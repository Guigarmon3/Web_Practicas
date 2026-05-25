import { obtenerCotizacionesAPI, crearCotizacionAPI, obtenerCotizacionAñoAPI, editarCotizacionAPI, borrarCotizacionAPI} from "./api.js";
import { tablavertical, Toast } from './tablas.js';
const addcotizacion = document.getElementById("cotizacion_add");
const addventana = document.getElementById("addcotizacion");
const cerrar_add_cotizacion = document.getElementById("cerrar_add_cotizacion");
const formadd_cotizacion = document.querySelector("#addcotizacion form");

const add_year = document.getElementById("add_year");
const add_trimestre = document.getElementById("add_trimestre");
const add_importe = document.getElementById("add_importe");
const add_fechaPago = document.getElementById("add_fechaPago");

const modventana = document.getElementById("modcotizacion");
const formmod_cotizacion = document.querySelector("#modcotizacion form");

const mod_importe = document.getElementById("mod_importe");
const mod_fechaPago = document.getElementById("mod_fechaPago");

const search_year = document.getElementById("year");

let cotizaciones = [];
let cotizacionEditable = null;

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
        cotizaciones = await obtenerCotizacionesAPI();
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
            <p>Importe: ${cotizacion.fac_import}€</p>
            <p>Fecha de Pago: ${cotizacion.date_pay ? cotizacion.date_pay.split('T')[0] : 'aún no se ha pagado'}</p>
        `;
        const modificar = document.createElement("button");
        modificar.classList.add("cli_modificar");
        modificar.textContent = "Modificar";
        modificar.value = "False";
        
        modificar.addEventListener("click", () => {
            if (modificar.value === "False") {
                modventana.style.display = "block";
                modificar.value = "True";
                mod_importe.value = cotizacion.fac_import || '';
                mod_fechaPago.value = cotizacion.date_pay ? cotizacion.date_pay.split('T')[0] : '';
                cotizacionEditable = cotizacion;
            } else {
                modventana.style.display = "none";
                modificar.value = "False";
                cotizacionEditable = null;
            }
        });
        
        const borrar = document.createElement("button");
        borrar.classList.add("cli_borrar");
        borrar.textContent = "Eliminar";
        borrar.addEventListener("click", async () => {
            if (confirm(`¿Estás seguro de que quieres eliminar el  ${cotizacion.year}-${cotizacion.quarterly}?`)) {
                try {
                    await borrarCotizacionAPI(cotizacion.year, cotizacion.quarterly);
                    Toast("Cotización eliminada correctamente");
                    cargarCotizaciones();
                } catch (error) {
                    console.error(error);
                    Toast("No se pudo eliminar la cotización");
                }
            }
        });
        cotizacionElement.appendChild(modificar);
        cotizacionElement.appendChild(borrar);
        main.appendChild(cotizacionElement);
    });
}

formadd_cotizacion.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!formadd_cotizacion.checkValidity()) return;

    try {
        const year = parseInt(add_year.value);
        const quarterly = parseInt(add_trimestre.value);
        const existe = cotizaciones.some(c =>
                c.year === year &&
                c.quarterly === quarterly
            );
        if (existe) {
            Toast("Ya existe una cotización para ese año y trimestre");
            return;
        }
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

search_year.addEventListener("input", async () => {
    const busqueda = search_year.value.trim();
    if (busqueda === "") {
        cargarCotizaciones();
        return;
    }
    if (busqueda.length < 4) {
        return; 
    }

    try {
        const resultados = await obtenerCotizacionAñoAPI(busqueda);
        renderizarCotizaciones(resultados);
    } catch (error) {
        console.error("Error en la búsqueda:", error);
    }
});

formmod_cotizacion.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!formmod_cotizacion.checkValidity()) return;

    try {
        const cotizacionData = await editarCotizacionAPI({
            year: cotizacionEditable.year,
            quarterly: cotizacionEditable.quarterly,
            fac_import: mod_importe.value,
            date_pay: mod_fechaPago.value
        });
        console.log('Cotización actualizada:', cotizacionData);
        Toast("Cotización actualizada correctamente");
        cargarCotizaciones();
        
        formmod_cotizacion.reset();
        modventana.style.display = "none";
        cotizacionEditable = null;
    } catch (err) {
        console.error('Error:', err);
        Toast("No se pudo actualizar la cotización");
    }
    modventana.style.display = "none";
    cargarCotizaciones();
});
