
// Mostrar y/o ocultar tabla de pagos de un cliente
const boton = document.querySelector(".cli_button");
const table = document.getElementById("template_table");
table.remove();
document.addEventListener("click", (e) => {
    const boton = e.target.closest(".cli_button");
    if (boton) {
        const padre = boton.closest(".cliente");
        if (boton.value === "True") {
            padre.appendChild(table)
            boton.value = "False";
        } else {
            table.remove();
            boton.value = "True";
        }
    }
});


// Formulario para añadir usuarios
const adduser = document.getElementById("cli_add");
const addventana = document.getElementById("adduser");
const formadd = document.querySelector("#adduser form");

adduser.value = "False";

adduser.addEventListener("click", () => {
    if (adduser.value == "False") {
        addventana.style.display = "block";
        adduser.value = "True";
        delventana.style.display = "none";
        userdel.value = "False";
    } else {
        addventana.style.display = "none";
        adduser.value = "False";
    }
});

formadd.addEventListener("submit", (e) => {
    if (!formadd.checkValidity()) return;
    formadd.reset();
    addventana.style.display = "none";
    adduser.value = "False";
});

// Formulario para Borrar Cliente

const userdel = document.getElementById("cli_del");
const delventana = document.getElementById("deluser");
const formdel = document.querySelector("#deluser form");
userdel.value = "False";

userdel.addEventListener("click", () => {
    if (userdel.value == "False") {
        formadd.reset();
        addventana.style.display = "none";
        adduser.value = "False";
        delventana.style.display = "block";
        userdel.value = "True";
    } else {
        delventana.style.display = "none";
        userdel.value = "False";
    }
});

formdel.addEventListener("submit", (e) => {
    if (!formdel.checkValidity()) return;
    formdel.reset();
    addventana.style.display = "none";
    adduser.value = "False";
});
// Consulta automatica Pagos Pendientes
// select * from Cliente where realizado = false;
const MostrarPendientes = document.getElementById("cli_pendientes");
MostrarPendientes.addEventListener("click", (e)=> {
     Toast("Mostrando pagos pendientes");
}) 


// Consulta automatica Pagos Realizados
// select * from cliente where realizado = true;
const MostrarRealizados = document.getElementById("cli_realizados");
MostrarRealizados.addEventListener("click", (e)=> {
    Toast("Mostrando pagos realizados");
});

// Toast
function Toast(texto) {
  Toastify({
    text: texto,
    duration: 1500,
    gravity: "bottom",
    position: "right",
    className: "toast_nube",
  }).showToast();    
}