const main = document.getElementById("main");

main.appendChild(crearEstructuraCalendario());

function crearEstructuraCalendario() {
    const divAno = document.createElement('div');
    divAno.classList.add('año');

    const trimestres = ['1/4', '2/4', '3/4', '4/4'];
    const meses = ['1/3', '2/3', '3/3'];

    trimestres.forEach(textoTrimestre => {
        const divTrimestre = document.createElement('div');
        divTrimestre.classList.add('trimestre');

        const h3 = document.createElement('h3');
        h3.textContent = textoTrimestre;
        divTrimestre.appendChild(h3);

        const contenedorMeses = document.createElement('div');
        contenedorMeses.classList.add('contenedor-meses');

        meses.forEach(textoMes => {
            const fieldsetMes = document.createElement('fieldset');
            fieldsetMes.classList.add('mes');
            
            const legendMes = document.createElement('legend');
            legendMes.textContent = "Mes: " +  textoMes;
            fieldsetMes.appendChild(legendMes);


            const divRendimiento = document.createElement('div');
            divRendimiento.textContent = "Rendimiento calculado por gestoría: ";
            fieldsetMes.appendChild(divRendimiento);

            const divPagoHacienda = document.createElement('div');
            divPagoHacienda.textContent = "Pago realizado a Hacienda: ";
            fieldsetMes.appendChild(divPagoHacienda);

            contenedorMeses.appendChild(fieldsetMes);
        });

        divTrimestre.appendChild(contenedorMeses);
        divAno.appendChild(divTrimestre);
    });

    return divAno;
}