# Postfix - Servidor SMTP

## Función

Postfix es el Agente de Transferencia de Correo (MTA) del sistema. Se encarga de:

- **Recepción de correo entrante** (puerto 25) desde otros servidores SMTP
- **Envío de correo saliente** autenticado (puertos 587/465)
- **Encolamiento y reintentos** para mensajes no entregados inmediatamente
- **Firma DKIM** de mensajes salientes
- **Protección contra open relay** (solo usuarios autenticados pueden enviar)

## Estado Actual

⏳ **Pendiente de configuración (Fase 4)**

En esta fase solo se crea el directorio y la documentación. La configuración real se implementará cuando:
- El VPS esté provisionado
- El dominio y DNS estén configurados
- PostgreSQL esté funcionando con el esquema de base de datos

## Archivos que se crearán en Fase 4

```
infrastructure/postfix/
├── main.cf              # Configuración principal
├── master.cf            # Configuración de servicios/puertos
├── pgsql-domains.cf     # Query SQL para dominios virtuales
├── pgsql-mailboxes.cf   # Query SQL para buzones
├── pgsql-aliases.cf     # Query SQL para alias
└── sasl_passwd          # Credenciales relay externo (si aplica)
```

## Puertos

| Puerto | Nombre | Uso |
|--------|--------|-----|
| 25 | SMTP | Recepción desde otros servidores (MTA→MTA) |
| 587 | Submission | Envío autenticado por clientes (STARTTLS) |
| 465 | SMTPS | Envío autenticado (TLS implícito) |

## Decisiones Técnicas

- **Postfix vs Exim**: Postfix elegido por su simplicidad, documentación extensa y compatibilidad con Dovecot
- **Virtual domains**: Se usarán dominios virtuales con PostgreSQL como backend
- **DKIM**: Se implementará vía milter con Rspamd (no OpenDKIM separado)
- **TLS**: Obligatorio para autenticación (smtpd_tls_auth_only=yes)

## Referencias

- [Postfix Official Documentation](http://www.postfix.org/documentation.html)
- [Postfix SASL Howto](http://www.postfix.org/SASL_README.html)
- [Postfix Virtual Domain Howto](http://www.postfix.org/VIRTUAL_README.html)
