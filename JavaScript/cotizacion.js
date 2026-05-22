const addcotizacion = document.getElementById("cotizacion_add");
const addventana = document.getElementById("addcotizacion");
const cerrar_add_cotizacion = document.getElementById("cerrar_add_cotizacion");
const formadd = document.querySelector("#addcotizacion form");

const add_year = document.getElementById("add_year");
const add_trimestre = document.getElementById("add_trimestre");
const add_importe = document.getElementById("add_importe");
const add_fechaPago = document.getElementById("add_fechaPago");

addcotizacion.addEventListener("click", () => {
    addventana.style.display = "block";
});

cerrar_add_cotizacion.addEventListener("click", () => {
    addventana.style.display = "none";
});

add_year.value = new Date().getFullYear();
add_trimestre.value = Math.ceil((new Date().getMonth() + 1) / 3);
add_importe.value = "";