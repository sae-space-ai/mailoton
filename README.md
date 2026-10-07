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
- **Redis**: Cache, colas y rate limiting
- **Traefik**: Proxy inverso con TLS automático

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

### Fase 1 - Estructura y Documentación ✅
- [x] Estructura de repositorio
- [x] Documentación de arquitectura
- [x] Configuración inicial de Next.js
- [x] Docker Compose base
- [x] CI/CD con GitHub Actions

### Fase 2 - Dominio y DNS (Próxima)
- [ ] Registro de dominio
- [ ] Configuración DNS (MX, SPF, DKIM, DMARC)
- [ ] PTR/Reverse DNS

### Fase 3 - Infraestructura Base
- [ ] Provisionar VPS
- [ ] Docker y Docker Compose
- [ ] PostgreSQL y Redis
- [ ] Traefik con TLS

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
- [ ] Rate limiting
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
- Node.js 18+
- Docker y Docker Compose
- Cuenta de Vercel (para deploy)
- VPS con Docker (para servicios de correo)

### Desarrollo Local

```bash
# Instalar dependencias
cd apps/web
npm install

# Desarrollo
npm run dev

# Build
npm run build
```

### Despliegue

#### Frontend (Vercel)
```bash
# Conectar repositorio en Vercel
# Configurar variables de entorno
# Deploy automático en push a main
```

#### Backend (VPS)
```bash
# Clonar repositorio en VPS
cd infrastructure
docker compose up -d
```

## 🔒 Seguridad

- TLS obligatorio en todas las conexiones
- Contraseñas hasheadas con Argon2id
- Fail2ban para protección contra fuerza bruta
- Rate limiting en API y servicios
- DKIM, SPF y DMARC para autenticación de correo
- Secretos gestionados vía variables de entorno (nunca en código)

## 📚 Documentación

- [Arquitectura](docs/architecture.md) - Diseño completo del sistema
- [DNS Setup](docs/dns-setup.md) - Configuración de registros DNS (próximamente)
- [Deployment](docs/deployment.md) - Guía de despliegue (próximamente)
- [API Reference](docs/api-reference.md) - Documentación de API (próximamente)

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios propuestos.

## ⚠️ Notas Importantes

- Este proyecto requiere un VPS para los servicios SMTP/IMAP
- La entregabilidad del correo depende de la configuración correcta de DNS y reputación de IP
- Se recomienda empezar con volúmenes bajos y escalar gradualmente
- Los backups son críticos y deben configurarse desde el inicio
