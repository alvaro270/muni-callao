// ===== PATRÓN STORE - MANEJO DE ESTADO GLOBAL =====
const EntregasStore = {
    state: {
        entregasHoy: [],
        beneficiarioActual: null,
        loading: false,
    },
    listeners: [],
    subscribe(listener) { this.listeners.push(listener); },
    notify() { this.listeners.forEach(listener => listener(this.state)); },
    setState(partialState) {
        this.state = { ...this.state, ...partialState };
        this.notify();
    }
};

// --- CLASES (Conceptuales, sin cambios) ---
class Beneficiario {}
class Entrega {}

// ===== SIMULACIÓN DE BASE DE DATOS (LocalStorage) =====
class EntregasDatabase {
    constructor() {
        // CORRECCIÓN: Usamos las claves estandarizadas que usan los otros módulos
        this.BENEFICIARIOS_KEY = 'beneficiarios';
        this.ENTREGAS_KEY = 'comedorDigital_entregas';
    }

    // Busca un beneficiario y devuelve el objeto completo
    async buscarBeneficiarioPorDNI(dni) {
        const beneficiariosJSON = localStorage.getItem(this.BENEFICIARIOS_KEY);
        if (!beneficiariosJSON) return null;
        try {
            const beneficiarios = JSON.parse(beneficiariosJSON);
            // Devuelve el objeto completo, que incluye la propiedad 'estado'
            return beneficiarios.find(b => b.dni === dni) || null;
        } catch(e) {
            console.error("Error al leer beneficiarios:", e);
            return null;
        }
    }

    async obtenerEntregas() {
        const entregasJSON = localStorage.getItem(this.ENTREGAS_KEY);
        return entregasJSON ? JSON.parse(entregasJSON) : [];
    }
    
    async guardarEntregas(entregas) {
        localStorage.setItem(this.ENTREGAS_KEY, JSON.stringify(entregas));
    }

    async obtenerEntregasDeHoy() {
        const todas = await this.obtenerEntregas();
        const hoy = new Date().toDateString();
        return todas.filter(e => new Date(e.fechaISO).toDateString() === hoy);
    }
    
    async registrarNuevaEntrega(entrega) {
        const todas = await this.obtenerEntregas();
        todas.push(entrega);
        await this.guardarEntregas(todas);
        return entrega;
    }

    async eliminarEntrega(id) {
        let todas = await this.obtenerEntregas();
        const entregasFiltradas = todas.filter(e => e.id !== id);
        if (todas.length === entregasFiltradas.length) throw new Error("No se encontró la entrega para eliminar.");
        await this.guardarEntregas(entregasFiltradas);
        return true;
    }

    async actualizarEntrega(id, datosActualizados) {
        let todas = await this.obtenerEntregas();
        const index = todas.findIndex(e => e.id === id);
        if (index === -1) throw new Error("No se encontró la entrega para actualizar.");
        todas[index].tipo = datosActualizados.tipo;
        await this.guardarEntregas(todas);
        return todas[index];
    }
}


// ===== LÓGICA DE LA APLICACIÓN (Controlador) =====
const db = new EntregasDatabase();

async function handleBuscarBeneficiario() {
    const dni = document.getElementById('searchDNI').value.trim();
    if (!/^\d{8}$/.test(dni)) {
        return mostrarModal('DNI Inválido', 'Por favor, ingrese un DNI válido de 8 dígitos.', true);
    }
    EntregasStore.setState({ loading: true, beneficiarioActual: null });
    const beneficiario = await db.buscarBeneficiarioPorDNI(dni);
    if (beneficiario) {
        EntregasStore.setState({ beneficiarioActual: beneficiario, loading: false });
    } else {
        mostrarModal("No Encontrado", `No se encontró ningún beneficiario con el DNI ${dni}.`, true);
        EntregasStore.setState({ loading: false });
    }
}

async function handleRegistrarEntrega(tipo) {
    const { beneficiarioActual, entregasHoy } = EntregasStore.state;
    if (!beneficiarioActual) return;
    
    // CORRECCIÓN: Se valida la propiedad 'estado' del objeto beneficiario.
    // El objeto se carga completo desde localStorage, por lo que ahora sí tiene esta propiedad.
    if (beneficiarioActual.estado !== 'Activo') {
         return mostrarModal("Beneficiario Inactivo", "No se puede registrar entregas a un beneficiario inactivo.", true);
    }

    if (entregasHoy.some(e => e.dni === beneficiarioActual.dni && e.tipo === tipo)) {
        return mostrarModal("Entrega Duplicada", `El beneficiario ya recibió su ${tipo} hoy.`, true);
    }
    const nuevaEntrega = {
        id: crypto.randomUUID(),
        dni: beneficiarioActual.dni,
        beneficiarioNombre: beneficiarioActual.nombre,
        comedor: beneficiarioActual.comedor,
        tipo: tipo,
        fechaISO: new Date().toISOString(),
        estado: 'entregado',
    };
    await db.registrarNuevaEntrega(nuevaEntrega);
    await actualizarEntregasYUI();
    mostrarModal("Registro Exitoso", `Se ha registrado el ${tipo} para ${beneficiarioActual.nombre}.`);
    handleLimpiarBusqueda();
}

async function handleEliminarEntrega(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
        try {
            await db.eliminarEntrega(id);
            mostrarModal("Eliminado", "El registro ha sido eliminado.");
            await actualizarEntregasYUI();
        } catch (error) {
            mostrarModal("Error", error.message, true);
        }
    }
}

function handleAbrirModalEditar(id) {
    const entrega = EntregasStore.state.entregasHoy.find(e => e.id === id);
    if(entrega) {
        document.getElementById('editEntregaId').value = id;
        document.getElementById('editBeneficiarioNombre').textContent = entrega.beneficiarioNombre;
        document.getElementById('editTipoRacion').value = entrega.tipo;
        document.getElementById('modalEditar').style.display = 'flex';
    }
}

async function handleGuardarCambiosEntrega(event) {
    event.preventDefault();
    const id = document.getElementById('editEntregaId').value;
    const tipo = document.getElementById('editTipoRacion').value;
    try {
        await db.actualizarEntrega(id, { tipo });
        mostrarModal("Actualizado", "La entrega ha sido modificada.");
        cerrarModal('modalEditar');
        await actualizarEntregasYUI();
    } catch (error) {
        mostrarModal("Error", error.message, true);
    }
}

async function inicializarApp() {
    EntregasStore.setState({ loading: true });
    await actualizarEntregasYUI();
    EntregasStore.setState({ loading: false });
}

async function actualizarEntregasYUI() {
    const entregasHoy = await db.obtenerEntregasDeHoy();
    EntregasStore.setState({ entregasHoy });
}

function handleLimpiarBusqueda() {
    document.getElementById('searchDNI').value = '';
    EntregasStore.setState({ beneficiarioActual: null });
}


// ===== RENDERIZADO Y MANEJO DEL DOM =====
function renderizarPanelBeneficiario({ beneficiarioActual, entregasHoy }) {
    const section = document.getElementById('beneficiarioSection');
    if (!beneficiarioActual) {
        section.style.display = 'none';
        return;
    }
    section.style.display = 'block';

    document.getElementById('beneficiarioNombre').textContent = beneficiarioActual.nombre;
    document.getElementById('beneficiarioDNI').textContent = beneficiarioActual.dni;
    document.getElementById('beneficiarioComedor').textContent = beneficiarioActual.comedor?.nombre || 'No asignado';
    
    const entregasDelBeneficiario = entregasHoy.filter(e => e.dni === beneficiarioActual.dni);
    const tieneDesayuno = entregasDelBeneficiario.some(e => e.tipo === 'desayuno');
    const tieneAlmuerzo = entregasDelBeneficiario.some(e => e.tipo === 'almuerzo');
    
    const esActivo = beneficiarioActual.estado === 'Activo';

    const estadoDesayunoEl = document.getElementById('estadoDesayuno');
    const btnDesayuno = document.getElementById('btnDesayuno');
    if (tieneDesayuno) {
        estadoDesayunoEl.textContent = '✅ Entregado';
        btnDesayuno.disabled = true;
    } else if (!esActivo) {
        estadoDesayunoEl.textContent = '❌ Inactivo';
        btnDesayuno.disabled = true;
    } else {
        estadoDesayunoEl.textContent = '⏳ Pendiente';
        btnDesayuno.disabled = false;
    }

    const estadoAlmuerzoEl = document.getElementById('estadoAlmuerzo');
    const btnAlmuerzo = document.getElementById('btnAlmuerzo');
    if (tieneAlmuerzo) {
        estadoAlmuerzoEl.textContent = '✅ Entregado';
        btnAlmuerzo.disabled = true;
    } else if (!esActivo) {
        estadoAlmuerzoEl.textContent = '❌ Inactivo';
        btnAlmuerzo.disabled = true;
    } else {
        estadoAlmuerzoEl.textContent = '⏳ Pendiente';
        btnAlmuerzo.disabled = false;
    }
}

function renderizarHistorial({ entregasHoy }) {
    const tbody = document.getElementById('historialBody');
    tbody.innerHTML = '';
    
    const entregasOrdenadas = [...entregasHoy].sort((a,b) => new Date(b.fechaISO) - new Date(a.fechaISO));

    if (entregasOrdenadas.length === 0) {
        document.getElementById('noDataMessage').style.display = 'table-row';
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-500"><span class="text-4xl mb-4 block">📝</span><p>No hay entregas registradas hoy.</p></td></tr>';
        return;
    }
    
    document.getElementById('noDataMessage').style.display = 'none';
    entregasOrdenadas.forEach(entrega => {
        const tr = document.createElement('tr');
        tr.className = 'border-b hover:bg-gray-50';
        const hora = new Date(entrega.fechaISO).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
        
        tr.innerHTML = `
            <td class="px-4 py-3">${hora}</td>
            <td class="px-4 py-3">${entrega.dni}</td>
            <td class="px-4 py-3 font-medium">${entrega.beneficiarioNombre}</td>
            <td class="px-4 py-3">${entrega.comedor?.nombre || 'N/A'}</td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs font-medium rounded-full ${entrega.tipo === 'desayuno' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}">
                    ${entrega.tipo === 'desayuno' ? '🌅 Desayuno' : '🍽️ Almuerzo'}
                </span>
            </td>
            <td class="px-4 py-3 text-center space-x-2">
                <button onclick="handleAbrirModalEditar('${entrega.id}')" title="Editar" class="text-blue-600 hover:text-blue-900 transition-colors">✏️</button>
                <button onclick="handleEliminarEntrega('${entrega.id}')" title="Eliminar" class="text-red-600 hover:text-red-900 transition-colors">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
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
    document.getElementById('modalIcon').textContent = esError ? '❌' : '✅';
    modal.style.display = 'flex';
}

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('open');
}

function actualizarFechaActual() {
    const fechaEl = document.getElementById('currentDate');
    const hoy = new Date();
    const formatoFecha = new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' }).format(hoy);
    fechaEl.textContent = formatoFecha.charAt(0).toUpperCase() + formatoFecha.slice(1);
}

// ===== INICIALIZACIÓN Y EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    EntregasStore.subscribe(renderizarPanelBeneficiario);
    EntregasStore.subscribe(renderizarHistorial);
    EntregasStore.subscribe(renderizarEstadisticas);
    
    document.getElementById('btnBuscar').onclick = handleBuscarBeneficiario;
    document.getElementById('btnLimpiar').onclick = handleLimpiarBusqueda;
    document.getElementById('formEditarEntrega').addEventListener('submit', handleGuardarCambiosEntrega);
    
    document.getElementById('searchDNI').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleBuscarBeneficiario();
    });

    actualizarFechaActual();
    inicializarApp();
});
