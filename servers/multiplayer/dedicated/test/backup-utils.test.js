const test = require("node:test");
const assert = require("node:assert/strict");
const { listBackupFiles, escapeHtml } = require("../src/backup-utils");

test("lists only gmd backups belonging to the requested room", () => {
  const entries = [
    ["AB12CD_level_save.gmd", true],
    ["Test_Level_export.gmd", true],
    ["OtherRoom_level_save.gmd", true],
    ["AB12CD_notes.txt", true],
    ["AB12CD_folder.gmd", false],
  ];
  const fakeFs = {
    readdirSync: () => entries.map(([name]) => name),
    statSync: (path) => ({
      isFile: () => entries.find(([name]) => path.endsWith(name))[1],
    }),
  };

  assert.deepEqual(
    listBackupFiles(fakeFs, "/levels", { code: "AB12CD", levelName: "Test Level" }),
    ["AB12CD_level_save.gmd", "Test_Level_export.gmd"],
  );
});

test("escapes user-controlled HTML content", () => {
  assert.equal(escapeHtml('<img src=x onerror="bad">'), "&lt;img src=x onerror=&quot;bad&quot;&gt;");
});
