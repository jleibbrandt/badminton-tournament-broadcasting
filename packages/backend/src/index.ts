import express from "express";
import http from "http";
import bodyParser from "body-parser";
import routes from "./routes";
import { setupWebSocket } from "./websocket";

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use("/api", routes);

setupWebSocket(server);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log("Server is running on port ${PORT}");
});
