export function constantTimeEqual(left, right) {
    if (typeof left !== "string" || typeof right !== "string" || !left || !right) return false;
    const a = new TextEncoder().encode(left);
    const b = new TextEncoder().encode(right);
    let difference = a.length ^ b.length;
    const length = Math.max(a.length, b.length);
    for (let i = 0; i < length; i++) {
        difference |= (a[i] || 0) ^ (b[i] || 0);
    }
    return difference === 0;
}

export function isHostTokenValid(room, token) {
    return !!room && constantTimeEqual(room.hostToken, token);
}

export function getPlayerForSessionToken(room, playerId, token) {
    if (!room || !Array.isArray(room.players) || !Number.isSafeInteger(playerId)) return null;
    const player = room.players.find((entry) => entry.id === playerId);
    return player && constantTimeEqual(player.sessionToken, token) ? player : null;
}
