-- ============================================================
-- Migración: Agregar columna user_id a las tablas existentes
-- ============================================================

-- Agregar user_id a projects si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE projects ADD COLUMN user_id INTEGER;
    ALTER TABLE projects ADD CONSTRAINT projects_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Agregar user_id a skills si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'skills' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE skills ADD COLUMN user_id INTEGER;
    ALTER TABLE skills ADD CONSTRAINT skills_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Agregar user_id a experiences si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'experiences' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE experiences ADD COLUMN user_id INTEGER;
    ALTER TABLE experiences ADD CONSTRAINT experiences_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Actualizar registros existentes sin user_id (asignar al primer usuario)
UPDATE projects SET user_id = (SELECT MIN(id) FROM users) WHERE user_id IS NULL;
UPDATE skills SET user_id = (SELECT MIN(id) FROM users) WHERE user_id IS NULL;
UPDATE experiences SET user_id = (SELECT MIN(id) FROM users) WHERE user_id IS NULL;

-- Hacer las columnas NOT NULL después de tener datos
ALTER TABLE projects ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE skills ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE experiences ALTER COLUMN user_id SET NOT NULL;
