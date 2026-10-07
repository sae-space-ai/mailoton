# Nginx - Proxy Inverso (Alternativo)

## Función

Nginx se incluye como **alternativa a Traefik** para el proxy inverso. En la arquitectura principal se utiliza Traefik por su integración nativa con Docker y gestión automática de certificados.

Nginx podría utilizarse si:
- Se prefiere una configuración más tradicional y estática
- Se necesita un control más fino sobre las reglas de routing
- Se quiere reducir la complejidad de Traefik

## Estado Actual

⏳ **Pendiente de decisión**

La arquitectura principal utiliza **Traefik** como proxy inverso. Nginx se mantiene como alternativa documentada.

## Archivos que se crearían (si se usa Nginx)

```
infrastructure/nginx/
├── nginx.conf              # Configuración principal
├── conf.d/
│   ├── mail.midominio.com.conf    # Virtual host para correo
│   ├── webmail.midominio.com.conf # Virtual host para webmail
│   └── admin.midominio.com.conf   # Virtual host para admin
├── ssl/                    # Certificados (generados por Certbot)
└── snippets/
    ├── ssl.conf            # Configuración SSL común
    └── security.conf       # Headers de seguridad
```

## Traefik vs Nginx

| Aspecto | Traefik | Nginx |
|---------|---------|-------|
| Auto TLS | ✅ Nativo | ❌ Necesita Certbot |
| Docker | ✅ Nativo | ⚠️ Requiere configuración |
| Dashboard | ✅ Incluido | ❌ No |
| SMTP routing | ✅ Soportado | ⚠️ Limitado (stream) |
| Curva aprendizaje | Media | Baja |
| Comunidad | Grande | Muy grande |

## Recomendación

**Usar Traefik** como proxy principal por:
- Gestión automática de certificados Let's Encrypt
- Routing nativo de puertos SMTP/IMAP
- Dashboard integrado para debug
- Configuración vía labels de Docker (no archivos separados)

## Referencias

- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Certbot with Nginx](https://certbot.eff.org/instructions)
