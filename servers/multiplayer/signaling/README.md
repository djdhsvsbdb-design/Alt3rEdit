# Multiplayer Edit Signaling Server

This is the Cloudflare Workers signaling server that handles matchmaking and WebRTC SDP exchange for the Multiplayer Edit mod.

Because the mod uses WebRTC Data Channels, players connect directly to each other peer to peer. This server is **only** used for the initial handshake to exchange connection metadata (SDP offers, answers, and ICE candidates). Once a player joins a room, all game data flows directly between players.

## Setup and Hosting (Cloudflare Workers)

1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Compute (Workers & Pages)**.
2. Create or select your Worker.
3. Click **Edit code** on the top right.
4. Paste the contents of `worker.js` into `index.js`.
5. Under **Bindings**, ensure a Durable Object binding is set:
   - **Variable name:** `SIGNALING_HUB`
   - **Class name:** `SignalingHub`
6. Click **Deploy**.

## Using Your Custom Server

In Geometry Dash, go to the Multiplayer Edit mod settings and change the **Signaling Server URL** to your Worker's URL (e.g. `https://multiplayer-edit.d050.workers.dev`). Make sure it uses `https://`.

## How It Works

1. **Host** creates a room -> POSTs to `/rooms` and receives a 6-character room code and private host token.
2. **Guests** join using the room code -> POSTs to `/rooms/:code/join` and receives a private session token and the Host's metadata.
3. Host and guest tokens authenticate polling and signaling; room codes alone cannot delete rooms, ban players, or inject signaling messages.
3. **Guest** generates a WebRTC Offer and POSTs it to the signaling server.
4. **Host** polls for Offers, retrieves the Guest's Offer, generates an Answer, and POSTs it back.
5. **Guest** polls for Answers and retrieves the Host's Answer.
6. Direct P2P connection is established! The signaling server is no longer used for this session.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/rooms` | Create room. Body: `{hostName, roomName, description, playerLimit, isPrivate, hasPassword, password, version}` |
| GET | `/rooms` | Get list of public active rooms |
| GET | `/rooms/:code` | Get room info |
| POST | `/rooms/:code/join` | Join room. Body: `{playerName, password}` |
| POST | `/rooms/:code/leave` | Leave room. Body: `{playerId, sessionToken}` |
| POST | `/rooms/:code/signal` | Send WebRTC message. Host requests include `hostToken`; client requests include `playerId` and `sessionToken`. |
| GET | `/rooms/:code/signal?role=<host\|client>&playerId=N` | Poll for pending messages. Host must include `hostToken`; clients must include `sessionToken`. |
| POST | `/rooms/:code/ban` | Ban a player. Body: `{playerName, hostToken}` |
| DELETE | `/rooms/:code?hostToken=...` | Close room (Host only). |
| GET | `/health` | Health check |
