import { obtenerTodosLosClientes, obtenerPagosCliente, editarPagoAPI } from './api.js';
import { Toast } from './tablas.js';

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

let todosLosPagos = [];

document.addEventListener('DOMContentLoaded', async () => {
    await cargarTodosLosPagosRealizados();
    document.getElementById('filtro-mes').addEventListener('change', renderizarFiltrado);
    document.getElementById('filtro-anyo').addEventListener('change', renderizarFiltrado);
});

async function cargarTodosLosPagosRealizados() {
    try {
        const clientes = await obtenerTodosLosClientes();
        todosLosPagos = [];

        for (const cliente of clientes) {
            const pagos = await obtenerPagosCliente(cliente.id);
            pagos.filter(pago => pago.made).forEach(pago => {
                todosLosPagos.push({ cliente, pago });
            });
        }

        const anyosExistentes = [...new Set(
            todosLosPagos.map(({ pago }) => new Date(pago.billDate).getFullYear())
        )].sort((a, b) => b - a);

        const selectAnyo = document.getElementById('filtro-anyo');
        while (selectAnyo.options.length > 1) selectAnyo.remove(1);

        anyosExistentes.forEach(anyo => {
            const opt = document.createElement('option');
            opt.value = anyo;
            opt.textContent = anyo;
            selectAnyo.appendChild(opt);
        });

        renderizarFiltrado();

    } catch (error) {
        console.error(error);
    }
}

function renderizarFiltrado() {
    const mesFiltro = document.getElementById('filtro-mes').value;
    const anyoFiltro = document.getElementById('filtro-anyo').value;

    let lista = todosLosPagos;

    if (mesFiltro !== "") {
        lista = lista.filter(({ pago }) =>
            new Date(pago.billDate).getMonth() === parseInt(mesFiltro)
        );
    }
    if (anyoFiltro !== "") {
        lista = lista.filter(({ pago }) =>
            new Date(pago.billDate).getFullYear() === parseInt(anyoFiltro)
        );
    }

    renderizarPagos(lista);
}

function renderizarPagos(lista) {
    const mainContainer = document.getElementById('contenedor-realizados');
    mainContainer.innerHTML = '';

    if (lista.length === 0) {
        mainContainer.innerHTML = `<p style="text-align:center; font-weight:bold; padding:20px;">Sin pagos realizados.</p>`;
        return;
    }

    const agrupado = {};
    lista.forEach(({ cliente, pago }) => {
        const fecha = new Date(pago.billDate);
        const anyo = fecha.getFullYear();
        const mes = fecha.getMonth();
        if (!agrupado[anyo]) agrupado[anyo] = {};
        if (!agrupado[anyo][mes]) agrupado[anyo][mes] = [];
        agrupado[anyo][mes].push({ cliente, pago });
    });

    const anyosOrdenados = Object.keys(agrupado).map(Number).sort((a, b) => b - a);

    anyosOrdenados.forEach(anyo => {
        const divAnyo = document.createElement('div');
        divAnyo.className = 'pendiente-anyo';

        const headerAnyo = document.createElement('div');
        headerAnyo.className = 'pendiente-anyo__header';
        headerAnyo.innerHTML = `<span class="pendiente-flecha">▶</span><span>${anyo}</span>`;

        const bodyAnyo = document.createElement('div');
        bodyAnyo.className = 'pendiente-anyo__body';
        bodyAnyo.style.display = 'none';

        let anyoAbierto = false;
        headerAnyo.addEventListener('click', () => {
            anyoAbierto = !anyoAbierto;
            bodyAnyo.style.display = anyoAbierto ? 'block' : 'none';
            headerAnyo.querySelector('.pendiente-flecha').textContent = anyoAbierto ? '▼' : '▶';
        });

        const mesesOrdenados = Object.keys(agrupado[anyo]).map(Number).sort((a, b) => b - a);

        mesesOrdenados.forEach(mes => {
            const divMes = document.createElement('div');
            divMes.className = 'pendiente-mes';

            const headerMes = document.createElement('div');
            headerMes.className = 'pendiente-mes__header';
            headerMes.innerHTML = `<span class="pendiente-flecha">▶</span><span>${MESES[mes]}</span>`;

            const bodyMes = document.createElement('div');
            bodyMes.className = 'pendiente-mes__body';
            bodyMes.style.display = 'none';

            let mesAbierto = false;
            headerMes.addEventListener('click', (e) => {
                e.stopPropagation();
                mesAbierto = !mesAbierto;
                bodyMes.style.display = mesAbierto ? 'block' : 'none';
                headerMes.querySelector('.pendiente-flecha').textContent = mesAbierto ? '▼' : '▶';
            });

            const cabeceras = ["NickName", "Cliente", "Numero Factura", "Tipo", "Titulo", "Fecha", "Precio USD$", "Precio PayPal", "Precio EUR€", "Acciones"];
            const table = document.createElement('table');
            table.classList.add('tablica');
            table.style.width = '100%';

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            cabeceras.forEach(text => {
                const th = document.createElement('th');
                th.textContent = text;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');

            agrupado[anyo][mes]
                .sort((a, b) => new Date(b.pago.billDate) - new Date(a.pago.billDate))
                .forEach(({ cliente, pago }) => {
                    const fila = document.createElement('tr');

                    const celdas = [
                        { label: "NickName",      valor: cliente.nick },
                        { label: "Cliente",       valor: cliente.name || "Sin Nombre" },
                        { label: "Numero Factura", valor: pago.idString },
                        { label: "Tipo",          valor: pago.facturaType },
                        { label: "Titulo",        valor: pago.title },
                        { label: "Fecha",         valor: pago.billDate },
                        { label: "Precio USD$",   valor: `$${pago.priceUs}` },
                        { label: "Precio PayPal", valor: `€${pago.pricePaypal}` },
                        { label: "Precio EUR€",   valor: `€${pago.priceEu}` }
                    ];

                    celdas.forEach(({ label, valor }) => {
                        const td = document.createElement('td');
                        td.setAttribute('data-label', label);
                        td.textContent = valor;
                        fila.appendChild(td);
                    });

                    const tdAccion = document.createElement('td');
                    tdAccion.setAttribute('data-label', 'Acciones');

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = true;

                    checkbox.addEventListener('change', async () => {
                        try {
                            await editarPagoAPI({
                                idNumber: pago.idNumber,
                                facturaType: pago.facturaType,
                                title: pago.title,
                                billDate: pago.billDate,
                                priceUs: pago.priceUs,
                                pricePaypal: pago.pricePaypal,
                                priceEu: pago.priceEu,
                                isMade: false,
                                customer: { id: cliente.id }
                            });
                            Toast("Estado del pago actualizado correctamente.");
                            await cargarTodosLosPagosRealizados();
                        } catch (error) {
                            console.error("Error al actualizar el estado del pago:", error);
                            Toast("Error al actualizar el estado del pago.");
                        }
                    });

                    tdAccion.appendChild(checkbox);
                    fila.appendChild(tdAccion);
                    tbody.appendChild(fila);
                });

            table.appendChild(tbody);
            bodyMes.appendChild(table);
            divMes.appendChild(headerMes);
            divMes.appendChild(bodyMes);
            bodyAnyo.appendChild(divMes);
        });

        divAnyo.appendChild(headerAnyo);
        divAnyo.appendChild(bodyAnyo);
        mainContainer.appendChild(divAnyo);
    });
}