# Gestor de Portafolio Profesional 📁

Sistema web para gestionar proyectos, habilidades y experiencia laboral con arquitectura en capas y Repository Pattern.

## 🎯 Características Principales

- ✅ **CRUD completo** para Proyectos, Habilidades y Experiencia Laboral
- ✅ **Arquitectura en Capas** con separación estricta de responsabilidades
- ✅ **Repository Pattern** para portabilidad de datos
- ✅ **Validaciones de negocio** (fechas, formatos de imagen, URLs)
- ✅ **Base de datos PostgreSQL** (local o en la nube con Neon)
- ✅ **UI moderna** con React, Next.js 15 y Tailwind CSS

---

## 🏗️ Arquitectura

Este proyecto implementa una **Arquitectura en Capas** enfocada en **Mantenibilidad**:

```
/core       → Lógica de negocio, entidades, interfaces
/data       → Implementación de repositorios, acceso a BD
/web        → API Routes, componentes UI, inyección de dependencias
```

📖 **[Ver documentación completa de arquitectura](ARQUITECTURA.md)**

---

## 🚀 Instalación y Configuración

### 1. Clonar y preparar el proyecto

```bash
# Instalar dependencias
pnpm install
```

### 2. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env.local
```

Editar `.env.local` con tu conexión a PostgreSQL:

```env
# Opción 1: PostgreSQL local
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio

# Opción 2: Neon (cloud)
DATABASE_URL=postgresql://user:password@host.neon.tech/neondb?sslmode=require
```

### 3. Crear las tablas en la base de datos

Ejecuta el script SQL en tu base de datos:

```bash
psql -d portfolio -f scripts/001-create-tables.sql
```

O copia el contenido de `scripts/001-create-tables.sql` en Neon SQL Editor si usas Neon.

### 4. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📂 Estructura del Proyecto

```
├── core/                    # 🧠 Capa de Dominio
│   ├── entities/            # Modelos de dominio (Project, Skill, Experience)
│   ├── interfaces/          # Interfaces de repositorio (contratos)
│   ├── services/            # Lógica de negocio y casos de uso
│   └── validators/          # Validaciones con Zod
│
├── data/                    # 💾 Capa de Persistencia
│   ├── repositories/        # Implementaciones de repositorios (Neon)
│   └── db.ts                # Cliente de conexión a PostgreSQL
│
├── web/                     # 🌐 Capa Web
│   └── container.ts         # Inyección de dependencias (DI)
│
├── app/                     # Next.js App Router
│   ├── api/                 # API Routes (endpoints CRUD)
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página principal
│
├── components/              # Componentes React
│   ├── ui/                  # Componentes base (shadcn/ui)
│   ├── projects-section.tsx
│   ├── skills-section.tsx
│   └── experiences-section.tsx
│
└── scripts/                 # Scripts SQL
    └── 001-create-tables.sql
```

---

## 🔄 Repository Pattern

### Interfaz (Core)

```typescript
// core/interfaces/project-repository.ts
export interface ProjectRepository {
  findAll(): Promise<Project[]>;
  create(data: CreateProjectDTO): Promise<Project>;
}
```

### Implementación (Data)

```typescript
// data/repositories/neon-project-repository.ts
export class NeonProjectRepository implements ProjectRepository {
  async findAll(): Promise<Project[]> {
    return await sql`SELECT * FROM projects`;
  }
}
```

### Inyección (Web)

```typescript
// web/container.ts
const projectRepository = new NeonProjectRepository();
export const projectService = new ProjectService(projectRepository);
```

### Uso en API Route

```typescript
// app/api/projects/route.ts
import { projectService } from "@/web/container";

export async function GET() {
  const projects = await projectService.getAllProjects();
  return NextResponse.json(projects);
}
```

---

## 🎯 Endpoints API

### Proyectos

- `GET /api/projects` - Listar todos
- `POST /api/projects` - Crear nuevo
- `GET /api/projects/[id]` - Obtener por ID
- `PUT /api/projects/[id]` - Actualizar
- `DELETE /api/projects/[id]` - Eliminar

### Habilidades

- `GET /api/skills` - Listar todas
- `POST /api/skills` - Crear nueva
- `GET /api/skills/[id]` - Obtener por ID
- `PUT /api/skills/[id]` - Actualizar
- `DELETE /api/skills/[id]` - Eliminar

### Experiencias

- `GET /api/experiences` - Listar todas
- `POST /api/experiences` - Crear nueva
- `GET /api/experiences/[id]` - Obtener por ID
- `PUT /api/experiences/[id]` - Actualizar
- `DELETE /api/experiences/[id]` - Eliminar

---

## ✅ Validaciones Implementadas

### Proyectos

- ✅ Título: requerido, máx. 255 caracteres
- ✅ Descripción: requerida
- ✅ Imagen: formatos `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`
- ✅ URLs: validación de formato
- ✅ Fechas: `endDate` debe ser posterior a `startDate`

### Habilidades

- ✅ Nombre: requerido
- ✅ Nivel: "básico" | "intermedio" | "avanzado"

### Experiencia

- ✅ Empresa: requerida
- ✅ Posición: requerida
- ✅ Fechas: `endDate` debe ser posterior a `startDate`

---

## 🔧 Tecnologías

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, Tailwind CSS, shadcn/ui
- **Database:** PostgreSQL (Neon)
- **Validación:** Zod
- **State Management:** SWR
- **TypeScript:** Strict mode

---

## 🧪 Cambiar de Base de Datos

Para cambiar de PostgreSQL a otra base de datos (ej: MongoDB):

1. Crear nuevas implementaciones en `/data/repositories`
2. Actualizar `web/container.ts` para usar las nuevas implementaciones
3. Actualizar `data/db.ts` con el nuevo cliente

**✅ NO se modifica:**

- `/core` (lógica de negocio)
- `/app/api` (endpoints)
- `/components` (UI)

---

## 📝 Scripts SQL

Ubicación: `scripts/001-create-tables.sql`

Crea las siguientes tablas:

- `projects` - Proyectos del portafolio
- `skills` - Habilidades técnicas
- `experiences` - Experiencia laboral

---

## 👨‍💻 Desarrollo

```bash
# Modo desarrollo
pnpm dev

# Build de producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Linter
pnpm lint
```

---

## 📄 Licencia

Este proyecto fue desarrollado como ejercicio académico de Arquitectura de Software enfocado en **Mantenibilidad** y **Repository Pattern**.

---

## 📚 Recursos

- [Documentación de Arquitectura](ARQUITECTURA.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Neon PostgreSQL](https://neon.tech)
- [shadcn/ui](https://ui.shadcn.com)
