# Arquitectura del Proyecto - Gestor de Portafolio Profesional

## 📐 Estilo Arquitectónico: Arquitectura en Capas

Este proyecto implementa una **Arquitectura en Capas** estricta con el **Repository Pattern** para garantizar la **mantenibilidad** y **portabilidad** del código.

---

## 🏗️ Estructura de Capas

### 1️⃣ `/core` - Capa de Dominio (Business Logic)

**Responsabilidad:** Contiene toda la lógica de negocio, reglas de validación y modelos de dominio.

**Contenido:**

- **`/entities`**: Modelos de dominio (Project, Skill, Experience)
- **`/interfaces`**: Interfaces de repositorio (contratos)
- **`/services`**: Casos de uso y lógica de negocio
- **`/validators`**: Validaciones de dominio (Zod schemas)

**Reglas:**

- ❌ NO puede depender de `/data` ni `/web`
- ❌ NO puede contener código de base de datos
- ❌ NO puede contener código HTTP
- ✅ Solo contiene lógica de negocio pura

**Ejemplo de flujo:**

```typescript
// core/services/project-service.ts
export class ProjectService {
  constructor(private readonly repository: ProjectRepository) {}

  async createProject(data: CreateProjectDTO): Promise<Project> {
    // Validar reglas de negocio
    const validated = createProjectSchema.parse(data);
    // Delegar persistencia al repositorio
    return this.repository.create(validated);
  }
}
```

---

### 2️⃣ `/data` - Capa de Persistencia (Data Access)

**Responsabilidad:** Implementa el acceso a datos y la persistencia.

**Contenido:**

- **`/repositories`**: Implementaciones concretas de los repositorios
- **`db.ts`**: Cliente de conexión a la base de datos

**Reglas:**

- ✅ Implementa las interfaces definidas en `/core/interfaces`
- ✅ Puede depender de `/core` (para usar interfaces y entidades)
- ❌ NO puede ser accedido directamente por `/web`

**Cambiar de BD:** Solo se modifica esta capa

```typescript
// data/repositories/neon-project-repository.ts
export class NeonProjectRepository implements ProjectRepository {
  async findAll(): Promise<Project[]> {
    return await sql`SELECT * FROM projects`;
  }
}

// Para cambiar a MongoDB, creas:
// data/repositories/mongo-project-repository.ts
export class MongoProjectRepository implements ProjectRepository {
  async findAll(): Promise<Project[]> {
    return await mongoClient.db().collection("projects").find().toArray();
  }
}
```

---

### 3️⃣ `/web` - Capa de Presentación (Web Layer)

**Responsabilidad:** Expone la funcionalidad a través de APIs y maneja la inyección de dependencias.

**Contenido:**

- **`container.ts`**: Inyección de dependencias (DI Container)
- **`/app/api`**: API Routes de Next.js (controladores HTTP)
- **`/components`**: Componentes de UI React

**Reglas:**

- ✅ Solo se comunica con `/core` a través del container
- ❌ Nunca accede directamente a `/data`
- ✅ Usa los servicios inyectados desde el container

**Ejemplo de endpoint:**

```typescript
// app/api/projects/route.ts
import { projectService } from "@/web/container";

export async function GET() {
  const projects = await projectService.getAllProjects();
  return NextResponse.json(projects);
}
```

---

## 🔄 Repository Pattern

### Definición en Core (Interfaz)

```typescript
// core/interfaces/project-repository.ts
export interface ProjectRepository {
  findAll(): Promise<Project[]>;
  create(data: CreateProjectDTO): Promise<Project>;
  // ...
}
```

### Implementación en Data

```typescript
// data/repositories/neon-project-repository.ts
export class NeonProjectRepository implements ProjectRepository {
  async findAll(): Promise<Project[]> {
    return await sql`SELECT * FROM projects`;
  }
}
```

### Inyección en Web

```typescript
// web/container.ts
const projectRepository = new NeonProjectRepository();
export const projectService = new ProjectService(projectRepository);
```

---

## 🎯 Atributo de Calidad: Mantenibilidad

### Cambio de Base de Datos (Ejemplo Real)

**Escenario:** Migrar de Neon PostgreSQL a MongoDB

**Archivos a modificar:**

1. ✅ Crear nuevas implementaciones en `/data/repositories/*-mongo-repository.ts`
2. ✅ Actualizar `web/container.ts` para usar las nuevas implementaciones
3. ✅ Actualizar `data/db.ts` para conectarse a MongoDB

**Archivos que NO se tocan:**

- ❌ `/core` (entidades, interfaces, servicios, validadores)
- ❌ `/app/api` (endpoints HTTP)
- ❌ `/components` (UI)

**Total de cambios:** ~3-5 archivos en lugar de toda la aplicación.

---

## 📋 Validaciones de Dominio

Las validaciones viven en `/core/validators`:

- ✅ **Fechas:** `endDate` debe ser posterior a `startDate`
- ✅ **Imágenes:** Solo formatos `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`
- ✅ **URLs:** Validación de formato con Zod
- ✅ **Campos requeridos:** `title`, `description`, etc.

```typescript
// core/validators/project-validator.ts
export const createProjectSchema = z
  .object({
    title: z.string().min(1).max(255),
    imageUrl: z.string().refine(isValidImageUrl),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
  })
  .refine((data) => isEndDateAfterStart(data.startDate, data.endDate));
```

---

## 🚀 Flujo de Datos Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                         CAPA WEB                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │  Componente  │ ───▶ │  API Route   │ ───▶ │  Container   │  │
│  │    React     │      │ (endpoint)   │      │     (DI)     │  │
│  └──────────────┘      └──────────────┘      └──────┬───────┘  │
└─────────────────────────────────────────────────────┼───────────┘
                                                       │
                                                       │ Inyecta
                                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                         CAPA CORE                                │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Service    │ ───▶ │  Validator   │      │  Repository  │  │
│  │  (lógica)    │      │  (reglas)    │      │  Interface   │  │
│  └──────┬───────┘      └──────────────┘      └──────▲───────┘  │
│         │                                            │           │
└─────────┼────────────────────────────────────────────┼───────────┘
          │                                            │
          │ Usa                                        │ Define contrato
          ▼                                            │
┌─────────────────────────────────────────────────────┼───────────┐
│                         CAPA DATA                    │           │
│  ┌──────────────┐      ┌──────────────┐      ┌──────┴───────┐  │
│  │   DB Client  │ ◀─── │ NeonProject  │ ───▶ │   Implements │  │
│  │   (Neon)     │      │  Repository  │      │  ProjectRepo │  │
│  └──────────────┘      └──────────────┘      └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologías por Capa

| Capa    | Tecnologías                           |
| ------- | ------------------------------------- |
| `/core` | TypeScript puro, Zod (validación)     |
| `/data` | Neon PostgreSQL, SQL tagged templates |
| `/web`  | Next.js 15, React, API Routes, SWR    |

---

## 📝 Notas Importantes

1. **Convenciones de Next.js:** Los API routes viven en `app/api` por convención del framework, pero son parte de la capa web.

2. **Inyección de Dependencias:** El archivo `web/container.ts` es el **único punto** donde `/data` y `/core` se conectan.

3. **Portabilidad:** Al usar variables de entorno (`DATABASE_URL`), el proyecto puede cambiar de base de datos local a cloud sin modificar código.

4. **Testing:** Cada capa puede probarse independientemente:
   - Core: tests unitarios puros
   - Data: tests de integración con BD
   - Web: tests de API con mocks de servicios

---

## 🎓 Conclusión

Esta arquitectura garantiza:

- ✅ **Mantenibilidad:** Cambios aislados por capa
- ✅ **Testabilidad:** Cada capa es testeable independientemente
- ✅ **Escalabilidad:** Fácil agregar nuevas entidades siguiendo el patrón
- ✅ **Portabilidad:** Cambiar BD sin tocar lógica de negocio
