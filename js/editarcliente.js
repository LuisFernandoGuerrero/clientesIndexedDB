(function () {
    let idCliente;
    const nombreInput = document.querySelector('#nombre')
    const emailInput = document.querySelector('#email')
    const telefonoInput = document.querySelector('#telefono')
    const empresaInput = document.querySelector('#empresa')
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        //Actualizar Registro
        formulario.addEventListener('submit', actualizarCliente);

        //Verificar id de la url
        const parametrosURL = new URLSearchParams(window.location.search);

        idCliente = parametrosURL.get('id');

        if (idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 500)
        }
    });

    function actualizarCliente(e) {
        e.preventDefault();
        if (nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
            Swal.fire({
                title: 'Por favor, no deje ningún campo vacio',
                icon: 'error',
                timer: 1500,
                position: 'top-end',
                showConfirmButton: false,
                footer: 'Verifica la información',
                toast: true
            });
            return;
        }

        // Actualizar cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['CRM'], 'readwrite');
        const objectStore = transaction.objectStore('CRM');
        objectStore.put(clienteActualizado);

        transaction.oncomplete = function () {
            Swal.fire({
                title: 'Se realizarón los cambios correctamente',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
                footer: 'Se está redireccionando a la lista de clientes.',
            });

            setTimeout(() => {
                window.location.href = 'index.html'
            }, 3000);
        }

        transaction.onerror = function () {
            imprimirAlerta('¡Tiene un error!', 'error')
        }
    }

    function obtenerCliente(id) {
        const transaction = DB.transaction(['CRM'], 'readwrite');
        const objectStore = transaction.objectStore('CRM');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function (e) {
            const cursor = e.target.result;
            if (cursor) {
                if (cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    function llenarFormulario(datosCliente) {
        const { nombre, email, telefono, empresa } = datosCliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('CRM', 1);

        abrirConexion.onerror = function () {
            console.log('Hubo un error');
        }

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        }
    }

    function imprimirAlerta(mensaje, tipo) {
        // Crear la alerta
        const alerta = document.querySelector('.alerta');

        if (!alerta) {
            const divMensaje = document.createElement('DIV');
            divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta')

            if (tipo === 'error') {
                divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            } else {
                divMensaje.classList.add('bg-green-100', 'border-green-300', 'text-green-700');
            }

            divMensaje.textContent = mensaje;

            formulario.appendChild(divMensaje);

            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        }
    }
})();