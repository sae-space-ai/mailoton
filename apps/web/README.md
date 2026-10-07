# MailForge Web - Frontend y Panel de Administración

Aplicación Next.js que proporciona el webmail y panel de administración del sistema MailForge.

## Estado Actual

🚧 **Fase 1 - Estructura Base**

La aplicación está en fase inicial de desarrollo. Actualmente incluye:
- Estructura base de Next.js 14 con App Router
- Configuración de TypeScript
- Tailwind CSS para estilos
- Endpoint de health check
- Preparación para Vercel

## Características Planificadas

### Webmail
- Bandeja de entrada con lectura de correos vía IMAP
- Composición y envío de correos
- Gestión de carpetas (Inbox, Sent, Drafts, Trash, Junk)
- Búsqueda de mensajes
- Gestión de adjuntos

### Panel de Administración
- Gestión de usuarios (crear, editar, eliminar)
- Gestión de dominios
- Gestión de buzones de correo
- Gestión de alias
- Cuotas y límites
- Logs de auditoría
- Configuración del sistema

### Autenticación
- Login con email/contraseña
- MFA opcional (TOTP)
- Sesiones seguras
- Recuperación de contraseña

## Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Autenticación**: NextAuth.js
- **Validación**: Zod
- **Hashing**: @node-rs/argon2
- **Despliegue**: Vercel

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start
```

## Variables de Entorno

Copiar `.env.example` a `.env.local` y configurar:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generar_con_openssl_rand_hex_32

# Conexión al servidor de correo (VPS)
SMTP_HOST=mail.midominio.com
SMTP_PORT=587
SMTP_USER=admin@midominio.com
SMTP_PASSWORD=***

IMAP_HOST=mail.midominio.com
IMAP_PORT=993

# Base de datos
DATABASE_URL=postgresql://user:pass@host:5432/mailforge
```

## Estructura de Directorios

```
apps/web/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (auth)/            # Rutas de autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Rutas protegidas
│   │   │   ├── admin/         # Panel de administración
│   │   │   ├── webmail/       # Webmail
│   │   │   └── settings/      # Configuración
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Autenticación
│   │   │   ├── users/         # Gestión de usuarios
│   │   │   ├── domains/       # Gestión de dominios
│   │   │   ├── mailboxes/     # Gestión de buzones
│   │   │   └── mail/          # Envío/lectura de correo
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes de UI
│   │   ├── mail/             # Componentes de correo
│   │   └── admin/            # Componentes de admin
│   ├── lib/                  # Utilidades y helpers
│   │   ├── db.ts            # Conexión a base de datos
│   │   ├── auth.ts          # Configuración de autenticación
│   │   └── validators.ts    # Schemas de validación
│   └── types/               # Tipos TypeScript
├── public/                  # Archivos estáticos
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Despliegue en Vercel

La aplicación está configurada para desplegarse automáticamente en Vercel:

1. Conectar repositorio en Vercel
2. Configurar root directory: `apps/web`
3. Configurar variables de entorno
4. Deploy automático en push a `main`

## Endpoints de API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/session` - Obtener sesión actual

### Usuarios
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Dominios
- `GET /api/domains` - Listar dominios
- `POST /api/domains` - Crear dominio
- `DELETE /api/domains/:id` - Eliminar dominio

### Buczones
- `GET /api/mailboxes` - Listar buzones
- `POST /api/mailboxes` - Crear buzón
- `PUT /api/mailboxes/:id` - Actualizar buzón
- `DELETE /api/mailboxes/:id` - Eliminar buzón

### Correo
- `GET /api/mail/inbox` - Listar correos (IMAP)
- `POST /api/mail/send` - Enviar correo
- `GET /api/mail/:id` - Leer correo

## Seguridad

- Headers de seguridad configurados (X-Frame-Options, CSP, etc.)
- Autenticación con NextAuth.js
- Contraseñas hasheadas con Argon2id
- Validación de inputs con Zod
- Rate limiting en API routes
- Variables de entorno para secretos

## Próximos Pasos

- [ ] Implementar autenticación con NextAuth.js
- [ ] Crear componentes de UI base
- [ ] Implementar conexión a PostgreSQL
- [ ] Crear CRUD de usuarios
- [ ] Implementar webmail con IMAP
- [ ] Panel de administración completo

## Referencias

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel Deployment](https://vercel.com/docs)
