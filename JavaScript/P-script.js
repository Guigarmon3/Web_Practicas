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
            
            const pagosPendientes = pagos.filter(pago => {
                return !pago.made;
            });

            if (pagosPendientes.length > 0) {
                tienePagosPendientesGlobal = true;

                pagosPendientes.forEach(pago => {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${cliente.nick}</td>
                        <td>${pago.idNumber || pago.id}</td>
                        <td>${pago.facturaType}</td>
                        <td>${pago.title}</td>
                        <td>${pago.billDate}</td>
                        <td>$${pago.priceUs}</td>
                        <td>€${pago.pricePaypal}</td>
                        <td>€${pago.priceEu}</td>
                    `;
                    tbody.appendChild(fila);
                });
            }
        }

        if (!tienePagosPendientesGlobal) {
            mostrarMensajeVacio(tbody, table.querySelectorAll("th").length);
        }

        mainContainer.appendChild(table);

    } catch (error) {
        console.error(error);
    }
}

function mostrarMensajeVacio(tbody, totalColumnas) {
    tbody.innerHTML = `<tr><td colspan="${totalColumnas}" style="text-align:center; font-weight: bold; padding: 20px;">Sin pagos pendientes.</td></tr>`;
}