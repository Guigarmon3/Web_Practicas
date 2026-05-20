// Mostrar y/o ocultar tabla de pagos de un cliente
const boton = document.querySelector(".cli_button");
const table = document.getElementById("template_table");

const adduser = document.getElementById("cli_add");
const addventana = document.getElementById("adduser");
const formadd = document.querySelector("#adduser form");

const addnombre = document.getElementById("add_nombre");
const addnick = document.getElementById("add_nick");
const addcorreo = document.getElementById("add_email");
const addplataforma = document.getElementById("add_plataforma");

const modventana = document.getElementById("moduser");
const formmod = document.querySelector("#moduser form");

const modnombre = document.getElementById("mod_nombre");
const modnick = document.getElementById("mod_nick");
const modcorreo = document.getElementById("mod_email");
const modplataforma = document.getElementById("mod_plataforma");

table.remove();
document.addEventListener("click", (e) => {
    const boton = e.target.closest(".cli_button");
    if (boton) {
        const padre = boton.closest(".cliente");
        if (boton.value === "True") {
            padre.appendChild(table)
            boton.value = "False";
        } else {
            table.remove();
            boton.value = "True";
        }
    }
});

//Buscar clientes por nick
const inputbuscat = document.getElementById("cli_found");
inputbuscat.addEventListener("input", async (e) => {
   const terminoBusqueda = e.target.value.trim();
   if (terminoBusqueda === "") {
       cargarClientes();
       return;
   }

   try {
       const respuesta = await fetch(`http://localhost:8080/customers/search/${terminoBusqueda}`);
      
       if (!respuesta.ok) {
           throw new Error("Error en la búsqueda");
       }
       const clientesFiltrados = await respuesta.json();
       renderizarClientes(clientesFiltrados);

   } catch (error) {
       console.error("Error al buscar cliente:", error);
   }
});

function renderizarClientes(clientes) {
    const main = document.getElementById("main");
    if (!main) return;
  
    main.innerHTML = ''; 


    clientes.forEach(cliente => {
        const newdiv = document.createElement("div");
        newdiv.classList.add("cliente");


        const newdiv2 = document.createElement("div");
        newdiv2.classList.add("cliente-cont");


        const nombre = document.createElement("h3");
        nombre.classList.add("cli_name");
        nombre.textContent = cliente.name === "" ? "?" : (cliente.name || '');
        
        const nickname = document.createElement("h3");
        nickname.classList.add("cli_nick");
        nickname.textContent = cliente.nick;


        const correo = document.createElement("h3");
        correo.classList.add("cli_email");
        correo.textContent = cliente.email;


        const plataforma = document.createElement("h3");
        plataforma.classList.add("cli_platform");
        plataforma.textContent = cliente.platform;

        const modificar = document.createElement("button");
        modificar.classList.add("cli_modificar")
        modificar.textContent="Modificar";
        modificar.value = "False";

        modificar.addEventListener("click", () => {
            if (modificar.value == "False") {
                modventana.style.display = "block";
                modificar.value = "True";

                modnombre.value = cliente.name;
                modnick.value = cliente.nick;
                modcorreo.value = cliente.email;
                modplataforma.value = cliente.platform;
            } else {
                modventana.style.display = "none";
                modificar.value = "False";
            }
        })

        const borrar = document.createElement("button");
        borrar.classList.add("cli_borrar")
        borrar.textContent="Eliminar"

        borrar.addEventListener("click", () => {
            const confirmar = confirm(`¿Estás seguro de que quieres eliminar a ${cliente.nick}?`);
            if (confirmar){
                console.log(cliente.id);
                borrarCliente(cliente.id);
            }
        })

        const boton = document.createElement("button");
        boton.classList.add("cli_button");
        boton.value = "True";
        boton.textContent = "Pagos";


        newdiv2.appendChild(nombre);
        newdiv2.appendChild(nickname);
        newdiv2.appendChild(correo);
        newdiv2.appendChild(plataforma);
        newdiv2.appendChild(modificar);
        newdiv2.appendChild(borrar);
        newdiv2.appendChild(boton);


        newdiv.appendChild(newdiv2);
        main.appendChild(newdiv);
    });
}


// Formulario para añadir usuarios

adduser.value = "False";

adduser.addEventListener("click", () => {
    if (adduser.value == "False") {
        addventana.style.display = "block";
        adduser.value = "True";
    } else {
        addventana.style.display = "none";
        adduser.value = "False";
    }
});

formadd.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!formadd.checkValidity()) return;
            
    fetch('http://localhost:8080/customers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: addnombre.value,
            nick: addnick.value,
            email: addcorreo.value,
            platform: addplataforma.value
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Error en la respuesta del servidor: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        console.log('Guardado:', data);
        Toast("Usuario añadido correctamente"); 
        
        cargarClientes(); 
    })
    .catch(err => console.error('Error:', err));
        
    // Fin añadido
    formadd.reset();
    addventana.style.display = "none";
    adduser.value = "False";
});

// Borrar cliente por id
async function borrarCliente(identificador){
    const url = `http://localhost:8080/customers/delete?id=${identificador}`;

    try {
        const respuesta = await fetch(url, { method: 'DELETE' });
        if (!respuesta.ok){
            throw new Error(`Error al eliminar: ${respuesta.status}`);
        }

        Toast("Usuario eliminado correctamente");
        cargarClientes();
    } catch (error){
        console.error("Error al borrar el cliente:", error);
        Toast("No se pudo eliminar al usuario");
    }
}

//Modificar cliente
formmod.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!formadd.checkValidity()) return;
            
    fetch('http://localhost:8080/customers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: addnombre.value,
            nick: addnick.value,
            email: addcorreo.value,
            platform: addplataforma.value
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Error en la respuesta del servidor: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        console.log('Guardado:', data);
        Toast("Usuario añadido correctamente"); 
        
        cargarClientes(); 
    })
    .catch(err => console.error('Error:', err));
        
    // Fin añadido
    formadd.reset();
    addventana.style.display = "none";
    adduser.value = "False";
});

// Consulta automatica Pagos Pendientes
// select * from Cliente where realizado = false;
const MostrarPendientes = document.getElementById("cli_pendientes");
MostrarPendientes.addEventListener("click", (e)=> {
     Toast("Mostrando pagos pendientes");
});


// Consulta automatica Pagos Realizados
// select * from cliente where realizado = true;
const MostrarRealizados = document.getElementById("cli_realizados");
MostrarRealizados.addEventListener("click", (e)=> {
    Toast("Mostrando pagos realizados");
});

// Toast
function Toast(texto) {
  Toastify({
    text: texto,
    duration: 1500,
    gravity: "bottom",
    position: "right",
    className: "toast_nube",
  }).showToast();    
}


// Aqui va el SPRINGBOOT
//Test
// 1. Definir la función que realiza la petición fetch
async function cargarClientes() {
   console.log("Iniciando la consulta fetch...");
   try {
       const respuesta = await fetch('http://localhost:8080/customers/all');
       if (!respuesta.ok) {
           throw new Error(`Error en la petición: ${respuesta.status}`);
       }


       const clientes = await respuesta.json();
       renderizarClientes(clientes); // Reutilizamos la función aquí también


   } catch (error) {
       console.error("Error detallado en la consulta:", error);
   }
}


document.addEventListener('DOMContentLoaded', cargarClientes);
// Sergi borrar y buscar
