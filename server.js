const express = require("express");
const { createServer } = require("http");
const { WebSocketServer } = require("ws");
const path = require("path");

const app = express();
const server = createServer(app);

// 🔹 建立 WebSocket 伺服器
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("✅ 玩家連線成功");

  ws.on("message", (message) => {
    console.log("📩 收到訊息：", message.toString());

    // 廣播給所有玩家
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ 玩家離線");
  });
});

// 🔹 提供靜態檔案 (public 資料夾)
app.use(express.static(path.join(__dirname, "public")));

// 🔹 其他路由 → 回傳 index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔹 啟動伺服器（Vercel 會自動指定 PORT）
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
