function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    })[ch]);
}

function listBackupFiles(fs, levelsDir, room) {
    const prefix = `${room.code}_`;
    const legacyPrefix = String(room.levelName || "").replace(/[^a-zA-Z0-9]/g, "_");
    return fs.readdirSync(levelsDir).filter((filename) => {
        if (!(filename.startsWith(prefix) || (legacyPrefix && filename.startsWith(legacyPrefix))) ||
            !filename.endsWith(".gmd")) return false;
        return fs.statSync(require("path").join(levelsDir, filename)).isFile();
    });
}

module.exports = { escapeHtml, listBackupFiles };
