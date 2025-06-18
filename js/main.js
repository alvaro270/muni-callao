function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("open");
}


document.getElementById("registrarDesayuno").addEventListener("click", function () {
  registrarEntrega("desayuno");
});

document.getElementById("registrarAlmuerzo").addEventListener("click", function () {
  registrarEntrega("almuerzo");
});

function registrarEntrega(tipo) {
  const dni = document.getElementById("dniBeneficiario").textContent;
  const beneficiarioNombre = document.getElementById("nombreBeneficiario").textContent.trim();
  const comedorNombre = document.getElementById("comedorBeneficiario").textContent.trim();

  const nuevaEntrega = {
    dni: dni,
    tipo: tipo,
    fechaISO: new Date().toISOString(),
    beneficiarioNombre: beneficiarioNombre,
    comedor: { nombre: comedorNombre }
  };

  // Guardar en localStorage
  const data = localStorage.getItem("comedorDigital_entregas");
  const entregas = data ? JSON.parse(data) : [];
  entregas.push(nuevaEntrega);
  localStorage.setItem("comedorDigital_entregas", JSON.stringify(entregas));

  // Actualizar UI
  const entregasDeHoy = obtenerEntregasDeHoy();
  mostrarEstadisticasGenerales(entregasDeHoy);
  mostrarResumenPorComedores(entregasDeHoy);
  mostrarActividadReciente(entregasDeHoy);

  // Feedback
  alert(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} registrado para ${beneficiarioNombre}`);
}



function actualizarFechaActual() {
  const fechaEl = document.getElementById("currentDate");
  const hoy = new Date();
  const formatoFecha = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "full",
  }).format(hoy);
  fechaEl.textContent =
    formatoFecha.charAt(0).toUpperCase() + formatoFecha.slice(1);
}

function buscarBeneficiario() {
  const dni = document.getElementById("dniInput").value;
  if (dni.length === 8) {
    // Simular búsqueda
    document.getElementById("beneficiarioInfo").style.display = "block";
    document.getElementById("botonesRegistro").style.display = "flex";

    document.getElementById("nombreBeneficiario").textContent = " Mendoza";
    document.getElementById("dniBeneficiario").textContent = dni;
    document.getElementById("comedorBeneficiario").textContent =
      "Teresa Izquierdo";
  } else {
    alert("Por favor ingrese un DNI válido de 8 dígitos");
  }
}

// Permitir búsqueda con Enter
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("dniInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        buscarBeneficiario();
      }
    });
});

// Cerrar menú móvil al hacer clic fuera
document.addEventListener("click", function (event) {
  const menu = document.getElementById("mobile-menu");
  const btn = document.getElementById("mobile-menu-btn");

  if (!menu.contains(event.target) && !btn.contains(event.target)) {
    menu.classList.remove("open");
  }
});

actualizarFechaActual();

// Mostrar fecha actual
function actualizarFechaActual() {
  const fechaEl = document.getElementById("currentDate");
  const fecha = new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  fechaEl.textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1);
}

// Obtener todas las entregas del día desde localStorage
function obtenerEntregasDeHoy() {
  const data = localStorage.getItem("comedorDigital_entregas");
  if (!data) return [];

  const entregas = JSON.parse(data);
  const hoy = new Date().toDateString();

  return entregas.filter((e) => new Date(e.fechaISO).toDateString() === hoy);
}

// Mostrar estadísticas generales
function mostrarEstadisticasGenerales(entregas) {
  const desayunos = entregas.filter((e) => e.tipo === "desayuno").length;
  const almuerzos = entregas.filter((e) => e.tipo === "almuerzo").length;
  const total = desayunos + almuerzos;

  document.getElementById("desayunos").textContent = desayunos;
  document.getElementById("almuerzos").textContent = almuerzos;
  document.getElementById("total").textContent = total;
}

// Mostrar resumen por comedores
function mostrarResumenPorComedores(entregas) {
  const resumen = {};

  entregas.forEach((e) => {
    const nombre = e.comedor?.nombre || "Otro";
    if (!resumen[nombre]) resumen[nombre] = { desayunos: 0, almuerzos: 0 };
    if (e.tipo === "desayuno") resumen[nombre].desayunos++;
    if (e.tipo === "almuerzo") resumen[nombre].almuerzos++;
  });

  // Teresa Izquierdo
  const dTeresa = resumen["Teresa Izquierdo"]?.desayunos || 0;
  const aTeresa = resumen["Teresa Izquierdo"]?.almuerzos || 0;
  const tTeresa = dTeresa + aTeresa;

  document.querySelector(
    ".card-hover:nth-child(1) .font-semibold"
  ).textContent = `${dTeresa} de 600`;
  document.querySelector(
    ".card-hover:nth-child(1) .bg-orange-400"
  ).style.width = `${(dTeresa / 600) * 100}%`;

  document.querySelector(
    ".card-hover:nth-child(1) .text-gray-600 + .font-semibold"
  ).textContent = `${aTeresa} de 600`;
  document.querySelector(
    ".card-hover:nth-child(1) .bg-secondary"
  ).style.width = `${(aTeresa / 600) * 100}%`;

  document.querySelector(
    ".card-hover:nth-child(1) .text-primary.font-bold"
  ).textContent = tTeresa;

  // Casa Adulto Mayor - Bocanegra
  const dBoca = resumen["Casa Adulto Mayor - Bocanegra"]?.desayunos || 0;
  const aBoca = resumen["Casa Adulto Mayor - Bocanegra"]?.almuerzos || 0;
  const tBoca = dBoca + aBoca;

  document.querySelector(
    ".card-hover:nth-child(2) .font-semibold"
  ).textContent = `${dBoca} de 200`;
  document.querySelector(
    ".card-hover:nth-child(2) .bg-orange-400"
  ).style.width = `${(dBoca / 200) * 100}%`;

  document.querySelector(
    ".card-hover:nth-child(2) .text-gray-600 + .font-semibold"
  ).textContent = `${aBoca} de 200`;
  document.querySelector(
    ".card-hover:nth-child(2) .bg-secondary"
  ).style.width = `${(aBoca / 200) * 100}%`;

  document.querySelector(
    ".card-hover:nth-child(2) .text-primary.font-bold"
  ).textContent = tBoca;
}

// Mostrar actividad reciente
function mostrarActividadReciente(entregas) {
  const actividad = document.getElementById("actividad-reciente");

  actividad.innerHTML = "";

  const recientes = entregas
    .sort((a, b) => new Date(b.fechaISO) - new Date(a.fechaISO))
    .slice(0, 3);

  recientes.forEach((e) => {
    const hora = new Date(e.fechaISO).toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    });

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
    actividad.appendChild(div);
  });
}

// Menú móvil toggle
function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("open");
}

// Ejecutar al cargar
document.addEventListener("DOMContentLoaded", function () {
  actualizarFechaActual();
  const entregas = obtenerEntregasDeHoy();
  mostrarEstadisticasGenerales(entregas);
  mostrarResumenPorComedores(entregas);
  mostrarActividadReciente(entregas);
});



