import { obtenerCotizacionesAPI, crearCotizacionAPI } from "./api.js";
import { tablavertical, Toast } from './tablas.js';
const addcotizacion = document.getElementById("cotizacion_add");
const addventana = document.getElementById("addcotizacion");
const cerrar_add_cotizacion = document.getElementById("cerrar_add_cotizacion");
const formadd_cotizacion = document.querySelector("#addcotizacion form");

const add_year = document.getElementById("add_year");
const add_trimestre = document.getElementById("add_trimestre");
const add_importe = document.getElementById("add_importe");
const add_fechaPago = document.getElementById("add_fechaPago");

addcotizacion.addEventListener("click", () => {
    addventana.style.display = "block";
});

cerrar_add_cotizacion.addEventListener("click", () => {
    addventana.style.display = "none";
});

add_year.value = new Date().getFullYear();
add_trimestre.value = Math.ceil((new Date().getMonth() + 1) / 3);
add_importe.value = "";

cargarCotizaciones();

async function cargarCotizaciones() {
    console.log("Iniciando la consulta fetch...");
    try {
        const cotizaciones = await obtenerCotizacionesAPI();
        renderizarCotizaciones(cotizaciones);
    } catch (error) {
        console.error("Error detallado en la consulta:", error);
    }
}

function renderizarCotizaciones(cotizaciones) {
    const main = document.getElementById("main");
    if (!main) return;
    main.innerHTML = ''; 

    cotizaciones.forEach(cotizacion => {
        const cotizacionElement = document.createElement("div");
        cotizacionElement.classList.add("cotizacion-item");
        cotizacionElement.innerHTML = `
            <h3>Cotización ${cotizacion.year}-${cotizacion.quarterly}</h3>
            <p>Importe: ${cotizacion.fac_import}</p>
            <p>Fecha de Pago: ${cotizacion.date_pay || 'No especificada'}</p>
        `;
        main.appendChild(cotizacionElement);
    });
}

formadd_cotizacion.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!formadd_cotizacion.checkValidity()) return;

    try {
        const cotizacionData = {
            year: parseInt(add_year.value),
            quarterly: parseInt(add_trimestre.value),
            fac_import: parseFloat(add_importe.value),
            date_pay: add_fechaPago.value ? add_fechaPago.value : null
        };
        const data = await crearCotizacionAPI(cotizacionData);
        console.log('Cotización registrada:', data);
        Toast("Cotización registrada correctamente");
    } catch (err) {
        console.error('Error:', err);
    }
    add_importe.value = "";
    addventana.style.display = "none";
    cargarCotizaciones();
});
