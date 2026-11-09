const test = require("node:test");
const assert = require("node:assert/strict");
const { RoomManager } = require("../src/room-manager");

test("signaling host token is required and cannot be guessed from room metadata", async () => {
  const { isHostTokenValid } = await import("../../signaling/auth.mjs");
  const room = { roomId: "public-id", hostToken: "private-host-token" };
  assert.equal(isHostTokenValid(room, "private-host-token"), true);
  assert.equal(isHostTokenValid(room, "public-id"), false);
  assert.equal(isHostTokenValid(room, ""), false);
});

test("player session tokens are bound to the assigned player id", async () => {
  const { getPlayerForSessionToken } = await import("../../signaling/auth.mjs");
  const room = {
    players: [
      { id: 1, sessionToken: "first-session" },
      { id: 2, sessionToken: "second-session" },
    ],
  };
  assert.equal(getPlayerForSessionToken(room, 1, "first-session").id, 1);
  assert.equal(getPlayerForSessionToken(room, 1, "second-session"), null);
  assert.equal(getPlayerForSessionToken(room, 2, "first-session"), null);
});

test("dedicated server rejects all cloud requests when no tokens are configured", () => {
  assert.equal(RoomManager.prototype.isValidToken.call({ tokens: new Set() }, "anything"), false);
});
