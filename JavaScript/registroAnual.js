import { obtenerPagoTrimestreAPI, obtenerPagoTrimestreRealAPI, obtenerPagosAñoRealAPI, obtenerPagosAñoAPI,obtenerManagementAPI, obtenerManagementAñoAPI, crearManagementAPI, editarManagementAPI, borrarManagementAPI } from "./api.js";
import { Toast } from './tablas.js';

let managementData = [];

const search_year = document.getElementById("search_year");

const addgestion = document.getElementById("gestoria_add");
const addventana = document.getElementById("addgestion");
const cerrar_add_gestion = document.getElementById("cerrar_add_gestion");
const formadd_gestion = document.querySelector("#addgestion form");

const add_year_gestion = document.getElementById("add_year_gestion");

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

async function cargarTodo() {
    try {
        managementData = await obtenerManagementAPI();
        await renderizarGestoria(managementData);
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }

    if (window.innerWidth <= 768) {
        addgestion.textContent = "+";
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
            totalfacturadoText.textContent = 'Total Facturado (automático):';
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
            gananciaText.textContent = 'Ganancia Real (automático):';
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
            rendimiento.textContent = `${cot.performance.toFixed(2)} €`;
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
                if (confirm('¿Seguro que deseas eliminar los datos del trimestre?')) {
                    try {
                        const respuesta = await editarManagementAPI({
                            facYear: cot.facYear, 
                            quarterly: cot.quarterly,
                            taxPayment: 0.00,
                            performance: 0.00
                        });
                        Toast("Datos del trimestre eliminados correctamente");
                        console.log(respuesta);
                        cargarTodo();
                    } catch (error) {
                        console.error("Error al eliminar los datos del trimestre:", error);
                        Toast("Error al eliminar los datos del trimestre");
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
                contenedorHorizontalMes.id = "listadomeses";
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
            
        };
        anyoDiv.appendChild(contenedorHorizontal);

        let pagosAnuales = 0;
        try {
            pagosAnuales = await obtenerPagosAñoAPI({ year: anyo });
            console.log(`Total Facturado para el año ${anyo}:`, pagosAnuales);
        } catch (error) {
            console.error(`Error al obtener los pagos por año para el año ${anyo}:`, error);
        }

        const gananciaAnual = document.createElement('h3');
        gananciaAnual.className = 'totalAnual';
        gananciaAnual.textContent = `Ganancia Anual: ${pagosAnuales ? pagosAnuales.toFixed(2) : '0.00'} €`;
        anyoDiv.appendChild(gananciaAnual);

        let pagosAnualesReal = 0;
        try {
            pagosAnualesReal = await obtenerPagosAñoRealAPI({ year: anyo });
            console.log(`Total Real para el año ${anyo}:`, pagosAnualesReal);
        } catch (error) {
            console.error(`Error al obtener los pagos por año para el año ${anyo}:`, error);
        }

        
        const gananciaAnualReal = document.createElement('h3');
        gananciaAnualReal.className = 'totalAnual';
        gananciaAnualReal.textContent = `Ganancia Anual Real: ${pagosAnualesReal ? pagosAnualesReal.toFixed(2) : '0.00'} €`;
        anyoDiv.appendChild(gananciaAnualReal);

        contenedorGestoria.appendChild(anyoDiv);

    }
}

search_year.addEventListener("input", async () => {
    let busqueda = search_year.value.trim();
    if (busqueda === "") {
        cargarTodo();
        return;
    }
    if (busqueda.length < 4) {
        return;
    }

    try {
        const datosParaRenderizar = [];
        for (let i = 1; i <= 4; i++) {
            const resultados = await obtenerManagementAñoAPI(busqueda, i);
            datosParaRenderizar.push(resultados);
        }
        renderizarGestoria(datosParaRenderizar);
    } catch (error) {
        console.error("Error en la búsqueda:", error);
    }
});

formadd_gestion.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!formadd_gestion.checkValidity()) return;
    const anio = parseInt(add_year_gestion.value);
    const existe = managementData.some(item => (item.facYear ?? item.fac_year) === anio);
    if (existe) {
        Toast("Ya existe un registro anual para ese año");
        return;
    }

    for (let i = 1; i <= 4; i++) {
        try {
            const newGestion = await crearManagementAPI({
                facYear: add_year_gestion.value,
                quarterly: i,
                taxPayment: 0.00,
                performance: 0.00
            });
            console.log("Registro anual creado:", newGestion);
        } catch (error) {
            console.error("Error al crear el registro anual:", error);
        }
    }
    addventana.style.display = "none";
    cargarTodo();
});

formmod_gestion.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!formmod_gestion.checkValidity()) return;
    try {        
        const updatedGestion = await editarManagementAPI({
            facYear: gestionEditable.facYear,
            quarterly: gestionEditable.quarterly,
            taxPayment: mod_importe_gestion.value,
            performance: mod_performance_gestion.value
        });
        console.log("Trimestre actualizado:", updatedGestion);
        Toast("Trimestre actualizado correctamente");
    } catch (error) {
        console.error("Error al actualizar el trimestre:", error);
        Toast("Error al actualizar el trimestre");
    }
    modventana.style.display = "none";
    cargarTodo();
});