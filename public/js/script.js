document.addEventListener('DOMContentLoaded', () => {
    obtenerTareas();

    document.getElementById('form-todo').addEventListener('submit', (e) => {
        e.preventDefault();
        registrarTarea();
    });
});

const registrarTarea = () => {
    const text = document.getElementById('texto').value;
    fetch('/add', {
        method: 'POST', // Método HTTP POST
        headers: {
            'Content-Type': 'application/json', // Tipo de contenido JSON
        },
        body: JSON.stringify({ text: text }), // Enviamos los datos en formato JSON
    })
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(data => {
            // Mostramos el mensaje de respuesta
            obtenerTareas();
            responseMessage.textContent = data.response;
        })
        .catch(err => {
            // En caso de error, mostramos un mensaje
            responseMessage.textContent = 'An error occurred: ' + err.message;
        });
};

const obtenerTareas = () => {
    fetch('/getall').
        then(res => res.json()).
        then(data => llenarTabla(data))
        .catch(err => console.log(err));
};

const marcarTarea = (id, status) => {
    status = status === 'true' ? false : true;

    fetch(`/complete/${id}/${status}`, {
        method: 'GET', // Utilizamos el método GET para coincidir con tu endpoint
        headers: {
            'Content-Type': 'application/json', // Configuración del tipo de contenido
        },
    })
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(data => {
            // Mostramos el mensaje de respuesta


            obtenerTareas();
        })
        .catch(err => {
            console.log(err);
        });
}

const eliminarTarea = (id) => {
    fetch(`/delete/${id}`, {
        method: 'GET', // Utilizamos el método GET para coincidir con tu endpoint
        headers: {
            'Content-Type': 'application/json', // Configuración del tipo de contenido
        },
    })
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(data => {
            // Mostramos el mensaje de respuesta
            obtenerTareas();
        })
        .catch(err => {
            console.log(err);
        });
};

const llenarTabla = (data) => {
    const tabla = document.getElementById('tabla-body');
    tabla.innerHTML = ''; // Limpiar la tabla
    data.forEach(todo => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${todo.text}</td>
            <td>${todo.completed ? 'Completada' : 'Pendiente'}</td>
            <td>
                <button class="btn btn-primary" onclick="marcarTarea('${todo._id}','${todo.completed}')">
                    ${todo.completed ? 'Marcar pendiente' : 'Marcar completada'}
                </button>
            </td>
            <td>
                <button class="btn btn-danger" onclick="eliminarTarea('${todo._id}')" >
                    Eliminar
                </button>
            </td>
        `;
        tabla.appendChild(tr);
    });
};