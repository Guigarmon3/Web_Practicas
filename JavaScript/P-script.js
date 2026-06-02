import { obtenerTodosLosClientes, obtenerPagosCliente, editarPagoAPI } from './api.js';
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

    const cabeceras = ["NickName", "Cliente", "Tipo", "Titulo", "Fecha", "Precio USD$", "Precio PayPal", "Precio EUR€", "Acciones"];
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
            console.log('Pagos de', cliente.nick, pagos);

            const pagosPendientes = pagos.filter(pago => !pago.made);

            if (pagosPendientes.length > 0) {
                tienePagosPendientesGlobal = true;

                pagosPendientes.forEach(pago => {
                    const fila = document.createElement("tr");

                    const celdas = [
                        { label: "NickName",      valor: cliente.nick },
                        { label: "Cliente",       valor: cliente.name || "Sin Nombre" },
                        { label: "Tipo",          valor: pago.facturaType },
                        { label: "Titulo",        valor: pago.title },
                        { label: "Fecha",         valor: pago.billDate },
                        { label: "Precio USD$",   valor: `$${pago.priceUs}` },
                        { label: "Precio PayPal", valor: `€${pago.pricePaypal}` },
                        { label: "Precio EUR€",   valor: `€${pago.priceEu}` }
                    ];

                    celdas.forEach(({ label, valor }) => {
                        const td = document.createElement("td");
                        td.setAttribute("data-label", label);
                        td.textContent = valor;
                        fila.appendChild(td);
                    });

                    const tdAccion = document.createElement("td");
                    tdAccion.setAttribute("data-label", "Acciones");

                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.checked = pago.made;

                    checkbox.addEventListener("change", async () => {
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
                                    id: cliente.id
                                }
                            });
                            console.log("Estado del pago actualizado:", resultado);
                            Toast("Estado del pago actualizado correctamente.");
                            cargarTodosLosPagosPendientes();
                        } catch (error) {
                            console.error("Error al actualizar el estado del pago:", error);
                            Toast("Error al actualizar el estado del pago.");
                        }
                    });

                    tdAccion.appendChild(checkbox);
                    fila.appendChild(tdAccion);

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