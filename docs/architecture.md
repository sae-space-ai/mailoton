# Arquitectura del Sistema MailForge

## Diagrama General

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INTERNET                                     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DOMINIO + DNS (Cloudflare)                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│  │   MX    │ │   SPF   │ │  DKIM   │ │  DMARC  │ │   PTR   │     │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                  │
              ▼                                  ▼
┌─────────────────────────┐      ┌─────────────────────────────────┐
│   VERCEL (Frontend)     │      │    SERVIDOR CLOUD (VPS)          │
│                         │      │                                  │
│  ┌───────────────────┐  │      │  ┌────────────────────────────┐ │
│  │   Next.js App     │  │      │  │      TRAEFIK (Proxy)       │ │
│  │                   │  │      │  │   TLS automático (Let's    │ │
│  │  • Webmail        │  │      │  │   Encrypt)                 │ │
│  │  • Panel Admin    │  │      │  └────────────────────────────┘ │
│  │  • API Serverless │  │      │                                  │
│  └───────────────────┘  │      │  ┌────────────────────────────┐ │
│                         │      │  │      POSTFIX (SMTP)        │ │
│  ┌───────────────────┐  │      │  │   • Recepción (puerto 25)  │ │
│  │   NextAuth.js     │  │      │  │   • Envío (puerto 587)     │ │
│  │   Autenticación   │  │      │  │   • SMTPS (puerto 465)     │ │
│  └───────────────────┘  │      │  │   • DKIM signing           │ │
│                         │      │  └────────────────────────────┘ │
│  ┌───────────────────┐  │      │                                  │
│  │   Tailwind CSS    │  │      │  ┌────────────────────────────┐ │
│  │   UI Components   │  │      │  │      DOVECOT (IMAP)        │ │
│  └───────────────────┘  │      │  │   • Acceso buzones (993)   │ │ │
│                         │      │  │   • Entrega local (LMTP)   │ │
└─────────────────────────┘      │  │   • Auth SQL               │ │
                                 │  └────────────────────────────┘ │
                                 │                                  │
                                 │  ┌────────────────────────────┐ │
                                 │  │      RSPAMD (Antispam)     │ │
                                 │  │   • Filtro heurístico      │ │
                                 │  │   • Bayesiano              │ │
                                 │  │   • DNSBL                  │ │
                                 │  │   • Web UI (11334)         │ │
                                 │  └────────────────────────────┘ │
                                 │                                  │
                                 │  ┌────────────────────────────┐ │
                                 │  │      CLAMAV (Antivirus)    │ │
                                 │  │   • Escaneo adjuntos       │ │
                                 │  │   • Actualización firmas   │ │
                                 │  └────────────────────────────┘ │
                                 │                                  │
                                 │  ┌────────────────────────────┐ │
                                 │  │    POSTGRESQL (Database)   │ │
                                 │  │   • Usuarios               │ │
                                 │  │   • Dominios               │ │
                                 │  │   • Buzones                │ │
                                 │  │   • Alias                  │ │
                                 │  │   • Auditoría              │ │
                                 │  └────────────────────────────┘ │
                                 │                                  │
                                 │  ┌────────────────────────────┐ │
                                 │  │      REDIS (Cache)         │ │
                                 │  │   • Rate limiting          │ │
                                 │  │   • Colas                  │ │
                                 │  │   • Sesiones               │ │
                                 │  └────────────────────────────┘ │
                                 │                                  │
                                 │  ┌────────────────────────────┐ │
                                 │  │   ALMACENAMIENTO (Maildir) │ │
                                 │  │   • /var/mail/vhosts/      │ │
                                 │  │   • Mensajes               │ │
                                 │  │   • Adjuntos               │ │
                                 │  └────────────────────────────┘ │
                                 └─────────────────────────────────┘
```

## Flujo de Correo Entrante

```
1. Servidor externo → DNS MX → mail.midominio.com
2. Traefik (puerto 25) → Postfix
3. Postfix → Rspamd (milter 11332)
4. Rspamd → análisis (SPF, DKIM, DMARC, bayes, DNSBL)
5. Rspamd → ClamAV (escaneo adjuntos)
6. Rspamd → Postfix (aceptar/rechazar/marcar)
7. Postfix → Dovecot LMTP → Maildir
```

## Flujo de Correo Saliente

```
1. Usuario → Webmail/API (Vercel)
2. API → SMTP autenticado (VPS:587)
3. Postfix → Rspamd (firma DKIM)
4. Postfix → Internet (puerto 25)
5. Servidor destino verifica SPF/DKIM/DMARC
```

## Flujo de Aplicación Web

```
1. Usuario → Navegador → Vercel CDN
2. Vercel → Next.js (SSR/SSG)
3. Next.js → API Routes (serverless)
4. API → PostgreSQL (VPS:5432) - gestión usuarios/dominios
5. API → Dovecot IMAP (VPS:993) - lectura de correos
6. API → Postfix SMTP (VPS:587) - envío de correos
```

## Componentes por Ubicación

### Vercel (Frontend + API)
- ✅ Next.js App (Webmail + Admin)
- ✅ NextAuth.js (Autenticación)
- ✅ API Routes (CRUD usuarios, dominios, buzones)
- ✅ Tailwind CSS (UI)
- ✅ CDN global
- ✅ Serverless functions

### Servidor Cloud (VPS)
- ✅ Postfix (SMTP)
- ✅ Dovecot (IMAP)
- ✅ Rspamd (Antispam)
- ✅ ClamAV (Antivirus)
- ✅ PostgreSQL (Base de datos)
- ✅ Redis (Cache)
- ✅ Traefik (Proxy + TLS)
- ✅ Fail2ban (Seguridad)
- ✅ Almacenamiento Maildir

### Cloudflare (DNS + CDN)
- ✅ DNS gestionado
- ✅ CDN para dominio
- ✅ Protección DDoS
- ✅ Certificados SSL (opcional)

### GitHub (CI/CD)
- ✅ Código fuente
- ✅ Configuración
- ✅ GitHub Actions (CI/CD)
- ✅ Issues/Projects

## Decisiones de Arquitectura

### ¿Por qué arquitectura híbrida?

**Vercel no puede ejecutar:**
- ❌ Procesos daemon persistentes (Postfix, Dovecot)
- ❌ Puertos TCP específicos (25, 587, 993)
- ❌ Almacenamiento persistente para buzones
- ❌ Conexiones de larga duración (IMAP)

**Vercel es perfecto para:**
- ✅ Frontend Next.js con SSR/SSG
- ✅ APIs serverless
- ✅ Autenticación
- ✅ CDN global
- ✅ Deploy automático

### ¿Por qué PostgreSQL y no SQLite?

- ✅ Conexiones concurrentes desde múltiples servicios
- ✅ Transaccionalidad ACID
- ✅ Soporte JSONB para configuraciones flexibles
- ✅ Escalabilidad horizontal (réplicas)
- ✅ Ecosistema maduro

### ¿Por qué Traefik y no Nginx?

- ✅ Integración nativa con Docker
- ✅ Gestión automática de certificados Let's Encrypt
- ✅ Dashboard para debug
- ✅ Configuración vía labels (no archivos separados)
- ✅ Soporte para routing SMTP/IMAP

### ¿Por qué Rspamd y no SpamAssassin?

- ✅ Mejor rendimiento (C vs Perl)
- ✅ Menor uso de memoria (~50MB vs ~300MB)
- ✅ Web UI incluida
- ✅ DKIM signing nativo
- ✅ Integración Redis nativa

## Seguridad

### Capas de Seguridad

1. **Red**: Firewall UFW, solo puertos necesarios
2. **Transporte**: TLS obligatorio (TLS 1.2+)
3. **Autenticación**: Argon2id para contraseñas, MFA opcional
4. **Aplicación**: Rate limiting, fail2ban, validación de inputs
5. **Correo**: SPF, DKIM, DMARC, MTA-STS
6. **Datos**: Backups cifrados, secretos en variables de entorno

### Principios

- **Mínimo privilegio**: Cada servicio solo accede a lo necesario
- **Defensa en profundidad**: Múltiples capas de seguridad
- **Zero trust**: No confiar en ninguna entrada sin validar
- **Secretos seguros**: Nunca en código, siempre en variables de entorno

## Escalabilidad

### Horizontal
- PostgreSQL: Réplicas de lectura
- Redis: Cluster mode
- Almacenamiento: Object storage (S3/B2) para adjuntos grandes

### Vertical
- Aumentar recursos del VPS (CPU, RAM, disco)
- Migrar a servidor dedicado si es necesario

### Migración a Producción
- Free tier → Planes de pago cuando sea necesario
- VPS económico → VPS dedicado o cloud managed
- Single server → Multi-server con load balancer

## Monitorización

### Métricas Clave
- Estado de servicios (SMTP, IMAP, Web)
- Cola de correo (Postfix queue)
- Uso de recursos (CPU, RAM, disco)
- Certificados TLS (expiración)
- Blacklists (reputación IP)
- Logs de errores

### Herramientas
- Uptime Kuma (monitorización de servicios)
- Docker logs + Loki (logs centralizados)
- Prometheus + Grafana (métricas avanzadas, opcional)

## Backups

### Estrategia
- **Frecuencia**: Cada 6 horas (buzones), cada hora (DB)
- **Retención**: 30 días diarios, 12 semanas, 12 meses
- **Destino**: Backblaze B2 (S3 compatible) + local
- **Cifrado**: Restic con contraseña segura
- **Pruebas**: Restauración mensual en entorno aislado

### Datos Críticos
- Buzones de correo (Maildir)
- Base de datos PostgreSQL
- Configuración (Postfix, Dovecot, Rspamd)
- Claves DKIM
- Certificados TLS

## Coste Estimado

### MVP (1-5 cuentas)
- VPS Hetzner CX22: ~5€/mes
- Dominio: ~10€/año
- Todo lo demás: Gratis (Vercel, Cloudflare, Docker)
- **Total: ~6€/mes**

### Producción (50-100 cuentas)
- VPS Hetzner CX32: ~15€/mes
- Dominio: ~10€/año
- Backblaze B2: ~0.50€/mes
- **Total: ~16€/mes**

### Escala (500+ cuentas)
- Servidor dedicado: ~50-100€/mes
- Dominio: ~10€/año
- Backups: ~5€/mes
- **Total: ~60-110€/mes**

## Roadmap de Fases

1. ✅ **Fase 1**: Estructura y documentación
2. ⏳ **Fase 2**: Dominio y DNS
3. ⏳ **Fase 3**: Infraestructura base (VPS, Docker, PostgreSQL)
4. ⏳ **Fase 4**: SMTP (Postfix)
5. ⏳ **Fase 5**: IMAP (Dovecot)
6. ⏳ **Fase 6**: Seguridad (TLS, fail2ban, hardening)
7. ⏳ **Fase 7**: Webmail (Next.js + IMAP)
8. ⏳ **Fase 8**: Panel de administración
9. ⏳ **Fase 9**: Antispam (Rspamd + ClamAV)
10. ⏳ **Fase 10**: Monitorización y backups
11. ⏳ **Fase 11**: Producción (warmup, entregabilidad)
12. ⏳ **Fase 12**: Escalabilidad y optimización

## Referencias

- [Postfix Documentation](http://www.postfix.org/documentation.html)
- [Dovecot Documentation](https://doc.dovecot.org/)
- [Rspamd Documentation](https://rspamd.com/doc/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
