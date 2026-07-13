import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";

import { Server } from "socket.io";
import { initializeSocket } from "./socket.js";

import authRoutes from "./routes/auth.js";
import prayerRoutes from "./routes/prayers.js";
import notificationRoutes from "./routes/notifications.js";
import pushRoutes from "./routes/push.js";

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://pray.elahi.app"],
    credentials: true,
  },
});

initializeSocket(io);

app.set("trust proxy", 1);

app.use(
  cors({
    origin: ["http://localhost:5173", "https://pray.elahi.app"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/prayers", prayerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/push", pushRoutes);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
