// Real-Time Watch Party Room Manager
class WatchPartyManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(hostName, movieId) {
    const roomId = Math.floor(100000 + Math.random() * 900000).toString();
    const room = {
      id: roomId,
      hostName,
      movieId,
      playbackState: { isPlaying: true, currentTime: 0 },
      participants: [{ name: hostName, isHost: true }],
      messages: [{ sender: 'System', text: `Room created by ${hostName}. Share code ${roomId} to invite friends!` }],
      createdAt: new Date().toISOString()
    };
    this.rooms.set(roomId, room);
    return room;
  }

  joinRoom(roomId, userName) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const exists = room.participants.find(p => p.name === userName);
    if (!exists) {
      room.participants.push({ name: userName, isHost: false });
      room.messages.push({ sender: 'System', text: `${userName} joined the watch party.` });
    }
    return room;
  }

  syncPlayback(roomId, isPlaying, currentTime) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.playbackState = { isPlaying, currentTime };
    return room;
  }

  addMessage(roomId, sender, text) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const msg = { sender, text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    room.messages.push(msg);
    return msg;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId) || null;
  }
}

export const watchPartyManager = new WatchPartyManager();
