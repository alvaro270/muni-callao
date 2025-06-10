# Historias de Usuario
## Sistema de Gestión de Comedores Populares

### Historia de Usuario 1: Registrar Beneficiario
**Como** administrador del comedor
**Quiero** registrar nuevos beneficiarios con su información personal y foto
**Para** mantener un padrón actualizado y evitar duplicados

#### Criterios de Aceptación:
1. **Dado** que soy un administrador autenticado
   **Cuando** ingreso un DNI nuevo en el formulario de registro
   **Entonces** el sistema me permite completar todos los datos del beneficiario

2. **Dado** que intento registrar un DNI que ya existe
   **Cuando** envío el formulario
   **Entonces** el sistema muestra un mensaje de error indicando que el beneficiario ya está registrado

3. **Dado** que completo todos los campos obligatorios
   **Cuando** subo una foto del beneficiario
   **Entonces** el sistema guarda la imagen y crea el registro exitosamente

#### Notas Técnicas:
- **Componentes**: FormularioBeneficiario, ValidadorDNI, SubidorImagen
- **Modelos**: Beneficiario {id, dni, nombres, apellidos, telefono, direccion, comedor_id, foto, fecha_registro}
- **Validaciones**: DNI único, campos obligatorios, formato de imagen

---

### Historia de Usuario 2: Controlar Entrega de Raciones
**Como** responsable del comedor
**Quiero** registrar la entrega de raciones diarias a beneficiarios
**Para** controlar que cada persona reciba máximo una ración por tipo por día

#### Criterios de Aceptación:
1. **Dado** que ingreso el DNI de un beneficiario válido
   **Cuando** selecciono el tipo de ración (desayuno o almuerzo)
   **Entonces** el sistema verifica si ya recibió esa ración el día actual

2. **Dado** que el beneficiario no ha recibido la ración solicitada hoy
   **Cuando** confirmo la entrega
   **Entonces** el sistema registra la entrega con fecha, hora y usuario

3. **Dado** que el beneficiario ya recibió esa ración hoy
   **Cuando** intento registrar otra entrega del mismo tipo
   **Entonces** el sistema muestra una alerta y no permite la entrega

#### Notas Técnicas:
- **Componentes**: BuscadorBeneficiario, ControlEntrega, ValidadorRacion
- **Modelos**: Entrega {id, beneficiario_id, tipo_racion, fecha, hora, usuario_id, comedor_id}
- **Validaciones**: Una ración por tipo por día, beneficiario activo

---

### Historia de Usuario 3: Gestionar Comedores
**Como** supervisor municipal
**Quiero** administrar la información de los comedores y sus responsables
**Para** mantener control sobre las ubicaciones y capacidades de atención

#### Criterios de Aceptación:
1. **Dado** que soy un supervisor autenticado
   **Cuando** registro un nuevo comedor
   **Entonces** el sistema guarda la ubicación, capacidad y responsable asignado

2. **Dado** que visualizo la lista de comedores
   **Cuando** selecciono un comedor específico
   **Entonces** puedo ver sus estadísticas de atención y modificar su información

3. **Dado** que asigno un responsable a un comedor
   **Cuando** guardo los cambios
   **Entonces** el responsable puede acceder al control de entregas de ese comedor únicamente

#### Notas Técnicas:
- **Componentes**: FormularioComedor, ListaComedores, AsignadorResponsable
- **Modelos**: Comedor {id, nombre, direccion, capacidad_maxima, responsable_id, activo}
- **Relaciones**: Comedor-Usuario (responsable), Comedor-Beneficiario

---

### Historia de Usuario 4: Visualizar Dashboard de Estadísticas
**Como** administrador general
**Quiero** ver un resumen de las actividades diarias en tiempo real
**Para** tomar decisiones informadas sobre la gestión de los comedores

#### Criterios de Aceptación:
1. **Dado** que accedo al dashboard principal
   **Cuando** la página se carga
   **Entonces** veo el resumen del día actual: raciones entregadas, beneficiarios atendidos, comedores activos

2. **Dado** que selecciono un rango de fechas
   **Cuando** aplico los filtros
   **Entonces** las estadísticas se actualizan mostrando los datos del período seleccionado

3. **Dado** que visualizo las estadísticas por comedor
   **Cuando** hago clic en un comedor específico
   **Entonces** veo el detalle de entregas y beneficiarios de ese comedor

#### Notas Técnicas:
- **Componentes**: Dashboard, GraficosEstadisticas, FiltrosFecha
- **Consultas**: Agregaciones por fecha, comedor y tipo de ración
- **Visualización**: Gráficos simples con JavaScript vanilla o Chart.js

---

### Historia de Usuario 5: Generar Reportes
**Como** supervisor municipal
**Quiero** exportar reportes de entregas y beneficiarios
**Para** presentar informes a las autoridades municipales

#### Criterios de Aceptación:
1. **Dado** que selecciono un período de tiempo
   **Cuando** genero un reporte de entregas
   **Entonces** el sistema crea un archivo Excel con todos los registros del período

2. **Dado** que filtro por comedor específico
   **Cuando** exporto el reporte
   **Entonces** el archivo contiene solo los datos del comedor seleccionado

3. **Dado** que genero un reporte de beneficiarios
   **Cuando** descargo el archivo
   **Entonces** incluye información personal, comedor asignado y estadísticas de asistencia

#### Notas Técnicas:
- **Componentes**: GeneradorReportes, ExportadorExcel, FiltrosAvanzados
- **Librerías**: SheetJS para exportación a Excel
- **Formatos**: Excel (.xlsx), PDF (opcional)

---

### Historia de Usuario 6: Gestionar Usuarios del Sistema
**Como** administrador general
**Quiero** crear y administrar cuentas de usuario con diferentes roles
**Para** controlar el acceso al sistema según las responsabilidades de cada persona

#### Criterios de Aceptación:
1. **Dado** que creo un nuevo usuario
   **Cuando** asigno un rol (Administrador, Supervisor, Responsable)
   **Entonces** el usuario accede solo a las funcionalidades correspondientes a su rol

2. **Dado** que un usuario olvida su contraseña
   **Cuando** solicita restablecerla
   **Entonces** el sistema permite cambiar la contraseña con validación de identidad

3. **Dado** que reviso la actividad de usuarios
   **Cuando** accedo al log de acciones
   **Entonces** veo quién realizó cada operación y cuándo

#### Notas Técnicas:
- **Componentes**: GestionUsuarios, SistemaRoles, LogActividades
- **Modelos**: Usuario {id, username, email, password_hash, rol, activo, ultimo_acceso}
- **Seguridad**: Hash de contraseñas, sesiones, validación de permisos

---

### Historia de Usuario 7: Buscar y Actualizar Beneficiarios
**Como** responsable del comedor
**Quiero** buscar beneficiarios por DNI o nombre y actualizar su información
**Para** mantener los datos actualizados y resolver consultas rápidamente

#### Criterios de Aceptación:
1. **Dado** que ingreso un DNI o nombre en el buscador
   **Cuando** ejecuto la búsqueda
   **Entonces** el sistema muestra todos los beneficiarios que coinciden con el criterio

2. **Dado** que selecciono un beneficiario de los resultados
   **Cuando** accedo a su perfil
   **Entonces** puedo ver su historial de entregas y modificar sus datos personales

3. **Dado** que actualizo información de un beneficiario
   **Cuando** guardo los cambios
   **Entonces** el sistema registra la modificación con fecha y usuario que la realizó

#### Notas Técnicas:
- **Componentes**: BuscadorBeneficiarios, PerfilBeneficiario, EditorDatos
- **Funcionalidades**: Búsqueda por texto, autocompletado, historial de cambios
- **Validaciones**: Campos obligatorios, formato de datos, permisos de edición

---

### Historia de Usuario 8: Validar Beneficiarios por Foto
**Como** responsable del comedor
**Quiero** ver la foto del beneficiario al registrar una entrega
**Para** verificar la identidad de la persona y evitar suplantaciones

#### Criterios de Aceptación:
1. **Dado** que ingreso el DNI de un beneficiario
   **Cuando** el sistema lo encuentra
   **Entonces** muestra la foto registrada junto con los datos personales

2. **Dado** que la foto no coincide con la persona presente
   **Cuando** verifico la identidad
   **Entonces** puedo cancelar la entrega y reportar la incidencia

3. **Dado** que un beneficiario no tiene foto registrada
   **Cuando** realizo la entrega
   **Entonces** el sistema muestra una alerta indicando que falta la foto

#### Notas Técnicas:
- **Componentes**: VisualizadorFoto, ValidadorIdentidad, ReportIncidencias
- **Almacenamiento**: Imágenes optimizadas, carga rápida
- **Fallback**: Placeholder cuando no hay foto disponible
