const DEFAULT_CONFIG = {
    useConfig: 0,
    mode: "gmd",
    customPath: "",
    selectedLevels: ["all"],
    port: 7575,
    maxPlayers: 0,
    password: "",
    autosaveInterval: 0,
    defaultViewOnly: false,
};

const VALID_MODES = new Set(["restore", "gd", "gmd", "custom", "none"]);

function normalizeServerConfig(input = {}) {
    const config = { ...DEFAULT_CONFIG, ...(input && typeof input === "object" ? input : {}) };

    config.useConfig = config.useConfig === 1 ? 1 : 0;
    if (!VALID_MODES.has(config.mode)) config.mode = DEFAULT_CONFIG.mode;
    if (typeof config.customPath !== "string") config.customPath = "";
    if (!Array.isArray(config.selectedLevels) ||
        config.selectedLevels.some((level) => typeof level !== "string")) {
        config.selectedLevels = ["all"];
    }
    if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
        config.port = DEFAULT_CONFIG.port;
    }
    if (!Number.isInteger(config.maxPlayers) || config.maxPlayers < 0) {
        config.maxPlayers = DEFAULT_CONFIG.maxPlayers;
    }
    if (typeof config.password !== "string") config.password = "";
    if (!Number.isFinite(config.autosaveInterval) || config.autosaveInterval < 0) {
        config.autosaveInterval = DEFAULT_CONFIG.autosaveInterval;
    }
    config.defaultViewOnly = config.defaultViewOnly === true;

    return config;
}

module.exports = { DEFAULT_CONFIG, normalizeServerConfig };
