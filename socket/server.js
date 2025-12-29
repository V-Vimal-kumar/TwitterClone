import http from "http";
import { Server } from "socket.io";
import pool from "../lib/db.js";

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// userId → Set(socketId)
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 socket connected:", socket.id);

  /* ===========================
     REGISTER USER
  =========================== */
  socket.on("register", async (userId) => {
    userId = Number(userId);
    socket.userId = userId;

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    console.log("✅ user online:", userId);
  });

  /* ===========================
     SEND MESSAGE
  =========================== */
  socket.on("send_message", async ({ toUserId, message }) => {
    const receiverSockets = onlineUsers.get(toUserId);

    if (receiverSockets) {
      receiverSockets.forEach((sid) => {
        io.to(sid).emit("receive_message", message);

        // 🔔 toast + unread notify
        io.to(sid).emit("new_message_notify", {
          fromUserId: message.sender_id,
          fromName: message.sender_name,
          text: message.text,
        });

        io.to(sid).emit("unread_increment", {
          fromUserId: message.sender_id,
        });
      });

      await pool.query(
        `UPDATE messages SET delivered_at = NOW() WHERE id = ?`,
        [message.id]
      );
    }
  });

  /* ===========================
     MARK AS READ (CLEAR UNREAD)
  =========================== */
  socket.on("mark_as_read", async ({ conversationId, readerId }) => {
    await pool.query(
      `
      UPDATE messages
      SET read_at = NOW()
      WHERE conversation_id = ?
        AND receiver_id = ?
        AND read_at IS NULL
      `,
      [conversationId, readerId]
    );
  });

  /* ===========================
     DISCONNECT
  =========================== */
  socket.on("disconnect", () => {
    const sockets = onlineUsers.get(socket.userId);
    sockets?.delete(socket.id);

    if (sockets?.size === 0) {
      onlineUsers.delete(socket.userId);
    }

    console.log("❌ user offline:", socket.userId);
  });
});

server.listen(3001, () => {
  console.log("🚀 Socket server running on http://localhost:3001");
});
