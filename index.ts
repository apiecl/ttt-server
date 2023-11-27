const args = process.argv.slice(2);
const count = "--count" == args[0]; // Usar este flag para contar cantidad de objetos recibidos por segundo
const fs = require("node:fs");
const net = require("node:net");
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const { join } = require("node:path");
const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

const app = express();
const clientServer = createServer(app);
const io = new Server(clientServer, {
  cors: {
    origin: "*",
  },
});

var n = 0;
let clientdata = {};
// const date = new Date(Date.now());
// console.log(date);
// const stream = fs.createWriteStream(
//   `./output/ttt-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}.csv`,
//   { flags: "a" }
// );

const server = net.createServer((socket: any) => {
  socket.on("data", (data: any) => {
    clientdata = JSON.parse(data as unknown as string);
    if (args.includes("--debug")) {
      console.log(clientdata);
      //stream.write(JSON.stringify(clientdata) + ",\n", (err: Error) => {
        // if (err) {
        //   console.error(err);
        // }
      //});
    }
    eventEmitter.emit("data-received");
    if (!count) {
      return JSON.stringify(data, null, "   ");
    } else {
      n += 1;
    }
  });
});

server.listen(8989, () => {
  console.log("Server started on port 8989");
});
if (count) {
  setInterval(() => {
    return n;
    n = 0;
  }, 1000);
}

app.get("/", (req: any, res: any) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify(clientdata));
});

app.get("/", (req: any, res: any) => {
  res.sendFile(join(__dirname, "index.html"));
});

clientServer.listen(3000);
console.log("Client server started at port 3000");

io.on("connection", (socket: any) => {
  console.log("a user connected");
  if (args.includes("--debug")) {
    socket.emit("data-debug", true);
  } else {
    socket.emit("data-debug", false);
  }
  eventEmitter.on("data-received", () => {
    socket.emit("data-parsed", clientdata);
  });
});
