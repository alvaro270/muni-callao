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
class Beneficiario {
    constructor(dni, nombre, comedor, activo = true) {
        if (!Beneficiario.validarDNI(dni)) {
            throw new Error("El DNI proporcionado no es válido.");
        }
        this.dni = dni;
        this.nombre = nombre;
        this.comedor = comedor;
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
        this.comedor = comedor;
        this.tipo = tipo;
        this.fechaISO = new Date().toISOString();
        this.registradoPor = usuario;
        this.estado = 'entregado';
    }
    get hora() {
        return new Date(this.fechaISO).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    }
}

// ===== SIMULACIÓN DE BASE DE DATOS (LocalStorage) =====
class EntregasDatabase {
    constructor() {
        this.BENEFICIARIOS_KEY = 'beneficiarios';
        this.ENTREGAS_KEY = 'comedorDigital_entregas';
        // this._inicializarDatosSimulados();
    }

    // CORRECCIÓN: Lógica de inicialización mejorada.
    // _inicializarDatosSimulados() {
    //     // --- Carga de Beneficiarios ---
    //     const beneficiariosData = localStorage.getItem(this.BENEFICIARIOS_KEY);
    //     // Se crean los datos solo si no existen O si existen pero están vacíos.
    //     if (!beneficiariosData || JSON.parse(beneficiariosData).length === 0) {
    //         const beneficiarios = [
    //             new Beneficiario('12345678', 'María Carmen Rodríguez', 'Teresa Izquierdo'),
    //             new Beneficiario('87654321', 'Carlos Alberto Mendoza', 'Teresa Izquierdo'),
    //             new Beneficiario('11111111', 'Ana Sofia Gutierrez', 'Casa Adulto Mayor - Bocanegra'),
    //             new Beneficiario('22222222', 'José Luis Torres', 'Teresa Izquierdo'),
    //             new Beneficiario('33333333', 'Rosa Elena Vásquez', 'Casa Adulto Mayor - Bocanegra'),
    //             new Beneficiario('44444444', 'Juan Pérez Gonzáles', 'Teresa Izquierdo'),
    //             new Beneficiario('55555555', 'Luisa Fernanda Castillo', 'Casa Adulto Mayor - Bocanegra'),
    //         ];
    //         localStorage.setItem(this.BENEFICIARIOS_KEY, JSON.stringify(beneficiarios));
    //     }

    //     // --- Carga de Entregas de Ejemplo para Hoy ---
    //     const entregasData = localStorage.getItem(this.ENTREGAS_KEY);
    //     // Creamos entregas de ejemplo para hoy solo si no hay ninguna entrega guardada.
    //     if (!entregasData) {
    //         const entregasDeEjemplo = [
    //             new Entrega('12345678', 'María Carmen Rodríguez', 'Teresa Izquierdo', 'desayuno'),
    //             new Entrega('11111111', 'Ana Sofia Gutierrez', 'Casa Adulto Mayor - Bocanegra', 'almuerzo'),
    //         ];
    //         // Simulamos que el desayuno se entregó hace una hora
    //         const unaHoraAntes = new Date();
    //         unaHoraAntes.setHours(unaHoraAntes.getHours() - 1);
    //         entregasDeEjemplo[0].fechaISO = unaHoraAntes.toISOString();

    //         localStorage.setItem(this.ENTREGAS_KEY, JSON.stringify(entregasDeEjemplo));
    //     }
    // }

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
                
                // Añadimos la nueva entrega a la lista completa
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
function renderizarPanelBeneficiario({ beneficiarioActual, entregasHoy, loading }) {
    const section = document.getElementById('beneficiarioSection');
    if (!beneficiarioActual) {
        section.style.display = 'none';
        return;
    }
    section.style.display = 'block';

    document.getElementById('beneficiarioNombre').textContent = beneficiarioActual.nombre;
    document.getElementById('beneficiarioDNI').textContent = beneficiarioActual.dni;
    document.getElementById('beneficiarioComedor').textContent = beneficiarioActual.comedor;

    const entregaDesayuno = entregasHoy.find(e => e.dni === beneficiarioActual.dni && e.tipo === 'desayuno');
    const entregaAlmuerzo = entregasHoy.find(e => e.dni === beneficiarioActual.dni && e.tipo === 'almuerzo');

    const estadoDesayunoEl = document.getElementById('estadoDesayuno');
    const btnDesayuno = document.getElementById('btnDesayuno');
    if (entregaDesayuno) {
        const hora = new Date(entregaDesayuno.fechaISO).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
        estadoDesayunoEl.innerHTML = `✅ Entregado a las ${hora}`;
        estadoDesayunoEl.className = 'font-bold text-green-600';
        btnDesayuno.disabled = true;
    } else {
        estadoDesayunoEl.textContent = '⏳ Pendiente';
        estadoDesayunoEl.className = 'font-bold text-orange-600';
        btnDesayuno.disabled = false;
    }

    const estadoAlmuerzoEl = document.getElementById('estadoAlmuerzo');
    const btnAlmuerzo = document.getElementById('btnAlmuerzo');
    if (entregaAlmuerzo) {
        const hora = new Date(entregaAlmuerzo.fechaISO).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
        estadoAlmuerzoEl.innerHTML = `✅ Entregado a las ${hora}`;
        estadoAlmuerzoEl.className = 'font-bold text-green-600';
        btnAlmuerzo.disabled = true;
    } else {
        estadoAlmuerzoEl.textContent = '⏳ Pendiente';
        estadoAlmuerzoEl.className = 'font-bold text-blue-600';
        btnAlmuerzo.disabled = false;
    }
    
    btnDesayuno.disabled = btnDesayuno.disabled || loading;
    btnAlmuerzo.disabled = btnAlmuerzo.disabled || loading;
}

function renderizarHistorial({ entregasHoy, filtros }) {
    const tbody = document.getElementById('historialBody');
    const noDataMessage = document.getElementById('noDataMessage');
    tbody.innerHTML = '';

    const entregasFiltradas = entregasHoy
        .filter(e => filtros.comedor ? e.comedor === filtros.comedor : true)
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
            tr.innerHTML = `
                <td class="px-4 py-3">${hora}</td>
                <td class="px-4 py-3 font-medium text-gray-800">${entrega.dni}</td>
                <td class="px-4 py-3">${entrega.beneficiarioNombre}</td>
                <td class="px-4 py-3">${entrega.comedor}</td>
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
