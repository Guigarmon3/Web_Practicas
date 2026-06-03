import { obtenerTodosLosClientes, obtenerPagosCliente, borrarPagoAPI } from './api.js';
import { Toast } from './tablas.js';

document.addEventListener('DOMContentLoaded', cargarTodosLosPagosPendientes);

async function cargarTodosLosPagosPendientes() {
    const mainContainer = document.getElementById('main');
    if (!mainContainer) return;
    mainContainer.innerHTML = '';

    const table = document.createElement("table");
    table.classList.add("tablica");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const cabeceras = ["Cliente", "id | Numero", "Tipo", "Titulo", "Fecha", "Precio USD$", "Precio PayPal", "Precio EUR€"];
    cabeceras.forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    table.style.width = "100%";

    try {
        const clientes = await obtenerTodosLosClientes();
        let tienePagosPendientesGlobal = false;

        for (const cliente of clientes) {
            const pagos = await obtenerPagosCliente(cliente.id);
            console.log('Pagos de', cliente.nick, pagos); // ← depuración

            const pagosPendientes = pagos.filter(pago => !pago.made);

            if (pagosPendientes.length > 0) {
                tienePagosPendientesGlobal = true;

                pagosPendientes.forEach(pago => {
                    const fila = document.createElement("tr");

                    const celdas = [
                        { label: "Cliente",       valor: cliente.nick },
                        { label: "id | Numero",   valor: pago.idNumber || pago.id },
                        { label: "Tipo",          valor: pago.facturaType },
                        { label: "Titulo",        valor: pago.title },
                        { label: "Fecha",         valor: pago.billDate },
                        { label: "Precio USD$",   valor: `$${pago.priceUs}` },
                        { label: "Precio PayPal", valor: `€${pago.pricePaypal}` },
                        { label: "Precio EUR€",   valor: `€${pago.priceEu}` },
                    ];

                    celdas.forEach(({ label, valor }) => {
                        const td = document.createElement("td");
                        td.setAttribute("data-label", label);
                        td.textContent = valor;
                        fila.appendChild(td);
                    });

                    tbody.appendChild(fila);
                });
            }
        }

        if (!tienePagosPendientesGlobal) {
            mostrarMensajeVacio(tbody, cabeceras.length);
        }

        mainContainer.appendChild(table);

    } catch (error) {
        console.error(error);
    }
}

function mostrarMensajeVacio(tbody, totalColumnas) {
    tbody.innerHTML = `<tr><td colspan="${totalColumnas}" style="text-align:center; font-weight: bold; padding: 20px;">Sin pagos pendientes.</td></tr>`;
}