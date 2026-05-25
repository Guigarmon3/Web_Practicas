const API_BASE_URL = 'http://localhost:8080/management';
const CURRENT_YEAR = 2026;

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosGestoria(CURRENT_YEAR);
});

function cargarDatosGestoria(año) {
    fetch(`${API_BASE_URL}/all`, {
        method: 'GET',
        mode: 'cors'
    })
    .then(response => response.json())
    .then(data => {
        const registrosAño = data.filter(item => item.facYear === año);
        generarInterfazHTML(registrosAño);
    })
    .catch(error => console.error("Error al cargar datos:", error));
}

function generarInterfazHTML(registros) {
    const mainContainer = document.getElementById('main');
    mainContainer.innerHTML = '';

    const anyoDiv = document.createElement('div');
    anyoDiv.className = 'anyo';

    const tituloAño = document.createElement('h2');
    tituloAño.textContent = `Año: ${CURRENT_YEAR}`;
    anyoDiv.appendChild(tituloAño);

    for (let q = 1; q <= 4; q++) {
        const registroTrimestre = registros.find(item => item.quarterly === q) || {
            performance: 0.00,
            taxPayment: 0.00
        };

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
        pRendimiento.id = `rendimiento-${q}`;
        pRendimiento.textContent = `Rendimiento: ${registroTrimestre.performance.toFixed(2)} €`;
        mesDiv.appendChild(pRendimiento);

        const pPago = document.createElement('p');
        pPago.className = 'mes_contenido';
        pPago.id = `pago-${q}`;
        pPago.textContent = `Pago: ${registroTrimestre.taxPayment.toFixed(2)} €`;
        mesDiv.appendChild(pPago);

        trimestreDiv.appendChild(mesDiv);
        anyoDiv.appendChild(trimestreDiv);
    }

    mainContainer.appendChild(anyoDiv);
}