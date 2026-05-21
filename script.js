import { 
    obtenerTodosLosClientes, 
    buscarClienteAPI, 
    crearClienteAPI, 
    editarClienteAPI, 
    borrarClienteAPI 
} from './api.js';

import { tablavertical, Toast } from './tablas.js';

let clienteEditable = null;

const adduser = document.getElementById("cli_add");
const addventana = document.getElementById("adduser");
const cerrar_add = document.getElementById("cerrar_add");
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

const ventanaPagos = document.getElementById("pagos");
const inputbuscat = document.getElementById("cli_found");
const MostrarPendientes = document.getElementById("cli_pendientes");
const MostrarRealizados = document.getElementById("cli_realizados");

adduser.value = "False";
document.addEventListener('DOMContentLoaded', cargarClientes);

async function cargarClientes() {
    console.log("Iniciando la consulta fetch...");
    try {
        const clientes = await obtenerTodosLosClientes();
        renderizarClientes(clientes); 
    } catch (error) {
        console.error("Error detallado en la consulta:", error);
    }
}

function renderizarClientes(clientes) {
    const main = document.getElementById("main");
    if (!main) return;
    main.innerHTML = ''; 

    clientes.forEach(cliente => {
        const newdiv = document.createElement("div");
        newdiv.classList.add("cliente");

        const newdiv2 = document.createElement("div");
        newdiv2.classList.add("cliente-cont");

        const nombre = document.createElement("h4");
        nombre.classList.add("cli_name");
        nombre.textContent = cliente.name === "" ? "?" : (cliente.name || '');
        
        const nickname = document.createElement("h4");
        nickname.classList.add("cli_nick");
        nickname.textContent = cliente.nick;

        const correo = document.createElement("h4");
        correo.classList.add("cli_email");
        correo.textContent = cliente.email;

        const plataforma = document.createElement("h4");
        plataforma.classList.add("cli_platform");
        plataforma.textContent = cliente.platform;

        const modificar = document.createElement("button");
        modificar.classList.add("cli_modificar");
        modificar.textContent = "Modificar";
        modificar.value = "False";

        modificar.addEventListener("click", () => {
            if (modificar.value === "False") {
                modventana.style.display = "block";
                modificar.value = "True";

                modnombre.value = cliente.name || '';
                modnick.value = cliente.nick || '';
                modcorreo.value = cliente.email || '';
                modplataforma.value = cliente.platform || '';
                clienteEditable = cliente;
            } else {
                modventana.style.display = "none";
                modificar.value = "False";
                clienteEditable = null;
            }
        });

        const borrar = document.createElement("button");
        borrar.classList.add("cli_borrar");
        borrar.textContent = "Eliminar";
        borrar.addEventListener("click", async () => {
            if (confirm(`¿Estás seguro de que quieres eliminar a ${cliente.nick}?`)) {
                try {
                    await borrarClienteAPI(cliente.id);
                    Toast("Usuario eliminado correctamente");
                    cargarClientes();
                } catch (error) {
                    console.error(error);
                    Toast("No se pudo eliminar al usuario");
                }
            }
        });

        const botonPagos = document.createElement("button");
        botonPagos.classList.add("cli_button");
        botonPagos.value = "True";
        botonPagos.textContent = "Pagos";

        newdiv2.append(nombre, nickname, correo, plataforma, modificar, borrar, botonPagos);
        newdiv.appendChild(newdiv2);
        main.appendChild(newdiv);
    });
}

document.addEventListener("click", (e) => {
    const boton = e.target.closest(".cli_button");
    if (!boton) return;

    const contenedorCliente = boton.closest(".cliente-cont");
    const elementoNick = contenedorCliente ? contenedorCliente.querySelector(".cli_nick") : null;
    const nickTexto = elementoNick ? elementoNick.textContent.trim() : "";
    
    if (boton.value === "True") {
        ventanaPagos.innerHTML = "";
        const centro = document.createElement("center");

        const btnCerrar = document.createElement("button");
        btnCerrar.classList.add("xbutton_db");
        btnCerrar.textContent = "X";
        btnCerrar.id = "cerrarpagos";
        btnCerrar.style.marginTop = "20px";
        btnCerrar.addEventListener("click", () => {
            ventanaPagos.style.display = "none";
            boton.value = "True";
        });
        
        centro.appendChild(btnCerrar);
        
        const titulo = document.createElement("h1");
        titulo.textContent = "Pagos del Cliente \n " + nickTexto;
        centro.appendChild(titulo);

        const tabla = tablavertical();
        tabla.style.width = "100%";
        centro.appendChild(tabla);

        const btnAñadirFac = document.createElement("button");
        btnAñadirFac.classList.add("cli_button");
        btnAñadirFac.textContent = "Añadir";
        btnAñadirFac.id = "addpagos";
        btnAñadirFac.style.marginTop = "20px";
        btnAñadirFac.addEventListener("click", () => {
            ventanaPagos.style.display = "none";
            boton.value = "True";
        });

        const btnModificarFac = document.createElement("button");
        btnModificarFac.classList.add("cli_modificar");
        btnModificarFac.textContent = "Modificar";
        btnModificarFac.id = "addpagos";
        btnModificarFac.style.marginTop = "20px";
        btnModificarFac.addEventListener("click", () => {
            ventanaPagos.style.display = "none";
            boton.value = "True";
        });

        const btnEliminarFac = document.createElement("button");
        btnEliminarFac.classList.add("cli_borrar");
        btnEliminarFac.textContent = "Eliminar";
        btnEliminarFac.id = "addpagos";
        btnEliminarFac.style.marginTop = "20px";
        btnEliminarFac.addEventListener("click", () => {
            ventanaPagos.style.display = "none";
            boton.value = "True";
        });

        centro.appendChild(btnAñadirFac);
        centro.appendChild(btnModificarFac);
        centro.appendChild(btnEliminarFac);
        ventanaPagos.appendChild(centro);
        ventanaPagos.style.display = "block";
        boton.value = "False";
    } else {
        ventanaPagos.style.display = "none";
        boton.value = "True";
    }
});

inputbuscat.addEventListener("input", async (e) => {
   const terminoBusqueda = e.target.value.trim();
   if (terminoBusqueda === "") {
       cargarClientes();
       return;
   }
   try {
       const clientesFiltrados = await buscarClienteAPI(terminoBusqueda);
       renderizarClientes(clientesFiltrados);
   } catch (error) {
       console.error("Error al buscar cliente:", error);
   }
});

cerrar_add.addEventListener("click", () => {
    addventana.style.display = "none";
    adduser.value = "False";
});

adduser.addEventListener("click", () => {
    if (adduser.value === "False") {
        addventana.style.display = "block";
        adduser.value = "True";
    } else {
        addventana.style.display = "none";
        adduser.value = "False";
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modventana.style.display === "block") {
        modventana.style.display = "none";
        document.querySelectorAll(".cli_modificar").forEach(b => b.value = "False");
        clienteEditable = null;
    }
});

formadd.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!formadd.checkValidity()) return;
            
    try {
        const data = await crearClienteAPI({
            name: addnombre.value,
            nick: addnick.value,
            email: addcorreo.value,
            platform: addplataforma.value
        });
        console.log('Guardado:', data);
        Toast("Usuario añadido correctamente"); 
        cargarClientes(); 
    } catch (err) {
        console.error('Error:', err);
    }
        
    formadd.reset();
    addventana.style.display = "none";
    adduser.value = "False";
});

formmod.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!formmod.checkValidity()) return;
                    
    try {
        const data = await editarClienteAPI({
            id: clienteEditable.id,
            name: modnombre.value,
            nick: modnick.value,
            email: modcorreo.value,
            platform: modplataforma.value
        });
        console.log('Modificado:', data);
        Toast("Usuario modificado correctamente"); 
        cargarClientes();
        
        formmod.reset();
        modventana.style.display = "none";
        clienteEditable = null;
    } catch (error) {
        console.error("Error", error);
        Toast("No se pudieron guardar los cambios. Inténtalo de nuevo.");
    }
});

MostrarPendientes.addEventListener("click", () => Toast("Mostrando pagos pendientes"));
MostrarRealizados.addEventListener("click", () => Toast("Mostrando pagos realizados"));