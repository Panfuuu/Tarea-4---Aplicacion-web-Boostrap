// Seguridad
if (localStorage.getItem('auth') !== 'true') window.location.href = 'login.html';

function logout() {
    localStorage.removeItem('auth');
    window.location.href = 'login.html';
}

async function cargarJuegos() {
    const res = await fetch('/api/juegos');
    const juegos = await res.json();
    const lista = document.getElementById('lista');
    lista.innerHTML = '';

    // Contadores para las cards
    let total = juegos.length;
    let completados = 0;
    let pendientes = 0;

    juegos.forEach(j => {
        if(j.estado === 'Completado') completados++;
        if(j.estado === 'Pendiente') pendientes++;

        // Definir color de badge segun elstado
        let badgeClass = 'bg-warning text-dark';
        if(j.estado === 'Completado') badgeClass = 'bg-success';
        if(j.estado === 'Jugando') badgeClass = 'bg-info text-dark';

        lista.innerHTML += `
            <tr>
                <td>
                    <div class="fw-bold">${j.titulo}</div>
                    <small class="text-muted">${j.genero || 'Sin género'}</small>
                </td>
                <td><span class="text-secondary"><i class="fas fa-desktop me-1"></i> ${j.plataforma}</span></td>
                <td><span class="badge badge-status ${badgeClass}">${j.estado}</span></td>
                <td class="text-center">
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="prepararEdicion(${j.id},'${j.titulo}','${j.plataforma}','${j.genero}','${j.estado}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="borrar(${j.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>`;
    });

    // Actualizar numeros en la interfaz
    document.getElementById('count-total').innerText = total;
    document.getElementById('count-done').innerText = completados;
    document.getElementById('count-pending').innerText = pendientes;
}


// solo asegurate de añadir esta función para resetear el boton de cancelar:

function limpiarFormulario() {
    document.getElementById('juego-form').reset();
    document.getElementById('juego-id').value = '';
    document.getElementById('form-title').innerHTML = '<i class="fas fa-plus-circle me-2"></i>Añadir Juego';
    document.getElementById('cancel-edit').classList.add('d-none');
}

// Modifica el event listener del submit para que llame a limpiarFormulario() al terminar
document.getElementById('juego-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('juego-id').value;
    const datos = {
        titulo: document.getElementById('titulo').value,
        plataforma: document.getElementById('plataforma').value,
        genero: document.getElementById('genero').value,
        estado: document.getElementById('estado').value
    };

    await fetch(id ? `/api/juegos/${id}` : '/api/juegos', {
        method: id ? 'PUT' : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos)
    });

    limpiarFormulario();
    cargarJuegos();
});

function prepararEdicion(id, titulo, plataforma, genero, estado) {
    document.getElementById('juego-id').value = id;
    document.getElementById('titulo').value = titulo;
    document.getElementById('plataforma').value = plataforma;
    document.getElementById('genero').value = genero;
    document.getElementById('estado').value = estado;
    
    document.getElementById('form-title').innerHTML = '<i class="fas fa-edit me-2"></i>Editando Juego';
    document.getElementById('cancel-edit').classList.remove('d-none');
}

async function borrar(id) {
    if(confirm('¿Estás seguro de eliminar este juego?')) {
        await fetch(`/api/juegos/${id}`, { method: 'DELETE' });
        cargarJuegos();
    }
}

// Carga inicial
cargarJuegos();