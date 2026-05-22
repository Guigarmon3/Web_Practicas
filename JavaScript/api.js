const BASE_URL = 'http://localhost:8080/customers';

export async function obtenerTodosLosClientes() {
    const respuesta = await fetch(`${BASE_URL}/all`);
    if (!respuesta.ok) throw new Error(`Error en la petición: ${respuesta.status}`);
    return await respuesta.json();
}

export async function buscarClienteAPI(termino) {
    const respuesta = await fetch(`${BASE_URL}/search/${termino}`);
    if (!respuesta.ok) throw new Error("Error en la búsqueda");
    return await respuesta.json();
}

export async function crearClienteAPI(clienteData) {
    const res = await fetch(`${BASE_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteData)
    });
    if (!res.ok) throw new Error(`Error en la respuesta del servidor: ${res.status}`);
    return await res.json();
}

export async function editarClienteAPI(clienteData) {
    const res = await fetch(`${BASE_URL}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteData)
    });
    if (!res.ok) throw new Error(`Error en la respuesta del servidor: ${res.status}`);
    return await res.json();
}

export async function borrarClienteAPI(identificador) {
    const respuesta = await fetch(`${BASE_URL}/delete?id=${identificador}`, { method: 'DELETE' });
    if (!respuesta.ok) throw new Error(`Error al eliminar: ${respuesta.status}`);
    return true;
}