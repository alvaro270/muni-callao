function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("open");
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