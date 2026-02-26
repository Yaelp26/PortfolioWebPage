# Cómo Agregar una Nueva Entidad al Sistema

Esta guía muestra cómo extender el sistema siguiendo la arquitectura en capas y el Repository Pattern.

## 📝 Ejemplo: Agregar entidad "Certifications" (Certificaciones)

---

## Paso 1: Definir la Entidad en `/core/entities`

```typescript
// core/entities/certification.ts

/**
 * Certification Entity - Domain model for professional certifications.
 */
export interface Certification {
  id: number;
  name: string;
  issuer: string; // Organización emisora (ej: "AWS", "Google")
  issueDate: string;
  expiryDate: string | null; // null si no expira
  credentialUrl: string | null;
  credentialId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificationDTO {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialUrl?: string | null;
  credentialId?: string | null;
}

export interface UpdateCertificationDTO {
  name?: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string | null;
  credentialUrl?: string | null;
  credentialId?: string | null;
}
```

---

## Paso 2: Crear la Interfaz del Repositorio en `/core/interfaces`

```typescript
// core/interfaces/certification-repository.ts

import type {
  Certification,
  CreateCertificationDTO,
  UpdateCertificationDTO,
} from "../entities/certification";

/**
 * CertificationRepository Interface - Defines the contract for certification data access.
 * Implementations live in /data layer.
 */
export interface CertificationRepository {
  findAll(): Promise<Certification[]>;
  findById(id: number): Promise<Certification | null>;
  create(data: CreateCertificationDTO): Promise<Certification>;
  update(
    id: number,
    data: UpdateCertificationDTO,
  ): Promise<Certification | null>;
  delete(id: number): Promise<boolean>;
}
```

---

## Paso 3: Crear Validadores en `/core/validators`

```typescript
// core/validators/certification-validator.ts

import { z } from "zod";

/**
 * Validates that expiry date is after issue date.
 */
function isExpiryAfterIssue(
  issueDate: string,
  expiryDate: string | null | undefined,
): boolean {
  if (!expiryDate) return true;
  return new Date(expiryDate) >= new Date(issueDate);
}

export const createCertificationSchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio").max(255),
    issuer: z.string().min(1, "El emisor es obligatorio").max(255),
    issueDate: z.string().min(1, "La fecha de emisión es obligatoria"),
    expiryDate: z.string().nullable().optional(),
    credentialUrl: z.string().url("URL inválida").nullable().optional(),
    credentialId: z.string().max(255).nullable().optional(),
  })
  .refine((data) => isExpiryAfterIssue(data.issueDate, data.expiryDate), {
    message: "La fecha de expiración debe ser posterior a la fecha de emisión",
    path: ["expiryDate"],
  });

export const updateCertificationSchema = createCertificationSchema.partial();
```

---

## Paso 4: Crear el Servicio en `/core/services`

```typescript
// core/services/certification-service.ts

import type {
  Certification,
  CreateCertificationDTO,
  UpdateCertificationDTO,
} from "../entities/certification";
import type { CertificationRepository } from "../interfaces/certification-repository";
import {
  createCertificationSchema,
  updateCertificationSchema,
} from "../validators/certification-validator";

/**
 * CertificationService - Business logic for managing certifications.
 * Receives repository through dependency injection.
 */
export class CertificationService {
  constructor(private readonly repository: CertificationRepository) {}

  async getAllCertifications(): Promise<Certification[]> {
    return this.repository.findAll();
  }

  async getCertificationById(id: number): Promise<Certification | null> {
    return this.repository.findById(id);
  }

  async createCertification(
    data: CreateCertificationDTO,
  ): Promise<Certification> {
    const validated = createCertificationSchema.parse(data);
    return this.repository.create(validated);
  }

  async updateCertification(
    id: number,
    data: UpdateCertificationDTO,
  ): Promise<Certification | null> {
    const validated = updateCertificationSchema.parse(data);
    return this.repository.update(id, validated);
  }

  async deleteCertification(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}
```

---

## Paso 5: Crear Tabla en la Base de Datos

```sql
-- scripts/002-add-certifications.sql

CREATE TABLE IF NOT EXISTS certifications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_url TEXT,
  credential_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_certifications_issue_date ON certifications(issue_date DESC);
```

---

## Paso 6: Implementar el Repositorio en `/data/repositories`

```typescript
// data/repositories/neon-certification-repository.ts

import type {
  Certification,
  CreateCertificationDTO,
  UpdateCertificationDTO,
} from "@/core/entities/certification";
import type { CertificationRepository } from "@/core/interfaces/certification-repository";
import { sql } from "../db";

/**
 * Maps database row to Certification entity.
 */
function mapRowToCertification(row: Record<string, unknown>): Certification {
  return {
    id: row.id as number,
    name: row.name as string,
    issuer: row.issuer as string,
    issueDate: String(row.issue_date),
    expiryDate: row.expiry_date ? String(row.expiry_date) : null,
    credentialUrl: (row.credential_url as string) || null,
    credentialId: (row.credential_id as string) || null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

/**
 * NeonCertificationRepository - PostgreSQL implementation.
 */
export class NeonCertificationRepository implements CertificationRepository {
  async findAll(): Promise<Certification[]> {
    const rows = await sql`
      SELECT * FROM certifications 
      ORDER BY issue_date DESC
    `;
    return rows.map(mapRowToCertification);
  }

  async findById(id: number): Promise<Certification | null> {
    const rows = await sql`
      SELECT * FROM certifications WHERE id = ${id}
    `;
    return rows.length > 0 ? mapRowToCertification(rows[0]) : null;
  }

  async create(data: CreateCertificationDTO): Promise<Certification> {
    const rows = await sql`
      INSERT INTO certifications (
        name, issuer, issue_date, expiry_date, 
        credential_url, credential_id
      )
      VALUES (
        ${data.name},
        ${data.issuer},
        ${data.issueDate},
        ${data.expiryDate ?? null},
        ${data.credentialUrl ?? null},
        ${data.credentialId ?? null}
      )
      RETURNING *
    `;
    return mapRowToCertification(rows[0]);
  }

  async update(
    id: number,
    data: UpdateCertificationDTO,
  ): Promise<Certification | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const rows = await sql`
      UPDATE certifications SET
        name = ${data.name ?? existing.name},
        issuer = ${data.issuer ?? existing.issuer},
        issue_date = ${data.issueDate ?? existing.issueDate},
        expiry_date = ${data.expiryDate !== undefined ? data.expiryDate : existing.expiryDate},
        credential_url = ${data.credentialUrl !== undefined ? data.credentialUrl : existing.credentialUrl},
        credential_id = ${data.credentialId !== undefined ? data.credentialId : existing.credentialId},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return rows.length > 0 ? mapRowToCertification(rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await sql`DELETE FROM certifications WHERE id = ${id}`;
    return result.count > 0;
  }
}
```

---

## Paso 7: Registrar en el Container de DI (`/web/container.ts`)

```typescript
// web/container.ts

import { NeonCertificationRepository } from "@/data/repositories/neon-certification-repository";
import { CertificationService } from "@/core/services/certification-service";

// ... repositorios existentes ...

// Nuevo repositorio
const certificationRepository = new NeonCertificationRepository();

// Nuevo servicio
export const certificationService = new CertificationService(
  certificationRepository,
);
```

---

## Paso 8: Crear API Routes en `/app/api/certifications`

### Collection endpoint (GET all, POST create)

```typescript
// app/api/certifications/route.ts

import { NextResponse } from "next/server";
import { certificationService } from "@/web/container";
import { ZodError } from "zod";

export async function GET() {
  try {
    const certifications = await certificationService.getAllCertifications();
    return NextResponse.json(certifications);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json(
      { error: "Error al obtener las certificaciones" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const certification = await certificationService.createCertification(body);
    return NextResponse.json(certification, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 },
      );
    }
    console.error("Error creating certification:", error);
    return NextResponse.json(
      { error: "Error al crear la certificación" },
      { status: 500 },
    );
  }
}
```

### Individual endpoint (GET, PUT, DELETE)

```typescript
// app/api/certifications/[id]/route.ts

import { NextResponse } from "next/server";
import { certificationService } from "@/web/container";
import { ZodError } from "zod";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const certification = await certificationService.getCertificationById(
      Number(id),
    );

    if (!certification) {
      return NextResponse.json(
        { error: "Certificación no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(certification);
  } catch (error) {
    console.error("Error fetching certification:", error);
    return NextResponse.json(
      { error: "Error al obtener la certificación" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const certification = await certificationService.updateCertification(
      Number(id),
      body,
    );

    if (!certification) {
      return NextResponse.json(
        { error: "Certificación no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(certification);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 },
      );
    }
    console.error("Error updating certification:", error);
    return NextResponse.json(
      { error: "Error al actualizar la certificación" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const success = await certificationService.deleteCertification(Number(id));

    if (!success) {
      return NextResponse.json(
        { error: "Certificación no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting certification:", error);
    return NextResponse.json(
      { error: "Error al eliminar la certificación" },
      { status: 500 },
    );
  }
}
```

---

## Paso 9: Crear Componente UI en `/components`

```tsx
// components/certifications-section.tsx

"use client";

import useSWR from "swr";
import { useState } from "react";
import type { Certification } from "@/core/entities/certification";
import { Button } from "@/components/ui/button";
// ... más imports de UI components

export function CertificationsSection() {
  const { data: certifications, mutate } = useSWR<Certification[]>(
    "/api/certifications",
  );
  const [open, setOpen] = useState(false);

  // ... lógica CRUD similar a ProjectsSection

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Certificaciones</h2>
        <Button onClick={() => setOpen(true)}>Nueva Certificación</Button>
      </div>

      {/* Grid de certificaciones */}
      <div className="grid gap-4 md:grid-cols-2">
        {certifications?.map((cert) => (
          <Card key={cert.id}>
            <CardHeader>
              <CardTitle>{cert.name}</CardTitle>
              <CardDescription>{cert.issuer}</CardDescription>
            </CardHeader>
            {/* ... contenido */}
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## ✅ Resumen de Archivos Creados/Modificados

### Creados (9 nuevos archivos):

1. `core/entities/certification.ts`
2. `core/interfaces/certification-repository.ts`
3. `core/validators/certification-validator.ts`
4. `core/services/certification-service.ts`
5. `data/repositories/neon-certification-repository.ts`
6. `scripts/002-add-certifications.sql`
7. `app/api/certifications/route.ts`
8. `app/api/certifications/[id]/route.ts`
9. `components/certifications-section.tsx`

### Modificados (1 archivo):

1. `web/container.ts` - Agregar inyección de dependencias

---

## 🎯 Beneficios de Seguir este Patrón

1. **Consistencia:** Todas las entidades siguen la misma estructura
2. **Mantenibilidad:** Cada archivo tiene una responsabilidad clara
3. **Testabilidad:** Cada capa puede probarse independientemente
4. **Escalabilidad:** Agregar nuevas entidades es mecánico y predecible
5. **Portabilidad:** Cambiar DB solo requiere modificar `/data`

---

## 🔄 Flujo de Datos de la Nueva Entidad

```
Usuario hace click "Nueva Certificación"
         ↓
CertificationsSection.tsx (UI)
         ↓
POST /api/certifications (API Route)
         ↓
certificationService.createCertification() (Core)
         ↓
Valida con createCertificationSchema (Core)
         ↓
repository.create() (Interface en Core)
         ↓
NeonCertificationRepository.create() (Implementación en Data)
         ↓
SQL INSERT en PostgreSQL
         ↓
Retorna Certification entity
         ↓
UI actualiza con SWR
```

---

## 📝 Tips Adicionales

### Para agregar relaciones entre entidades:

```typescript
// Ejemplo: Asociar certificaciones con skills
export interface Certification {
  // ... campos existentes
  relatedSkillIds: number[];  // IDs de skills relacionados
}

// En el servicio, puedes validar que los skills existan:
async createCertification(data: CreateCertificationDTO): Promise<Certification> {
  const validated = createCertificationSchema.parse(data);

  // Validar que los skills existan (opcional)
  if (validated.relatedSkillIds?.length) {
    for (const skillId of validated.relatedSkillIds) {
      const skill = await this.skillRepository.findById(skillId);
      if (!skill) throw new Error(`Skill ${skillId} no encontrado`);
    }
  }

  return this.repository.create(validated);
}
```

### Para agregar lógica de negocio compleja:

```typescript
// core/services/certification-service.ts

async getActiveCertifications(): Promise<Certification[]> {
  const all = await this.repository.findAll();
  const today = new Date();

  return all.filter((cert) => {
    if (!cert.expiryDate) return true; // No expira nunca
    return new Date(cert.expiryDate) >= today;
  });
}

async getExpiredCertifications(): Promise<Certification[]> {
  const all = await this.repository.findAll();
  const today = new Date();

  return all.filter((cert) => {
    if (!cert.expiryDate) return false;
    return new Date(cert.expiryDate) < today;
  });
}
```

---

Esta guía demuestra cómo el patrón es **mecánico y repetible**, facilitando el crecimiento del sistema manteniendo la calidad arquitectónica.
