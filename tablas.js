export const headers = ["Tipo", "Descripción", "id | Numero", "Fecha", "Precio USD$", "Precio PayPal", "Precio EUR€", "Transferencia Realizada"];
export const data = ["TIpo de factura", "Descripción de factura", "ID de factura", "Fecha de factura", "precio en $", "Precio paypal$", "precio en €", "true o false"];

export function tablavertical() {
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    headers.forEach((text, i) => {
        const tr = document.createElement("tr");

        const th = document.createElement("th");
        th.textContent = text;
        const td = document.createElement("td");
        if (th.textContent === "Transferencia Realizada") {
                const caja = document.createElement("input");
                caja.type="checkbox";
                caja.classList.add="checkmate"
                td.style.backgroundColor="red"
                td.addEventListener("click", (e)=>{
                    if (caja.checked) {
                        td.style.backgroundColor="green";
                    } else {
                        td.style.backgroundColor="red"
                    }
                });
                td.append(caja)
        } else {
            td.textContent = data[i];
        }

        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    table.classList.add("tablica");
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