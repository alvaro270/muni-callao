// --- FUNCIONES PRINCIPALES DEL DASHBOARD ---

/**
 * Función principal que se ejecuta cuando el DOM está completamente cargado.
 * Orquesta la carga de datos y la renderización de la UI.
 */
document.addEventListener('DOMContentLoaded', function () {
    // Se asegura de que la UI se actualice con datos frescos de LocalStorage
    // cada vez que se carga la página del dashboard.
    actualizarDashboardCompleto();
    
    // Configura los listeners de eventos para los botones
    setupEventListeners();
});

/**
 * Orquesta todas las actualizaciones de la UI del dashboard.
 */
function actualizarDashboardCompleto() {
    actualizarFechaActual();
    const entregas = obtenerEntregasDeHoy();
    const comedores = obtenerComedores();
    
    mostrarEstadisticasGenerales(entregas, comedores);
    mostrarResumenPorComedores(entregas, comedores);
    mostrarActividadReciente(entregas); // Esta función ahora funcionará correctamente
}

/**
 * Configura todos los event listeners de la página.
 */
function setupEventListeners() {
    const dniInput = document.getElementById('dniInput');
    if (dniInput) {
        dniInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                buscarBeneficiario();
            }
        });
    }

    const exportButton = document.getElementById('export-button');
    if (exportButton) {
        exportButton.addEventListener('click', exportarReporteExcel);
    }
    
    const btnRegDesayuno = document.getElementById('registrarDesayuno');
    if(btnRegDesayuno) btnRegDesayuno.addEventListener("click", () => registrarEntregaRapida("desayuno"));

    const btnRegAlmuerzo = document.getElementById('registrarAlmuerzo');
    if(btnRegAlmuerzo) btnRegAlmuerzo.addEventListener("click", () => registrarEntregaRapida("almuerzo"));
    
    document.addEventListener('click', function (event) {
        const menu = document.getElementById('mobile-menu');
        const btn = document.getElementById('mobile-menu-btn');
        if (menu && btn && !menu.contains(event.target) && !btn.contains(event.target)) {
            menu.classList.remove('open');
        }
    });
}


// --- LÓGICA DE DATOS (LocalStorage) ---

function obtenerEntregasDeHoy() {
    const data = localStorage.getItem("comedorDigital_entregas");
    if (!data) return [];
    try {
        const entregas = JSON.parse(data);
        const hoy = new Date().toDateString();
        return entregas.filter((e) => new Date(e.fechaISO).toDateString() === hoy);
    } catch (error) {
        console.error("Error al parsear entregas de localStorage:", error);
        return [];
    }
}

function obtenerComedores() {
    const data = localStorage.getItem("comedores");
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al parsear comedores de localStorage:", error);
        return [];
    }
}

// --- RENDERIZADO DE COMPONENTES DE UI ---

function mostrarEstadisticasGenerales(entregas, comedores) {
    const desayunos = entregas.filter((e) => e.tipo === "desayuno").length;
    const almuerzos = entregas.filter((e) => e.tipo === "almuerzo").length;
    const total = desayunos + almuerzos;
    
    const capacidadTotal = comedores
        .filter(c => c.estado === 'Activo')
        .reduce((acc, c) => acc + (c.capacidad || 0), 0);

    document.getElementById("desayunos").textContent = desayunos;
    document.getElementById("almuerzos").textContent = almuerzos;
    document.getElementById("total").textContent = total;

    const desayunoPorcentaje = capacidadTotal > 0 ? (desayunos / capacidadTotal) * 100 : 0;
    const almuerzoPorcentaje = capacidadTotal > 0 ? (almuerzos / capacidadTotal) * 100 : 0;
    const totalPorcentaje = capacidadTotal > 0 ? (total / (capacidadTotal * 2)) * 100 : 0;

    const cardDesayuno = document.getElementById("desayunos").closest(".card-hover");
    cardDesayuno.querySelector(".bg-orange-400").style.width = `${desayunoPorcentaje}%`;
    cardDesayuno.querySelector(".text-gray-500").textContent = `${desayunoPorcentaje.toFixed(0)}% de capacidad`;
    
    const cardAlmuerzo = document.getElementById("almuerzos").closest(".card-hover");
    cardAlmuerzo.querySelector(".bg-secondary").style.width = `${almuerzoPorcentaje}%`;
    cardAlmuerzo.querySelector(".text-gray-500").textContent = `${almuerzoPorcentaje.toFixed(0)}% de capacidad`;
    
    const cardTotal = document.getElementById("total").closest(".card-hover");
    cardTotal.querySelector(".bg-primary").style.width = `${totalPorcentaje}%`;
    cardTotal.querySelector(".text-gray-500").textContent = `${totalPorcentaje.toFixed(0)}% de capacidad total`;
}

function mostrarResumenPorComedores(entregas, todosLosComedores) {
    const wrapper = document.getElementById('resumen-comedores-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = ''; 

    const resumen = {};
    entregas.forEach((e) => {
        const comedorNombre = e.comedor?.nombre || "Otro";
        if (!resumen[comedorNombre]) {
            resumen[comedorNombre] = { desayunos: 0, almuerzos: 0 };
        }
        if (e.tipo === "desayuno") resumen[comedorNombre].desayunos++;
        if (e.tipo === "almuerzo") resumen[comedorNombre].almuerzos++;
    });

    const comedoresConActividad = Object.keys(resumen);
    
    const container = document.getElementById('comedores-carousel-container');
    const noDataMessage = document.getElementById('no-comedores-activos');
    if (comedoresConActividad.length === 0) {
        if(container) container.style.display = 'none';
        if(noDataMessage) noDataMessage.style.display = 'block';
        return;
    }
    if(container) container.style.display = 'block';
    if(noDataMessage) noDataMessage.style.display = 'none';

    comedoresConActividad.forEach(nombreComedor => {
        const comedorInfo = todosLosComedores.find(c => c.nombre === nombreComedor) || { capacidad: 100, estado: 'Activo' };
        const cap = comedorInfo.capacidad;
        const desayunos = resumen[nombreComedor].desayunos;
        const almuerzos = resumen[nombreComedor].almuerzos;
        const total = desayunos + almuerzos;

        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `<div class="bg-white rounded-xl shadow-md p-4 md:p-6 card-hover h-full flex flex-col justify-between" data-comedor="${nombreComedor}"><div><div class="flex items-center justify-between mb-4"><h4 class="font-bold text-gray-800 text-sm md:text-base">${nombreComedor}</h4><span class="bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">${comedorInfo.estado}</span></div><div class="space-y-3"><div class="flex justify-between items-center text-sm md:text-base"><span class="text-gray-600">🌅 Desayunos:</span><span class="font-semibold">${desayunos} de ${cap}</span></div><div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-orange-400 h-2 rounded-full" style="width: ${(desayunos / cap) * 100}%"></div></div><div class="flex justify-between items-center text-sm md:text-base"><span class="text-gray-600">🍽️ Almuerzos:</span><span class="font-semibold">${almuerzos} de ${cap}</span></div><div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-secondary h-2 rounded-full" style="width: ${(almuerzos / cap) * 100}%"></div></div></div></div><div class="pt-2 border-t mt-4"><div class="flex justify-between items-center text-sm md:text-base"><span class="text-gray-700 font-medium">Total raciones:</span><span class="font-bold text-primary">${total}</span></div></div></div>`;
        wrapper.appendChild(slide);
    });

    if (window.swiper) {
        window.swiper.destroy(true, true);
    }
    window.swiper = new Swiper('#comedores-carousel-container', {
        loop: false,
        slidesPerView: 1,
        spaceBetween: 16,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.carousel-next', prevEl: '.carousel-prev' },
        breakpoints: { 768: { slidesPerView: 2, spaceBetween: 24 } },
    });
}

/**
 * Muestra las últimas 3 entregas en la sección "Actividad Reciente".
 * @param {Array} entregas - La lista de entregas del día.
 */
function mostrarActividadReciente(entregas) {
    const actividadContainer = document.getElementById("actividad-reciente");
    if (!actividadContainer) return;
    actividadContainer.innerHTML = "";

    // CORRECCIÓN: El error estaba aquí. Los parámetros del sort() eran incorrectos.
    // Antes era: .sort((a, b) => new Date(b.fechaISO) - new Date(a.fechaISO))
    // pero en una versión anterior se minificó/ofuscó a (e, t) y dentro se usaba a y b.
    // La corrección es usar los parámetros correctos (a, b) para la comparación.
    const recientes = entregas
        .sort((a, b) => new Date(b.fechaISO) - new Date(a.fechaISO))
        .slice(0, 3);

    if (recientes.length === 0) {
        actividadContainer.innerHTML = '<p class="text-center text-gray-500 py-4">No hay actividad reciente hoy.</p>';
        return;
    }

    recientes.forEach((e) => {
        const hora = new Date(e.fechaISO).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
        const icono = e.tipo === "desayuno" ? "🌅" : "🍽️";
        const div = document.createElement("div");
        div.className = "flex items-center justify-between p-3 bg-gray-50 rounded-lg";
        div.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="text-xl md:text-2xl">${icono}</span>
                <div>
                    <p class="font-medium text-gray-800 text-sm md:text-base">${e.tipo.charAt(0).toUpperCase() + e.tipo.slice(1)} registrado</p>
                    <p class="text-xs md:text-sm text-gray-600">DNI: ${e.dni} - ${e.beneficiarioNombre}</p>
                </div>
            </div>
            <span class="text-xs md:text-sm text-gray-500">${hora}</span>
        `;
        actividadContainer.appendChild(div);
    });
}


// --- FUNCIONES DE UTILIDAD Y ACCIONES ---

function toggleMobileMenu() {
    const menu = document.getElementById("mobile-menu");
    if(menu) menu.classList.toggle("open");
}

function actualizarFechaActual() {
    const fechaEl = document.getElementById("currentDate");
    const hoy = new Date();
    const formatoFecha = new Intl.DateTimeFormat("es-ES", { dateStyle: "full" }).format(hoy);
    fechaEl.textContent = formatoFecha.charAt(0).toUpperCase() + formatoFecha.slice(1);
}

function buscarBeneficiario() {
    const dniInput = document.getElementById("dniInput");
    const dni = dniInput.value.trim();
    if (!/^\d{8}$/.test(dni)) {
        return alert("Por favor ingrese un DNI válido de 8 dígitos.");
    }
    
    const beneficiarios = JSON.parse(localStorage.getItem('beneficiarios')) || [];
    const beneficiario = beneficiarios.find(b => b.dni === dni);

    const infoPanel = document.getElementById("beneficiarioInfo");
    const botonesPanel = document.getElementById("botonesRegistro");

    if (beneficiario) {
        document.getElementById("nombreBeneficiario").textContent = beneficiario.nombre;
        document.getElementById("dniBeneficiario").textContent = beneficiario.dni;
        document.getElementById("comedorBeneficiario").textContent = beneficiario.comedor?.nombre || 'No asignado';
        document.getElementById("estadoBeneficiario").className = beneficiario.activo ? 'text-green-600' : 'text-red-600';
        document.getElementById("estadoBeneficiario").textContent = beneficiario.activo ? '✅ Activo' : '❌ Inactivo';
        
        infoPanel.style.display = "block";
        botonesPanel.style.display = "flex";
    } else {
        alert(`No se encontró un beneficiario con el DNI ${dni}.`);
        infoPanel.style.display = "none";
        botonesPanel.style.display = "none";
    }
}

function registrarEntregaRapida(tipo) {
    const dni = document.getElementById("dniBeneficiario").textContent;
    if (!dni) return alert("No hay un beneficiario seleccionado.");
    
    const beneficiarios = JSON.parse(localStorage.getItem('beneficiarios')) || [];
    const beneficiario = beneficiarios.find(b => b.dni === dni);

    if (!beneficiario) return alert("Error: No se encontraron los datos completos del beneficiario.");
    if (beneficiario.estado !== 'Activo') return alert("Error: No se pueden registrar entregas a un beneficiario inactivo.");

    const entregas = obtenerEntregasDeHoy();
    if (entregas.some(e => e.dni === dni && e.tipo === tipo)) {
        return alert(`El ${tipo} para este beneficiario ya fue registrado hoy.`);
    }

    const nuevaEntrega = {
        id: crypto.randomUUID(),
        dni: dni,
        tipo: tipo,
        fechaISO: new Date().toISOString(),
        beneficiarioNombre: beneficiario.nombre,
        comedor: beneficiario.comedor,
        estado: 'entregado',
    };

    const todasLasEntregas = JSON.parse(localStorage.getItem("comedorDigital_entregas") || '[]');
    todasLasEntregas.push(nuevaEntrega);
    localStorage.setItem("comedorDigital_entregas", JSON.stringify(todasLasEntregas));

    actualizarDashboardCompleto();
    alert(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} registrado para ${beneficiario.nombre}`);
}

/**
 * Exporta los datos de las entregas del día a un archivo CSV.
 */
function exportarReporteExcel() {
    const entregas = obtenerEntregasDeHoy();
    if (entregas.length === 0) {
        alert("No hay entregas registradas hoy para exportar.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = ["ID_Entrega", "Fecha", "Hora", "DNI_Beneficiario", "Nombre_Beneficiario", "Comedor", "Tipo_Racion", "Estado"];
    csvContent += headers.join(",") + "\r\n";

    entregas.forEach(entrega => {
        const fecha = new Date(entrega.fechaISO);
        const row = [
            entrega.id,
            fecha.toLocaleDateString('es-PE'),
            fecha.toLocaleTimeString('es-PE'),
            entrega.dni,
            `"${entrega.beneficiarioNombre}"`,
            `"${entrega.comedor?.nombre || 'No asignado'}"`,
            entrega.tipo,
            entrega.estado
        ];
        csvContent += row.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fechaArchivo = new Date().toISOString().slice(0, 10);
    link.setAttribute("download", `reporte_entregas_${fechaArchivo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
