# Requerimientos del Proyecto: ComedorDigital

## 1. Análisis del Problema

### a) Descripción del Negocio
La Gerencia de Programas Sociales de la Municipalidad Provincial del Callao gestiona comedores populares para asistir a vecinos vulnerables. El objetivo es proveer desayunos y almuerzos gratuitos de forma ordenada y eficiente a cientos de beneficiarios empadronados.

### b) Dolor Actual (Pain Point)
La gestión actual es 100% manual, basada en papel y archivos físicos. Esto genera:
-   **Ineficiencia:** Búsqueda lenta de información y registros manuales propensos a errores.
-   **Falta de Trazabilidad:** Imposibilidad de saber en tiempo real cuántas raciones se han entregado o quién las recibió.
-   **Ocupación de Espacio Físico:** Almacenamiento costoso y desorganizado.
-   **Sin Datos para Decisiones:** No existen estadísticas consolidadas para la supervisión y mejora del programa.

### c) Beneficios Esperados con "ComedorDigital"
-   **Agilidad:** Digitalizar el registro de entregas, reduciendo tiempos de espera.
-   **Control:** Tener un padrón único de beneficiarios y comedores, evitando duplicados y fraudes.
-   **Trazabilidad:** Generar un historial de cada ración entregada (quién, qué, cuándo y dónde).
-   **Inteligencia de Negocio:** Visualizar estadísticas en tiempo real para optimizar recursos y tomar decisiones informadas.

## 2. Alcance del Proyecto (MVP)

### a) Funcionalidades Core
1.  **Gestión de Comedores:**
    -   Registrar, ver, actualizar y eliminar (CRUD) la información de cada comedor (nombre, dirección, capacidad, responsable, estado).
2.  **Gestión de Beneficiarios:**
    -   Registrar, ver, actualizar y eliminar (CRUD) los datos de los beneficiarios (DNI, nombre, comedor asignado).
3.  **Control de Entregas de Raciones:**
    -   Buscar un beneficiario por DNI.
    -   Registrar la entrega de desayuno y/o almuerzo, validando que solo se entregue una ración de cada tipo por día y por persona.
    -   Ver el historial de entregas del día en tiempo real.
4.  **Dashboard de Supervisión:**
    -   Mostrar estadísticas clave del día: total de desayunos, total de almuerzos y total de raciones.
    -   Proveer un acceso rápido para el registro de entregas.

### b) Restricciones Técnicas
-   **Frontend:** HTML5, CSS3, TailwindCSS.
-   **Lógica:** JavaScript (ES6+).
-   **Base de Datos (Simulada):** `LocalStorage` del navegador. La aplicación debe funcionar sin un backend de servidor.
-   **Entorno:** Aplicación web accesible desde cualquier navegador moderno.

### c) Entregables Mínimos
-   Una aplicación web funcional con las 4 funcionalidades core implementadas.
-   Código fuente completo y comentado.
-   Documentación del proyecto (`README.md`, `team.md`, `requirements.md`, `user-stories.md`).

## 3. Wireframes y Bocetos

### a) Mapa del Sitio
```
ComedorDigital
|
|-- 🏠 Dashboard (index.html)
|   |-- Resumen de estadísticas diarias
|   |-- Acceso rápido a registro de entrega 
| 
|-- 🏢 Gestión de Comedores (comedor/comedor.html) 
|   |-- Formulario para agregar/editar comedores 
|   |-- Tabla/Lista de comedores existentes
|
|-- 👥 Gestión de Beneficiarios (beneficiario/beneficiario.html)
|   |-- Formulario para agregar/editar beneficiarios
|   |-- Tabla/Lista de beneficiarios existentes 
| 
|-- 🍽️ Control de Entregas (entregas/entregas.html) 
|   |-- Buscador de beneficiarios por DNI 
|   |-- Panel de información del beneficiario 
|   |-- Botones para registrar desayuno/almuerzo 
|   |-- Historial de entregas del día
```

### b) Interfaces de Baja Fidelidad y Flujos

- **Flujo 1: Registrar una nueva entrega (Rol: Responsable de Comedor)**
    1.  El usuario ingresa a la vista "Control de Entregas".
    2.  Introduce el DNI del beneficiario en el campo de búsqueda.
    3.  El sistema muestra los datos del beneficiario y el estado de sus raciones del día (pendiente/entregado).
    4.  El usuario hace clic en "Registrar Desayuno" o "Registrar Almuerzo".
    5.  El sistema guarda la entrega, actualiza el estado a "Entregado" y añade el registro al historial del día.

- **Flujo 2: Registrar un nuevo beneficiario (Rol: Administrador)**
    1. El usuario va a la vista "Gestión de Beneficiarios".
    2. Rellena el formulario con DNI, nombre y selecciona un comedor de una lista desplegable.
    3. Hace clic en "Guardar".
    4. El sistema valida los datos y añade el nuevo beneficiario a la lista y al `LocalStorage`.

- **Flujo 3: Supervisar la jornada (Rol: Supervisor Zonal)**
    1. El usuario ingresa al "Dashboard".
    2. Observa las tarjetas de estadísticas para ver en tiempo real cuántos desayunos y almuerzos se han servido.
    3. Puede navegar a las otras vistas para ver detalles específicos.
