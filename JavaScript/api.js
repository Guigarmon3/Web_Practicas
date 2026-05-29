const CUSTOMER_URL = 'http://localhost:8080/customers';
const BILL_URL = 'http://localhost:8080/bill';
const QUOTE_URL = 'http://localhost:8080/quotes';
const MANAGEMENT_URL = 'http://localhost:8080/management';

export async function obtenerTodosLosClientes() {
    const respuesta = await fetch(`${CUSTOMER_URL}/all`);
    if (!respuesta.ok) throw new Error(`Error en la petición: ${respuesta.status}`);
    return await respuesta.json();
}

export async function buscarClienteAPI(termino) {
    const respuesta = await fetch(`${CUSTOMER_URL}/search/${termino}`);
    if (!respuesta.ok) throw new Error("Error en la búsqueda");
    return await respuesta.json();
}

export async function crearClienteAPI(clienteData) {
    const res = await fetch(`${CUSTOMER_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteData)
    });
    if (!res.ok) throw new Error(`Error en la respuesta del servidor: ${res.status}`);
    return await res.json();
}

export async function editarClienteAPI(clienteData) {
    const res = await fetch(`${CUSTOMER_URL}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteData)
    });
    if (!res.ok) throw new Error(`Error en la respuesta del servidor: ${res.status}`);
    return await res.json();
}

export async function borrarClienteAPI(identificador) {
    const respuesta = await fetch(`${CUSTOMER_URL}/delete/${identificador}`, { method: 'DELETE' });
    if (!respuesta.ok) throw new Error(`Error al eliminar: ${respuesta.status}`);
    return true;
}

export async function obtenerPagosAPI() {
    const respuesta = await fetch(`${BILL_URL}/all`);
    if (!respuesta.ok) throw new Error(`Error en la petición: ${respuesta.status}`);
    return await respuesta.json();
}

export async function obtenerPagoTrimestreAPI(year, quarter) {
    const respuesta = await fetch(`${BILL_URL}/quarterly`);
    if (!respuesta.ok) throw new Error(`Error en la petición: ${respuesta.status}`);
    return await respuesta.json();
}

export async function obtenerPagosCliente(idCustomer) {
    const respuesta = await fetch(`${BILL_URL}/customer/${idCustomer}`);
    if (!respuesta.ok) throw new Error(`Error en la petición: ${respuesta.status}`);
    return await respuesta.json();
}

export async function crearPagoAPI(pagoData) {
    const res = await fetch(`${BILL_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pagoData)
    });
    if (!res.ok) throw new Error(`Error en la respuesta del servidor: ${res.status}`);
    return await res.json();
}

export async function editarPagoAPI(pagoData) {
    const res = await fetch(`${BILL_URL}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pagoData)
    });
    if (!res.ok) throw new Error(`Error en la respuesta del servidor: ${res.status}`);
    return await res.json();
}

export async function borrarPagoAPI(id) {
    const respuesta = await fetch(`${BILL_URL}/delete/${id}`, { method: 'DELETE' });
    if (!respuesta.ok) throw new Error(`Error al eliminar: ${respuesta.status}`);
    return true;
}

export async function obtenerCotizacionesAPI() {
    const respuesta = await fetch(`${QUOTE_URL}/all`);
    if (!respuesta.ok) throw new Error(`Error en la petición: ${respuesta.status}`);
    return await respuesta.json();
}

export async function crearCotizacionAPI(cotizacionData) {
    const res = await fetch(`${QUOTE_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cotizacionData)
    });
    if (!res.ok) throw new Error(`Error en la respuesta del servidor: ${res.status}`);
    return await res.json();
}

export async function obtenerCotizacionAñoAPI(year) {
    const respuesta = await fetch(`${QUOTE_URL}/search/${year}`);
    if (!respuesta.ok) throw new Error(`Error en la petición: ${respuesta.status}`);
    return await respuesta.json();
}

export async function editarCotizacionAPI(cotizacionData) {
    const res = await fetch(`${QUOTE_URL}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cotizacionData)
    });
    if (!res.ok) throw new Error(`Error en la respuesta del servidor: ${res.status}`);
    return await res.json();
}

export async function borrarCotizacionAPI(year, quarterly) {
    const respuesta = await fetch(`${QUOTE_URL}/delete/${year}/${quarterly}`, { 
        method: 'DELETE' 
    });
    if (!respuesta.ok) throw new Error(`Error al eliminar: ${respuesta.status}`);
    return true;
}

export async function obtenerCotizacionesAgrupadasPorAnyo(year) {
    const respuesta = await fetch(`${QUOTE_URL}/yearly/${year}`, { method: 'GET' });
    if (!respuesta.ok) throw new Error(`Error en la petición: ${respuesta.status}`);
    return await respuesta.json();
}

export async function obtenerManagementAPI() {
    const respuesta = await fetch(`${MANAGEMENT_URL}/all`);
    if (!respuesta.ok) throw new Error(`Error en la petición: ${respuesta.status}`);
    return await respuesta.json();
}

export async function obtenerManagementAñoAPI(year, quarterly) {
    const respuesta = await fetch(`${MANAGEMENT_URL}/${year}/${quarterly}`);
    if (!respuesta.ok) throw new Error(`Error en la petición: ${respuesta.status}`);
    return await respuesta.json();
}

export async function crearManagementAPI(gestionData) {
    const res = await fetch(`${MANAGEMENT_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gestionData)
    });
    if (!res.ok) throw new Error(`Error en la respuesta del servidor: ${res.status}`);
    return await res.json();
}

export async function editarManagementAPI(gestionData) {
    const res = await fetch(`${MANAGEMENT_URL}/edit/${gestionData.facYear}/${gestionData.quarterly}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gestionData)
    });
    if (!res.ok) throw new Error(`Error en la respuesta del servidor: ${res.status}`);
    return await res.json();
}

export async function borrarManagementAPI(year, quarterly) {
    const respuesta = await fetch(`${MANAGEMENT_URL}/delete/${year}/${quarterly}`, { 
        method: 'DELETE' 
    });
    if (!respuesta.ok) throw new Error(`Error al eliminar: ${respuesta.status}`);
    return true;
}