# Rspamd - Filtro Antispam

## Función

Rspamd es el sistema de filtrado de correo del proyecto. Se encarga de:

- **Detección de spam** mediante análisis heurístico y scoring
- **Verificación SPF/DKIM/DMARC** de mensajes entrantes
- **Firma DKIM** de mensajes salientes
- **Filtro bayesiano** adaptativo (aprende de spam/ham)
- **Listas negras DNS** (DNSBL/RBL)
- **Greylisting** para reducir spam
- **Integración con ClamAV** para escaneo de virus
- **Web UI** para administración del filtro

## Estado Actual

⏳ **Pendiente de configuración (Fase 9)**

Se configurará después de que SMTP e IMAP estén funcionando correctamente.

## Archivos que se crearán en Fase 9

```
infrastructure/rspamd/
├── worker-normal.conf        # Configuración worker principal
├── classifier-bayes.conf     # Filtro bayesiano
├── dkim_signing.conf         # Firma DKIM saliente
├── antivirus.conf            # Integración ClamAV
├── milter_headers.conf       # Headers añadidos
├── redis.conf                # Configuración Redis
└── dkim/                     # Claves DKIM (generadas)
    ├── midominio.com.default.key
    └── midominio.com.default.txt
```

## Puertos

| Puerto | Nombre | Uso |
|--------|--------|-----|
| 11332 | Milter | Integración con Postfix |
| 11333 | Worker | Procesamiento interno |
| 11334 | Web UI | Panel de administración |

## ¿Por qué Rspamd y no SpamAssassin?

| Aspecto | Rspamd | SpamAssassin |
|---------|--------|--------------|
| Rendimiento | C, muy rápido | Perl, más lento |
| Memoria | ~50-100MB | ~200-500MB |
| Web UI | Incluida | Necesita addon |
| DKIM | Sign + verify | Solo verify |
| Redis | Nativo | Plugin |
| Comunidad | Activa, moderna | Estable, legacy |

## Decisiones Técnicas

- **Rspamd sobre SpamAssassin**: Mejor rendimiento, Web UI integrada, DKIM signing nativo
- **ClamAV integrado**: Escaneo de adjuntos como módulo de Rspamd
- **Redis como backend**: Para bayes, cache, greylisting y rate limiting
- **DKIM signing**: Rspamd firma en lugar de OpenDKIM (menos componentes)

## Referencias

- [Rspamd Documentation](https://rspamd.com/doc/)
- [Rspamd Quick Start](https://rspamd.com/doc/quickstart.html)
- [Postfix + Rspamd Integration](https://rspamd.com/doc/integration.html#postfix)
