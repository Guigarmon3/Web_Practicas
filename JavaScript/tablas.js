export const headers = ["Tipo", "Titulo", "Fecha", "USD$", "PayPal", "EUR€", "Transferencia", "Acciones"];

const MOBILE_BREAKPOINT = 768;

function isMobile() {
    return window.innerWidth < MOBILE_BREAKPOINT;
}

function construirVertical(filas) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("tablica-movil");

    filas.forEach(fila => {
        const card = document.createElement("div");
        card.classList.add("tablica-card");

        Array.from(fila.querySelectorAll("td")).forEach((td, index) => {
            const row = document.createElement("div");
            row.classList.add("tablica-card__row");

            const label = document.createElement("b");
            label.textContent = headers[index] + ": ";

            const val = document.createElement("div");
            val.classList.add("tablica-card__value");
            val.style.display = "inline";
            val.appendChild(td.cloneNode(true));

            row.appendChild(label);
            row.appendChild(val);
            card.appendChild(row);
        });

        wrapper.appendChild(card);
    });

    return wrapper;
}

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

    const contenedor = document.createElement("div");
    contenedor.classList.add("tablica-wrapper");
    contenedor.appendChild(table);

    contenedor.querySelector = (sel) => table.querySelector(sel);
    contenedor.querySelectorAll = (sel) => table.querySelectorAll(sel);

    function render() {
        const filas = Array.from(tbody.rows);
        if (isMobile()) {
            table.style.display = "none";
            let viejo = contenedor.getElementsByClassName("tablica-movil-container")[0];
            if (viejo) viejo.remove();
            const vertical = construirVertical(filas);
            const divMovil = document.createElement("div");
            divMovil.classList.add("tablica-movil-container");
            divMovil.appendChild(vertical);
            contenedor.appendChild(divMovil);
        } else {
            table.style.display = "";
            let viejo = contenedor.getElementsByClassName("tablica-movil-container")[0];
            if (viejo) viejo.remove();
        }
    }

    const observer = new MutationObserver(render);
    observer.observe(tbody, { childList: true });

    window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
          .addEventListener("change", render);

    return contenedor;
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