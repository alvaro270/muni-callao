// main.js

// ==== Funciones Globales ====
function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("open");
}

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

function obtenerEntregasDeHoy() {
  const data = localStorage.getItem("comedorDigital_entregas");
  if (!data) return [];
  const entregas = JSON.parse(data);
  const hoy = new Date().toDateString();
  return entregas.filter((e) => new Date(e.fechaISO).toDateString() === hoy);
}

// ==== Buscar Beneficiario (Simulado) ====
function buscarBeneficiario() {
  const dni = document.getElementById("dniInput").value.trim();
  if (dni.length !== 8 || isNaN(dni)) {
    alert("Por favor ingrese un DNI válido de 8 dígitos");
    return;
  }

  // Simulamos base de datos con 2 beneficiarios
  const beneficiarios = {
    "12345678": {
      nombre: "Maria Carmen Rodriguez",
      comedor: "Teresa Izquierdo"
    },
    "87654321": {
      nombre: "Carlos Alberto Mendoza",
      comedor: "Santa Rosa"
    }
  };

  const beneficiario = beneficiarios[dni];

  if (!beneficiario) {
    alert("Beneficiario no encontrado");
    return;
  }

  // Mostrar info
  document.getElementById("beneficiarioInfo").style.display = "block";
  document.getElementById("botonesRegistro").style.display = "flex";
  document.getElementById("nombreBeneficiario").textContent = beneficiario.nombre;
  document.getElementById("dniBeneficiario").textContent = dni;
  document.getElementById("comedorBeneficiario").textContent = beneficiario.comedor;
}

// ==== Registrar Entrega ====
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

  const data = localStorage.getItem("comedorDigital_entregas");
  const entregas = data ? JSON.parse(data) : [];
  entregas.push(nuevaEntrega);
  localStorage.setItem("comedorDigital_entregas", JSON.stringify(entregas));

  const entregasDeHoy = obtenerEntregasDeHoy();
  mostrarEstadisticasGenerales(entregasDeHoy);
  mostrarResumenPorComedores(entregasDeHoy);
  mostrarActividadReciente(entregasDeHoy);

  alert(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} registrado para ${beneficiarioNombre}`);
}

// ==== Mostrar estadísticas ====
function mostrarEstadisticasGenerales(entregas) {
  const desayunos = entregas.filter((e) => e.tipo === "desayuno").length;
  const almuerzos = entregas.filter((e) => e.tipo === "almuerzo").length;
  const total = desayunos + almuerzos;

  const capacidadDesayunos = 800;
  const capacidadAlmuerzos = 800;
  const capacidadTotal = capacidadDesayunos + capacidadAlmuerzos;

  document.getElementById("desayunos").textContent = desayunos;
  document.getElementById("almuerzos").textContent = almuerzos;
  document.getElementById("total").textContent = total;

  document.querySelector("#desayunos").closest(".card-hover").querySelector(".bg-orange-400").style.width = `${(desayunos / capacidadDesayunos) * 100}%`;
  document.querySelector("#almuerzos").closest(".card-hover").querySelector(".bg-secondary").style.width = `${(almuerzos / capacidadAlmuerzos) * 100}%`;
  document.querySelector("#total").closest(".card-hover").querySelector(".bg-primary").style.width = `${(total / capacidadTotal) * 100}%`;
}

function mostrarResumenPorComedores(entregas) {
  const contenedor = document.getElementById("contenedor-comedores");
  contenedor.innerHTML = "";
  const resumen = {};

  entregas.forEach((e) => {
    const comedor = e.comedor?.nombre || "Otro";
    if (!resumen[comedor]) resumen[comedor] = { desayunos: 0, almuerzos: 0 };
    if (e.tipo === "desayuno") resumen[comedor].desayunos++;
    if (e.tipo === "almuerzo") resumen[comedor].almuerzos++;
  });

  Object.entries(resumen).forEach(([nombre, datos]) => {
    const cap = 800;
    const total = datos.desayunos + datos.almuerzos;
    const tarjeta = document.createElement("div");
    tarjeta.className = "bg-white rounded-xl shadow-md p-4 md:p-6 card-hover min-w-[280px] snap-start";
    tarjeta.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-bold text-gray-800 text-sm md:text-base">${nombre}</h4>
        <span class="bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">Activo</span>
      </div>
      <div class="space-y-3">
        <div class="flex justify-between text-sm md:text-base">
          <span class="text-gray-600">🌅 Desayunos:</span>
          <span class="font-semibold">${datos.desayunos} de ${cap}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-orange-400 h-2 rounded-full" style="width: ${(datos.desayunos / cap) * 100}%"></div>
        </div>
        <div class="flex justify-between text-sm md:text-base">
          <span class="text-gray-600">🍽️ Almuerzos:</span>
          <span class="font-semibold">${datos.almuerzos} de ${cap}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-secondary h-2 rounded-full" style="width: ${(datos.almuerzos / cap) * 100}%"></div>
        </div>
        <div class="pt-2 border-t">
          <div class="flex justify-between text-sm md:text-base">
            <span class="text-gray-700 font-medium">Total raciones:</span>
            <span class="font-bold text-primary">${total}</span>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(tarjeta);
  });
}

function mostrarActividadReciente(entregas) {
  const actividad = document.getElementById("actividad-reciente");
  actividad.innerHTML = "";

  const recientes = entregas.sort((a, b) => new Date(b.fechaISO) - new Date(a.fechaISO)).slice(0, 3);

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

// ==== Eventos y Carga Inicial ====
document.addEventListener("DOMContentLoaded", function () {
  actualizarFechaActual();
  const entregas = obtenerEntregasDeHoy();
  mostrarEstadisticasGenerales(entregas);
  mostrarResumenPorComedores(entregas);
  mostrarActividadReciente(entregas);

  document.getElementById("dniInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") buscarBeneficiario();
  });

  document.getElementById("registrarDesayuno").addEventListener("click", () => registrarEntrega("desayuno"));
  document.getElementById("registrarAlmuerzo").addEventListener("click", () => registrarEntrega("almuerzo"));
});
