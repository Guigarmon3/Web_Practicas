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

let clienteEditable = null;

const ventanaPagos = document.getElementById("pagos");

document.addEventListener("click", (e) => {
    const boton = e.target.closest(".cli_button");
    const contenedorCliente = boton.closest(".cliente-cont");
    const elementoNick = contenedorCliente ? contenedorCliente.querySelector(".cli_nick") : null;
    const nickTexto = elementoNick ? elementoNick.textContent.trim() : "";
    
    if (boton.value === "True") {
        ventanaPagos.innerHTML = "";
        const centro = document.createElement("center");
        
        const titulo = document.createElement("h1");
        titulo.textContent = "Pagos del Cliente \n " + nickTexto;
        
        centro.appendChild(titulo);

        const tabla = tablavertical();
        tabla.style.width = "100%";
        
        centro.appendChild(tabla);

        const btnCerrar = document.createElement("button");
        btnCerrar.classList.add("button_db");
        btnCerrar.textContent = "Cerrar";
        btnCerrar.style.marginTop = "20px";
        btnCerrar.addEventListener("click", () => {
            ventanaPagos.style.display = "none";
            boton.value = "True";
        });
        
        centro.appendChild(btnCerrar);
        ventanaPagos.appendChild(centro);
        ventanaPagos.style.display = "block";
        boton.value = "False";
    } else {
        ventanaPagos.style.display = "none";
        boton.value = "True";
    }
});

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
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && document.body.contains(modventana) && modificar.value == "True") {
                modventana.style.display = "none";
                modificar.value = "False";
            }
        });

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
        
    formadd.reset();
    addventana.style.display = "none";
    adduser.value = "False";
});

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
        
    formadd.reset();
    addventana.style.display = "none";
    adduser.value = "False";
});

formmod.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!formmod.checkValidity()) return;
                    
            try{
                const res = await fetch('http://localhost:8080/customers/edit', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: clienteEditable.id,
                        name: modnombre.value,
                        nick: modnick.value,
                        email: modcorreo.value,
                        platform: modplataforma.value
                    })
                });
                if (!res.ok) {
                    throw new Error(`Error en la respuesta del servidor: ${res.status}`);
                }
                const data = await res.json();
                console.log('Modificado:', data);
                Toast("Usuario modificado correctamente"); 
                cargarClientes();
                formmod.reset();
                modventana.style.display = "none";
                clienteAEditar = null;

            } catch (error) {
                console.error("Error", error);
                Toast("No se pudieron guardar los cambios. Inténtalo de nuevo.");
            }
        });

const MostrarPendientes = document.getElementById("cli_pendientes");
MostrarPendientes.addEventListener("click", (e)=> {
     Toast("Mostrando pagos pendientes");
});

const MostrarRealizados = document.getElementById("cli_realizados");
MostrarRealizados.addEventListener("click", (e)=> {
    Toast("Mostrando pagos realizados");
});

function Toast(texto) {
  Toastify({
    text: texto,
    duration: 1500,
    gravity: "bottom",
    position: "right",
    className: "toast_nube",
  }).showToast();    
}

async function cargarClientes() {
   console.log("Iniciando la consulta fetch...");
   try {
       const respuesta = await fetch('http://localhost:8080/customers/all');
       if (!respuesta.ok) {
           throw new Error(`Error en la petición: ${respuesta.status}`);
       }


       const clientes = await respuesta.json();
       renderizarClientes(clientes); 

   } catch (error) {
       console.error("Error detallado en la consulta:", error);
   }
}


document.addEventListener('DOMContentLoaded', cargarClientes);


const headers = ["Tipo", "Descripción", "id | Numero", "Fecha", "Precio USD$", "Precio PayPal", "Precio EUR€", "Transferencia Realizada"];
const data = ["TIpo de factura", "Descripción de factura", "ID de factura", "Fecha de factura", "precio en $", "Precio paypal$", "precio en €", "true o false"];

function tablahorizontal() {
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    const trHeader = document.createElement("tr");
    const trData = document.createElement("tr");

    headers.forEach((text, i) => {
        const th = document.createElement("th");
        th.textContent = text;
        trHeader.appendChild(th);

        const td = document.createElement("td");
        td.textContent = data[i];
        trData.appendChild(td);
    });

    tbody.appendChild(trHeader);
    tbody.appendChild(trData);
    table.appendChild(tbody);
    table.classList = "tablica";
    return table;
}

function tablavertical() {
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    headers.forEach((text, i) => {
        const tr = document.createElement("tr");
        
        const th = document.createElement("th");
        th.textContent = text;
        
        const td = document.createElement("td");
        td.textContent = data[i];
        
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    table.classList = "tablica";
    return table;
}