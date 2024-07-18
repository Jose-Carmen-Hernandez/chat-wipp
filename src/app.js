import express from "express";
import handlebars from "express-handlebars";
//__dirname se debe desestructurar al importarlo:
import { __dirname } from "./utils.js";
import ViewRouters from "./routes/viewsRouters.route.js";
//socket.io se utiliza del lado del servidor y del lado del cliente:
import { Server } from "socket.io";

const app = express();
//El siguiente valor debe venir de una variable de entorno .env:
const PORT = process.env.PORT || 8080;

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
const usuarios = [];

//escuchar el evento "connection":
io.on("connection", (socket) => {
  console.log("New client connected");

  //capturar emision del mensaje del cliente:
  socket.on("mensaje", (data) => {
    conversacion.push(data);
    console.log(data);
    //enviar el mensaje a todos los clientes conectados:
    io.emit("conversacion", conversacion);
  });

  socket.on("nuevoUsuario", (nuevoUsuario) => {
    //guardar el nuevo usuario en el array de ususarios:
    usuarios.push({ ...nuevoUsuario, id: socket.id });
    //mostrar la conversacion al nuevo usuario:
    socket.emit("conversacion", conversacion);
    //enviar la lista de usuarios a todos los clientes conectados:
    io.emit("conectados", usuarios);
    //mostrar el numero de clientes conectados:
    io.emit("numeroUsuarios", usuarios.length);
  });

  //detectar el evento de desconexion y emitir a todos los clientes la lista actualizada de conectados:
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    //eliminar el usuario desconectado del array de usuarios:
    const index = usuarios.findIndex((user) => user.id === socket.id);
    if (index != -1) {
      usuarios.splice(index, 1);
    }
    //enviar la lista actualizada de conectados a todos los clientes que aun estan conectados:
    io.emit("conectados", usuarios);
    //volver a contar los usuarios conectados:
    io.emit("numeroUsuarios", usuarios.length);
  });
});
