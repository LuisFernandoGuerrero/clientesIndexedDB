// IIFE 
(function () {
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        formulario.addEventListener('submit', validarCliente)
    });



    function validarCliente(e) {
        e.preventDefault();

        // Leer los datos de los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;
        
        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            Swal.fire({
                title: 'Todos los campos son obligatorios',
                icon: 'error',
                timer: 1500,
                position: 'top-end',
                showConfirmButton: false,
                footer: 'Intenta nuevamente',
                toast: true
            });
            return;
        } 

        // Crear un objeto con nuevo cliente
        const cliente = {
            nombre,
            email,
            telefono,
            empresa
        }

        cliente.id = Date.now();
        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['CRM'], 'readwrite');
        const objectStore = transaction.objectStore('CRM');

        objectStore.add(cliente);

        transaction.onerror = function () {
            imprimirAlerta('Error al guardar el cliente', 'error')
        }

        transaction.oncomplete = function () {
            Swal.fire({
                title: 'El cliente se agrego correctamente',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
                footer: 'Se está redireccionando a la lista de clientes.',
            });
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
    }
})();