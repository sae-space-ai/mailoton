# MailForge - Sistema de Correo Electrónico Propio

Sistema de correo electrónico propio, moderno, seguro y escalable, con arquitectura híbrida que combina Vercel para el frontend/API y un servidor cloud externo para los servicios SMTP/IMAP.

## 🎯 Objetivo

Crear una plataforma de correo electrónico completa que permita:
- Crear cuentas de correo asociadas a dominio propio
- Enviar y recibir correos mediante SMTP
- Consultar buzones mediante IMAP
- Gestionar usuarios y dominios
- Disponer de interfaz web (webmail) y panel de administración
- Mantener seguridad, entregabilidad y escalabilidad

## 🏗️ Arquitectura

El proyecto utiliza una **arquitectura híbrida**:

### Componentes en Vercel
- **Frontend (Next.js)**: Webmail y panel de administración
- **API Serverless**: Gestión de usuarios, dominios, buzones y alias
- **Autenticación**: NextAuth.js con MFA opcional

### Componentes en Servidor Cloud Externo
- **Postfix**: Servidor SMTP (envío y recepción)
- **Dovecot**: Servidor IMAP (acceso a buzones)
- **Rspamd**: Filtro antispam
- **ClamAV**: Antivirus para adjuntos
- **PostgreSQL**: Base de datos para usuarios, dominios y configuración
- **Redis**: Cache, colas y rate limiting (Fase 6+)
- **Traefik**: Proxy inverso con TLS automático (Fase 3+)

### Flujo de Correo
```
Internet → DNS → Servidor Cloud (Postfix + Dovecot + Rspamd) → Buzones
```

### Flujo de Aplicación Web
```
Usuario → Vercel (Next.js) → API Serverless → PostgreSQL (VPS)
                              ↓
                         Dovecot (IMAP proxy)
```

## 📦 Estado Actual del Desarrollo

### Fase 1 - Estructura y Documentación ✅ COMPLETADA
- [x] Estructura de repositorio profesional
- [x] Documentación completa de arquitectura
- [x] Aplicación Next.js inicializada en `/apps/web`
- [x] Docker Compose base (PostgreSQL)
- [x] CI/CD con GitHub Actions
- [x] Schema de base de datos
- [x] Landing page del proyecto

### Fase 2 - Dominio y DNS (Próxima)
- [ ] Registro de dominio
- [ ] Configuración DNS (MX, SPF, DKIM, DMARC)
- [ ] PTR/Reverse DNS

### Fase 3 - Infraestructura Base
- [ ] Provisionar VPS
- [ ] Docker y Docker Compose en VPS
- [ ] Traefik con TLS
- [ ] Redis (cuando sea necesario)

### Fase 4 - SMTP (Postfix)
- [ ] Configuración de Postfix
- [ ] Integración con PostgreSQL
- [ ] DKIM signing
- [ ] Pruebas de envío

### Fase 5 - IMAP (Dovecot)
- [ ] Configuración de Dovecot
- [ ] Autenticación SQL
- [ ] Pruebas con clientes

### Fase 6 - Seguridad
- [ ] TLS obligatorio
- [ ] Fail2ban
- [ ] Rate limiting (Redis)
- [ ] Hardening

### Fase 7 - Webmail
- [ ] Interfaz Next.js
- [ ] Conexión IMAP
- [ ] Envío de correos

### Fase 8 - Panel de Administración
- [ ] Gestión de usuarios
- [ ] Gestión de dominios
- [ ] Gestión de buzones y alias

### Fase 9 - Antispam y Antivirus
- [ ] Rspamd
- [ ] ClamAV
- [ ] Integración con Postfix

### Fase 10 - Monitorización y Backups
- [ ] Uptime Kuma
- [ ] Restic backups
- [ ] Alertas

## 🚀 Inicio Rápido

### Requisitos
- Node.js 20+
- Docker y Docker Compose (para servicios de infraestructura)
- Cuenta de Vercel (para deploy del frontend)
- VPS con Docker (para servicios de correo, Fase 3+)

### Desarrollo Local

#### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/mailforge.git
cd mailforge
```

#### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con valores reales
```

#### 3. Levantar infraestructura base (PostgreSQL)
```bash
docker compose up -d postgres
```

#### 4. Instalar dependencias del frontend
```bash
cd apps/web
npm install
```

#### 5. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Comandos Útiles

```bash
# Build de producción
cd apps/web
npm run build

# Lint
npm run lint

# Type check
npm run typecheck

# Iniciar en producción
npm start
```

## 📁 Estructura del Repositorio

```
mailforge/
├── apps/
│   └── web/                    # Aplicación Next.js (Frontend principal)
│       ├── src/
│       │   ├── app/           # App Router de Next.js
│       │   ├── components/    # Componentes React
│       │   └── lib/          # Utilidades
│       ├── package.json
│       └── README.md
│
├── infrastructure/
│   ├── postfix/               # Configuración SMTP (Fase 4)
│   ├── dovecot/               # Configuración IMAP (Fase 5)
│   ├── rspamd/                # Configuración antispam (Fase 9)
│   ├── nginx/                 # Configuración proxy alternativo
│   └── postgres/
│       └── init.sql          # Schema de base de datos
│
├── docs/
│   └── architecture.md       # Documentación de arquitectura
│
├── scripts/                   # Scripts de utilidad (Fases posteriores)
│
├── .github/
│   └── workflows/
│       └── ci.yml            # Pipeline de CI/CD
│
├── src/                       # Landing page del proyecto (Vite)
├── docker-compose.yml         # Servicios de infraestructura
├── .env.example              # Plantilla de variables de entorno
├── .gitignore
└── README.md
```

## 🔒 Seguridad

- TLS obligatorio en todas las conexiones
- Contraseñas hasheadas con Argon2id
- Fail2ban para protección contra fuerza bruta (Fase 6)
- Rate limiting en API y servicios
- DKIM, SPF y DMARC para autenticación de correo
- Secretos gestionados vía variables de entorno (nunca en código)

## 📚 Documentación

- [Arquitectura](docs/architecture.md) - Diseño completo del sistema
- [apps/web](apps/web/README.md) - Documentación del frontend
- [Postfix](infrastructure/postfix/README.md) - Configuración SMTP
- [Dovecot](infrastructure/dovecot/README.md) - Configuración IMAP
- [Rspamd](infrastructure/rspamd/README.md) - Configuración antispam

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios propuestos.

## ⚠️ Notas Importantes

- Este proyecto requiere un VPS para los servicios SMTP/IMAP (Fase 3+)
- La entregabilidad del correo depende de la configuración correcta de DNS y reputación de IP
- Se recomienda empezar con volúmenes bajos y escalar gradualmente
- Los backups son críticos y deben configurarse desde el inicio

## 💰 Coste Estimado

### MVP (1-5 cuentas)
- VPS Hetzner CX22: ~5€/mes
- Dominio: ~10€/año
- Todo lo demás: Gratis (Vercel, Cloudflare, Docker)
- **Total: ~6€/mes**

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
