import { obtenerPagoTrimestreAPI, obtenerPagoTrimestreRealAPI, obtenerPagosAñoRealAPI, obtenerPagosAñoAPI,obtenerManagementAPI, obtenerManagementAñoAPI, crearManagementAPI, editarManagementAPI, borrarManagementAPI } from "./api.js";
import { Toast } from './tablas.js';

let managementData = [];

const search_year = document.getElementById("search_year");
const search_trimestre = document.getElementById("search_trimestre");

const addgestion = document.getElementById("gestoria_add");
const addventana = document.getElementById("addgestion");
const cerrar_add_gestion = document.getElementById("cerrar_add_gestion");
const formadd_gestion = document.querySelector("#addgestion form");

const add_year_gestion = document.getElementById("add_year_gestion");
const add_quarterly_gestion = document.getElementById("add_quarterly_gestion");
const add_performance_gestion = document.getElementById("add_performance_gestion");
const add_importe_gestion = document.getElementById("add_importe_gestion");

const modventana = document.getElementById("modgestion");
const cerrarModgestion = document.getElementById("cerrarModgestion");
const formmod_gestion = document.querySelector("#modgestion form");

const mod_performance_gestion = document.getElementById("mod_performance_gestion");
const mod_importe_gestion = document.getElementById("mod_importe_gestion");

const meses = document.getElementById("meses");
const cerrarMeses = document.getElementById("cerrarMeses");
const mesesContenedor = document.getElementById("meses-contenedor");    

let gestionEditable = null;

addgestion.addEventListener("click", () => {
    addventana.style.display = "block";
});

cerrar_add_gestion.addEventListener("click", () => {
    addventana.style.display = "none";
});

document.addEventListener('DOMContentLoaded', () => {
    cargarTodo();
});

add_year_gestion.value = new Date().getFullYear();
add_quarterly_gestion.value = Math.ceil((new Date().getMonth() + 1) / 3);

async function cargarTodo() {
    try {
        managementData = await obtenerManagementAPI();
        await renderizarGestoria(managementData);
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

async function renderizarGestoria(management) {
    const contenedorGestoria = document.getElementById('contenedor-gestoria');
    contenedorGestoria.innerHTML = '';

    const gestoriasAgrupadas = {};
    management.forEach(man => {
        if (!gestoriasAgrupadas[man.facYear]) {
            gestoriasAgrupadas[man.facYear] = [];
        }
        gestoriasAgrupadas[man.facYear].push(man);
    });

    const aniosOrdenados = Object.keys(gestoriasAgrupadas).sort((a, b) => b - a);

    const anyosConManagement = management.map(item => item.facYear ?? item.fac_year);

    for (const anyo of aniosOrdenados) {
        const anyoDiv = document.createElement('div');
        anyoDiv.className = 'contenedor-anio';

        const cabeceraAnyo = document.createElement('h2');
        cabeceraAnyo.textContent = `Año: ${anyo}`;
        anyoDiv.appendChild(cabeceraAnyo);

        let pagosAnuales = 0;
        try {
            pagosAnuales = await obtenerPagosAñoAPI({ year: anyo });
            console.log(`Total Facturado para el año ${anyo}:`, pagosAnuales);
        } catch (error) {
            console.error(`Error al obtener los pagos por año para el año ${anyo}:`, error);
        }

        const divInfoGananciaAnual = document.createElement('div');
        divInfoGananciaAnual.className = 'cotizacion-info';
        const gananciaAnualText = document.createElement('h3');
        gananciaAnualText.textContent = 'Ganancia Anual:';
        const gananciaAnual = document.createElement('p');
        gananciaAnual.className = 'cotizacion-valor';
        gananciaAnual.textContent = `${pagosAnuales ? pagosAnuales.toFixed(2) : '0.00'} €`;
        divInfoGananciaAnual.appendChild(gananciaAnualText);
        divInfoGananciaAnual.appendChild(gananciaAnual);
        anyoDiv.appendChild(divInfoGananciaAnual);

        let pagosAnualesReal = 0;
        try {
            pagosAnualesReal = await obtenerPagosAñoRealAPI({ year: anyo });
            console.log(`Total Real para el año ${anyo}:`, pagosAnualesReal);
        } catch (error) {
            console.error(`Error al obtener los pagos por año para el año ${anyo}:`, error);
        }

        const divInfoGananciaAnualReal = document.createElement('div');
        divInfoGananciaAnualReal.className = 'cotizacion-info';
        const gananciaAnualRealText = document.createElement('h3');
        gananciaAnualRealText.textContent = 'Ganancia Anual Real:';
        const gananciaAnualReal = document.createElement('p');
        gananciaAnualReal.className = 'cotizacion-valor';
        gananciaAnualReal.textContent = `${pagosAnualesReal ? pagosAnualesReal.toFixed(2) : '0.00'} €`;
        divInfoGananciaAnualReal.appendChild(gananciaAnualRealText);
        divInfoGananciaAnualReal.appendChild(gananciaAnualReal);
        anyoDiv.appendChild(divInfoGananciaAnualReal);

        const contenedorHorizontal = document.createElement('div');
        contenedorHorizontal.className = 'listado-cotizaciones-anio';

        const cotsAnio = gestoriasAgrupadas[anyo].sort((a, b) => a.quarterly - b.quarterly);

        for (const cot of cotsAnio) {
            const trimestreDiv = document.createElement('div');
            trimestreDiv.className = 'cotizacion-item';

            const tituloTrimestre = document.createElement('h3');
            tituloTrimestre.textContent = `Trimestre: ${cot.quarterly}/4`;
            trimestreDiv.appendChild(tituloTrimestre);

            let pagosTrimestre = 0;
            try{
                pagosTrimestre = await obtenerPagoTrimestreAPI({
                    startMonth: (cot.quarterly - 1) * 3 + 1,
                    endMonth: cot.quarterly * 3,
                    year: cot.facYear
                });
            } catch (error) {
                console.error("Error al obtener los pagos del trimestre:", error);
            }

            const divInfoTotalFacturado = document.createElement('div');
            divInfoTotalFacturado.className = 'cotizacion-info';
            const totalfacturadoText = document.createElement('h4');
            totalfacturadoText.textContent = 'Total Facturado:';
            const totalfacturado = document.createElement('p');
            totalfacturado.className = 'cotizacion-valor';
            totalfacturado.textContent = `${pagosTrimestre ? pagosTrimestre.toFixed(2) : '0.00'} €`;
            divInfoTotalFacturado.appendChild(totalfacturadoText);
            divInfoTotalFacturado.appendChild(totalfacturado);
            trimestreDiv.appendChild(divInfoTotalFacturado);

            let pagosTrimestreReal = 0;
            try{
                pagosTrimestreReal = await obtenerPagoTrimestreRealAPI({
                    startMonth: (cot.quarterly - 1) * 3 + 1,
                    endMonth: cot.quarterly * 3,
                    year: cot.facYear
                });
            } catch (error) {
                console.error("Error al obtener los pagos reales del trimestre:", error);
            }

            const divInfoGanancia = document.createElement('div');
            divInfoGanancia.className = 'cotizacion-info';
            const gananciaText = document.createElement('h4');
            gananciaText.textContent = 'Ganancia:';
            const ganancia = document.createElement('p');
            ganancia.className = 'cotizacion-valor';
            ganancia.textContent = `${pagosTrimestreReal ? pagosTrimestreReal.toFixed(2) : '0.00'} €`;
            divInfoGanancia.appendChild(gananciaText);
            divInfoGanancia.appendChild(ganancia);
            trimestreDiv.appendChild(divInfoGanancia);

            const divInfoRendimiento = document.createElement('div');
            divInfoRendimiento.className = 'cotizacion-info';
            const rendimientoText = document.createElement('h4');
            rendimientoText.textContent = 'Rendimiento:';
            const rendimiento = document.createElement('p');
            rendimiento.className = 'cotizacion-valor';
            rendimiento.textContent = `${cot.performance.toFixed(2)} %`;
            divInfoRendimiento.appendChild(rendimientoText);
            divInfoRendimiento.appendChild(rendimiento);
            trimestreDiv.appendChild(divInfoRendimiento);

            const divInfoPagoHacienda = document.createElement('div');
            divInfoPagoHacienda.className = 'cotizacion-info';
            const pagoHaciendaText = document.createElement('h4');
            pagoHaciendaText.textContent = 'Pago a Hacienda:';
            divInfoPagoHacienda.appendChild(pagoHaciendaText);
            const pagoHaciendaP = document.createElement('p');
            pagoHaciendaP.className = 'cotizacion-valor';
            pagoHaciendaP.textContent = `${cot.taxPayment.toFixed(2)} €`;
            divInfoPagoHacienda.appendChild(pagoHaciendaP);
            trimestreDiv.appendChild(divInfoPagoHacienda);

            const divBotones = document.createElement('div');
            divBotones.className = 'cotizacion-botones';
            
            const modificar = document.createElement('button');
            modificar.textContent = 'Modificar';
            modificar.className = 'cli_modificar';
            divBotones.appendChild(modificar);
            modificar.addEventListener('click', () => {
                gestionEditable = cot;
                mod_performance_gestion.value = cot.performance;
                mod_importe_gestion.value = cot.taxPayment;
                modventana.style.display = "block";
            });

            const cerrarModgestion = document.getElementById("cerrarModgestion");
            cerrarModgestion.addEventListener("click", () => {
                modventana.style.display = "none";
                gestionEditable = null;
            });

            const eliminar = document.createElement('button');
            eliminar.textContent = 'Eliminar';
            eliminar.className = 'cli_borrar';
            divBotones.appendChild(eliminar);
            eliminar.addEventListener('click', async () => {
                if (confirm('¿Seguro que deseas eliminar esta gestoría?')) {
                    try {
                        const respuesta = await borrarManagementAPI(cot.facYear, cot.quarterly);
                        Toast("Gestoría eliminada correctamente");
                        console.log(respuesta);
                        cargarTodo();
                    } catch (error) {
                        console.error("Error al eliminar la gestoría:", error);
                        Toast("Error al eliminar la gestoría");
                    }
                }
            });

            const mostrarMes = document.createElement('button');
            mostrarMes.textContent = 'Meses';
            mostrarMes.className = 'cli_button';
            divBotones.appendChild(mostrarMes);

            mostrarMes.addEventListener('click', async () => {
                mesesContenedor.innerHTML = '';
                const nombresMeses = [
                    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                ];
                const startMonth = (cot.quarterly - 1) * 3;
                const textoMeses = document.createElement('h2');
                textoMeses.textContent = `Meses del ${cot.quarterly}º Trimestre del ${cot.facYear}`;
                mesesContenedor.appendChild(textoMeses);
                const contenedorHorizontalMes = document.createElement('div');
                contenedorHorizontalMes.className = 'listado-cotizaciones-anio';
                for (let i = 0; i < 3; i++) {   
                    const indiceMes = startMonth + i;
                    const nombreMes = nombresMeses[indiceMes];
                    const cardMes = document.createElement('div');
                    cardMes.className = 'cotizacion-item';
                    const tituloMes = document.createElement('h3');
                    tituloMes.textContent = nombreMes;

                    let pagosMes = 0;
                    const infoTotalFacturadoMes = document.createElement('div');
                    infoTotalFacturadoMes.className = 'cotizacion-info';
                    const totalFacturadoMesText = document.createElement('h4');
                    totalFacturadoMesText.textContent = 'Total Facturado:';
                    infoTotalFacturadoMes.appendChild(totalFacturadoMesText);
                    const totalFacturadoMes = document.createElement('p');
                    totalFacturadoMes.className = 'cotizacion-valor';
                    try {                        
                        pagosMes = await obtenerPagoTrimestreAPI({
                            startMonth: indiceMes + 1,
                            endMonth: indiceMes + 1,
                            year: cot.facYear
                        });
                        totalFacturadoMes.textContent = `${pagosMes ? pagosMes.toFixed(2) : '0.00'} €`;
                    } catch (error) {
                        console.error(`Error al obtener los pagos del mes ${nombreMes}:`, error);
                        totalFacturadoMes.textContent = `Total Facturado: 0.00 €`;
                    }
                    infoTotalFacturadoMes.appendChild(totalFacturadoMes);
                    
                    let IRPFMes = pagosMes * 0.20;
                    const infoIRPF = document.createElement('div');
                    infoIRPF.className = 'cotizacion-info';
                    const IRPFText = document.createElement('h4');
                    IRPFText.textContent = 'IRPF  retenido (20%):';
                    infoIRPF.appendChild(IRPFText);
                    const IRPF = document.createElement('p');
                    IRPF.className = 'cotizacion-valor';
                    IRPF.textContent = `${IRPFMes ? IRPFMes.toFixed(2) : '0.00'} €`;
                    infoIRPF.appendChild(IRPF);

                    let ganaciaMes = pagosMes - IRPFMes;
                    const infoGanacia = document.createElement('div');
                    infoGanacia.className = 'cotizacion-info';
                    const ganaciaText = document.createElement('h4');
                    ganaciaText.textContent = 'Ganancia:';
                    infoGanacia.appendChild(ganaciaText);
                    const ganacia = document.createElement('p');
                    ganacia.className = 'cotizacion-valor';
                    ganacia.textContent = `${ganaciaMes ? ganaciaMes.toFixed(2) : '0.00'} €`;
                    infoGanacia.appendChild(ganacia);

                    cardMes.appendChild(tituloMes);
                    cardMes.appendChild(infoTotalFacturadoMes);
                    cardMes.appendChild(infoIRPF);
                    cardMes.appendChild(infoGanacia);
                    contenedorHorizontalMes.appendChild(cardMes);
                    mesesContenedor.appendChild(contenedorHorizontalMes);
                }
                meses.style.display = "block";
            });

            cerrarMeses.addEventListener("click", () => {
                meses.style.display = "none";
            });

            trimestreDiv.appendChild(divBotones);
            contenedorHorizontal.appendChild(trimestreDiv);

            //Seguir por aquí para mostrar el total anual
            let pagosAnuales = 0;
            try {
                pagosAnuales = await obtenerPagosAñoAPI({
                    year: cot.facYear
                });
                console.log("Total Facturado:", pagosAnuales);
            } catch (error) {
                console.error("Error al obtener los pagos por año:", error);
            }
            
        };
        anyoDiv.appendChild(contenedorHorizontal);
        contenedorGestoria.appendChild(anyoDiv);

    }
}

search_trimestre.addEventListener("input", async () => {
    const busqueda = search_trimestre.value.trim();
    if (busqueda === "") {
        cargarTodo();
        return;
    }
    if (busqueda > 4) {
        search_trimestre.value = 4;
    }
    if (busqueda < 1) {
        search_trimestre.value = 1;
    }
    if (search_year.value === "") {
        search_year.value = new Date().getFullYear();
    }

    try {
        const resultados = await obtenerManagementAñoAPI(search_year.value, busqueda);
        const datosParaRenderizar = Array.isArray(resultados) ? resultados : (resultados ? [resultados] : []);
        renderizarGestoria(datosParaRenderizar);
    } catch (error) {
        console.error("Error en la búsqueda:", error);
    }
});

search_year.addEventListener("input", async () => {
    const busqueda = search_year.value.trim();
    if (busqueda === "") {
        cargarTodo();
        return;
    }
    if (busqueda.length < 4) {
        return;
    }
    if (search_trimestre.value === "") {
        search_trimestre.value =  Math.ceil((new Date().getMonth() + 1) / 3);
    }
    if (search_trimestre.value > 4) {
        search_trimestre.value = 4;
    }
    if (search_trimestre.value < 1) {
        search_trimestre.value = 1;
    }

    try {
        const resultados = await obtenerManagementAñoAPI(busqueda, search_trimestre.value);
        const datosParaRenderizar = Array.isArray(resultados) ? resultados : (resultados ? [resultados] : []);
        renderizarGestoria(datosParaRenderizar);
    } catch (error) {
        console.error("Error en la búsqueda:", error);
    }
});

formadd_gestion.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!formadd_gestion.checkValidity()) return;
    const anio = parseInt(add_year_gestion.value);
    const trimestre = parseInt(add_quarterly_gestion.value);
    const existe = managementData.some(item => (item.facYear ?? item.fac_year) === anio && item.quarterly === trimestre);
    if (existe) {
        Toast("Ya existe una gestoría para ese año y trimestre");
        return;
    }

    try {
        const newGestion = await crearManagementAPI({
            facYear: add_year_gestion.value,
            quarterly: add_quarterly_gestion.value,
            taxPayment: add_importe_gestion.value,
            performance: add_performance_gestion.value
        });
        console.log("Gestoría creada:", newGestion);
        Toast("Gestoría creada correctamente");
    } catch (error) {
        console.error("Error al crear la gestoría:", error);
        Toast("Error al crear la gestoría");
    }
    addventana.style.display = "none";
    add_importe_gestion.value = "";
    add_performance_gestion.value = "";
    cargarTodo();
});

formmod_gestion.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!formmod_gestion.checkValidity()) return;
    try {        const updatedGestion = await editarManagementAPI({
            facYear: gestionEditable.facYear,
            quarterly: gestionEditable.quarterly,
            taxPayment: mod_importe_gestion.value,
            performance: mod_performance_gestion.value
        });
        console.log("Gestoría actualizada:", updatedGestion);
        Toast("Gestoría actualizada correctamente");
    } catch (error) {
        console.error("Error al actualizar la gestoría:", error);
        Toast("Error al actualizar la gestoría");
    }
    modventana.style.display = "none";
    cargarTodo();
});