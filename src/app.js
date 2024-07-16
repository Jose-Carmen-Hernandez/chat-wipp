import express from "express";
import handlebars from "express-handlebars";
//__dirname se debe desestructurar al importarlo:
import { __dirname } from "./utils.js";
import ViewRouters from "./routes/viewsRouters.route.js";
//socket.io se utiliza del lado del servidor y del lado del cliente:
import { Server } from "socket.io";

const app = express();
//El siguiente valor debe venir de una variable de entorno .env:
const PORT = 8080 || 3000;

//plantillaHB = alias de motor de plantilla handlebars.
app.engine("handlebars", handlebars.engine()); //motor de plantilla
//ruta de las visualizaciones
app.set("views", __dirname + "/views");
//indicar que el motor de vista sera = alias de motor de plantilla
app.set("view engine", "handlebars");
//ruta de los archivos estaticos
app.use(express.static(__dirname + "/public"));
//el endpoint se hace en viewsRouters.route.js:
app.use("/", ViewRouters);
const httpServer = app.listen(PORT, () => {
  console.log("Server http is running on port 8080");
});
//socket.io se utiliza del lado del servidor y del lado del cliente:
const io = new Server(httpServer);
const conversacion = [];

//escuchar el evento "connection":
io.on("connection", (socket) => {
  console.log("New client connected");
  //capturar socket.emit que esta en main.js:
  socket.on("mensaje", (data) => {
    conversacion.push(data);
    console.log(data);
    //enviar el mensaje a todos los clientes conectados:
    io.emit("conversacion", conversacion);
  });
});
