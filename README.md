# Sistema de Gestión de Comedores Populares
## Municipalidad Provincial del Callao

### 📋 Descripción General

Sistema web integral para la gestión de comedores populares que permite administrar beneficiarios, controlar entregas de raciones y generar reportes estadísticos. Desarrollado para digitalizar y optimizar los procesos de asistencia alimentaria de la Municipalidad del Callao.

**Beneficiarios actuales:**
- 🏠 Comedor Teresa Izquierdo: 600 raciones diarias
- 👴 Casa del Adulto Mayor (Bocanegra): 200 raciones diarias
- 👥 Total de empadronados: 1,500 beneficiarios

### 🚀 Funcionalidades Principales

#### 🔐 Gestión de Usuarios
- Sistema de autenticación con roles diferenciados
- Tres niveles de acceso: Administrador, Supervisor, Responsable
- Control de permisos por funcionalidad

#### 👥 Gestión de Beneficiarios
- Registro completo con DNI y fotografía
- Búsqueda avanzada por DNI o nombre
- Validación automática de duplicados
- Actualización de datos personales

#### 🍽️ Control de Entregas
- Registro diario de raciones (desayuno/almuerzo)
- Validación: una ración por tipo por día
- Verificación de identidad mediante foto
- Alertas automáticas de entregas duplicadas

#### 🏢 Gestión de Comedores
- Administración de ubicaciones y capacidades
- Asignación de responsables por comedor
- Control de inventario de raciones

#### 📊 Panel de Estadísticas
- Dashboard en tiempo real
- Reportes por fecha, comedor y tipo de ración
- Exportación a Excel y PDF
- Gráficos de tendencias de atención

#### 🔍 Auditoría y Trazabilidad
- Registro completo de todas las operaciones
- Historial de modificaciones
- Log de accesos de usuarios

### 🛠️ Tecnologías Utilizadas

#### Frontend
- **HTML5**: Estructura semántica y accessibility
- **CSS3**: Diseño responsivo con Flexbox/Grid
- **JavaScript ES6+**: Lógica de interfaz y validaciones
- **Chart.js**: Visualización de estadísticas (opcional)

#### Backend
- **Node.js**: Servidor web y API REST
- **Express.js**: Framework para endpoints
- **SQLite**: Base de datos ligera y portable
- **Multer**: Manejo de archivos (fotos)

#### Herramientas de Desarrollo
- **Git**: Control de versiones
- **Visual Studio Code**: Editor de código
- **Postman**: Testing de API (opcional)
- **DB Browser for SQLite**: Administración de base de datos

### 📁 Estructura del Proyecto

```
comedores-populares/
├── 📁 frontend/
│   ├── 📁 css/
│   │   ├── styles.css
│   │   └── dashboard.css
│   ├── 📁 js/
│   │   ├── app.js
│   │   ├── beneficiarios.js
│   │   ├── entregas.js
│   │   └── reportes.js
│   ├── 📁 images/
│   │   └── beneficiarios/
│   └── 📁 pages/
│       ├── index.html
│       ├── dashboard.html
│       ├── beneficiarios.html
│       ├── entregas.html
│       └── reportes.html
├── 📁 backend/
│   ├── 📁 routes/
│   │   ├── auth.js
│   │   ├── beneficiarios.js
│   │   ├── entregas.js
│   │   └── reportes.js
│   ├── 📁 models/
│   │   ├── database.js
│   │   └── schemas.sql
│   ├── 📁 middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── 📁 uploads/
│   └── server.js
├── 📁 docs/
│   ├── requerimientos.md
│   ├── user-stories.md
│   └── manual-usuario.md
├── 📁 database/
│   └── comedores.db
├── package.json
├── .gitignore
└── README.md
```

### 🔧 Instalación y Configuración

#### Prerrequisitos
- Node.js v14 o superior
- npm o yarn
- Git

#### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/comedores-populares.git
cd comedores-populares
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar base de datos**
```bash
npm run init-db
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

5. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- API: http://localhost:3000/api

#### Variables de Entorno
Crear archivo `.env` con:
```
PORT=3000
DB_PATH=./database/comedores.db
JWT_SECRET=tu_clave_secreta_aqui
UPLOAD_PATH=./backend/uploads
```

### 👥 Equipo de Desarrollo

- **Líder Técnico**: [Tu nombre]
- **Desarrollador Frontend**: [Nombre compañero 1]
- **Desarrollador Backend**: [Nombre compañero 2]

### 📅 Cronograma de Desarrollo

#### Sprint 1 (Semanas 1-2)
- ✅ Diseño de base de datos
- ✅ Estructura del proyecto
- ✅ Sistema de autenticación básico
- ✅ CRUD de beneficiarios

#### Sprint 2 (Semanas 3-4)
- 🔄 Control de entregas
- 🔄 Gestión de comedores
- 🔄 Dashboard básico
- 🔄 Validaciones frontend/backend

#### Sprint 3 (Semanas 5-6)
- ⏳ Sistema de reportes
- ⏳ Exportación de datos
- ⏳ Testing y corrección de bugs
- ⏳ Documentación final

### 🎯 Objetivos de Aprendizaje

#### Técnicos
- Desarrollo full-stack con tecnologías web estándar
- Diseño de bases de datos relacionales
- Implementación de API REST
- Manejo de autenticación y autorización
- Validación de datos frontend y backend

#### Blandos
- Liderazgo técnico de equipo
- Gestión de proyecto con metodología ágil
- Comunicación efectiva con stakeholders
- Resolución de problemas en equipo
- Documentación técnica profesional

### 📊 Métricas de Éxito

- ✅ Sistema funcional con 5 funcionalidades core
- ✅ Capacidad para 1,500 beneficiarios
- ✅ Tiempo de respuesta < 3 segundos
- ✅ Interfaz intuitiva para usuarios no técnicos
- ✅ Cobertura de testing > 70%
- ✅ Documentación completa

### 🤝 Contribuciones

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

### 📞 Contacto

Para consultas sobre el proyecto:
- **Email**: [tu-email@universidad.edu.pe]
- **GitHub**: [tu-usuario-github]

### 🙏 Agradecimientos

- Municipalidad Provincial del Callao por proporcionar la problemática real
- Profesores y mentores por el apoyo técnico
- Comunidad de desarrolladores por recursos y documentación
