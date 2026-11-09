const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeServerConfig } = require("../src/config");

test("normalizes invalid startup configuration before server initialization", () => {
  const config = normalizeServerConfig({
    useConfig: 1,
    mode: "unknown",
    customPath: 42,
    selectedLevels: null,
    port: 70000,
    maxPlayers: -1,
    password: 42,
    autosaveInterval: -1,
    defaultViewOnly: "false",
  });

  assert.equal(config.useConfig, 1);
  assert.equal(config.mode, "gmd");
  assert.equal(config.customPath, "");
  assert.deepEqual(config.selectedLevels, ["all"]);
  assert.equal(config.port, 7575);
  assert.equal(config.maxPlayers, 0);
  assert.equal(config.password, "");
  assert.equal(config.autosaveInterval, 5);
  assert.equal(config.defaultViewOnly, false);
});

test("preserves valid startup configuration", () => {
  const config = normalizeServerConfig({
    useConfig: 1,
    mode: "custom",
    customPath: "/tmp/level.gmd",
    selectedLevels: ["Level One"],
    port: 9000,
    maxPlayers: 12,
    password: "secret",
    autosaveInterval: 2,
    defaultViewOnly: true,
  });

  assert.equal(config.mode, "custom");
  assert.equal(config.port, 9000);
  assert.equal(config.maxPlayers, 12);
  assert.equal(config.password, "secret");
  assert.equal(config.autosaveInterval, 2);
  assert.equal(config.defaultViewOnly, true);
});
