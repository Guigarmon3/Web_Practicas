import { obtenerCotizacionesAPI, crearCotizacionAPI, obtenerCotizacionAñoAPI, editarCotizacionAPI, borrarCotizacionAPI, obtenerCotizacionesAgrupadasPorAnyo} from "./api.js";
import { Toast } from './tablas.js';
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

document.getElementById("cerrar_mod_cotizacion").addEventListener("click", () => {
    modventana.style.display = "none";
});

add_year.value = new Date().getFullYear();
add_trimestre.value = Math.ceil((new Date().getMonth() + 1) / 3);

document.addEventListener('DOMContentLoaded', cargarCotizaciones);

async function cargarCotizaciones() {
    try {
        cotizaciones = await obtenerCotizacionesAPI();
        renderizarCotizaciones(cotizaciones);
    } catch (error) {
        console.error("Error al cargar las cotizaciones:", error);
    }
}

async function renderizarCotizaciones(lista) {
    const contenedorCotizaciones = document.getElementById('contenedor-cotizaciones');
    contenedorCotizaciones.innerHTML = '';

    const cotizacionesAgrupadas = {};
    lista.forEach(cot => {
        if (!cotizacionesAgrupadas[cot.quoteYear]) {
            cotizacionesAgrupadas[cot.quoteYear] = [];
        }
        cotizacionesAgrupadas[cot.quoteYear].push(cot);
    });

    const aniosOrdenados = Object.keys(cotizacionesAgrupadas).sort((a, b) => b - a);

    for (const anyo of aniosOrdenados) {
        const divAnio = document.createElement('div');
        divAnio.className = 'contenedor-anio';

        const h2Anio = document.createElement('h2');
        h2Anio.textContent = `Año ${anyo}`;
        divAnio.appendChild(h2Anio);

        const divListado = document.createElement('div');
        divListado.className = 'listado-cotizaciones-anio';

        const cotsAnio = cotizacionesAgrupadas[anyo].sort((a, b) => a.quarterly - b.quarterly);

        cotsAnio.forEach(cot => {
            const divCot = document.createElement('div');
            divCot.className = 'cotizacion-item';

            const h3Trim = document.createElement('h3');
            h3Trim.textContent = `Trimestre ${cot.quarterly}`;
            divCot.appendChild(h3Trim);

            const divInfoImporte = document.createElement('div');
            divInfoImporte.className = 'cotizacion-info';
            const h4Importe = document.createElement('h4');
            h4Importe.textContent = 'Importe TGSS:';
            const divValImporte = document.createElement('div');
            divValImporte.className = 'cotizacion-valor';
            divValImporte.textContent = `${cot.facImport.toFixed(2)} €`;
            divInfoImporte.appendChild(h4Importe);
            divInfoImporte.appendChild(divValImporte);
            divCot.appendChild(divInfoImporte);

            const divInfoFecha = document.createElement('div');
            divInfoFecha.className = 'cotizacion-info';
            divInfoFecha.style.marginTop = '10px';
            const h4Fecha = document.createElement('h4');
            h4Fecha.textContent = 'Fecha de Pago:';
            const divValFecha = document.createElement('div');
            divValFecha.className = 'cotizacion-valor';
            divValFecha.textContent = cot.datePay ? new Date(cot.datePay).toLocaleDateString('es-ES') : 'Pendiente';
            divInfoFecha.appendChild(h4Fecha);
            divInfoFecha.appendChild(divValFecha);
            divCot.appendChild(divInfoFecha);

            const divBotones = document.createElement('div');
            divBotones.className = 'cotizacion-botones';

            const btnMod = document.createElement('button');
            btnMod.className = 'cli_modificar';
            btnMod.textContent = 'Modificar';
            btnMod.addEventListener('click', () => {
                cotizacionEditable = cot;
                mod_importe.value = cot.facImport;
                mod_fechaPago.value = cot.datePay ? cot.datePay.substring(0, 10) : '';
                modventana.style.display = 'block';
            });

            const btnDel = document.createElement('button');
            btnDel.className = 'cli_borrar';
            btnDel.textContent = 'Borrar';
            btnDel.addEventListener('click', async () => {
                if (confirm('¿Seguro que deseas eliminar esta cotización?')) {
                    try {
                        const response = await borrarCotizacionAPI(cot.quoteYear, cot.quarterly);
                        console.log(response);
                        Toast("Cotización eliminada correctamente");
                        cargarCotizaciones();
                    } catch (error) {
                        console.error(error);
                    }
                }
            });

            divBotones.appendChild(btnMod);
            divBotones.appendChild(btnDel);
            divCot.appendChild(divBotones);

            divListado.appendChild(divCot);
        });

        divAnio.appendChild(divListado);

        try {
            const totalanio = await obtenerCotizacionesAgrupadasPorAnyo(anyo);
            const h3total = document.createElement('h3');
            h3total.textContent = `Total TGSS: ${totalanio.toFixed(2)} €`;
            h3total.id = "totalTGB"
            divAnio.appendChild(h3total);
        } catch (error) {
            console.error(`Error al obtener cotizaciones para el año ${anyo}:`, error);
            return;
        }
        
        contenedorCotizaciones.appendChild(divAnio);
    };
}

formadd_cotizacion.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!formadd_cotizacion.checkValidity()) return;
    const anio = parseInt(add_year.value);
    const trimestre = parseInt(add_trimestre.value);
    const existe = cotizaciones.some(cot => 
        cot.quoteYear === anio && 
        cot.quarterly === trimestre
    );

    if (existe) {
        Toast("Ya existe una cotización para este trimestre.");
        return;
    }

    try {
        const data = await crearCotizacionAPI({
            quoteYear: add_year.value,
            quarterly: add_trimestre.value,
            facImport: add_importe.value,
            datePay: add_fechaPago.value || null
        });
        console.log('Guardado:', data);
        Toast("Cotización añadida correctamente");
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
            quoteYear: cotizacionEditable.quoteYear,
            quarterly: cotizacionEditable.quarterly,
            facImport: mod_importe.value,
            datePay: mod_fechaPago.value || null
        });
        console.log('Cotización actualizada:', cotizacionData);
        Toast("Cotización actualizada correctamente");
        modventana.style.display = "none";
        cargarCotizaciones();
    } catch (error) {
        console.error("Error", error);
    }
});