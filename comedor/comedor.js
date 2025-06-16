// Variables globales para manejar los comedores
        let comedores = [];
        let editandoId = null;

        // Función que se ejecuta cuando carga la página
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Página cargada, iniciando sistema...');
            cargarComedoresIniciales();
            cargarComedoresDesdeStorage();
            mostrarComedores();
            actualizarEstadisticas();
        });

        // Función para cargar los comedores que aparecen en el dashboard
        function cargarComedoresIniciales() {
            console.log('Cargando comedores iniciales...');
            const comedoresIniciales = [
                {
                    id: 1,
                    nombre: "Teresa Izquierdo",
                    direccion: "Jr. Supe 134 - Bellavista",
                    capacidad: 600,
                    responsable: "Juana Soto",
                    telefono: "986-432-111",
                    estado: "Activo"
                },
                {
                    id: 2,
                    nombre: "Casa Adulto Mayor - Bocanegra",
                    direccion: "Av. Venezuela 2026 - Callao",
                    capacidad: 200,
                    responsable: "Pedro Luna",
                    telefono: "999-888-777",
                    estado: "Activo"
                },
                {
                    id: 3,
                    nombre: "Santa Rosa de Lima",
                    direccion: "Mz. K Lt. 8, Pachacútec",
                    capacidad: 65,
                    responsable: "Rosa Díaz",
                    telefono: "964-114-312",
                    estado: "Inactivo"
                }
            ];

            // Solo los carga si no hay datos guardados
            if (!localStorage.getItem('comedores')) {
                localStorage.setItem('comedores', JSON.stringify(comedoresIniciales));
                console.log('Comedores iniciales guardados en localStorage');
            }
        }

        // Función para cargar comedores desde localStorage
        function cargarComedoresDesdeStorage() {
            console.log('Cargando comedores desde localStorage...');
            const datosGuardados = localStorage.getItem('comedores');
            if (datosGuardados) {
                comedores = JSON.parse(datosGuardados);
                console.log('Comedores cargados:', comedores.length);
            } else {
                comedores = [];
                console.log('No hay comedores guardados');
            }
        }

        // Función para guardar comedores en localStorage
        function guardarComedoresEnStorage() {
            localStorage.setItem('comedores', JSON.stringify(comedores));
            console.log('Comedores guardados en localStorage');
        }

        // Función para mostrar/ocultar el menú móvil
        function mostrarMenuMovil() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('open');
        }

        // Función para mostrar el modal para agregar un nuevo comedor
        function mostrarModalAgregar() {
            console.log('Abriendo modal para agregar comedor');
            editandoId = null;
            document.getElementById('tituloModal').textContent = 'Agregar Nuevo Comedor';
            document.getElementById('formularioComedor').reset();
            document.getElementById('modalComedor').classList.add('show');
        }

        // Función para mostrar el modal para editar un comedor existente
        function mostrarModalEditar(id) {
            console.log('Abriendo modal para editar comedor ID:', id);
            editandoId = id;
            const comedor = comedores.find(c => c.id === id);
            
            if (comedor) {
                document.getElementById('tituloModal').textContent = 'Editar Comedor';
                document.getElementById('nombreComedor').value = comedor.nombre;
                document.getElementById('direccionComedor').value = comedor.direccion;
                document.getElementById('capacidadComedor').value = comedor.capacidad;
                document.getElementById('responsableComedor').value = comedor.responsable;
                document.getElementById('telefonoComedor').value = comedor.telefono;
                document.getElementById('estadoComedor').value = comedor.estado;
                document.getElementById('modalComedor').classList.add('show');
            } else {
                alert('Error: No se encontró el comedor');
            }
        }

        // Función para cerrar el modal
        function cerrarModal() {
            console.log('Cerrando modal');
            document.getElementById('modalComedor').classList.remove('show');
            editandoId = null;
        }

        // Función para manejar el envío del formulario
        document.getElementById('formularioComedor').addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Procesando formulario...');
            
            const nuevoComedor = {
                id: editandoId || Date.now(), // Si está editando usa el ID existente, sino crea uno nuevo
                nombre: document.getElementById('nombreComedor').value.trim(),
                direccion: document.getElementById('direccionComedor').value.trim(),
                capacidad: parseInt(document.getElementById('capacidadComedor').value),
                responsable: document.getElementById('responsableComedor').value.trim(),
                telefono: document.getElementById('telefonoComedor').value.trim(),
                estado: document.getElementById('estadoComedor').value
            };

            // Validar que todos los campos estén llenos
            if (!nuevoComedor.nombre || !nuevoComedor.direccion || !nuevoComedor.responsable || !nuevoComedor.telefono) {
                alert('Por favor, completa todos los campos');
                return;
            }

            if (editandoId) {
                // Editar comedor existente
                const indice = comedores.findIndex(c => c.id === editandoId);
                if (indice !== -1) {
                    comedores[indice] = nuevoComedor;
                    console.log('Comedor editado:', nuevoComedor);
                }
            } else {
                // Agregar nuevo comedor
                comedores.push(nuevoComedor);
                console.log('Nuevo comedor agregado:', nuevoComedor);
            }

            guardarComedoresEnStorage();
            mostrarComedores();
            actualizarEstadisticas();
            cerrarModal();
            
            alert(editandoId ? 'Comedor actualizado correctamente' : 'Comedor agregado correctamente');
        });

        
        // Función para eliminar un comedor
        function eliminarComedor(id) {
            console.log('Eliminando comedor ID:', id);
            
            if (confirm('¿Estás seguro de que quieres eliminar este comedor?')) {
                comedores = comedores.filter(c => c.id !== id);
                guardarComedoresEnStorage();
                mostrarComedores();
                actualizarEstadisticas();
                alert('Comedor eliminado correctamente');
                console.log('Comedor eliminado, comedores restantes:', comedores.length);
            }
        }

        // Función para mostrar todos los comedores en la tabla y tarjetas
        function mostrarComedores() {
            console.log('Mostrando comedores...');
            mostrarComedoresDesktop();
            mostrarComedoresMovil();
        }

        // Función para mostrar comedores en la tabla desktop
        function mostrarComedoresDesktop() {
            const tabla = document.getElementById('tablaComedoresDesktop');
            tabla.innerHTML = '';

            comedores.forEach(comedor => {
                const fila = document.createElement('tr');
                fila.className = 'hover:bg-gray-50 transition-colors';
                
                fila.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">${comedor.nombre}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-600">${comedor.direccion}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ${comedor.capacidad} personas
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${comedor.responsable}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-600">${comedor.telefono}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            comedor.estado === 'Activo' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }">
                            ${comedor.estado}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex space-x-2">
                            <button 
                                onclick="mostrarModalEditar(${comedor.id})"
                                class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg transition-colors"
                            >
                                ✏️ Editar
                            </button>
                            <button 
                                onclick="eliminarComedor(${comedor.id})"
                                class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    </td>
                `;
                
                tabla.appendChild(fila);
            });

            console.log('Tabla desktop actualizada con', comedores.length, 'comedores');
        }

        // Función para mostrar comedores en tarjetas móviles
        function mostrarComedoresMovil() {
            const contenedor = document.getElementById('tarjetasComedoresMovil');
            contenedor.innerHTML = '';

            comedores.forEach(comedor => {
                const tarjeta = document.createElement('div');
                tarjeta.className = 'p-4 border-b border-gray-200 fade-in';
                
                tarjeta.innerHTML = `
                    <div class="flex justify-between items-start mb-3">
                        <h4 class="font-semibold text-gray-800 text-base">${comedor.nombre}</h4>
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            comedor.estado === 'Activo' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }">
                            ${comedor.estado}
                        </span>
                    </div>
                    
                    <div class="space-y-2 text-sm text-gray-600 mb-4">
                        <div class="flex items-center">
                            <span class="mr-2">📍</span>
                            <span>${comedor.direccion}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="mr-2">👥</span>
                            <span>Capacidad: ${comedor.capacidad} personas</span>
                        </div>
                        <div class="flex items-center">
                            <span class="mr-2">👤</span>
                            <span>Responsable: ${comedor.responsable}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="mr-2">📞</span>
                            <span>${comedor.telefono}</span>
                        </div>
                    </div>
                    
                    <div class="flex space-x-2">
                        <button 
                            onclick="mostrarModalEditar(${comedor.id})"
                            class="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                        >
                            <span>✏️</span>
                            <span>Editar</span>
                        </button>
                        <button 
                            onclick="eliminarComedor(${comedor.id})"
                            class="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                        >
                            <span>🗑️</span>
                            <span>Eliminar</span>
                        </button>
                    </div>
                `;
                
                contenedor.appendChild(tarjeta);
            });

            console.log('Tarjetas móviles actualizadas con', comedores.length, 'comedores');
        }

        // Función para actualizar las estadísticas en tiempo real
        function actualizarEstadisticas() {
            console.log('Actualizando estadísticas...');
            
            const totalComedores = comedores.length;
            const comedoresActivos = comedores.filter(c => c.estado === 'Activo').length;
            const comedoresInactivos = comedores.filter(c => c.estado === 'Inactivo').length;
            const capacidadTotal = comedores.reduce((total, comedor) => total + comedor.capacidad, 0);

            // Actualizar los números en las tarjetas de estadísticas
            document.getElementById('totalComedores').textContent = totalComedores;
            document.getElementById('comedoresActivos').textContent = comedoresActivos;
            document.getElementById('comedoresInactivos').textContent = comedoresInactivos;
            document.getElementById('capacidadTotal').textContent = capacidadTotal.toLocaleString();

            console.log('Estadísticas actualizadas:', {
                total: totalComedores,
                activos: comedoresActivos,
                inactivos: comedoresInactivos,
                capacidad: capacidadTotal
            });
        }

        // Función para validar el formulario
        function validarFormulario() {
            const nombre = document.getElementById('nombreComedor').value.trim();
            const direccion = document.getElementById('direccionComedor').value.trim();
            const capacidad = document.getElementById('capacidadComedor').value;
            const responsable = document.getElementById('responsableComedor').value.trim();
            const telefono = document.getElementById('telefonoComedor').value.trim();

            if (!nombre || !direccion || !capacidad || !responsable || !telefono) {
                alert('Por favor, completa todos los campos obligatorios');
                return false;
            }

            if (capacidad <= 0) {
                alert('La capacidad debe ser mayor a 0');
                return false;
            }

            if (telefono.length < 9) {
                alert('El teléfono debe tener al menos 9 dígitos');
                return false;
            }

            return true;
        }

        // Función para limpiar el formulario
        function limpiarFormulario() {
            document.getElementById('formularioComedor').reset();
            editandoId = null;
        }

        // Función para buscar comedores (opcional, para futuras mejoras)
        function buscarComedores(termino) {
            console.log('Buscando comedores con término:', termino);
            const comedoresFiltrados = comedores.filter(comedor => 
                comedor.nombre.toLowerCase().includes(termino.toLowerCase()) ||
                comedor.direccion.toLowerCase().includes(termino.toLowerCase()) ||
                comedor.responsable.toLowerCase().includes(termino.toLowerCase())
            );
            
            // Aquí podrías mostrar solo los comedores filtrados
            return comedoresFiltrados;
        }

        // Función para cambiar el estado de un comedor rápidamente
        function cambiarEstadoComedor(id) {
            console.log('Cambiando estado del comedor ID:', id);
            const comedor = comedores.find(c => c.id === id);
            
            if (comedor) {
                comedor.estado = comedor.estado === 'Activo' ? 'Inactivo' : 'Activo';
                guardarComedoresEnStorage();
                mostrarComedores();
                actualizarEstadisticas();
                alert(`Comedor ${comedor.estado === 'Activo' ? 'activado' : 'desactivado'} correctamente`);
            }
        }

        // Cerrar modal al hacer clic fuera de él
        document.getElementById('modalComedor').addEventListener('click', function(e) {
            if (e.target === this) {
                cerrarModal();
            }
        });

        // Cerrar modal con la tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.getElementById('modalComedor').classList.contains('show')) {
                cerrarModal();
            }
        });

        // Función para exportar datos (opcional, para futuras mejoras)
        function exportarComedores() {
            console.log('Exportando datos de comedores...');
            const datos = JSON.stringify(comedores, null, 2);
            const blob = new Blob([datos], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'comedores_' + new Date().toISOString().split('T')[0] + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert('Datos exportados correctamente');
        }

        // Función para importar datos (opcional, para futuras mejoras)
        function importarComedores(archivo) {
            console.log('Importando datos de comedores...');
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const datosImportados = JSON.parse(e.target.result);
                    if (Array.isArray(datosImportados)) {
                        comedores = datosImportados;
                        guardarComedoresEnStorage();
                        mostrarComedores();
                        actualizarEstadisticas();
                        alert('Datos importados correctamente');
                    } else {
                        alert('Formato de archivo inválido');
                    }
                } catch (error) {
                    console.error('Error al importar:', error);
                    alert('Error al importar el archivo');
                }
            };
            
            reader.readAsText(archivo);
        }

        // Agregar eventos adicionales cuando la página esté lista
        document.addEventListener('DOMContentLoaded', function() {
            // Actualizar estadísticas cada 30 segundos (opcional)
            setInterval(function() {
                if (comedores.length > 0) {
                    actualizarEstadisticas();
                }
            }, 30000);
            
            console.log('Sistema de comedores completamente inicializado');
            console.log('Funciones disponibles:');
            console.log('- mostrarModalAgregar()');
            console.log('- mostrarModalEditar(id)');
            console.log('- eliminarComedor(id)');
            console.log('- cambiarEstadoComedor(id)');
            console.log('- exportarComedores()');
        });

        // Log final para confirmar que todo está cargado
        console.log('✅ JavaScript de comedores cargado completamente');
        console.log('📊 Total de funciones definidas: 15+');
        console.log('💾 Sistema de localStorage configurado');
        console.log('📱 Responsive design implementado');
  