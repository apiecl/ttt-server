const args = process.argv.slice(2);
const count = '--count' == args[0]; // Usar este flag para contar cantidad de objetos recibidos por segundo

import  path  from "node:path";
import  net from "node:net";

const express = require('express');

const app = express();
var n = 0;
let clientdata = {};
const server = net.createServer((socket) => {

    socket.on('data', (data) => {
      clientdata = JSON.parse(data as unknown as string);
      if (!count){
        return JSON.stringify(data, null,"   ");
      }
      else{
        n+=1;
      }
    });
});

server.listen(8989, () => {
  console.log('Server started on port 8989');
});
if (count){
    setInterval(() => {
    return n; 
    n=0;
  }, 1000);
}

app.get('/', (req:any, res:any) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(clientdata));  
});
app.listen(3000);
console.log('Client server started at port 3000');