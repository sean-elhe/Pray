let ioInstance;

export function initializeSocket(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register", (userId) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined room user:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

export function notifyUser(userId, notification) {
  if (!ioInstance) return;

  ioInstance.to(`user:${userId}`).emit("notification", notification);
}
