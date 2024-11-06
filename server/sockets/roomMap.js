//ALL THE GAME ROOM
import Room from "./room.js"; // Import the Room class

class RoomMap {
  constructor() {
    this.rooms = new Map(); // Store rooms by ID
  }

  //Check if user has joined any room and return that room
  getRoomForUser(userId) {
    for (const room of this.rooms.values()) {
      for (const playerStats of room.players.values()) {
        if (playerStats.userId._id === userId) {
          return room; // User is already in a room
        }
      }
    }
    return null; // User is not in any room
  }

  //Find user with socket_id
  getRoomBySocketId(socketId) {
    const roomObjArray = Array.from(this.rooms.values());
    for (let roomObj of roomObjArray) {
      const players = roomObj.players;
      if (players.has(socketId)) {
        return roomObj;
      }
    }
    return null;
  }

  // Update the number of rooms
  updateRoomMap(gameNamespace) {
    const clonedMap = new Map();

    // Check for new rooms and old room existed
    gameNamespace.adapter.rooms.forEach((value, key) => {
      if (key.startsWith("room")) {
        if (!this.rooms.has(key)) {
          // If room does not exist, create a new Room object
          const newRoom = new Room(key, gameNamespace);
          clonedMap.set(key, newRoom); // Add new room
        } else {
          //If room existed, just add in the clonedMap like normal
          clonedMap.set(key, this.rooms.get(key));
        }
      }
    });

    console.log(clonedMap);
    this.rooms = clonedMap;
  }
}

export default RoomMap;
