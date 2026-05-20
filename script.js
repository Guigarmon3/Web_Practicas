// Mostrar y/o ocultar tabla de pagos de un cliente
const table = document.getElementById("template_table");
if (table) {
    table.remove();
}

document.addEventListener("click", (e) => {
    const boton = e.target.closest(".cli_button");
    if (!boton) return;

    const padre = boton.closest(".cliente");
    const esMovil = window.matchMedia("(max-width: 768px)").matches;

    if (boton.value === "True") {
        if (esMovil) {
            const nuevaTabla = creartabla();
            padre.appendChild(nuevaTabla);
        } else {
            padre.appendChild(table);
        }
        boton.value = "False";
    } else {
        if (esMovil) {
            const tablaMovil = padre.querySelector("table");
            if (tablaMovil) {
                tablaMovil.remove();
            }
        } else {
            table.remove();
        }
        boton.value = "True";
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
  
    main.innerHTML = ''; // Vaciamos main para que no aparezcan otros usuarios


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

        const borrar = document.createElement("button");
        borrar.classList.add("cli_borrar")
        borrar.textContent="Eliminar"

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


// ventana para añdir usuarios
const adduser = document.getElementById("cli_add");
const addventana = document.getElementById("adduser");
const formadd = document.querySelector("#adduser form");

adduser.value = "False";

adduser.addEventListener("click", () => {
    if (adduser.value == "False") {
        addventana.style.display = "block";
        adduser.value = "True";
        delventana.style.display = "none";
        userdel.value = "False";
    } else {
        addventana.style.display = "none";
        adduser.value = "False";
    }
});

formadd.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!formadd.checkValidity()) return;

    const nombre = document.getElementById("add_nombre").value;
    const nick = document.getElementById("add_nick").value;
    const correo = document.getElementById("add_email").value;
    const plataforma = document.getElementById("add_plataforma").value;
            
    fetch('http://localhost:8080/customers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: nombre,
            nick: nick,
            email: correo,
            platform: plataforma
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


// ventana para Borrar Cliente

const userdel = document.getElementById("cli_del");
const delventana = document.getElementById("deluser");
const formdel = document.querySelector("#deluser form");
userdel.value = "False";

userdel.addEventListener("click", () => {
    if (userdel.value == "False") {
        formadd.reset();
        addventana.style.display = "none";
        adduser.value = "False";
        delventana.style.display = "block";
        userdel.value = "True";
    } else {
        delventana.style.display = "none";
        userdel.value = "False";
    }
});

formdel.addEventListener("submit", (e) => {
    if (!formdel.checkValidity()) return;
    formdel.reset();
    addventana.style.display = "none";
    adduser.value = "False";
});
// Consulta Pagos Pendientes
// select * from Cliente where realizado = false;
const MostrarPendientes = document.getElementById("cli_pendientes");
MostrarPendientes.addEventListener("click", (e)=> {
     Toast("Mostrando pagos pendientes");
});

// =============================================

// Consulta Pagos Realizados
// select * from cliente where realizado = true;

const MostrarRealizados = document.getElementById("cli_realizados");
MostrarRealizados.addEventListener("click", (e)=> {
    Toast("Mostrando pagos realizados");
});
// =============================================

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

// 1. Definir la función que realiza la petición fetch
async function cargarClientes() {
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


 
function creartabla() {
    // Plantilla tabla telefono

    const tabla = document.createElement("table");
    const tabla_contenido = document.createElement("tbody");
    tabla.appendChild(tabla_contenido)
    const tipo = document.createElement("tr");
    const tipo_titulo = document.createElement("th");
    tipo_titulo.textContent = ("Tipo");
    const tipo_contenido = document.createElement("td");

    tipo.appendChild(tipo_titulo);
    tipo.appendChild(tipo_contenido);
    tabla_contenido.appendChild(tipo);

    const titulo = document.createElement("tr");
    const titulo_titulo = document.createElement("th");
    titulo_titulo.textContent = ("Titulo");
    const titulo_contenido = document.createElement("td");

    titulo.appendChild(titulo_titulo);
    titulo.appendChild(titulo_contenido);
    tabla_contenido.appendChild(titulo);

    const numero = document.createElement("tr");
    const numero_titulo = document.createElement("th");
    numero_titulo.textContent = ("id | Numero");
    const numero_contenido = document.createElement("td");

    numero.appendChild(numero_titulo);
    numero.appendChild(numero_contenido);
    tabla_contenido.appendChild(numero);

    const fecha = document.createElement("tr");
    const fecha_titulo = document.createElement("th");
    fecha_titulo.textContent = ("Fecha");
    const fecha_contenido = document.createElement("td");
    
    fecha.appendChild(fecha_titulo);
    fecha.appendChild(fecha_contenido);
    tabla_contenido.appendChild(fecha);

    const dolares = document.createElement("tr");
    const dolares_titulo = document.createElement("th");
    dolares_titulo.textContent = ("Precio USD$");
    const dolares_contenido = document.createElement("td");
    
    dolares.appendChild(dolares_titulo);
    dolares.appendChild(dolares_contenido);
    tabla_contenido.appendChild(dolares);

    const paypal = document.createElement("tr");
    const paypal_titulo = document.createElement("th");
    paypal_titulo.textContent = ("Precio PayPal");
    const paypal_contenido = document.createElement("td");
    
    paypal.appendChild(paypal_titulo);
    paypal.appendChild(paypal_contenido);
    tabla_contenido.appendChild(paypal);

    const euros = document.createElement("tr");
    const euros_titulo = document.createElement("th");
    euros_titulo.textContent = ("Precio EUR€");
    const euros_contenido = document.createElement("td");
    
    euros.appendChild(euros_titulo);
    euros.appendChild(euros_contenido);
    tabla_contenido.appendChild(euros);

    const realizada = document.createElement("tr");
    const realizada_titulo = document.createElement("th");
    realizada_titulo.textContent = ("Transferencia Realiazda");
    const realizada_contenido = document.createElement("td");

    realizada.appendChild(realizada_titulo);
    realizada.appendChild(realizada_contenido);
    tabla_contenido.appendChild(realizada);

    main.appendChild(tabla);
    return tabla; // Para que se ponga dentro del usuario

        /*
        <table>
            <tbody>
                <tr> *8
                    <td>Titulo</td>
                    <td>Respuesta-</td>
                </tr>
            </tbody>
        </table>
        */
}
