const { Server } = require("socket.io");

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // hoặc ['http://localhost:3000']
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Online user
    socket.on("online", (userId) => {
       io.emit("user-online", userId);
    });

    // Offline user
    socket.on("offline", (userId) => {
      io.emit("user-offline", userId);
    });

    // Tham gia phòng
    socket.on("join-room", (roomId, user) => {
      socket.join(roomId);
      // Thông báo cho các thành viên khác trong phòng
      socket.to(roomId).emit("user-joined", { user, socketId: socket.id });
      console.log(`${user.displayName} joined room "${roomId}"`);
    });


    // Rời phòng
    socket.on("leave-room", (roomId, user) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user-left", { user, socketId: socket.id });
      console.log(`${user.displayName} left room "${roomId}"`);
    });

    // Gửi tin nhắn trong phòng
    socket.on("chat-message", (roomId, message) => {
      io.emit('new-message',({roomId, message}));
      // console.log(
      //   `${message.sender.displayName} sent message ${
      //     message.files.length > 0 ? ` and ${message.files.length} file(s)` : ""
      //   } in "${roomId}"`
      // );
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // Có thể broadcast sự kiện user rời tất cả phòng nếu cần
    });
  });

  return io;
}

module.exports = setupSocket;
