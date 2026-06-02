import { 
    obtenerTodosLosClientes, 
    buscarClienteAPI, 
    crearClienteAPI, 
    editarClienteAPI, 
    borrarClienteAPI,
    obtenerPagosCliente,
    crearPagoAPI,
    editarPagoAPI,
    borrarPagoAPI
} from './api.js';

import { tablaHorizontal, Toast } from './tablas.js';

let clienteEditable = null;
let clientePagos = null;
let pagoEditable = null;

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
const cerrar_mod = document.getElementById("cerrar_mod");

const ventanaPagos = document.getElementById("pagos");
const inputbuscat = document.getElementById("cli_found");
const MostrarPendientes = document.getElementById("cli_pendientes");
const MostrarRealizados = document.getElementById("cli_realizados");

const addventanaPagos = document.getElementById("addpago");
const cerrar_addpagos = document.getElementById("cerrar_addPago");
const formaddpagos = document.querySelector("#addpago form");

const add_tipo_pago = document.getElementById("add_tipo_pago");
const add_titulo_pago = document.getElementById("add_titulo_pago");
const add_fecha_pago = document.getElementById("add_fecha_pago");
const add_precio_pago = document.getElementById("add_precio_pago");
const add_precio_paypal = document.getElementById("add_precio_paypal");
const add_precio_eur = document.getElementById("add_precio_eur");

const modventanaPagos = document.getElementById("modpago");
const formmodpagos = document.querySelector("#modpago form");
const cerrar_modPago = document.getElementById("cerrar_modPago");

const mod_tipo_pago = document.getElementById("mod_tipo_pago");
const mod_titulo_pago = document.getElementById("mod_titulo_pago");
const mod_fecha_pago = document.getElementById("mod_fecha_pago");
const mod_precio_pago = document.getElementById("mod_precio_pago");
const mod_precio_paypal = document.getElementById("mod_precio_paypal");
const mod_precio_eur = document.getElementById("mod_precio_eur");
const mod_transferencia = document.getElementById("mod_transferencia");

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
    
    if (window.innerWidth <= 768) {
        adduser.textContent = "+";
    }
}

function renderizarClientes(clientes) {
    
    const contenedorClientes = document.getElementById("contenedor-clientes");
    contenedorClientes.innerHTML = '';

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

                modnombre.value = cliente.name;
                modnick.value = cliente.nick;
                modcorreo.value = cliente.email;
                modplataforma.value = cliente.platform;
                clienteEditable = cliente;
            } else {
                modventana.style.display = "none";
                modificar.value = "False";
                clienteEditable = null;
            }
        });

        cerrar_mod.addEventListener("click", () => {
            modventana.style.display = "none";
            modificar.value = "False";
            clienteEditable = null;
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
        botonPagos.addEventListener("click", async () => {
            clientePagos = cliente;
        });

        newdiv2.append(nombre, nickname, correo, plataforma, modificar, borrar, botonPagos);
        newdiv.appendChild(newdiv2);
        contenedorClientes.appendChild(newdiv);
    });
}

async function renderizarVentanaPagos() {
    if (!clientePagos) return;

    ventanaPagos.innerHTML = "";
    const centro = document.createElement("center");

    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("xbutton_db");
    btnCerrar.textContent = "X";
    btnCerrar.id = "cerrarpagos";
    btnCerrar.style.marginTop = "20px";
    btnCerrar.addEventListener("click", () => {
        ventanaPagos.style.display = "none";
        document.querySelectorAll("#contenedor-clientes .cli_button").forEach(b => b.value = "True");
    });
    
    centro.appendChild(btnCerrar);
    
    const titulo = document.createElement("h2");
    titulo.textContent = "Pagos del Cliente: " + clientePagos.nick;
    centro.appendChild(titulo);

    const tabla = tablaHorizontal();
    tabla.style.width = "100%";

    try {
        const tbody = tabla.querySelector("tbody");
        const pagos = await obtenerPagosCliente(clientePagos.id);

        if (pagos.length === 0) {
            const totalColumnas = tabla.querySelectorAll("th").length;
            tbody.innerHTML = `<tr><td colspan="${totalColumnas}" style="text-align:center;">Este cliente no tiene pagos registrados.</td></tr>`;
        } else {
            pagos.forEach(pago => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${pago.idNumber || pago.id}</td>
                    <td>${pago.facturaType}</td>
                    <td>${pago.title}</td>
                    <td>${pago.billDate}</td>
                    <td>$${pago.priceUs}</td>
                    <td>$${pago.pricePaypal}</td>
                    <td>€${pago.priceEu}</td>
                `;
                const tdCheck = document.createElement("td");
                const caja = document.createElement("input");
                caja.type = "checkbox";
                caja.checked = pago.made;
                tdCheck.style.backgroundColor = "transparent";
                caja.addEventListener("change", async () => {
                    try {
                        const resultado = await editarPagoAPI({
                            idNumber: pago.idNumber,
                            facturaType: pago.facturaType,
                            title: pago.title,
                            billDate: pago.billDate,
                            priceUs: pago.priceUs,
                            pricePaypal: pago.pricePaypal,
                            priceEu: pago.priceEu,
                            isMade: pago.made ? false : true,
                            customer: {
                                id: clientePagos.id
                            }
                        });
                        console.log("Estado del pago actualizado:", resultado);
                        Toast("Estado del pago actualizado correctamente.");
                        renderizarVentanaPagos();
                    } catch (error) {
                        console.error("Error al actualizar el estado del pago:", error);
                        Toast("Error al actualizar el estado del pago.");
                    }
                });

                const botones = document.createElement("td");
                botones.classList.add("botones-pago");
                
                const btnModificarFac = document.createElement("button");
                btnModificarFac.classList.add("cli_modificar");
                btnModificarFac.textContent = "Modificar";
                btnModificarFac.id = "modpagosButton";
                btnModificarFac.addEventListener("click", async () => {
                    modventanaPagos.style.display = "block";
                    mod_tipo_pago.value = pago.facturaType;
                    mod_titulo_pago.value = pago.title;
                    mod_fecha_pago.value = pago.billDate;
                    mod_precio_pago.value = pago.priceUs;
                    mod_precio_paypal.value = pago.pricePaypal;
                    mod_precio_eur.value = pago.priceEu;
                    mod_transferencia.checked = pago.made;
                    pagoEditable = pago;
                });

                cerrar_modPago.addEventListener("click", () => {
                    modventanaPagos.style.display = "none";
                    btnModificarFac.value = "False";
                    pagoEditable = null;
                });

                const btnEliminarFac = document.createElement("button");
                btnEliminarFac.classList.add("cli_borrar");
                btnEliminarFac.textContent = "Eliminar";
                btnEliminarFac.id = "delpagosButton";
                btnEliminarFac.style.marginRight = "-50%";
                btnEliminarFac.addEventListener("click", async () => {
                    if (confirm(`¿Estás seguro de que quieres eliminar el pago "${pago.facturaType}"?`)) {
                        try {
                            const response = await borrarPagoAPI(pago.idNumber);
                            Toast("Pago eliminado correctamente");
                            renderizarVentanaPagos();
                            console.log(response);
                            Toast("Pago eliminado correctamente");
                        } catch (error) {
                            console.error(error);
                            Toast("No se pudo eliminar el pago");
                        }
                    }
                });

                botones.appendChild(btnModificarFac);
                botones.appendChild(btnEliminarFac);
                tdCheck.appendChild(caja);
                fila.appendChild(tdCheck);
                fila.appendChild(botones);
                tbody.appendChild(fila);
            });
        }
    } catch (error) {
        console.error("Error al cargar los pagos:", error);
        Toast("Error al cargar la lista de pagos.");
    }

    centro.appendChild(tabla);

    const btnAñadirFac = document.createElement("button");
    btnAñadirFac.classList.add("cli_button");
    btnAñadirFac.textContent = "Añadir";
    btnAñadirFac.id = "addpagos";
    btnAñadirFac.style.marginTop = "20px";
    btnAñadirFac.addEventListener("click", () => {
        addventanaPagos.style.display = "block";
    });
    
    const lineador = document.createElement("div");
    lineador.className = "lineador";
    lineador.appendChild(btnAñadirFac);
    centro.appendChild(lineador);
    ventanaPagos.appendChild(centro);
    ventanaPagos.style.display = "block";
}

document.addEventListener("click", async (e) => {
    const boton = e.target.closest("#main .cli_button");
    if (!boton) return;
    
    if (boton.value === "True") {
        await renderizarVentanaPagos();
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

cerrar_addpagos.addEventListener("click", () => {
    addventanaPagos.style.display = "none";
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
        Toast("No se pudo añadir el cliente. Inténtalo de nuevo.");
    }
        
    formadd.reset();
    addventana.style.display = "none";
    adduser.value = "False";
});

formaddpagos.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!formaddpagos.checkValidity()) return;

    try {
        const data = await crearPagoAPI({
            facturaType: add_tipo_pago.value,
            title: add_titulo_pago.value,
            billDate: add_fecha_pago.value,
            priceUs: add_precio_pago.value,
            pricePaypal: add_precio_paypal.value,
            priceEu: add_precio_eur.value,
            isMade: false,
            customer: {
                id: clientePagos.id
            }
        });
        console.log('Pago añadido:', data);
        Toast("Pago añadido correctamente");
        await renderizarVentanaPagos();
    } catch (err) {
        console.error('Error al añadir pago:', err);
        Toast("No se pudo añadir el pago. Inténtalo de nuevo.");
    }
    formaddpagos.reset();
    addventanaPagos.style.display = "none";
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

formmodpagos.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!formmodpagos.checkValidity()) return;

    try {
        const data = await editarPagoAPI({
            idNumber: pagoEditable.idNumber,
            facturaType: mod_tipo_pago.value,
            title: mod_titulo_pago.value,
            billDate: mod_fecha_pago.value,
            priceUs: mod_precio_pago.value,
            pricePaypal: mod_precio_paypal.value,
            priceEu: mod_precio_eur.value,
            isMade: mod_transferencia.checked,
            customer: {
                id: clientePagos.id
            }
        });
        console.log('Pago modificado:', data);
        Toast("Pago modificado correctamente");
        pagoEditable = null;
        modventanaPagos.style.display = "none";
        await renderizarVentanaPagos();
    } catch (error) {
        console.error("Error", error);
        Toast("No se pudieron guardar los cambios. Inténtalo de nuevo.");
    }
});