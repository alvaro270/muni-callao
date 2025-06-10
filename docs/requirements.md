# Documento de Requerimientos
## Sistema de Gestión de Comedores Populares - Municipalidad del Callao

### 1. Análisis del Problema

#### 1.1 Descripción del Negocio
La Municipalidad Provincial del Callao, a través de su Gerencia de Programas Sociales, gestiona comedores populares que brindan desayunos y almuerzos gratuitos a beneficiarios empadronados. El programa opera en:
- **Comedor Teresa Izquierdo**: 600 raciones diarias
- **Comedor Casa del Adulto Mayor (Bocanegra)**: 200 raciones diarias
- **Total de empadronados**: 1,500 beneficiarios

#### 1.2 Dolor Actual (Pain Points)
- **Gestión manual ineficiente**: Documentos físicos en estanterías ocupan espacio considerable
- **Búsqueda lenta**: Localizar información específica consume tiempo excesivo
- **Control precario**: Registros en Excel sin integración ni trazabilidad confiable
- **Riesgo de duplicados**: Sin validación automática de beneficiarios
- **Falta de estadísticas**: No hay reportes automatizados para toma de decisiones
- **Control de entregas deficiente**: No hay validación de "una ración por persona por día"

#### 1.3 Beneficios Esperados
- **Eficiencia operativa**: Reducción de tiempo en búsquedas y registros
- **Control automatizado**: Validación automática de entregas y duplicados
- **Trazabilidad completa**: Auditoría de todas las operaciones
- **Reportes en tiempo real**: Estadísticas para mejor gestión de recursos
- **Reducción de errores**: Eliminación de procesos manuales propensos a errores
- **Optimización de espacio**: Digitalización de archivos físicos

### 2. Definición del Alcance

#### 2.1 Funcionalidades Core (MVP)

##### A. Gestión de Beneficiarios
- Registro con DNI y foto
- Consulta y actualización de datos
- Verificación de duplicados
- Asignación a comedores

##### B. Control de Entrega de Raciones
- Registro diario de asistencia
- Validación: una ración por tipo por día
- Alertas de beneficiarios ya atendidos

##### C. Gestión de Comedores
- Registro de comedores y ubicaciones
- Asignación de responsables
- Control de capacidad

##### D. Panel de Administración
- Dashboard con estadísticas básicas
- Reportes por fecha y comedor
- Exportación a Excel/PDF

##### E. Gestión de Usuarios
- Roles: Administrador, Supervisor, Responsable
- Control de accesos básico

#### 2.2 Restricciones Técnicas
- **Frontend**: HTML, CSS, JavaScript básico
- **Tiempo de desarrollo**: Limitado por cronograma académico
- **Equipo**: 3 desarrolladores principiantes
- **Recursos**: Sin presupuesto para servicios externos premium
- **Hosting**: Gratuito o de bajo costo

#### 2.3 Entregables Mínimos
1. **Aplicación web funcional** con las 5 funcionalidades core
2. **Base de datos** con estructura definida
3. **Documentación técnica** básica
4. **Manual de usuario** simple
5. **Código fuente** documentado y versionado

### 3. Wireframes y Bocetos

#### 3.1 Mapa del Sitio
```
Sistema de Comedores Populares
├── Login/Autenticación
├── Dashboard Principal
│   ├── Estadísticas generales
│   └── Accesos rápidos
├── Gestión de Beneficiarios
│   ├── Listar beneficiarios
│   ├── Registrar nuevo
│   ├── Editar/Ver detalle
│   └── Buscar por DNI
├── Control de Entregas
│   ├── Registrar entrega
│   ├── Consultar entregas del día
│   └── Historial por beneficiario
├── Gestión de Comedores
│   ├── Listar comedores
│   ├── Registrar comedor
│   └── Asignar responsables
├── Reportes
│   ├── Entregas por fecha
│   ├── Estadísticas por comedor
│   └── Exportar datos
└── Administración
    ├── Gestión de usuarios
    └── Configuración general
```

#### 3.2 Interfaces de Baja Fidelidad

##### Dashboard Principal
```
+----------------------------------+
|  [Logo] Sistema Comedores   [Usuario] |
+----------------------------------+
| Resumen del día:                 |
| □ Raciones entregadas: 450/800   |
| □ Beneficiarios atendidos: 420   |
| □ Comedores activos: 2/2         |
+----------------------------------+
| Acciones rápidas:                |
| [Registrar Entrega] [Ver Reportes]|
+----------------------------------+
```

##### Registro de Beneficiario
```
+----------------------------------+
| Registrar Nuevo Beneficiario     |
+----------------------------------+
| DNI: [________] [Validar]        |
| Nombres: [________________]      |
| Apellidos: [______________]      |
| Teléfono: [___________]          |
| Dirección: [______________]      |
| Comedor asignado: [▼Seleccionar] |
| Foto: [Subir archivo]            |
| [Guardar] [Cancelar]             |
+----------------------------------+
```

##### Control de Entregas
```
+----------------------------------+
| Registrar Entrega de Ración      |
+----------------------------------+
| DNI Beneficiario: [______] [🔍]  |
| Nombre: Juan Pérez López         |
| Comedor: Teresa Izquierdo        |
| Tipo de ración:                  |
| ○ Desayuno ○ Almuerzo           |
| Estado: ✅ Disponible            |
| [Confirmar Entrega]              |
+----------------------------------+
```

#### 3.3 Flujos de Usuario

##### Flujo: Entrega de Ración
1. Usuario ingresa DNI del beneficiario
2. Sistema valida existencia en padrón
3. Sistema verifica si ya recibió ración del tipo solicitado
4. Si está disponible: confirma entrega
5. Sistema registra entrega con timestamp
6. Muestra confirmación al usuario

##### Flujo: Registro de Beneficiario
1. Usuario ingresa DNI
2. Sistema verifica que no existe duplicado
3. Usuario completa formulario
4. Sistema valida datos obligatorios
5. Usuario sube foto (opcional)
6. Sistema guarda registro
7. Asigna automáticamente a comedor según jurisdicción

### 4. Estructura del Documento

#### 4.1 Priorización de Funcionalidades
**Prioridad Alta (Sprint 1)**:
- Gestión básica de beneficiarios
- Control simple de entregas
- Dashboard básico

**Prioridad Media (Sprint 2)**:
- Gestión de comedores
- Reportes básicos
- Validaciones avanzadas

**Prioridad Baja (Sprint 3)**:
- Exportación de datos
- Gestión avanzada de usuarios
- Auditoría completa

#### 4.2 Consideraciones Técnicas
- **Base de datos**: SQLite para simplicidad inicial
- **Autenticación**: Sistema básico con sesiones
- **Responsive**: Mobile-first approach
- **Validaciones**: Frontend y backend
- **Backup**: Sistema básico de respaldo

#### 4.3 Cronograma Sugerido
- **Semana 1-2**: Diseño de BD y estructura del proyecto
- **Semana 3-4**: Desarrollo de funcionalidades core
- **Semana 5**: Integración y testing
- **Semana 6**: Documentación y entrega

### 5. Criterios de Éxito
- Sistema funcional con las 5 funcionalidades core
- Capacidad de gestionar 1,500 beneficiarios
- Tiempo de respuesta menor a 3 segundos
- Interfaz intuitiva para usuarios no técnicos
- Documentación completa para mantenimiento futuro
