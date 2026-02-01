// // server.js
// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const axios = require("axios");
// const { Server } = require("socket.io");
// const dotenv = require("dotenv");
// const { all } = require("axios");

// const app = express();
// const server = http.createServer(app);

// // ✅ ENV variables
// const PORT = process.env.PORT || 3001;
// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
// const RAPID_API_KEY = process.env.RAPID_API_KEY;

// app.use(cors());
// app.use(express.json());

// // ✅ Middleware
// const allowedOrigins = [
//   "http://localhost:3000", // dev frontend
//   FRONTEND_URL // production frontend (from Render env)
// ];

// const io = new Server(server, {
//   cors: {
//     origin:allowedOrigins,
//     methods: ["GET", "POST"],
//     credentials: true
//   },
// });



// // 🔌 Socket.IO Events
// io.on("connection", (socket) => {
//   console.log(`✅ User connected: ${socket.id}`);

//   socket.on("join_room", (roomId) => {
//     socket.join(roomId);
//     console.log(`👥 User ${socket.id} joined room ${roomId}`);
//   });

//   socket.on("code_change", ({ roomId, code }) => {
//     socket.to(roomId).emit("code_update", code);
//   });

//   socket.on("code_output", ({ roomId, output }) => {
//     console.log(`📤 Broadcasting output to room ${roomId}`);
//     io.to(roomId).emit("code_output", { output }); // includes sender
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//   });
// });

// // 🧠 Run code via Judge0
// app.post("/run-code", async (req, res) => {
//   const { source_code, language_id, stdin = "" } = req.body;

//   try {
//     const submissionRes = await axios.post(
//       "https://judge0-ce.p.rapidapi.com/submissions",
//       { source_code, language_id, stdin },
//       {
//         headers: {
//           "content-type": "application/json",
//           "X-RapidAPI-Key": RAPID_API_KEY,
//           "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
//         },
//       }
//     );

//     const token = submissionRes.data.token;

//     // Polling for result
//     let result = null;
//     while (!result || result.status.id <= 2) {
//       const pollRes = await axios.get(
//         `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
//         {
//           headers: {
//             "X-RapidAPI-Key": RAPID_API_KEY,
//             "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
//           },
//         }
//       );
//       result = pollRes.data;
//       if (result.status.id <= 2) await new Promise((r) => setTimeout(r, 1000));
//     }

//     const output = result.stdout || result.stderr || "No output";
//     res.json({ output });
//   } catch (error) {
//     console.error("❌ Code execution error:", error.message);
//     res.status(500).json({ error: "Execution failed" });
//   }
// });

// server.listen(3001, () => {
//   console.log(`Socket.IO + API server running at ${PORT}`);
// });


// server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const axios = require("axios");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

// ✅ Load .env in local dev
dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ ENV variables
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const RAPID_API_KEY = process.env.RAPID_API_KEY;

// ✅ CORS config
const allowedOrigins = [
  "http://localhost:3000", 
  process.env.FRONTEND_URL?.replace(/\/$/, ""),
  "https://myfrontend.vercel.app" 
];

// const allowedOrigins = [
//   "http://localhost:3000", // dev frontend
//   process.env.FRONTEND_URL // production frontend (from Render env)
// ];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// ✅ Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
});

// 🔌 Socket.IO Events
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`👥 User ${socket.id} joined room ${roomId}`);
  });

  socket.on("code_change", ({ roomId, code }) => {
    socket.to(roomId).emit("code_update", code);
  });

  socket.on("code_output", ({ roomId, output }) => {
    console.log(`📤 Broadcasting output to room ${roomId}`);
    io.to(roomId).emit("code_output", { output }); // includes sender
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// 🧠 Run code via Judge0
app.post("/run-code", async (req, res) => {
  const { source_code, language_id, stdin = "" } = req.body;

  try {
    const submissionRes = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      { source_code, language_id, stdin },
      {
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": RAPID_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    const token = submissionRes.data.token;

    // Polling for result
    let result = null;
    while (!result || result.status.id <= 2) {
      const pollRes = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        {
          headers: {
            "X-RapidAPI-Key": RAPID_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );
      result = pollRes.data;
      if (result.status.id <= 2) await new Promise((r) => setTimeout(r, 1000));
    }

    const output = result.stdout || result.stderr || "No output";
    res.json({ output });
  } catch (error) {
    console.error("❌ Code execution error:", error.message);
    res.status(500).json({ error: "Execution failed" });
  }
});

// ✅ Use Render’s dynamic port
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO + API server running on port ${PORT}`);
});
