export const headers = ["id | Numero", "Tipo", "Titulo", "Fecha", "Precio USD$", "Precio PayPal", "Precio EUR€", "Transferencia Realizada", ""];

export function tablaHorizontal() {
    const table = document.createElement("table");
    table.classList.add("tablica");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    headers.forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    return table;
}

export function Toast(texto) {
    Toastify({
        text: texto,
        duration: 1500,
        gravity: "bottom",
        position: "right",
        className: "toast_nube",
    }).showToast();    
}