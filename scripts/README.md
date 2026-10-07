# Scripts de MailForge

## Descripción

Este directorio contiene scripts de utilidad para la gestión, despliegue y mantenimiento del sistema de correo.

## Estado Actual

⏳ **Pendiente de implementación (Fases posteriores)**

Los scripts se crearán conforme avance el desarrollo del proyecto.

## Scripts Planificados

### Fase 3 - Infraestructura
- `setup.sh` — Instalación inicial del VPS
- `check-ports.sh` — Verificación de puertos abiertos

### Fase 4 - SMTP
- `generate-dkim.sh` — Generación de claves DKIM
- `test-smtp.sh` — Pruebas de envío SMTP

### Fase 5 - IMAP
- `test-imap.sh` — Pruebas de conexión IMAP

### Fase 6 - Seguridad
- `security-audit.sh` — Auditoría de seguridad
- `check-tls.sh` — Verificación de certificados TLS

### Fase 9 - Antispam
- `train-bayes.sh` — Entrenamiento del filtro bayesiano
- `check-spam-score.sh` — Verificación de scoring

### Fase 10 - Monitorización
- `health-check.sh` — Verificación de salud del sistema
- `backup.sh` — Script de backup con restic
- `restore.sh` — Script de restauración
- `check-blacklists.sh` — Verificación de blacklists

### Fase 11 - Producción
- `warmup-ip.sh` — Plan de calentamiento de IP
- `deliverability-check.sh` — Verificación de entregabilidad

## Convenciones

- Todos los scripts deben ser `#!/bin/bash`
- Usar `set -e` para detenerse en errores
- Incluir logging con timestamps
- Validar prerequisitos antes de ejecutar
- Usar variables de entorno de `.env`
- No incluir secretos en los scripts

## Ejemplo de estructura

```bash
#!/bin/bash
# script-name.sh - Descripción breve
# Uso: ./script-name.sh [opciones]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Funciones auxiliares
log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Cargar variables de entorno
if [ -f .env ]; then
    source .env
fi

# Lógica principal
main() {
    log "Iniciando script..."
    # ...
}

main "$@"
```
