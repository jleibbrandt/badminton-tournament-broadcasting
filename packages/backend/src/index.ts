import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import routes from "./routes";
import { setupWebSocket } from "./websocket";

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors());

app.use(bodyParser.json());
app.use("/api", routes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// The "catchall" handler: for any request that doesn't match an API route, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

setupWebSocket(server);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
