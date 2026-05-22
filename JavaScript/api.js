const CUSTOMER_URL = 'http://localhost:8080/customers';
const QUOTE_URL = 'http://localhost:8080/quotes';

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
    const respuesta = await fetch(`${CUSTOMER_URL}/delete?id=${identificador}`, { method: 'DELETE' });
    if (!respuesta.ok) throw new Error(`Error al eliminar: ${respuesta.status}`);
    return true;
}

export async function obtenerFacturasAPI() {
    const respuesta = await fetch(`${BASE_URL}/invoices`);
    if (!respuesta.ok) throw new Error(`Error en la petición: ${respuesta.status}`);
    return await respuesta.json();
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