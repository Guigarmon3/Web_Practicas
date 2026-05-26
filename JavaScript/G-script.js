const API_MANAGEMENT = 'http://localhost:8080/management';
const API_BILL = 'http://localhost:8080/bill';

document.addEventListener('DOMContentLoaded', () => {
    inicializarEventos();
    cargarTodo();
});

function inicializarEventos() {
    document.getElementById('cerrarModalPago').addEventListener('click', () => {
        document.getElementById('modalPago').style.display = 'none';
    });

    document.getElementById('formPago').addEventListener('submit', (e) => {
        e.preventDefault();
        const anyo = parseInt(document.getElementById('pagoAnyo').value);
        const q = parseInt(document.getElementById('pagoTrimestre').value);
        const nuevoPago = parseFloat(document.getElementById('inputNuevoPago').value);
        guardarPagoHacienda(anyo, q, nuevoPago);
    });
}

function cargarTodo() {
    Promise.all([
        fetch(`${API_MANAGEMENT}/all`).then(res => res.json()),
        fetch(API_BILL).then(res => res.json())
    ])
    .then(([dataManagement, dataBills]) => {
        const mgmtArray = Array.isArray(dataManagement) ? dataManagement : [];
        const billsArray = Array.isArray(dataBills) ? dataBills : [];
        procesarYRenderizar(mgmtArray, billsArray);
    })
    .catch(error => console.error(error));
}

function obtenerTrimestre(mes) {
    if (mes >= 1 && mes <= 3) return 1;
    if (mes >= 4 && mes <= 6) return 2;
    if (mes >= 7 && mes <= 9) return 3;
    return 4;
}
const mainContainer = document.getElementById('main');
mainContainer.innerHTML = '';

function procesarYRenderizar(management, bills) {


    const anyosConFacturas = bills
        .map(bill => bill.billDate ? new Date(bill.billDate).getFullYear() : null)
        .filter(Boolean);

    const anyosConManagement = management.map(item => item.facYear);

    const todasLasFechas = anyosConFacturas.concat(anyosConManagement);
    const anyosUnicos = Array.from(new Set(todasLasFechas));
    
    anyosUnicos.forEach(anyo => {
        const anyoDiv = document.createElement('div');
        anyoDiv.className = 'anyo';

        const cabeceraAnyo = document.createElement('div');
        cabeceraAnyo.style.display = 'flex';
        cabeceraAnyo.style.justifyContent = 'space-between';
        cabeceraAnyo.style.alignItems = 'center';
        cabeceraAnyo.style.width = '100%';

        const tituloAño = document.createElement('h2');
        tituloAño.textContent = `Año: ${anyo}`;
        tituloAño.style.border = 'none';
        tituloAño.style.margin = '0';
        
        cabeceraAnyo.appendChild(tituloAño);
        anyoDiv.appendChild(cabeceraAnyo);

        const contenedorHorizontal = document.createElement('div');
        contenedorHorizontal.className = 'contenedor-horizontal-trimestres';

        for (let q = 1; q <= 4; q++) {
            const rendimientoCalculado = bills.reduce((suma, bill) => {
                if (!bill.billDate) return suma;
                const fecha = new Date(bill.billDate);
                if (fecha.getFullYear() === anyo && obtenerTrimestre(fecha.getMonth() + 1) === q) {
                    return suma + (bill.priceEu || 0);
                }
                return suma;
            }, 0);

            const regMg = management.find(item => item.facYear === anyo && item.quarterly === q);
            const pagoHacienda = regMg ? regMg.taxPayment : 0.00;

            const trimestreDiv = document.createElement('div');
            trimestreDiv.className = 'trimestre';

            const tituloTrimestre = document.createElement('h3');
            tituloTrimestre.textContent = `Trimestre: ${q}/4`;
            trimestreDiv.appendChild(tituloTrimestre);

            const mesDiv = document.createElement('div');
            mesDiv.className = 'mes';

            const tituloMes = document.createElement('h4');
            tituloMes.textContent = `Datos Trimestrales`;
            mesDiv.appendChild(tituloMes);

            const pRendimiento = document.createElement('p');
            pRendimiento.className = 'mes_contenido';
            pRendimiento.textContent = `Rendimiento: ${rendimientoCalculado.toFixed(2)}€`;
            mesDiv.appendChild(pRendimiento);

            const pPago = document.createElement('p');
            pPago.className = 'mes_contenido';
            pPago.textContent = `Pago: ${pagoHacienda.toFixed(2)}€`;
            mesDiv.appendChild(pPago);

            const btnEditarPago = document.createElement('button');
            btnEditarPago.className = 'cli_button';
            btnEditarPago.textContent = 'Modificar Pago';
            btnEditarPago.addEventListener('click', () => abrirModalPago(anyo, q, pagoHacienda));
            mesDiv.appendChild(btnEditarPago);

            trimestreDiv.appendChild(mesDiv);
            contenedorHorizontal.appendChild(trimestreDiv);
        }

        anyoDiv.appendChild(contenedorHorizontal);
        mainContainer.appendChild(anyoDiv);
    });
}

function abrirModalPago(anyo, trimestre, pagoActual) {
    document.getElementById('pagoAnyo').value = anyo;
    document.getElementById('pagoTrimestre').value = trimestre;
    document.getElementById('inputNuevoPago').value = pagoActual;
    document.getElementById('modalPago').style.display = 'block';
}

function guardarPagoHacienda(anyo, q, nuevoPago) {
    fetch(`${API_MANAGEMENT}/all`)
    .then(res => res.json())
    .then(management => {
        const regMg = management.find(item => item.facYear === anyo && item.quarterly === q);
        const existe = !!regMg;
        
        const bodyData = {
            facYear: anyo,
            quarterly: q,
            performance: regMg ? regMg.performance : 0.00,
            taxPayment: nuevoPago
        };

        const url = existe ? `${API_MANAGEMENT}/edit/${anyo}/${q}` : `${API_MANAGEMENT}/create`;
        const metodo = existe ? 'PUT' : 'POST';

        return fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        });
    })
    .then(() => {
        document.getElementById('modalPago').style.display = 'none';
        cargarTodo();
    })
    .catch(error => console.error(error));
}