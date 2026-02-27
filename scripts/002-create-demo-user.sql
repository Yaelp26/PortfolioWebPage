-- Script para crear un usuario de prueba
-- Ejecutar después de crear las tablas

-- Crear usuario de prueba
-- Email: demo@example.com
-- Password: demo1234
-- (password hash para "demo1234" usando bcrypt con 10 rounds)

INSERT INTO users (
  email, 
  name, 
  password_hash, 
  bio, 
  github_url, 
  linkedin_url
) VALUES (
  'demo@example.com',
  'Usuario Demo',
  '$2b$10$HFwRe9y1GIOyezYdcWZ0QuDYDLAVfCZiEF9yBlVSOe5jFfH6L3oUa', -- Password: demo1234
  'Desarrollador full-stack apasionado por crear soluciones innovadoras.',
  'https://github.com/demo',
  'https://linkedin.com/in/demo'
) ON CONFLICT (email) DO NOTHING;

-- Nota: Para generar el hash de contraseña, puedes usar:
-- 1. El formulario de registro en /register
-- 2. O ejecutar en Node.js:
--    const bcrypt = require('bcryptjs');
--    console.log(bcrypt.hashSync('demo1234', 10));
