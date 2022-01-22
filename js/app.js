// IIFY
(function () {
    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();

        if (window.indexedDB.open('CRM'), 1) {
            obtenerClientes();
        }

        listadoClientes.addEventListener('click', eliminarRegistro)
    });

    function eliminarRegistro(e) {
        if (e.target.classList.contains('eliminar')) {
            const idEliminar = Number(e.target.dataset.cliente);

            Swal.fire({
                title: '¿Está seguro de eliminar este usuario?',
                text: "Si lo elimina no se podrá recuperar nuevamente",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#319795',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: 'No, no estoy seguro'
            }).then((result) => {
                if (result.isConfirmed) {
                    const transaction = DB.transaction('CRM', 'readwrite');
                    const objectStore = transaction.objectStore('CRM');

                    objectStore.delete(idEliminar);

                    transaction.oncomplete = function () {
                        Swal.fire({
                            title: 'Eliminando',
                            icon: 'error',
                            backdrop: true,
                            timer: 2000,
                            timerProgressBar: true,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: false,
                            stopKeydownPropagation: false,
                            showConfirmButton: false,
                        });
                        e.target.parentElement.parentElement.remove();
                    }
                    transaction.onerror = function () {
                        imprimirAlerta('Error...', 'error')
                    }
                }
            });
        }
    }
    // Creando la base de datos
    function crearDB() {
        const crearDB = window.indexedDB.open('CRM', 1)

        crearDB.onerror = function () {
            console.log('Hubo un error');
        }

        crearDB.onsuccess = function () {
            DB = crearDB.result;
        }

        crearDB.onupgradeneeded = function (e) {
            const db = e.target.result;
            const objectStore = db.createObjectStore('CRM', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });

            console.log('Lista y Creada La DB');
        }
    }

    function obtenerClientes() {
        const abrirConexion = window.indexedDB.open('CRM', 1);
        abrirConexion.onerror = function () {
            console.log('Error');
        }
        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;

            const objectStore = DB.transaction('CRM').objectStore('CRM');
            objectStore.openCursor().onsuccess = function (e) {
                const cursor = e.target.result;
                if (cursor) {
                    const { nombre, empresa, email, telefono, id } = cursor.value;
                    listadoClientes.innerHTML += ` 
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-gray-600 hover:text-gray-900 mr-5"><i class="far fa-edit mr-1"></i>Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar"><i class="far fa-times-circle mr-1"></i>Eliminar</a>
                        </td>
                    </tr>
                    `;
                    // Obtener cliente por cliente!
                    cursor.continue();
                } else {
                    Swal.fire({
                        title: 'Bienvenidos',
                        icon: 'success',
                        backdrop: true,
                        timer: 1200,
                        timerProgressBar: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        stopKeydownPropagation: false,
                        showConfirmButton: false,
                    });
                }
            }
        }
    }
})();

