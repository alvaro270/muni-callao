// ===== PATRÓN STORE - MANEJO DE ESTADO GLOBAL =====
const EntregasStore = {
    state: {
        beneficiarios: [],
        entregasHoy: [],
        beneficiarioActual: null,
        filtros: {
            dni: '',
            comedor: '',
            tipo: '',
        },
        loading: false,
        error: null,
    },
    listeners: [],
    subscribe(listener) {
        this.listeners.push(listener);
    },
    notify() {
        this.listeners.forEach(listener => listener(this.state));
    },
    setState(partialState) {
        this.state = { ...this.state, ...partialState };
        this.notify();
    }
};

// ===== CLASES Y MODELADO DE OBJETOS (POO) =====
// No se necesitan cambios aquí, las clases son conceptuales.
class Beneficiario {
    constructor(dni, nombre, comedor, activo = true) {
        if (!Beneficiario.validarDNI(dni)) {
            throw new Error("El DNI proporcionado no es válido.");
        }
        this.dni = dni;
        this.nombre = nombre;
        this.comedor = comedor; // Ahora 'comedor' es un objeto {id, nombre}
        this.activo = activo;
    }
    static validarDNI(dni) {
        return /^\d{8}$/.test(dni);
    }
}

class Entrega {
    constructor(dni, beneficiarioNombre, comedor, tipo, usuario = 'admin_responsable') {
        this.id = crypto.randomUUID();
        this.dni = dni;
        this.beneficiarioNombre = beneficiarioNombre;
        this.comedor = comedor; // Aquí también 'comedor' es el objeto {id, nombre}
        this.tipo = tipo;
        this.fechaISO = new Date().toISOString();
        this.registradoPor = usuario;
        this.estado = 'entregado';
    }
}

// ===== SIMULACIÓN DE BASE DE DATOS (LocalStorage) =====
class EntregasDatabase {
    constructor() {
        // CAMBIO CLAVE: Nos aseguramos de usar exactamente las mismas claves de LocalStorage
        // que los otros módulos para que los datos estén sincronizados.
        this.BENEFICIARIOS_KEY = 'beneficiarios';
        this.ENTREGAS_KEY = 'comedorDigital_entregas'; // Mantenemos esta clave para las entregas
    }

    // Ya no necesitamos inicializar datos aquí, porque los otros módulos (beneficiario, comedor)
    // se encargan de crear sus propios datos. Esta vista solo los consume.

    buscarBeneficiarioPorDNI(dni) {
        return new Promise((resolve, reject) => {
            setTimeout(() => { 
                try {
                    const beneficiariosJSON = localStorage.getItem(this.BENEFICIARIOS_KEY);
                    if (!beneficiariosJSON) return resolve(null);
                    const beneficiarios = JSON.parse(beneficiariosJSON);
                    const beneficiario = beneficiarios.find(b => b.dni === dni);
                    resolve(beneficiario || null);
                } catch (error) {
                    console.error("Error al buscar beneficiario:", error);
                    reject("No se pudo acceder a los datos de beneficiarios.");
                }
            }, 500);
        });
    }

    obtenerEntregasDeHoy() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const entregasJSON = localStorage.getItem(this.ENTREGAS_KEY);
                    if (!entregasJSON) return resolve([]);
                    const todasLasEntregas = JSON.parse(entregasJSON);
                    const hoy = new Date().toDateString();
                    const entregasHoy = todasLasEntregas.filter(e => new Date(e.fechaISO).toDateString() === hoy);
                    resolve(entregasHoy);
                } catch (error) {
                    console.error("Error al obtener entregas:", error);
                    reject("No se pudo acceder al historial de entregas.");
                }
            }, 300);
        });
    }

    registrarNuevaEntrega(entrega) {
        return new Promise(async (resolve, reject) => {
            try {
                const todasLasEntregasJSON = localStorage.getItem(this.ENTREGAS_KEY) || '[]';
                const todasLasEntregas = JSON.parse(todasLasEntregasJSON);
                todasLasEntregas.push(entrega);
                localStorage.setItem(this.ENTREGAS_KEY, JSON.stringify(todasLasEntregas));
                resolve(entrega);
            } catch (error) {
                console.error("Error al registrar entrega:", error);
                reject("No se pudo guardar la entrega.");
            }
        });
    }
}

// ===== LÓGICA DE LA APLICACIÓN (Controlador) =====
const db = new EntregasDatabase();

async function handleBuscarBeneficiario() {
    const dniInput = document.getElementById('searchDNI');
    const dni = dniInput.value.trim();

    if (!Beneficiario.validarDNI(dni)) {
        mostrarModal("DNI Inválido", "Por favor, ingrese un DNI válido de 8 dígitos.", true);
        return;
    }

    EntregasStore.setState({ loading: true, beneficiarioActual: null, error: null });

    try {
        const beneficiario = await db.buscarBeneficiarioPorDNI(dni);
        if (beneficiario) {
            EntregasStore.setState({ beneficiarioActual: beneficiario, loading: false });
        } else {
            EntregasStore.setState({ error: "Beneficiario no encontrado.", loading: false });
            mostrarModal("No Encontrado", `No se encontró ningún beneficiario con el DNI ${dni}.`, true);
        }
    } catch (error) {
        EntregasStore.setState({ error, loading: false });
        mostrarModal("Error de Búsqueda", error, true);
    }
}

async function handleRegistrarEntrega(tipo) {
    const { beneficiarioActual, entregasHoy } = EntregasStore.state;
    if (!beneficiarioActual) return;

    const yaRecibio = entregasHoy.find(e => e.dni === beneficiarioActual.dni && e.tipo === tipo);
    if (yaRecibio) {
        mostrarModal("Entrega Duplicada", `El beneficiario ya recibió el ${tipo} el día de hoy.`, true);
        return;
    }

    EntregasStore.setState({ loading: true });
    
    // Al crear la nueva entrega, pasamos el objeto 'comedor' completo.
    const nuevaEntrega = new Entrega(
        beneficiarioActual.dni,
        beneficiarioActual.nombre,
        beneficiarioActual.comedor, 
        tipo
    );

    try {
        await db.registrarNuevaEntrega(nuevaEntrega);
        const nuevoHistorial = await db.obtenerEntregasDeHoy();
        EntregasStore.setState({ entregasHoy: nuevoHistorial, loading: false });
        mostrarModal("Registro Exitoso", `Se ha registrado el ${tipo} para ${beneficiarioActual.nombre}.`);
        
        setTimeout(handleLimpiarBusqueda, 1500);

    } catch (error) {
        EntregasStore.setState({ loading: false, error });
        mostrarModal("Error al Registrar", error, true);
    }
}

function handleLimpiarBusqueda() {
    document.getElementById('searchDNI').value = '';
    EntregasStore.setState({ beneficiarioActual: null, error: null });
}

function handleLimpiarFiltros() {
    handleLimpiarBusqueda();
    document.getElementById('filterComedor').value = '';
    document.getElementById('filterTipo').value = '';
    document.getElementById('filterComedor').dispatchEvent(new Event('change'));
}

async function inicializarApp() {
    EntregasStore.setState({ loading: true });
    try {
        const entregasHoy = await db.obtenerEntregasDeHoy();
        EntregasStore.setState({ entregasHoy, loading: false });
    } catch (error) {
        EntregasStore.setState({ error, loading: false });
        mostrarModal("Error de Carga", "No se pudo cargar el historial inicial.", true);
    }
}

// ===== RENDERIZADO Y MANEJO DEL DOM =====
function renderizarPanelBeneficiario({ beneficiarioActual }) {
    const section = document.getElementById('beneficiarioSection');
    if (!beneficiarioActual) {
        section.style.display = 'none';
        return;
    }
    section.style.display = 'block';

    document.getElementById('beneficiarioNombre').textContent = beneficiarioActual.nombre;
    document.getElementById('beneficiarioDNI').textContent = beneficiarioActual.dni;

    // CORRECCIÓN CLAVE 1: Acceder a la propiedad 'nombre' del objeto 'comedor'.
    // Usamos 'optional chaining' (?.) por si el objeto comedor no existiera.
    document.getElementById('beneficiarioComedor').textContent = beneficiarioActual.comedor?.nombre || 'No asignado';
}

function renderizarHistorial({ entregasHoy, filtros }) {
    const tbody = document.getElementById('historialBody');
    const noDataMessage = document.getElementById('noDataMessage');
    tbody.innerHTML = '';

    const entregasFiltradas = entregasHoy
        // CORRECCIÓN: Al filtrar, también comparamos con la propiedad 'nombre' del objeto 'comedor'.
        .filter(e => filtros.comedor ? e.comedor?.nombre === filtros.comedor : true)
        .filter(e => filtros.tipo ? e.tipo === filtros.tipo : true)
        .sort((a, b) => new Date(b.fechaISO) - new Date(a.fechaISO));

    if (entregasFiltradas.length === 0) {
        noDataMessage.style.display = 'block';
    } else {
        noDataMessage.style.display = 'none';
        entregasFiltradas.forEach(entrega => {
            const tr = document.createElement('tr');
            tr.className = 'border-b hover:bg-gray-50';
            const hora = new Date(entrega.fechaISO).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            // CORRECCIÓN CLAVE 2: Mostrar 'entrega.comedor.nombre' en la tabla.
            tr.innerHTML = `
                <td class="px-4 py-3">${hora}</td>
                <td class="px-4 py-3 font-medium text-gray-800">${entrega.dni}</td>
                <td class="px-4 py-3">${entrega.beneficiarioNombre}</td>
                <td class="px-4 py-3">${entrega.comedor?.nombre || 'No especificado'}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${entrega.tipo === 'desayuno' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}">
                        ${entrega.tipo === 'desayuno' ? '🌅 Desayuno' : '🍽️ Almuerzo'}
                    </span>
                </td>
                <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        ✅ Entregado
                    </span>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function renderizarEstadisticas({ entregasHoy }) {
    const desayunos = entregasHoy.filter(e => e.tipo === 'desayuno').length;
    const almuerzos = entregasHoy.filter(e => e.tipo === 'almuerzo').length;
    const beneficiariosUnicos = new Set(entregasHoy.map(e => e.dni)).size;

    document.getElementById('totalDesayunos').textContent = desayunos;
    document.getElementById('totalAlmuerzos').textContent = almuerzos;
    document.getElementById('totalBeneficiarios').textContent = beneficiariosUnicos;
    document.getElementById('totalRaciones').textContent = desayunos + almuerzos;
}

// ===== Funciones de Utilidad (UI) =====
function mostrarModal(titulo, mensaje, esError = false) {
    const modal = document.getElementById('modalConfirmacion');
    document.getElementById('modalTitulo').textContent = titulo;
    document.getElementById('modalMensaje').textContent = mensaje;
    const icon = document.getElementById('modalIcon');
    icon.textContent = esError ? '❌' : '✅';
    modal.style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modalConfirmacion').style.display = 'none';
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('open');
}

function actualizarFechaActual() {
    const fechaEl = document.getElementById('currentDate');
    const hoy = new Date();
    const formatoFecha = new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' }).format(hoy);
    fechaEl.textContent = formatoFecha.charAt(0).toUpperCase() + formatoFecha.slice(1);
}

// ===== INICIALIZACIÓN Y EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    const searchDNIInput = document.getElementById('searchDNI');
    const buscarBtn = document.getElementById('btnBuscar');
    const limpiarBtn = document.getElementById('btnLimpiar');
    const filterComedor = document.getElementById('filterComedor');
    const filterTipo = document.getElementById('filterTipo');

    if (buscarBtn) {
        buscarBtn.onclick = handleBuscarBeneficiario;
    }
    if (limpiarBtn) {
        limpiarBtn.onclick = handleLimpiarFiltros;
    }

    // Suscribimos los renderizadores que dependen del estado global
    EntregasStore.subscribe(renderizarPanelBeneficiario);
    EntregasStore.subscribe(renderizarHistorial);
    EntregasStore.subscribe(renderizarEstadisticas);
    
    searchDNIInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleBuscarBeneficiario();
        }
    });

    const actualizarFiltros = () => {
        EntregasStore.setState({
            filtros: {
                // Para el filtro, usamos el valor del select, que es el nombre del comedor
                comedor: filterComedor.value,
                tipo: filterTipo.value
            }
        });
    };

    filterComedor.addEventListener('change', actualizarFiltros);
    filterTipo.addEventListener('change', actualizarFiltros);

    actualizarFechaActual();
    inicializarApp();
});