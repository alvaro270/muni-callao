# Historias de Usuario - ComedorDigital
## Módulo: Gestión de Comedores
### Historia de Usuario: Registrar un nuevo comedor
**Como** administrador del sistema,

**Quiero** poder añadir la información de un nuevo comedor (nombre, dirección, capacidad, etc.),

**Para** mantener el listado de comedores actualizado y disponible para la asignación de beneficiarios.

### Criterios de Aceptación:
1. **Dado** que estoy en la vista de "Gestión de Comedores",

    **Cuando** relleno el formulario con datos válidos y hago clic en "Guardar",

    **Entonces** el nuevo comedor debe aparecer en la lista de comedores y persistir en LocalStorage.

2. **Dado** que intento guardar un comedor sin un nombre o dirección,

    **Cuando** hago clic en "Guardar",

    **Entonces** el sistema debe mostrarme un mensaje de error indicando los campos obligatorios.

### Notas Técnicas:
* Componentes: Formulario modal, tabla de comedores.

* Modelo de Datos (comedor): ```{ id: number, nombre: string, direccion: string, capacidad: number, responsable: string, telefono: string, estado: 'Activo' | 'Inactivo' }```

* Interacciones: El botón "Agregar Comedor" abre el modal. El botón "Guardar" del modal valida y guarda los datos.

## Módulo: Gestión de Beneficiarios
### Historia de Usuario: Registrar un nuevo beneficiario
**Como** personal administrativo,

**Quiero** registrar a un nuevo beneficiario con su DNI, nombre y asignarle un comedor existente,

**Para** que pueda recibir las raciones de alimentos.

### Criterios de Aceptación:
1. **Dado** que estoy en la vista de "Gestión de Beneficiarios",

    **Cuando** completo el formulario y selecciono un comedor de la lista desplegable,

    **Entonces** el nuevo beneficiario se guarda y aparece en la tabla de registrados.

2. **Dado** que intento registrar un DNI que ya existe,

    **Cuando** hago clic en "Guardar",

    **Entonces** el sistema debe mostrar un error de duplicado.

### Notas Técnicas:
* Componentes: Formulario de registro, lista desplegable (```<select>```) de comedores, tabla de beneficiarios.

* Modelo de Datos (beneficiario): ```{ dni: string, nombre: string, comedor: {id: number, nombre: string}, estado: 'Activo' | 'Inactivo', fechaRegistro: string }```

* Interacciones: La lista desplegable debe cargarse dinámicamente con los comedores activos desde ```LocalStorage```.

## Módulo: Control de Entregas
### Historia de Usuario: Registrar entrega de ración
**Como** responsable de un comedor,

**Quiero** buscar a un beneficiario por DNI y registrar la entrega de su desayuno o almuerzo con un solo clic,

**Para** agilizar el proceso de atención y evitar largas colas.

### Criterios de Aceptación:
1. **Dado** que he buscado un DNI válido,

    **Cuando** hago clic en el botón "Registrar Desayuno",

    **Entonces** el estado del desayuno cambia a "Entregado" y el botón se deshabilita.

2. **Dado** que un beneficiario ya ha recibido su almuerzo hoy,

    **Cuando** busco su DNI,

    **Entonces** el botón "Registrar Almuerzo" debe aparecer deshabilitado desde el inicio.

### Notas Técnicas:
* Componentes: Campo de búsqueda, panel de información de beneficiario, botones de acción, tabla de historial.

* Modelo de Datos (entrega): ```{ id: string, dni: string, beneficiarioNombre: string, comedor: {id: number, nombre: string}, tipo: 'desayuno' | 'almuerzo', fechaISO: string }```

* Interacciones: La búsqueda se activa al presionar "Enter" o hacer clic en "Buscar". El historial se actualiza en tiempo real.

## Módulo: Dashboard
### Historia de Usuario: Visualizar resumen diario
**Como** supervisor zonal,

**Quiero** ver en un dashboard principal las estadísticas totales de raciones entregadas en el día,

**Para** tener una visión rápida del rendimiento del programa sin necesidad de revisar reportes detallados.

### Criterios de Aceptación:
1. **Dado** que cargo la página del Dashboard,

    **Cuando** la página se muestra,
    
    **Entonces** debo ver tres tarjetas con los totales de "Desayunos Entregados", "Almuerzos Entregados" y "Total Raciones" del día actual.

2. **Dado** que se registra una nueva entrega en la vista de "Control de Entregas",

    **Cuando** regreso al Dashboard y recargo la página,

    **Entonces** las estadísticas deben estar actualizadas para reflejar esa nueva entrega.

### Notas Técnicas:
* Componentes: Tarjetas de estadísticas.

* Modelo de Datos: Lectura agregada del array de ```entregas``` en ```LocalStorage```, filtrando por la fecha actual.

* Interacciones: Los datos se calculan al cargar la página.
