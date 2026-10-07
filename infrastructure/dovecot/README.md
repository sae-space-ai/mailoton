# Dovecot - Servidor IMAP/LMTP

## Función

Dovecot es el Agente de Entrega de Correo (MDA) y servidor IMAP del sistema. Se encarga de:

- **Acceso IMAP** a los buzones de correo (puerto 993)
- **Entrega local** de mensajes vía LMTP desde Postfix
- **Autenticación** de usuarios contra PostgreSQL
- **Gestión de cuotas** de almacenamiento por buzón
- **Indexación** de mensajes para búsqueda rápida
- **Carpetas estándar** (Inbox, Sent, Drafts, Trash, Junk, Archive)

## Estado Actual

⏳ **Pendiente de configuración (Fase 5)**

La configuración se implementará después de que Postfix esté funcionando (Fase 4).

## Archivos que se crearán en Fase 5

```
infrastructure/dovecot/
├── dovecot.conf              # Configuración principal
├── dovecot-sql.conf.ext      # Queries SQL para auth
└── conf.d/
    ├── auth-sql.conf.ext     # Configuración auth SQL
    ├── mail-quota.conf.ext   # Plugin de cuotas
    └── ssl.conf              # Configuración TLS
```

## Puertos

| Puerto | Nombre | Uso |
|--------|--------|-----|
| 993 | IMAPS | Acceso seguro a buzones (TLS implícito) |
| 143 | IMAP | Acceso con STARTTLS (redirección a 993) |

## Características

- **Maildir**: Formato de almacenamiento (compatible, robusto)
- **Auth SQL**: Usuarios almacenados en PostgreSQL
- **Quotas**: Límite configurable por buzón
- **Namespaces**: Carpetas especiales con atributos IMAP
- **SASL**: Proveedor de autenticación para Postfix

## Decisiones Técnicas

- **Dovecot vs Courier**: Dovecot elegido por mejor rendimiento, soporte SQL nativo y comunidad activa
- **Maildir vs mbox**: Maildir por mejor rendimiento concurrente y resistencia a corrupción
- **Argon2id**: Hash de contraseñas resistente a GPU/ASIC attacks
- **LMTP**: Protocolo eficiente para entrega local desde Postfix

## Compatibilidad con Clientes

Con la configuración adecuada, funcionará con:
- Thunderbird (autoconfig)
- Apple Mail (SRV records)
- Outlook (Autodiscover)
- Clientes móviles iOS/Android

## Referencias

- [Dovecot Documentation](https://doc.dovecot.org/)
- [Dovecot SQL Authentication](https://doc.dovecot.org/admin_manual/authentication/sql/)
- [Dovecot Quota Plugin](https://doc.dovecot.org/admin_manual/quota_plugin/)
