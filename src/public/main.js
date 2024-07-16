//main.js es el lado del cliente:
//socket.io se utiliza del lado del cliente y del lado del servidor. Por eso se instala como paquete de node.

//este log se ejecuta en la consola del cliente:
console.log("ejecutando main.js del lado del cliente");
//variables globales:
const socket = io();
let user = ""; //inicia vacio
const title = document.querySelector("#wellcome"); //h1
const chatBox = document.querySelector("#send"); //input

//sweet alert maneja promesas, por ello usamos .then:
Swal.fire({
  title: "Ingrese su alias",
  input: "text",
  text: "Para ingresar al chat identificate",
  allowOutsideClick: false,
  inputValidator: (value) => {
    return !value && "Ingresa un nombre por favor flaco!";
  },
}).then((result) => {
  console.log(result.value); //se obtiene el valor del input de sweet alert
  user = result.value;
  title.innerText = `Bienvenido al chat ${user}`;
  //emitir:
  socket.emit("nuevoUsuario", { user });
});

//capturar el evento del input:
chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    //emitir:
    socket.emit("mensaje", { user, mensaje: event.target.value }); //el mensaje puede ser objeto, string, array, etc. (se captura en app.js)
    event.target.value = ""; //limpiar el input
    //chatBox.value = ""; //tambien limpia el input
  }
});

//escuchar el evento del servidor:
socket.on("conversacion", (data) => {
  const contenedorChat = document.querySelector("#contenedor-chat");
  //vaciar contenedor:
  contenedorChat.innerHTML = "";
  data.forEach((chat) => {
    //renderizar la conversacion en una div con 2 parrafos:
    const div = document.createElement("div");
    const nombre = document.createElement("p");
    const mensaje = document.createElement("p");
    nombre.classList.add("bold-name");

    nombre.innerText = chat.user + ": ";
    mensaje.innerText = chat.mensaje;
    div.appendChild(nombre);
    div.appendChild(mensaje);
    contenedorChat.appendChild(div);
  });
});
