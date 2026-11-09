const test = require("node:test");
const assert = require("node:assert/strict");
const { Room } = require("../src/room");
const proto = require("../src/protocol");
const saveReader = require("../src/save-reader");

function makeRoom() {
  return new Room("Test level", {
    compressedBytes: Buffer.from("level-data"),
    uuids: ["object-1"],
  }, {
    saveString: "",
    audioTrack: 0,
    songID: 0,
    levelLength: 0,
    levelName: "Test level",
  });
}

function playerAction(opcode, playerId) {
  const writer = new proto.Writer();
  writer.writeOpcode(opcode);
  writer.writeVarInt(playerId);
  return writer.finish();
}

test("only the room moderator can kick another player", (t) => {
  const room = makeRoom();
  t.after(() => room.destroy());
  const host = { readyState: 1, send() {}, close() {} };
  const guest = { readyState: 1, send() {}, close() {} };
  const hostId = room.addPlayer("Host", 0, host);
  const guestId = room.addPlayer("Guest", 0, guest);

  room.handleMessage(guestId, playerAction(proto.Opcode.KickPlayer, hostId));
  assert.equal(room.players.has(hostId), true);
  assert.equal(room.players.has(guestId), true);

  room.handleMessage(hostId, playerAction(proto.Opcode.KickPlayer, guestId));
  assert.equal(room.players.has(guestId), false);
});

test("only the room moderator can ban another player", (t) => {
  const room = makeRoom();
  t.after(() => room.destroy());
  const host = { readyState: 1, send() {}, close() {} };
  const guest = { readyState: 1, send() {}, close() {} };
  const hostId = room.addPlayer("Host", 0, host);
  const guestId = room.addPlayer("Guest", 0, guest);

  room.handleMessage(guestId, playerAction(proto.Opcode.BanPlayer, hostId));
  assert.equal(room.banned.has("Host"), false);

  room.handleMessage(hostId, playerAction(proto.Opcode.BanPlayer, guestId));
  assert.equal(room.banned.has("Guest"), true);
  assert.equal(room.players.has(guestId), false);
});

test("rejects unsolicited snapshots from clients that were not asked", (t) => {
  const room = makeRoom();
  t.after(() => room.destroy());
  const hostId = room.addPlayer("Host", 0, { readyState: 1, send() {}, close() {} });
  const guestId = room.addPlayer("Guest", 0, { readyState: 1, send() {}, close() {} });
  const start = proto.serializeSyncLevelStart(1, 1, {
    saveString: "", audioTrack: 0, songID: 0, levelLength: 0, levelName: "Forged",
  });

  room.handleMessage(guestId, start);
  assert.equal(room.snapshotPending, false);
  assert.equal(room.snapshotState, null);

  room.requestSnapshot();
  room.handleMessage(guestId, start);
  assert.equal(room.snapshotState.fromPlayerId, hostId);
  assert.equal(room.snapshotState.active, false);
});

test("restores snapshot locks using their remaining lifetime", (t) => {
  const room = makeRoom();
  t.after(() => room.destroy());
  const hostId = room.addPlayer("Host", 0, { readyState: 1, send() {}, close() {} });
  room.requestSnapshot();
  room.handleMessage(hostId, proto.serializeSyncLevelStart(1, 1, {
    saveString: "", audioTrack: 0, songID: 0, levelLength: 0, levelName: "Test level",
  }));
  room.handleMessage(hostId, proto.serializeSyncLocksChunk([
    { uuid: "object-1", playerId: hostId, timeLeft: 2 },
  ]));

  const lock = room.locks.get("object-1");
  assert.ok(lock);
  assert.ok(lock.expiresAt > Date.now());
  assert.equal(lock.time, undefined);
});

test("rejects incomplete snapshots without replacing the current level", (t) => {
  const room = makeRoom();
  t.after(() => room.destroy());
  const hostId = room.addPlayer("Host", 0, { readyState: 1, send() {}, close() {} });
  const original = room.compressedLevelData.toString();
  room.requestSnapshot();
  room.handleMessage(hostId, proto.serializeSyncLevelStart(2, 1, {
    saveString: "", audioTrack: 0, songID: 0, levelLength: 0, levelName: "Test level",
  }));
  room.handleMessage(hostId, proto.serializeSyncLevelChunk(0, Buffer.from("partial"), ["object-1"]));
  room.handleMessage(hostId, proto.serializeSyncLevelEnd());

  assert.equal(room.compressedLevelData.toString(), original);
  assert.equal(room.snapshotPending, false);
});

test("parseGmd returns no levels for invalid input", () => {
  assert.deepEqual(saveReader.parseGmd("<not-a-level />"), []);
});
