import { ReactNode } from 'react';

export interface Section {
  id: string;
  title: string;
  icon: string;
  content: ReactNode;
}

function CodeBlock({ children, lang = 'bash' }: { children: string; lang?: string }) {
  return (
    <div className="code-block relative">
      <div className="flex items-center justify-between px-4 py-2 border-b border-dark-700 bg-dark-800/50 rounded-t-lg">
        <span className="text-xs text-dark-400 font-mono">{lang}</span>
        <button
          onClick={() => navigator.clipboard.writeText(children)}
          className="text-xs text-dark-400 hover:text-white transition-colors px-2 py-0.5 rounded hover:bg-dark-700"
        >
          Copiar
        </button>
      </div>
      <code>{children}</code>
    </div>
  );
}

function InfoCard({ title, children, variant = 'default' }: { title: string; children: ReactNode; variant?: 'default' | 'warning' | 'success' | 'danger' }) {
  const colors = {
    default: 'border-primary-800/50 bg-primary-900/10',
    warning: 'border-warning/30 bg-warning/5',
    success: 'border-accent/30 bg-accent/5',
    danger: 'border-danger/30 bg-danger/5',
  };
  const titleColors = {
    default: 'text-primary-400',
    warning: 'text-warning',
    success: 'text-accent',
    danger: 'text-danger',
  };
  return (
    <div className={`rounded-lg border p-4 ${colors[variant]}`}>
      <h4 className={`font-semibold text-sm mb-2 ${titleColors[variant]}`}>{title}</h4>
      <div className="text-sm text-dark-200 space-y-2">{children}</div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-dark-700">
      <table className="table-custom">
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const sections: Section[] = [
  {
    id: 'overview',
    title: 'Visión General',
    icon: '🏗️',
    content: (
      <>
        <p className="text-dark-200 leading-relaxed">
          <strong className="text-white">MailForge</strong> es una plataforma de correo electrónico propia, moderna, segura y escalable. Combina infraestructura autoalojada para los servicios de correo (SMTP/IMAP) con Vercel para el frontend, webmail y panel de administración.
        </p>

        <InfoCard title="¿Por qué arquitectura híbrida?" variant="warning">
          <p>Vercel no puede ejecutar daemons persistentes (Postfix, Dovecot), escuchar en puertos TCP específicos (25, 587, 993), ni mantener almacenamiento persistente para buzones de correo. Estos servicios requieren un VPS o servidor dedicado.</p>
          <p>Lo que SÍ funciona perfectamente en Vercel: frontend Next.js, APIs serverless, autenticación, panel admin y webmail.</p>
        </InfoCard>

        <div className="architecture-diagram">
          <h4 className="text-white font-semibold mb-4 text-center">📐 Diagrama de Arquitectura</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h5 className="text-primary-400 text-sm font-semibold mb-3">📧 Flujo de Correo</h5>
              <div className="space-y-1 text-sm">
                <div className="bg-dark-800/80 rounded px-3 py-2 text-center border border-dark-700">Internet / Otros servidores</div>
                <div className="text-center text-primary-400">↓</div>
                <div className="bg-dark-800/80 rounded px-3 py-2 text-center border border-dark-700">DNS (MX, SPF, DKIM, DMARC)</div>
                <div className="text-center text-primary-400">↓</div>
                <div className="bg-dark-800/80 rounded px-3 py-2 text-center border border-dark-700">VPS — Traefik (TLS)</div>
                <div className="text-center text-primary-400">↓</div>
                <div className="bg-dark-800/80 rounded px-3 py-2 text-center border border-dark-700">Rspamd + ClamAV (filtro)</div>
                <div className="text-center text-primary-400">↓</div>
                <div className="bg-dark-800/80 rounded px-3 py-2 text-center border border-dark-700">Postfix (SMTP) + Dovecot (IMAP)</div>
                <div className="text-center text-primary-400">↓</div>
                <div className="bg-dark-800/80 rounded px-3 py-2 text-center border border-dark-700">Maildir en disco + PostgreSQL</div>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="text-accent text-sm font-semibold mb-3">🌐 Flujo de Aplicación Web</h5>
              <div className="space-y-1 text-sm">
                <div className="bg-dark-800/80 rounded px-3 py-2 text-center border border-dark-700">Usuario (navegador)</div>
                <div className="text-center text-accent">↓</div>
                <div className="bg-dark-800/80 rounded px-3 py-2 text-center border border-dark-700">Vercel — Next.js Frontend</div>
                <div className="text-center text-accent">↓</div>
                <div className="bg-dark-800/80 rounded px-3 py-2 text-center border border-dark-700">Vercel — API Serverless</div>
                <div className="text-center text-accent">↓</div>
                <div className="bg-dark-800/80 rounded px-3 py-2 text-center border border-dark-700">Supabase PostgreSQL / Neon</div>
                <div className="text-center text-accent">↓</div>
                <div className="bg-dark-800/80 rounded px-3 py-2 text-center border border-dark-700">VPS — Dovecot (IMAP proxy)</div>
              </div>
            </div>
          </div>
        </div>

        <InfoCard title="Principios de diseño" variant="success">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Seguridad primero:</strong> TLS obligatorio, hashing Argon2id, fail2ban, DKIM/SPF/DMARC</li>
            <li><strong>Coste mínimo:</strong> Free tier de Supabase/Neon, Cloudflare DNS, Let's Encrypt</li>
            <li><strong>Simplicidad:</strong> Docker Compose para toda la infraestructura</li>
            <li><strong>Escalabilidad:</strong> Arquitectura preparada para crecer</li>
            <li><strong>Versionado:</strong> Todo en GitHub con CI/CD</li>
          </ul>
        </InfoCard>
      </>
    ),
  },
  {
    id: 'architecture',
    title: 'Arquitectura Detallada',
    icon: '⚙️',
    content: (
      <>
        <p className="text-dark-200">Cada componente del sistema tiene una ubicación específica según sus requisitos técnicos.</p>

        <Table
          headers={['Componente', 'Ubicación', 'Tecnología', 'Motivo']}
          rows={[
            ['SMTP entrante/saliente', 'VPS propio', 'Postfix', 'Necesita puerto 25/587/465 persistente'],
            ['Servidor IMAP', 'VPS propio', 'Dovecot', 'Necesita puerto 993, acceso a Maildir'],
            ['Filtro antispam', 'VPS propio', 'Rspamd', 'Procesamiento local de mensajes'],
            ['Antivirus', 'VPS propio', 'ClamAV', 'Escaneo de adjuntos local'],
            ['Base de datos', 'Supabase/Neon (free)', 'PostgreSQL', 'Free tier generoso, gestionado'],
            ['Cache/Colas', 'VPS propio', 'Redis', 'Necesita persistencia, bajo latency'],
            ['Almacenamiento mail', 'VPS propio', 'Maildir', 'Estándar, compatible Dovecot'],
            ['Adjuntos grandes', 'VPS + S3 opcional', 'MinIO/B2', 'Escalar sin límites de disco VPS'],
            ['Frontend/Webmail', 'Vercel', 'Next.js + React', 'Serverless, CDN global'],
            ['Panel Admin', 'Vercel', 'Next.js + React', 'APIs serverless, auth'],
            ['API Backend', 'Vercel', 'Next.js API Routes', 'Serverless, escalable'],
            ['Proxy inverso', 'VPS propio', 'Traefik', 'TLS auto, routing, Docker nativo'],
            ['DNS', 'Cloudflare', 'DNS gestionado', 'Free, CDN, DDoS protection'],
            ['Certificados', 'Let\'s Encrypt', 'Traefik/Certbot', 'Gratis, auto-renovación'],
            ['Monitorización', 'VPS + Uptime Kuma', 'Docker', 'Self-hosted, gratuito'],
            ['Logs', 'VPS propio', 'Docker logs + Loki', 'Centralizados, gratuitos'],
            ['Backups', 'B2/VPS local', 'restic/borg', 'Cifrados, incrementales'],
            ['CI/CD', 'GitHub Actions', 'YAML workflows', 'Gratis para repos públicos'],
          ]}
        />

        <h3 className="text-xl font-bold text-white mt-8 mb-4">¿Por qué NO todo en Vercel?</h3>
        <InfoCard title="Limitaciones de Vercel para correo" variant="danger">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Sin puertos TCP:</strong> Vercel solo expone HTTP/HTTPS (80/443). No puede escuchar en puertos 25, 587, 993.</li>
            <li><strong>Sin procesos daemon:</strong> Las funciones serverless tienen timeout de 10s-60s. No pueden ejecutar Postfix/Dovecot.</li>
            <li><strong>Sin almacenamiento persistente:</strong> El filesystem es efímero. Los buzones de correo se perderían.</li>
            <li><strong>Sin conexiones persistentes:</strong> IMAP requiere conexiones de larga duración.</li>
            <li><strong>Sin acceso a puerto 25:</strong> Muchos cloud providers bloquean puerto 25 por spam.</li>
          </ul>
        </InfoCard>

        <InfoCard title="¿Qué SÍ funciona en Vercel?" variant="success">
          <ul className="list-disc list-inside space-y-1">
            <li>Frontend Next.js con SSR/SSG</li>
            <li>APIs REST para gestión de usuarios, dominios, alias</li>
            <li>Autenticación (NextAuth.js / Clerk)</li>
            <li>Webmail que se conecta al IMAP del VPS vía proxy</li>
            <li>Panel de administración</li>
            <li>Webhooks y notificaciones</li>
          </ul>
        </InfoCard>
      </>
    ),
  },
  {
    id: 'stack',
    title: 'Stack Tecnológico',
    icon: '🛠️',
    content: (
      <>
        <p className="text-dark-200">Selección minimalista de tecnologías probadas y adecuadas para cada capa.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-500"></span>
              Servidor de Correo (VPS)
            </h4>
            <ul className="space-y-2 text-sm text-dark-200">
              <li><strong className="text-white">Postfix</strong> — MTA estándar, robusto, ampliamente documentado</li>
              <li><strong className="text-white">Dovecot</strong> — Servidor IMAP/LMTP, excelente rendimiento</li>
              <li><strong className="text-white">Rspamd</strong> — Filtro antispam moderno, más eficiente que SpamAssassin</li>
              <li><strong className="text-white">ClamAV</strong> — Antivirus open source para adjuntos</li>
              <li><strong className="text-white">Traefik</strong> — Proxy inverso con TLS automático</li>
              <li><strong className="text-white">Redis</strong> — Rate limiting, colas, cache</li>
            </ul>
          </div>

          <div className="card p-4">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              Aplicación Web (Vercel)
            </h4>
            <ul className="space-y-2 text-sm text-dark-200">
              <li><strong className="text-white">Next.js 14</strong> — Framework React con App Router, API routes</li>
              <li><strong className="text-white">TypeScript</strong> — Type safety en todo el stack</li>
              <li><strong className="text-white">Tailwind CSS</strong> — Styling utility-first</li>
              <li><strong className="text-white">NextAuth.js</strong> — Autenticación (credentials + MFA)</li>
              <li><strong className="text-white">nodemailer</strong> — Envío desde API (relay)</li>
              <li><strong className="text-white">imapflow</strong> — Cliente IMAP para webmail</li>
            </ul>
          </div>

          <div className="card p-4">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warning"></span>
              Infraestructura
            </h4>
            <ul className="space-y-2 text-sm text-dark-200">
              <li><strong className="text-white">Docker + Compose</strong> — Todo containerizado</li>
              <li><strong className="text-white">GitHub Actions</strong> — CI/CD</li>
              <li><strong className="text-white">Cloudflare</strong> — DNS, CDN, DDoS</li>
              <li><strong className="text-white">Let's Encrypt</strong> — Certificados TLS</li>
              <li><strong className="text-white">Uptime Kuma</strong> — Monitorización</li>
              <li><strong className="text-white">restic</strong> — Backups cifrados</li>
            </ul>
          </div>

          <div className="card p-4">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-danger"></span>
              Base de Datos
            </h4>
            <ul className="space-y-2 text-sm text-dark-200">
              <li><strong className="text-white">PostgreSQL</strong> — Supabase free tier (500MB) o Neon (gratis)</li>
              <li><strong className="text-white">Alternativa:</strong> PostgreSQL en VPS si se necesita más control</li>
              <li><strong className="text-white">Redis</strong> — En VPS, para rate limiting y colas</li>
            </ul>
            <InfoCard title="¿Por qué no SQLite?" variant="default">
              <p>SQLite no soporta conexiones concurrentes desde múltiples servicios. PostgreSQL es necesario para que Postfix, Dovecot y la API accedan simultáneamente.</p>
            </InfoCard>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Comparativa: Roundcube vs Webmail Propio</h3>
        <Table
          headers={['Aspecto', 'Roundcube (Existente)', 'Webmail Propio (Next.js)']}
          rows={[
            ['Tiempo desarrollo', '0 (solo configurar)', 'Semanas/meses'],
            ['Seguridad', 'Probada, auditada', 'Requiere auditoría propia'],
            ['UX moderna', 'Limitada (PHP/jQuery)', 'Completa (React, responsive)'],
            ['Personalización', 'Plugins/Skins limitados', 'Totalmente personalizable'],
            ['Mantenimiento', 'Updates comunidad', 'Responsabilidad propia'],
            ['Integración API', 'Limitada', 'Nativa con tu backend'],
            ['Recomendación MVP', '✅ USAR', '❌ Para fase posterior'],
          ]}
        />
        <InfoCard title="Recomendación" variant="success">
          <p><strong>Fase 1 (MVP):</strong> Usar Roundcube o SnappyMail como webmail. SnappyMail es más ligero y moderno.</p>
          <p><strong>Fase 2:</strong> Desarrollar webmail propio con Next.js cuando la base sea sólida.</p>
        </InfoCard>
      </>
    ),
  },
  {
    id: 'dns',
    title: 'Configuración DNS',
    icon: '🌐',
    content: (
      <>
        <p className="text-dark-200">Configuración DNS completa para <code className="text-primary-400 bg-dark-800 px-1.5 py-0.5 rounded text-sm">midominio.com</code> usando Cloudflare.</p>

        <h3 className="text-lg font-bold text-white mt-6 mb-3">Registros DNS necesarios</h3>
        <Table
          headers={['Tipo', 'Nombre', 'Valor', 'Prioridad', 'Propósito']}
          rows={[
            ['A', 'midominio.com', 'IP_VPS', '-', 'Servidor web + mail'],
            ['A', 'mail.midominio.com', 'IP_VPS', '-', 'Servidor de correo'],
            ['AAAA', 'midominio.com', 'IPv6_VPS', '-', 'IPv6 (opcional)'],
            ['MX', 'midominio.com', 'mail.midominio.com', '10', 'Recepción de correo'],
            ['TXT', 'midominio.com', 'v=spf1 mx a:mail.midominio.com ~all', '-', 'SPF: autoriza tu servidor'],
            ['TXT', '_default._domainkey', 'v=DKIM1; k=rsa; p=MIIBIjANBg...', '-', 'DKIM: firma mensajes'],
            ['TXT', '_dmarc.midominio.com', 'v=DMARC1; p=quarantine; rua=mailto:dmarc@midominio.com', '-', 'DMARC: política'],
            ['TXT', '_mta-sts.midominio.com', 'v=STSv1; id=20240101', '-', 'MTA-STS (opcional)'],
            ['CNAME', 'autoconfig.midominio.com', 'mail.midominio.com', '-', 'Autoconfig clientes'],
            ['SRV', '_imap._tcp.midominio.com', 'mail.midominio.com:993', '0', 'Autodiscover IMAP'],
            ['SRV', '_submission._tcp', 'mail.midominio.com:587', '0', 'Autodiscover SMTP'],
          ]}
        />

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Explicación de cada registro</h3>

        <div className="space-y-4">
          <InfoCard title="MX (Mail Exchange)" variant="default">
            <p>Indica qué servidor recibe correo para tu dominio. Prioridad 10 (único servidor). Otros servidores SMTP consultan este registro para entregar correo.</p>
          </InfoCard>

          <InfoCard title="SPF (Sender Policy Framework)" variant="default">
            <p><code className="text-primary-300 text-xs">v=spf1 mx a:mail.midominio.com ~all</code></p>
            <p>Autoriza a tu servidor a enviar correo en nombre de tu dominio. <code>~all</code> = softfail (marcar como sospechoso). Para producción usar <code>-all</code> (hardfail = rechazar).</p>
          </InfoCard>

          <InfoCard title="DKIM (DomainKeys Identified Mail)" variant="default">
            <p>Firma criptográfica que demuestra que el correo no fue alterado. La clave privada está en Postfix, la pública en DNS. Se genera con: <code className="text-primary-300 text-xs">openssl genrsa -out dkim.key 2048</code></p>
          </InfoCard>

          <InfoCard title="DMARC (Domain-based Message Authentication)" variant="default">
            <p><code className="text-primary-300 text-xs">v=DMARC1; p=quarantine; rua=mailto:dmarc@midominio.com; pct=100</code></p>
            <p>Indica a receptores qué hacer si SPF/DKIM fallan. <code>p=quarantine</code> = enviar a spam. Evolucionar a <code>p=reject</code> cuando todo funcione.</p>
          </InfoCard>

          <InfoCard title="PTR (Reverse DNS)" variant="warning">
            <p>Se configura en el panel del proveedor VPS (no en DNS). Debe coincidir: <code className="text-primary-300 text-xs">IP → mail.midominio.com</code>. Imprescindible para entregabilidad.</p>
          </InfoCard>
        </div>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Registros imprescindibles para entregabilidad</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="card p-3">
            <span className="badge bg-danger/20 text-danger border border-danger/30 mb-2">CRÍTICO</span>
            <ul className="text-sm text-dark-200 space-y-1">
              <li>• PTR / Reverse DNS</li>
              <li>• SPF válido</li>
              <li>• DKIM configurado</li>
              <li>• DMARC al menos en modo observación</li>
            </ul>
          </div>
          <div className="card p-3">
            <span className="badge bg-warning/20 text-warning border border-warning/30 mb-2">IMPORTANTE</span>
            <ul className="text-sm text-dark-200 space-y-1">
              <li>• TLS en SMTP (STARTTLS/forced)</li>
              <li>• IP de datacenter (no residencial)</li>
              <li>• No estar en blacklists</li>
              <li>• Calentamiento de IP progresivo</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'docker',
    title: 'Docker Compose',
    icon: '🐳',
    content: (
      <>
        <p className="text-dark-200">Toda la infraestructura del servidor de correo se ejecuta en contenedores Docker con un único <code className="text-primary-400 bg-dark-800 px-1.5 py-0.5 rounded text-sm">docker-compose.yml</code>.</p>

        <CodeBlock lang="docker-compose.yml">{`services:
  # ============================================
  # PROXY INVERSO - TLS automático
  # ============================================
  traefik:
    image: traefik:v3.0
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--entrypoints.smtp.address=:25"
      - "--entrypoints.submission.address=:587"
      - "--entrypoints.smtps.address=:465"
      - "--entrypoints.imaps.address=:993"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@midominio.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
      - "25:25"
      - "587:587"
      - "465:465"
      - "993:993"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik_certs:/letsencrypt
    networks:
      - mail_network
    restart: unless-stopped

  # ============================================
  # POSTFIX - Servidor SMTP
  # ============================================
  postfix:
    image: boky/postfix:latest
    environment:
      - ALLOWED_SENDER_DOMAINS=midominio.com
      - TZ=Europe/Madrid
    volumes:
      - postfix_data:/var/spool/postfix
      - ./config/postfix/main.cf:/etc/postfix/main.cf:ro
      - ./config/postfix/master.cf:/etc/postfix/master.cf:ro
      - dkim_keys:/etc/opendkim/keys
    labels:
      - "traefik.enable=false"
    ports:
      - "25:25"
      - "587:587"
    networks:
      - mail_network
    depends_on:
      - redis
    restart: unless-stopped

  # ============================================
  # DOVECOT - Servidor IMAP/LMTP
  # ============================================
  dovecot:
    image: dovecot/dovecot:latest
    volumes:
      - ./config/dovecot/dovecot.conf:/etc/dovecot/dovecot.conf:ro
      - ./config/dovecot/conf.d:/etc/dovecot/conf.d:ro
      - mail_data:/var/mail
      - dovecot_data:/var/lib/dovecot
    ports:
      - "993:993"
      - "143:143"
    networks:
      - mail_network
    depends_on:
      - postgres
    restart: unless-stopped

  # ============================================
  # RSPAMD - Filtro antispam
  # ============================================
  rspamd:
    image: rspamd/rspamd:latest
    volumes:
      - ./config/rspamd:/etc/rspamd/local.d:ro
      - rspamd_data:/var/lib/rspamd
    ports:
      - "11334:11334"  # Web UI
    networks:
      - mail_network
    restart: unless-stopped

  # ============================================
  # CLAMAV - Antivirus
  # ============================================
  clamav:
    image: clamav/clamav:latest
    volumes:
      - clamav_data:/var/lib/clamav
      - clamav_log:/var/log/clamav
    networks:
      - mail_network
    restart: unless-stopped

  # ============================================
  # REDIS - Cache y rate limiting
  # ============================================
  redis:
    image: redis:7-alpine
    command: redis-server --requirepass \${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - mail_network
    restart: unless-stopped

  # ============================================
  # POSTGRESQL - Base de datos (alternativa local)
  # ============================================
  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=mailforge
      - POSTGRES_USER=mailforge
      - POSTGRES_PASSWORD=\${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./config/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - mail_network
    restart: unless-stopped

  # ============================================
  # ROUNDCUBE - Webmail (MVP)
  # ============================================
  roundcube:
    image: roundcube/roundcubemail:latest
    environment:
      - ROUNDCUBEMAIL_DB_TYPE=pgsql
      - ROUNDCUBEMAIL_DB_HOST=postgres
      - ROUNDCUBEMAIL_DB_NAME=roundcube
      - ROUNDCUBEMAIL_DB_USER=roundcube
      - ROUNDCUBEMAIL_DB_PASS=\${ROUNDCUBE_DB_PASSWORD}
      - ROUNDCUBEMAIL_DEFAULT_HOST=ssl://dovecot
      - ROUNDCUBEMAIL_SMTP_SERVER=tls://postfix
      - ROUNDCUBEMAIL_PORT=993
      - ROUNDCUBEMAIL_SMTP_PORT=587
    volumes:
      - roundcube_data:/var/roundcube/config
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.roundcube.rule=Host(\`webmail.midominio.com\`)"
      - "traefik.http.routers.roundcube.entrypoints=websecure"
      - "traefik.http.routers.roundcube.tls.certresolver=letsencrypt"
      - "traefik.http.services.roundcube.loadbalancer.server.port=80"
    networks:
      - mail_network
    depends_on:
      - postgres
      - dovecot
      - postfix
    restart: unless-stopped

  # ============================================
  # FAIL2BAN - Protección contra fuerza bruta
  # ============================================
  fail2ban:
    image: crazymax/fail2ban:latest
    volumes:
      - ./config/fail2ban:/data
      - /var/log/mail:/var/log/mail:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      - TZ=Europe/Madrid
      - F2B_LOG_LEVEL=INFO
    network_mode: "host"
    restart: unless-stopped

volumes:
  traefik_certs:
  postfix_data:
  mail_data:
  dovecot_data:
  rspamd_data:
  clamav_data:
  clamav_log:
  redis_data:
  postgres_data:
  roundcube_data:
  dkim_keys:

networks:
  mail_network:
    driver: bridge`}</CodeBlock>

        <InfoCard title="Comunicación entre contenedores" variant="default">
          <p>Todos los servicios comparten la red <code className="text-primary-300 text-xs">mail_network</code>. Se comunican por nombre de servicio (DNS interno de Docker):</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Postfix → Rspamd: <code className="text-primary-300 text-xs">rspamd:11332</code> (filtro milter)</li>
            <li>Postfix → ClamAV: <code className="text-primary-300 text-xs">clamav:3310</code> (escaneo adjuntos)</li>
            <li>Dovecot → PostgreSQL: <code className="text-primary-300 text-xs">postgres:5432</code> (autenticación usuarios)</li>
            <li>Roundcube → Dovecot: <code className="text-primary-300 text-xs">dovecot:993</code> (IMAP)</li>
            <li>Roundcube → Postfix: <code className="text-primary-300 text-xs">postfix:587</code> (SMTP envío)</li>
          </ul>
        </InfoCard>
      </>
    ),
  },
  {
    id: 'smtp',
    title: 'Configuración SMTP',
    icon: '📤',
    content: (
      <>
        <p className="text-dark-200">Configuración de Postfix para envío y recepción de correo con TLS obligatorio.</p>

        <h3 className="text-lg font-bold text-white mt-6 mb-3">main.cf — Configuración principal</h3>
        <CodeBlock lang="config/postfix/main.cf">{`# Identificación del servidor
myhostname = mail.midominio.com
mydomain = midominio.com
myorigin = $mydomain
mydestination = localhost

# Redes permitidas (solo local, autenticación para el resto)
mynetworks = 127.0.0.0/8, 172.16.0.0/12
inet_interfaces = all
inet_protocols = all

# Buzones virtuales
virtual_mailbox_domains = pgsql:/etc/postfix/pgsql-domains.cf
virtual_mailbox_maps = pgsql:/etc/postfix/pgsql-mailboxes.cf
virtual_alias_maps = pgsql:/etc/postfix/pgsql-aliases.cf
virtual_mailbox_base = /var/mail/vhosts
virtual_minimum_uid = 100
virtual_uid_maps = static:5000
virtual_gid_maps = static:5000

# TLS - Entrante (SMTP server)
smtpd_tls_cert_file = /etc/letsencrypt/live/mail.midominio.com/fullchain.pem
smtpd_tls_key_file = /etc/letsencrypt/live/mail.midominio.com/privkey.pem
smtpd_tls_security_level = may
smtpd_tls_auth_only = yes
smtpd_tls_mandatory_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1
smtpd_tls_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1
smtpd_tls_mandatory_ciphers = medium
smtpd_tls_loglevel = 1

# TLS - Saliente (SMTP client)
smtp_tls_security_level = may
smtp_tls_mandatory_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1
smtp_tls_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1
smtp_tls_loglevel = 1

# Autenticación SASL vía Dovecot
smtpd_sasl_type = dovecot
smtpd_sasl_path = inet:dovecot:2561
smtpd_sasl_auth_enable = yes
smtpd_sasl_security_options = noanonymous
smtpd_sasl_local_domain = $mydomain

# Restricciones anti-spam / anti-relay
smtpd_relay_restrictions =
    permit_mynetworks,
    permit_sasl_authenticated,
    defer_unauth_destination

smtpd_recipient_restrictions =
    permit_mynetworks,
    permit_sasl_authenticated,
    reject_unauth_destination,
    reject_rbl_client zen.spamhaus.org,
    reject_rbl_client bl.spamcop.net,
    check_policy_service inet:redis:6379

smtpd_sender_restrictions =
    reject_unknown_sender_domain,
    reject_non_fqdn_sender

# DKIM firma (vía milter)
milter_protocol = 6
milter_default_action = accept
smtpd_milters = inet:rspamd:11332
non_smtpd_milters = inet:rspamd:11332

# Límites y colas
message_size_limit = 52428800  # 50MB
mailbox_size_limit = 0
virtual_mailbox_limit = 0
queue_run_delay = 300s
minimal_backoff_time = 300s
maximal_backoff_time = 4000s
maximal_queue_lifetime = 5d

# Rate limiting
smtpd_client_connection_rate_limit = 10
anvil_rate_time_unit = 60s`}</CodeBlock>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Puertos SMTP</h3>
        <Table
          headers={['Puerto', 'Nombre', 'Uso', 'TLS']}
          rows={[
            ['25', 'SMTP', 'Recepción de correo desde otros servidores (MTA→MTA)', 'STARTTLS (opportunistic)'],
            ['465', 'SMTPS', 'Envío autenticado (legacy, aún usado)', 'TLS implícito desde inicio'],
            ['587', 'Submission', 'Envío autenticado por clientes (recomendado)', 'STARTTLS obligatorio'],
          ]}
        />

        <InfoCard title="Protección contra Open Relay" variant="danger">
          <p>Nunca permitir que servidores no autenticados envíen correo a través de tu servidor. Las restricciones <code className="text-primary-300 text-xs">smtpd_relay_restrictions</code> garantizan que solo:</p>
          <ul className="list-disc list-inside mt-1">
            <li>Redes locales (mynetworks)</li>
            <li>Usuarios autenticados (SASL)</li>
            <li>Puedan hacer relay</li>
          </ul>
        </InfoCard>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Consultas PostgreSQL para Postfix</h3>
        <CodeBlock lang="config/postfix/pgsql-domains.cf">{`hosts = postgres
user = mailforge
password = $DB_PASSWORD
dbname = mailforge
query = SELECT domain FROM domains WHERE domain='%s' AND active=true`}</CodeBlock>
        <CodeBlock lang="config/postfix/pgsql-mailboxes.cf">{`hosts = postgres
user = mailforge
password = $DB_PASSWORD
dbname = mailforge
query = SELECT maildir FROM mailboxes WHERE email='%s' AND active=true`}</CodeBlock>
        <CodeBlock lang="config/postfix/pgsql-aliases.cf">{`hosts = postgres
user = mailforge
password = $DB_PASSWORD
dbname = mailforge
query = SELECT destination FROM aliases WHERE source='%s' AND active=true`}</CodeBlock>
      </>
    ),
  },
  {
    id: 'imap',
    title: 'Configuración IMAP',
    icon: '📥',
    content: (
      <>
        <p className="text-dark-200">Dovecot configurado para acceso IMAP seguro con autenticación contra PostgreSQL.</p>

        <CodeBlock lang="config/dovecot/dovecot.conf">{`# Protocolos habilitados
protocols = imap lmtp

# Escuchar en todas las interfaces
listen = *, ::

# Logging
log_path = /var/log/dovecot.log
info_log_path = /var/log/dovecot-info.log

# Autenticación
auth_mechanisms = plain login
disable_plaintext_auth = yes

# Passwd para autenticación contra SQL
passdb {
  driver = sql
  args = /etc/dovecot/dovecot-sql.conf.ext
}

userdb {
  driver = sql
  args = /etc/dovecot/dovecot-sql.conf.ext
}

# Servicio de autenticación para Postfix (SASL)
service auth {
  inet_listener {
    address = *
    port = 2561
  }
}

# SSL/TLS
ssl = required
ssl_cert = </etc/letsencrypt/live/mail.midominio.com/fullchain.pem
ssl_key = </etc/letsencrypt/live/mail.midominio.com/privkey.pem
ssl_min_protocol = TLSv1.2
ssl_prefer_server_ciphers = yes

# Mail location (Maildir)
mail_location = maildir:/var/mail/vhosts/%d/%n/Maildir

# Namespaces (carpetas estándar)
namespace inbox {
  inbox = yes
  separator = /

  mailbox Drafts {
    auto = subscribe
    special_use = \\Drafts
  }
  mailbox Sent {
    auto = subscribe
    special_use = \\Sent
  }
  mailbox "Sent Messages" {
    special_use = \\Sent
  }
  mailbox Trash {
    auto = subscribe
    special_use = \\Trash
  }
  mailbox Junk {
    auto = subscribe
    special_use = \\Junk
  }
  mailbox Spam {
    special_use = \\Spam
  }
  mailbox Archive {
    auto = subscribe
    special_use = \\Archive
  }
}

# LMTP para entrega local desde Postfix
service lmtp {
  unix_listener /var/spool/postfix/private/dovecot-lmtp {
    mode = 0600
    user = postfix
    group = postfix
  }
}

# Quotas
plugin {
  quota = maildir:User quota
  quota_rule = *:storage=1G
  quota_rule2 = Trash:storage=+100M
  quota_warning = storage=95%% quota-warning 95 %u
  quota_warning2 = storage=80%% quota-warning 80 %u
}

# Rate limiting
service imap-login {
  process_limit = 100
  service_count = 1
  inet_listener imap {
    port = 143
  }
  inet_listener imaps {
    port = 993
    ssl = yes
  }
}`}</CodeBlock>

        <CodeBlock lang="config/dovecot/dovecot-sql.conf.ext">{`driver = pgsql
connect = host=postgres dbname=mailforge user=mailforge password=$DB_PASSWORD
default_pass_scheme = ARGON2ID

password_query = SELECT email as user, password, \
  '/var/mail/vhosts/%d/%n' as userdb_home, \
  5000 as userdb_uid, 5000 as userdb_gid \
  FROM mailboxes WHERE email = '%u' AND active = true

user_query = SELECT '/var/mail/vhosts/%d/%n' as home, \
  5000 as uid, 5000 as gid, \
  'maildir:storage=' || quota_kb as quota \
  FROM mailboxes WHERE email = '%u' AND active = true

iterate_query = SELECT email AS user FROM mailboxes WHERE active = true`}</CodeBlock>

        <InfoCard title="Compatibilidad con clientes" variant="success">
          <p>Con esta configuración, los siguientes clientes funcionarán con autoconfiguración:</p>
          <ul className="list-disc list-inside mt-1">
            <li><strong>Thunderbird</strong> — Detecta automáticamente via autoconfig.midominio.com</li>
            <li><strong>Apple Mail</strong> — Via SRV records</li>
            <li><strong>Outlook</strong> — Configuración manual o Autodiscover</li>
            <li><strong>iOS/Android</strong> — Configuración manual con los datos IMAP/SMTP</li>
          </ul>
        </InfoCard>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Datos de configuración para clientes</h3>
        <Table
          headers={['Parámetro', 'IMAP (recepción)', 'SMTP (envío)']}
          rows={[
            ['Servidor', 'mail.midominio.com', 'mail.midominio.com'],
            ['Puerto', '993', '587'],
            ['Seguridad', 'SSL/TLS', 'STARTTLS'],
            ['Autenticación', 'Contraseña normal', 'Contraseña normal'],
            ['Usuario', 'email@midominio.com', 'email@midominio.com'],
          ]}
        />
      </>
    ),
  },
  {
    id: 'security',
    title: 'Seguridad',
    icon: '🔒',
    content: (
      <>
        <p className="text-dark-200">La seguridad es la prioridad absoluta. Cada capa del sistema implementa medidas específicas.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard title="TLS/SSL" variant="success">
            <ul className="list-disc list-inside space-y-1">
              <li>TLS obligatorio en SMTP (smtpd_tls_auth_only=yes)</li>
              <li>TLS obligatorio en IMAP (ssl=required)</li>
              <li>Mínimo TLSv1.2 (bloqueados SSLv3, TLSv1, TLSv1.1)</li>
              <li>Certificados Let's Encrypt con auto-renovación</li>
              <li>Ciphers modernos, preferencia del servidor</li>
            </ul>
          </InfoCard>

          <InfoCard title="Contraseñas" variant="success">
            <ul className="list-disc list-inside space-y-1">
              <li>Almacenamiento: Argon2id (resistente a GPU/ASIC)</li>
              <li>Min 12 caracteres, complejidad obligatoria</li>
              <li>Hash con salt único por usuario</li>
              <li>Rotación periódica recomendada</li>
              <li>Nunca en texto plano ni logs</li>
            </ul>
          </InfoCard>

          <InfoCard title="Protección de acceso" variant="warning">
            <ul className="list-disc list-inside space-y-1">
              <li>Fail2ban: 5 intentos → ban 1 hora</li>
              <li>Rate limiting Redis: 10 conexiones/minuto</li>
              <li>Firewall UFW: solo puertos necesarios</li>
              <li>SSH: key-only, puerto alternativo</li>
              <li>MFA opcional para webmail/admin</li>
            </ul>
          </InfoCard>

          <InfoCard title="Autenticación correo" variant="success">
            <ul className="list-disc list-inside space-y-1">
              <li>SPF: autoriza IPs que pueden enviar</li>
              <li>DKIM: firma criptográfica (RSA 2048-bit)</li>
              <li>DMARC: política de rechazo</li>
              <li>MTA-STS: fuerza TLS entre servidores</li>
              <li>TLS Reporting (TLSRPT)</li>
            </ul>
          </InfoCard>
        </div>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Firewall (UFW)</h3>
        <CodeBlock lang="bash">{`# Habilitar UFW
sudo ufw enable

# SSH (puerto alternativo)
sudo ufw allow 2222/tcp comment 'SSH'

# Web (Traefik)
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'

# SMTP
sudo ufw allow 25/tcp comment 'SMTP'
sudo ufw allow 587/tcp comment 'Submission'
sudo ufw allow 465/tcp comment 'SMTPS'

# IMAP
sudo ufw allow 993/tcp comment 'IMAPS'

# Denegar todo lo demás por defecto
sudo ufw default deny incoming
sudo ufw default allow outgoing`}</CodeBlock>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Fail2ban — Configuración</h3>
        <CodeBlock lang="config/fail2ban/jail.d/mail.conf">{`[postfix-sasl]
enabled  = true
port     = smtp,465,submission
filter   = postfix[mode=auth]
logpath  = /var/log/mail/mail.log
maxretry = 5
bantime  = 3600
findtime = 600

[dovecot-auth]
enabled  = true
port     = imaps,993
filter   = dovecot[mode=aggressive]
logpath  = /var/log/mail/dovecot.log
maxretry = 5
bantime  = 3600
findtime = 600

[traefik-auth]
enabled  = true
port     = http,https
filter   = traefik-auth
logpath  = /var/log/traefik/access.log
maxretry = 10
bantime  = 7200`}</CodeBlock>

        <InfoCard title="Gestión de secretos" variant="danger">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>NUNCA</strong> commitear .env, claves privadas o certificados al repo</li>
            <li>Usar <code className="text-primary-300 text-xs">.env.example</code> como plantilla</li>
            <li>GitHub Secrets para CI/CD</li>
            <li>Vercel Environment Variables para producción</li>
            <li>Docker secrets o archivos montados para VPS</li>
            <li>Rotación de claves DKIM cada 6-12 meses</li>
          </ul>
        </InfoCard>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Riesgos de operar correo propio</h3>
        <div className="space-y-3">
          <InfoCard title="Riesgo: IP en blacklist" variant="danger">
            <p>Si tu IP es marcada como spam, todos tus correos serán rechazados. Mitigación: monitorear blacklists, configurar correctamente SPF/DKIM/DMARC, no enviar spam, responder a abuse reports.</p>
          </InfoCard>
          <InfoCard title="Riesgo: Servidor comprometido" variant="danger">
            <p>Un servidor de correo expuesto es objetivo de ataques. Mitigación: actualizaciones automáticas, fail2ban, firewall estricto, mínimo privilegio, auditoría de logs.</p>
          </InfoCard>
          <InfoCard title="Riesgo: Pérdida de datos" variant="warning">
            <p>Sin backups, perder correos es irreversible. Mitigación: backups diarios cifrados, retención 30 días, pruebas de restauración mensuales.</p>
          </InfoCard>
        </div>
      </>
    ),
  },
  {
    id: 'spam',
    title: 'Antispam y Antivirus',
    icon: '🛡️',
    content: (
      <>
        <p className="text-dark-200">Rspamd como filtro principal y ClamAV para escaneo de adjuntos.</p>

        <h3 className="text-lg font-bold text-white mt-6 mb-3">¿Por qué Rspamd y no SpamAssassin?</h3>
        <Table
          headers={['Aspecto', 'Rspamd', 'SpamAssassin']}
          rows={[
            ['Rendimiento', 'C, muy rápido', 'Perl, más lento'],
            ['Memoria', '~50-100MB', '~200-500MB'],
            ['Web UI', 'Incluida', 'Necesita addon'],
            ['Configuración', 'Lua, moderna', 'Perl, legacy'],
            ['Bayes', 'Integrado', 'Integrado'],
            ['DKIM', 'Sign + verify', 'Solo verify'],
            ['Redis', 'Nativo', 'Plugin'],
            ['Comunidad', 'Activa, moderna', 'Estable, legacy'],
          ]}
        />

        <CodeBlock lang="config/rspamd/worker-normal.conf">{`bind_socket = "*:11333";
count = 2;

# Score para marcar como spam
score_threshold = 15.0;

# Acciones
actions {
  reject = 15;
  add_header = 6;
  greylist = 4;
}

# DKIM signing
dkim_signing {
  sign_authenticated = true;
  sign_local = true;
  symbol = "DKIM_SIGNED";
  use_domain = "envelope";
  use_esld = true;
  allow_envfrom_empty = true;
}

selector {
  algorithm = "domain";
  selector = "default";
}`}</CodeBlock>

        <CodeBlock lang="config/rspamd/classifier-bayes.conf">{`autolearn = true;
backend = "redis";
min_learns = 200;

new_learn_score_perday = 1000;

per_user = false;

servers = "redis:6379";`}</CodeBlock>

        <CodeBlock lang="config/rspamd/antivirus.conf">{`clamav {
  action = "reject";
  type = "clamav";
  symbols {
    symbol = "CLAM_VIRUS";
    score = 15;
  }
  servers = "clamav:3310";
  scan_mime_parts = true;
  max_size = 52428800;  # 50MB
  whitelist = "/etc/rspamd/antivirus.wl";
}`}</CodeBlock>

        <InfoCard title="Flujo de filtrado" variant="default">
          <ol className="list-decimal list-inside space-y-1">
            <li>Correo llega a Postfix (puerto 25)</li>
            <li>Postfix envía a Rspamd via milter (puerto 11332)</li>
            <li>Rspamd ejecuta: SPF check, DKIM verify, Bayesian, DNSBL, URI checks</li>
            <li>Rspamd envía a ClamAV si hay adjuntos</li>
            <li>Score total determina acción: aceptar / marcar / rechazar</li>
            <li>Si pasa filtros → Dovecot LMTP entrega al buzón</li>
          </ol>
        </InfoCard>
      </>
    ),
  },
  {
    id: 'database',
    title: 'Base de Datos',
    icon: '🗄️',
    content: (
      <>
        <p className="text-dark-200">Esquema PostgreSQL para gestión de usuarios, dominios, buzones y auditoría.</p>

        <CodeBlock lang="config/postgres/init.sql">{`-- ============================================
-- MAILFORGE - Schema de Base de Datos
-- ============================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- DOMINIOS
-- ============================================
CREATE TABLE domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    max_mailboxes INTEGER DEFAULT 100,
    max_quota BIGINT DEFAULT 10737418240, -- 10GB total
    dkim_selector VARCHAR(63) DEFAULT 'default',
    dkim_private_key TEXT,
    dkim_public_key TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USUARIOS (admins del sistema)
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Argon2id
    role VARCHAR(20) DEFAULT 'user', -- admin, user
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret TEXT,
    last_login_at TIMESTAMPTZ,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BUZONES DE CORREO
-- ============================================
CREATE TABLE mailboxes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
    password_hash TEXT NOT NULL, -- Argon2id
    name VARCHAR(255),
    maildir VARCHAR(255) NOT NULL,
    quota_kb BIGINT DEFAULT 1048576, -- 1GB default
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_mailboxes_domain ON mailboxes(domain_id);
CREATE INDEX idx_mailboxes_active ON mailboxes(active);

-- ============================================
-- ALIAS
-- ============================================
CREATE TABLE aliases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(255) NOT NULL,
    destination TEXT NOT NULL, -- comma-separated emails
    domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_aliases_source ON aliases(source);

-- ============================================
-- SESIONES
-- ============================================
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- ============================================
-- LOGS DE AUDITORÍA
-- ============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- login, create_mailbox, delete_alias, etc.
    resource_type VARCHAR(50), -- mailbox, domain, alias, user
    resource_id UUID,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- ============================================
-- CONFIGURACIÓN
-- ============================================
CREATE TABLE mail_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VISTAS PARA POSTFIX
-- ============================================
CREATE VIEW postfix_domains AS
SELECT domain FROM domains WHERE active = true;

CREATE VIEW postfix_mailboxes AS
SELECT email, maildir FROM mailboxes WHERE active = true;

CREATE VIEW postfix_aliases AS
SELECT source, destination FROM aliases WHERE active = true;

-- ============================================
-- FUNCIÓN: Actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_domains_updated_at
    BEFORE UPDATE ON domains
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_mailboxes_updated_at
    BEFORE UPDATE ON mailboxes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_aliases_updated_at
    BEFORE UPDATE ON aliases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();`}</CodeBlock>

        <InfoCard title="Hosting de PostgreSQL" variant="default">
          <p><strong>Opción A (Free):</strong> Supabase — 500MB, 2 proyectos gratis, conexiones ilimitadas</p>
          <p><strong>Opción B (Free):</strong> Neon — 512MB, serverless, branches, autoscaling</p>
          <p><strong>Opción C (VPS):</strong> PostgreSQL local en Docker — máximo control, requiere backups propios</p>
          <p className="mt-2"><strong>Recomendación MVP:</strong> PostgreSQL en VPS (Docker) para que Postfix y Dovecot accedan con latencia mínima.</p>
        </InfoCard>
      </>
    ),
  },
  {
    id: 'api',
    title: 'API Backend',
    icon: '🔌',
    content: (
      <>
        <p className="text-dark-200">API REST en Next.js API Routes (Vercel serverless) para gestión completa del sistema.</p>

        <h3 className="text-lg font-bold text-white mt-6 mb-3">Endpoints principales</h3>
        <Table
          headers={['Método', 'Endpoint', 'Descripción', 'Auth']}
          rows={[
            ['POST', '/api/auth/login', 'Autenticación', 'Público'],
            ['POST', '/api/auth/logout', 'Cerrar sesión', 'Bearer'],
            ['GET', '/api/users', 'Listar usuarios', 'Admin'],
            ['POST', '/api/users', 'Crear usuario', 'Admin'],
            ['PUT', '/api/users/:id', 'Actualizar usuario', 'Admin'],
            ['DELETE', '/api/users/:id', 'Eliminar usuario', 'Admin'],
            ['GET', '/api/domains', 'Listar dominios', 'Admin'],
            ['POST', '/api/domains', 'Crear dominio', 'Admin'],
            ['POST', '/api/domains/:id/dkim', 'Generar DKIM', 'Admin'],
            ['GET', '/api/mailboxes', 'Listar buzones', 'Admin'],
            ['POST', '/api/mailboxes', 'Crear buzón', 'Admin'],
            ['PUT', '/api/mailboxes/:id', 'Actualizar buzón', 'Admin'],
            ['DELETE', '/api/mailboxes/:id', 'Eliminar buzón', 'Admin'],
            ['GET', '/api/aliases', 'Listar alias', 'Admin'],
            ['POST', '/api/aliases', 'Crear alias', 'Admin'],
            ['DELETE', '/api/aliases/:id', 'Eliminar alias', 'Admin'],
            ['GET', '/api/mail/inbox', 'Listar correos (IMAP)', 'Bearer'],
            ['POST', '/api/mail/send', 'Enviar correo', 'Bearer'],
            ['GET', '/api/audit-logs', 'Logs de auditoría', 'Admin'],
          ]}
        />

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Ejemplo: API Route — Crear buzón</h3>
        <CodeBlock lang="apps/api/app/api/mailboxes/route.ts">{`import { NextRequest, NextResponse } from 'next/server';
import { hash } from '@node-rs/argon2';
import { db } from '@/lib/db';
import { authMiddleware } from '@/lib/auth';
import { createMailboxSchema } from '@/lib/validators';

// POST /api/mailboxes - Crear nuevo buzón
export async function POST(request: NextRequest) {
  // 1. Autenticación (solo admin)
  const user = await authMiddleware(request, 'admin');
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Validar input
    const body = await request.json();
    const parsed = createMailboxSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { localPart, domainId, password, name, quotaKb } = parsed.data;

    // 3. Verificar dominio existe y está activo
    const domain = await db.query(
      'SELECT * FROM domains WHERE id = $1 AND active = true',
      [domainId]
    );
    if (domain.rows.length === 0) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    const email = \`\${localPart}@\${domain.rows[0].domain}\`;

    // 4. Verificar que no existe ya
    const existing = await db.query(
      'SELECT id FROM mailboxes WHERE email = $1',
      [email]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Mailbox already exists' },
        { status: 409 }
      );
    }

    // 5. Hashear contraseña con Argon2id
    const passwordHash = await hash(password, {
      algorithm: 'argon2id',
      memory: 65536,    // 64MB
      iterations: 3,
      parallelism: 4,
      outputLen: 32,
    });

    // 6. Crear directorio Maildir en VPS (vía SSH/API interna)
    const maildir = \`/var/mail/vhosts/\${domain.rows[0].domain}/\${localPart}/Maildir\`;
    await createMaildirOnServer(maildir);

    // 7. Insertar en base de datos
    const result = await db.query(
      \`INSERT INTO mailboxes (email, domain_id, password_hash, name, maildir, quota_kb)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, name, maildir, quota_kb, created_at\`,
      [email, domainId, passwordHash, name, maildir, quotaKb || 1048576]
    );

    // 8. Log de auditoría
    await db.query(
      \`INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address)
       VALUES ($1, 'create_mailbox', 'mailbox', $2, $3, $4)\`,
      [user.id, result.rows[0].id, JSON.stringify({ email, domain: domain.rows[0].domain }), request.headers.get('x-forwarded-for')]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Create mailbox error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/mailboxes - Listar buzones
export async function GET(request: NextRequest) {
  const user = await authMiddleware(request, 'admin');
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const domainId = searchParams.get('domainId');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;

  let query = 'SELECT id, email, name, maildir, quota_kb, active, created_at FROM mailboxes';
  const params: any[] = [];

  if (domainId) {
    query += ' WHERE domain_id = $1';
    params.push(domainId);
  }

  query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);

  const result = await db.query(query, params);

  return NextResponse.json({
    data: result.rows,
    page,
    limit,
  });
}`}</CodeBlock>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Ejemplo: Enviar correo vía API</h3>
        <CodeBlock lang="apps/api/app/api/mail/send/route.ts">{`import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { authMiddleware } from '@/lib/auth';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,     // mail.midominio.com
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  const user = await authMiddleware(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { to, subject, text, html, attachments } = await request.json();

  try {
    const info = await transporter.sendMail({
      from: user.email,
      to,
      subject,
      text,
      html,
      attachments,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send email', details: (error as Error).message },
      { status: 500 }
    );
  }
}`}</CodeBlock>
      </>
    ),
  },
  {
    id: 'frontend',
    title: 'Frontend / Webmail',
    icon: '🖥️',
    content: (
      <>
        <p className="text-dark-200">Frontend Next.js desplegado en Vercel. Incluye webmail y panel de administración.</p>

        <h3 className="text-lg font-bold text-white mt-6 mb-3">Estructura del proyecto Next.js</h3>
        <CodeBlock lang="tree">{`apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard principal
│   │   ├── mail/
│   │   │   ├── page.tsx          # Bandeja de entrada
│   │   │   ├── compose/page.tsx  # Redactar
│   │   │   └── [id]/page.tsx     # Leer correo
│   │   ├── admin/
│   │   │   ├── users/page.tsx
│   │   │   ├── domains/page.tsx
│   │   │   ├── mailboxes/page.tsx
│   │   │   ├── aliases/page.tsx
│   │   │   └── audit/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── mailboxes/route.ts
│   │   ├── mail/send/route.ts
│   │   └── mail/inbox/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Table.tsx
│   ├── mail/
│   │   ├── MailList.tsx
│   │   ├── MailViewer.tsx
│   │   ├── ComposeForm.tsx
│   │   └── FolderSidebar.tsx
│   └── admin/
│       ├── UserForm.tsx
│       ├── DomainForm.tsx
│       └── MailboxForm.tsx
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   ├── validators.ts
│   └── imap-client.ts
├── types/
│   └── index.ts
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json`}</CodeBlock>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Ejemplo: Componente MailList</h3>
        <CodeBlock lang="apps/web/components/mail/MailList.tsx">{`'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Email {
  uid: number;
  from: string;
  subject: string;
  date: string;
  seen: boolean;
  flagged: boolean;
  size: number;
}

export function MailList({ folder = 'INBOX' }: { folder?: string }) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetchEmails();
  }, [folder]);

  async function fetchEmails() {
    setLoading(true);
    try {
      const res = await fetch(\`/api/mail/inbox?folder=\${folder}\`);
      const data = await res.json();
      setEmails(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch emails:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="divide-y divide-dark-700">
      {emails.map((email) => (
        <button
          key={email.uid}
          onClick={() => setSelectedId(email.uid)}
          className={\`w-full text-left px-4 py-3 hover:bg-dark-800 transition-colors
            \${selectedId === email.uid ? 'bg-dark-800 border-l-2 border-primary-500' : ''}
            \${!email.seen ? 'bg-dark-800/50' : ''}\`}
        >
          <div className="flex items-center justify-between">
            <span className={\`text-sm truncate \${!email.seen ? 'font-semibold text-white' : 'text-dark-200'}\`}>
              {email.from}
            </span>
            <span className="text-xs text-dark-400">
              {format(new Date(email.date), 'dd MMM HH:mm')}
            </span>
          </div>
          <p className={\`text-sm truncate mt-0.5 \${!email.seen ? 'text-dark-100' : 'text-dark-300'}\`}>
            {email.subject || '(Sin asunto)'}
          </p>
        </button>
      ))}
      {emails.length === 0 && (
        <div className="text-center py-12 text-dark-400">
          <p>No hay mensajes en esta carpeta</p>
        </div>
      )}
    </div>
  );
}`}</CodeBlock>

        <InfoCard title="Conexión IMAP desde Vercel" variant="warning">
          <p>Las API routes de Vercel pueden conectarse al servidor IMAP del VPS. El flujo es:</p>
          <ol className="list-decimal list-inside mt-1">
            <li>Frontend → API Route (Vercel serverless)</li>
            <li>API Route → imapflow → Dovecot (VPS:993)</li>
            <li>Respuesta con mensajes formateados</li>
          </ol>
          <p className="mt-2">Esto funciona porque las serverless functions pueden hacer conexiones TCP salientes.</p>
        </InfoCard>
      </>
    ),
  },
  {
    id: 'free-services',
    title: 'Servicios Gratuitos',
    icon: '💰',
    content: (
      <>
        <p className="text-dark-200">Servicios cloud gratuitos utilizados en la arquitectura. Todos verificados a 2025.</p>

        <Table
          headers={['Servicio', 'Uso', 'Free Tier', 'Límites']}
          rows={[
            ['Vercel', 'Frontend + API', 'Hobby (gratis)', '100GB bandwidth, serverless functions'],
            ['Supabase', 'PostgreSQL + Auth', 'Free tier', '500MB DB, 2 proyectos, 50K MAU'],
            ['Neon', 'PostgreSQL alt.', 'Free tier', '512MB, serverless, branches'],
            ['Cloudflare', 'DNS + CDN', 'Free', 'DNS ilimitado, CDN, DDoS protection'],
            ['GitHub', 'Repos + CI/CD', 'Free', '2000 min/month Actions, 500MB packages'],
            ['Let\'s Encrypt', 'Certificados TLS', 'Gratis', 'Renovación cada 90 días, auto'],
            ['Uptime Kuma', 'Monitorización', 'Self-hosted', 'Sin límites (tu VPS)'],
            ['Backblaze B2', 'Backups S3', '10GB gratis', '10GB storage, 1GB/día download'],
            ['Hetzner', 'VPS (no free)', '~4€/mes', 'CX11: 2 vCPU, 2GB RAM, 20GB SSD'],
          ]}
        />

        <h3 className="text-lg font-bold text-white mt-8 mb-3">VPS — La pieza necesaria</h3>
        <InfoCard title="¿Por qué necesitamos un VPS?" variant="warning">
          <p>No existe un servicio gratuito que permita ejecutar Postfix/Dovecot con puertos SMTP/IMAP. Un VPS económico es imprescindible.</p>
        </InfoCard>

        <Table
          headers={['Proveedor', 'Plan', 'CPU', 'RAM', 'Disco', 'Precio/mes', 'Notas']}
          rows={[
            ['Hetzner', 'CX11', '2 vCPU', '2GB', '20GB SSD', '~4€', 'Mejor calidad/precio EU'],
            ['Hetzner', 'CX22', '2 vCPU', '4GB', '40GB SSD', '~5€', 'Recomendado'],
            ['OVH', 'Starter', '1 vCPU', '2GB', '20GB', '~3.5€', 'Económico'],
            ['DigitalOcean', 'Basic', '1 vCPU', '1GB', '25GB', '$6', 'Popular, buen docs'],
            ['Vultr', 'Cloud Compute', '1 vCPU', '1GB', '25GB', '$6', 'Múltiples regiones'],
            ['Contabo', 'VPS S', '4 vCPU', '8GB', '50GB', '~5€', 'Mucho recurso, calidad variable'],
          ]}
        />

        <InfoCard title="Recomendación MVP" variant="success">
          <p><strong>Hetzner CX22 (4-5€/mes)</strong> — Suficiente para 5-50 buzones, excelente rendimiento, datacenter EU (Alemania/Finlandia), buena reputación de IP.</p>
          <p className="mt-1"><strong>Coste total mensual estimado:</strong> ~5€ (VPS) + 0€ (todo lo demás) = <strong>~5€/mes</strong></p>
        </InfoCard>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Riesgos del free tier</h3>
        <div className="space-y-3">
          <InfoCard title="Supabase Free" variant="warning">
            <p>500MB de base de datos. Si se llena, la DB se pausa. Proyectos inactivos 7 días se pausan. No hay SLA. Para producción considerar el plan Pro ($25/mes).</p>
          </InfoCard>
          <InfoCard title="Vercel Hobby" variant="warning">
            <p>100GB bandwidth/mes. Serverless functions con timeout 10s (hobby). No incluye analytics avanzados. Para producción: Pro ($20/mes).</p>
          </InfoCard>
          <InfoCard title="VPS económico" variant="danger">
            <p>Proveedores baratos pueden tener IPs con mala reputación. Verificar que la IP no esté en blacklists antes de configurar correo. Hetner y OVH tienen buena reputación general.</p>
          </InfoCard>
        </div>
      </>
    ),
  },
  {
    id: 'github',
    title: 'GitHub y CI/CD',
    icon: '📦',
    content: (
      <>
        <p className="text-dark-200">Estructura profesional del repositorio y flujos de CI/CD.</p>

        <h3 className="text-lg font-bold text-white mt-6 mb-3">Estructura del repositorio</h3>
        <CodeBlock lang="tree">{`mailforge/
├── README.md
├── LICENSE
├── .env.example
├── .gitignore
├── docker-compose.yml
├── docker-compose.prod.yml
│
├── apps/
│   ├── web/                    # Frontend + Webmail (Next.js)
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   └── api/                    # API interna VPS (opcional)
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
│
├── infrastructure/
│   ├── postfix/
│   │   ├── main.cf
│   │   ├── master.cf
│   │   ├── pgsql-domains.cf
│   │   ├── pgsql-mailboxes.cf
│   │   └── pgsql-aliases.cf
│   │
│   ├── dovecot/
│   │   ├── dovecot.conf
│   │   ├── dovecot-sql.conf.ext
│   │   └── conf.d/
│   │
│   ├── rspamd/
│   │   ├── worker-normal.conf
│   │   ├── classifier-bayes.conf
│   │   └── antivirus.conf
│   │
│   ├── fail2ban/
│   │   └── jail.d/
│   │       └── mail.conf
│   │
│   ├── postgres/
│   │   └── init.sql
│   │
│   ├── nginx/                  # Config alternativa si no se usa Traefik
│   │   └── nginx.conf
│   │
│   └── scripts/
│       ├── setup.sh            # Script de instalación inicial
│       ├── backup.sh           # Script de backup
│       ├── restore.sh          # Script de restauración
│       ├── generate-dkim.sh    # Generar claves DKIM
│       └── check-deliverability.sh  # Verificar entregabilidad
│
├── packages/
│   └── shared/                 # Tipos y utilidades compartidas
│       ├── types/
│       └── validators/
│
├── docs/
│   ├── architecture.md
│   ├── dns-setup.md
│   ├── deployment.md
│   ├── security.md
│   ├── troubleshooting.md
│   └── api-reference.md
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Tests + lint en PR
│   │   ├── deploy-web.yml      # Deploy frontend a Vercel
│   │   ├── deploy-mail.yml     # Deploy config al VPS
│   │   └── security-scan.yml   # Escaneo de seguridad
│   │
│   ├── CODEOWNERS
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── scripts/
    ├── dev.sh
    └── production-checklist.sh`}</CodeBlock>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">GitHub Actions — CI</h3>
        <CodeBlock lang=".github/workflows/ci.yml">{`name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Unit tests
        run: npm run test:unit

      - name: Build
        run: npm run build

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          severity: 'CRITICAL,HIGH'

      - name: npm audit
        run: npm audit --production --audit-level=high`}</CodeBlock>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">GitHub Actions — Deploy al VPS</h3>
        <CodeBlock lang=".github/workflows/deploy-mail.yml">{`name: Deploy Mail Server

on:
  push:
    branches: [main]
    paths:
      - 'infrastructure/**'
      - 'docker-compose*.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to VPS via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_SSH_KEY }}
          port: \${{ secrets.VPS_PORT }}
          script: |
            cd /opt/mailforge
            git pull origin main
            docker compose pull
            docker compose up -d --remove-orphans
            docker compose exec postfix postfix reload
            docker compose exec dovecot doveadm reload
            docker system prune -f

      - name: Verify deployment
        run: |
          sleep 10
          # Verificar que los servicios están corriendo
          echo "Checking SMTP..."
          timeout 5 bash -c 'echo QUIT | openssl s_client -connect \${{ secrets.VPS_HOST }}:465' || exit 1
          echo "Checking IMAP..."
          timeout 5 bash -c 'echo QUIT | openssl s_client -connect \${{ secrets.VPS_HOST }}:993' || exit 1
          echo "✅ All services running"`}</CodeBlock>

        <InfoCard title="Seguridad en CI/CD" variant="danger">
          <ul className="list-disc list-inside space-y-1">
            <li>SSH keys almacenadas en <strong>GitHub Secrets</strong> (nunca en código)</li>
            <li>Variables de entorno en <strong>GitHub Environments</strong> con protection rules</li>
            <li>Deploy solo desde rama <code className="text-primary-300 text-xs">main</code></li>
            <li>Revisión obligatoria de PRs antes de merge</li>
            <li>Branch protection rules activadas</li>
          </ul>
        </InfoCard>
      </>
    ),
  },
  {
    id: 'vercel',
    title: 'Configuración Vercel',
    icon: '▲',
    content: (
      <>
        <p className="text-dark-200">Configuración del proyecto Next.js para despliegue en Vercel.</p>

        <h3 className="text-lg font-bold text-white mt-6 mb-3">next.config.js</h3>
        <CodeBlock lang="apps/web/next.config.js">{`/** @type {import('next').NextConfig} */
const nextConfig = {
  // API routes como serverless functions
  experimental: {
    serverActions: true,
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://mail.midominio.com;",
          },
        ],
      },
    ];
  },

  // Rewrites para API interna (si es necesario)
  async rewrites() {
    return [
      {
        source: '/api/internal/:path*',
        destination: 'https://mail.midominio.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;`}</CodeBlock>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Variables de entorno en Vercel</h3>
        <CodeBlock lang=".env (Vercel Environment Variables)">{`# Base de datos
DATABASE_URL=postgresql://user:pass@db.supabase.co:5432/mailforge
DIRECT_URL=postgresql://user:pass@db.supabase.co:5432/mailforge

# SMTP (conexión al VPS)
SMTP_HOST=mail.midominio.com
SMTP_PORT=587
SMTP_USER=noreply@midominio.com
SMTP_PASSWORD=***

# IMAP (conexión al VPS)
IMAP_HOST=mail.midominio.com
IMAP_PORT=993

# Autenticación
NEXTAUTH_URL=https://mail.midominio.com
NEXTAUTH_SECRET=***

# Admin
ADMIN_EMAIL=admin@midominio.com

# API interna VPS
INTERNAL_API_URL=https://mail.midominio.com/api
INTERNAL_API_KEY=***`}</CodeBlock>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">vercel.json</h3>
        <CodeBlock lang="apps/web/vercel.json">{`{
  "framework": "nextjs",
  "regions": ["fra1"],
  "functions": {
    "app/api/mail/**/*.ts": {
      "maxDuration": 30
    },
    "app/api/auth/**/*.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" },
        { "key": "Access-Control-Allow-Origin", "value": "https://mail.midominio.com" }
      ]
    }
  ]
}`}</CodeBlock>

        <InfoCard title="Despliegue automático" variant="success">
          <p>Vercel se conecta directamente al repositorio GitHub. Cada push a <code className="text-primary-300 text-xs">main</code> dispara un deploy automático. No se necesitan GitHub Actions para el frontend.</p>
          <p className="mt-2"><strong>Pasos:</strong></p>
          <ol className="list-decimal list-inside mt-1">
            <li>Importar repo en vercel.com</li>
            <li>Seleccionar root directory: <code className="text-primary-300 text-xs">apps/web</code></li>
            <li>Configurar variables de entorno</li>
            <li>Deploy automático en cada push</li>
          </ol>
        </InfoCard>
      </>
    ),
  },
  {
    id: 'env',
    title: 'Variables de Entorno',
    icon: '🔑',
    content: (
      <>
        <p className="text-dark-200">Archivo <code className="text-primary-400 bg-dark-800 px-1.5 py-0.5 rounded text-sm">.env.example</code> completo como plantilla.</p>

        <CodeBlock lang=".env.example">{`# ============================================
# MAILFORGE - Variables de Entorno
# COPIAR A .env Y RELENAR
# NUNCA commitear .env al repositorio
# ============================================

# ---------- DOMINIO ----------
DOMAIN=midominio.com
MAIL_HOSTNAME=mail.midominio.com
WEBMAIL_HOSTNAME=webmail.midominio.com
ADMIN_HOSTNAME=admin.midominio.com

# ---------- VPS ----------
VPS_IP=xxx.xxx.xxx.xxx
VPS_HOST=mail.midominio.com

# ---------- POSTFIX ----------
POSTFIX_MYHOSTNAME=mail.midominio.com
POSTFIX_MYDOMAIN=midominio.com
POSTFIX_MYNETWORKS=127.0.0.0/8,172.16.0.0/12

# ---------- DOVECOT ----------
DOVECOT_MAIL_LOCATION=maildir:/var/mail/vhosts/%d/%n/Maildir
DOVECOT_DEFAULT_QUOTA=1048576

# ---------- POSTGRESQL ----------
DB_HOST=postgres
DB_PORT=5432
DB_NAME=mailforge
DB_USER=mailforge
DB_PASSWORD=cambiar_esto_por_password_seguro

# ---------- REDIS ----------
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=cambiar_esto_por_password_seguro

# ---------- RSPAMD ----------
RSPAMD_WEB_PASSWORD=cambiar_esto_por_password_seguro

# ---------- LET'S ENCRYPT ----------
ACME_EMAIL=admin@midominio.com

# ---------- VERCEL / APP ----------
NEXTAUTH_URL=https://mail.midominio.com
NEXTAUTH_SECRET=generar_con_openssl_rand_hex_32
SMTP_HOST=mail.midominio.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
IMAP_HOST=mail.midominio.com
IMAP_PORT=993

# ---------- DKIM ----------
DKIM_SELECTOR=default
DKIM_KEY_LENGTH=2048

# ---------- BACKUPS ----------
BACKUP_DIR=/backups
BACKUP_RETENTION_DAYS=30
B2_BUCKET_ID=
B2_APP_KEY_ID=
B2_APP_KEY=

# ---------- MONITORIZACIÓN ----------
UPTIME_KUMA_URL=https://status.midominio.com
UPTIME_KUMA_TOKEN=`}</CodeBlock>

        <InfoCard title="Generar secretos seguros" variant="default">
          <CodeBlock lang="bash">{`# Generar password aleatorio
openssl rand -base64 32

# Generar NEXTAUTH_SECRET
openssl rand -hex 32

# Generar DKIM key pair
openssl genrsa -out dkim.private 2048
openssl rsa -in dkim.private -pubout -out dkim.public

# Verificar que .env está en .gitignore
grep ".env" .gitignore || echo ".env" >> .gitignore`}</CodeBlock>
        </InfoCard>
      </>
    ),
  },
  {
    id: 'monitoring',
    title: 'Monitorización',
    icon: '📊',
    content: (
      <>
        <p className="text-dark-200">Sistema de monitorización para mantener la salud del servidor de correo.</p>

        <h3 className="text-lg font-bold text-white mt-6 mb-3">Qué monitorizar</h3>
        <Table
          headers={['Métrica', 'Herramienta', 'Alerta si...']}
          rows={[
            ['Estado SMTP (25/587/465)', 'Uptime Kuma', 'No responde en 30s'],
            ['Estado IMAP (993)', 'Uptime Kuma', 'No responde en 30s'],
            ['Cola de correo', 'postfix queue', '> 100 mensajes'],
            ['Espacio en disco', 'df / node_exporter', '> 80% uso'],
            ['CPU', 'htop / node_exporter', '> 90% sostenido'],
            ['RAM', 'free / node_exporter', '> 85% uso'],
            ['Certificados TLS', 'ssl-check script', '< 14 días para expirar'],
            ['Blacklists', 'mxtoolbox check', 'Aparece en alguna RBL'],
            ['Fail2ban bans', 'fail2ban-client', '> 50 bans/hora (ataque)'],
            ['Reputación IP', 'mxtoolbox/talos', 'Score bajo'],
            ['Logs de errores', 'docker logs / Loki', 'Errores críticos'],
            ['Bounce rate', 'Postfix logs', '> 5% de rebotes'],
          ]}
        />

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Script de verificación de salud</h3>
        <CodeBlock lang="infrastructure/scripts/health-check.sh">{`#!/bin/bash
# health-check.sh - Verifica el estado de todos los servicios

set -e

RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m'

MAIL_DOMAIN="midominio.com"
MAIL_HOST="mail.midominio.com"
ERRORS=0

check_service() {
    local name=$1
    local command=$2
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "\${GREEN}✓\${NC} $name"
    else
        echo -e "\${RED}✗\${NC} $name"
        ERRORS=$((ERRORS + 1))
    fi
}

echo "=== MailForge Health Check ==="
echo ""

# Docker containers
echo "--- Contenedores Docker ---"
check_service "Postfix" "docker compose exec postfix postfix status"
check_service "Dovecot" "docker compose exec dovecot doveconf -n"
check_service "Rspamd" "docker compose exec rspamd rspamc stat"
check_service "Redis" "docker compose exec redis redis-cli ping"
check_service "PostgreSQL" "docker compose exec postgres pg_isready"

echo ""
echo "--- Puertos ---"
check_service "SMTP (25)" "nc -z $MAIL_HOST 25"
check_service "Submission (587)" "nc -z $MAIL_HOST 587"
check_service "SMTPS (465)" "nc -z $MAIL_HOST 465"
check_service "IMAPS (993)" "nc -z $MAIL_HOST 993"

echo ""
echo "--- TLS ---"
check_service "Cert SMTP" "echo | openssl s_client -connect $MAIL_HOST:465 -servername $MAIL_HOST 2>/dev/null | openssl x509 -noout -checkend 1209600"
check_service "Cert IMAP" "echo | openssl s_client -connect $MAIL_HOST:993 -servername $MAIL_HOST 2>/dev/null | openssl x509 -noout -checkend 1209600"

echo ""
echo "--- DNS ---"
check_service "MX Record" "dig +short MX $MAIL_DOMAIN | grep -q $MAIL_HOST"
check_service "SPF Record" "dig +short TXT $MAIL_DOMAIN | grep -q 'v=spf1'"
check_service "DMARC Record" "dig +short TXT _dmarc.$MAIL_DOMAIN | grep -q 'v=DMARC1'"
check_service "DKIM Record" "dig +short TXT default._domainkey.$MAIL_DOMAIN | grep -q 'v=DKIM1'"

echo ""
echo "--- Cola de correo ---"
QUEUE_SIZE=$(docker compose exec -T postfix find /var/spool/postfix -name '*.pid' | wc -l)
echo "Mensajes en cola: $QUEUE_SIZE"
if [ "$QUEUE_SIZE" -gt 100 ]; then
    echo -e "\${RED}⚠ Cola de correo alta\${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "--- Disco ---"
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')
echo "Uso de disco: \${DISK_USAGE}%"
if [ "$DISK_USAGE" -gt 80 ]; then
    echo -e "\${YELLOW}⚠ Disco por encima del 80%\${NC}"
fi

echo ""
echo "--- Blacklists ---"
# Verificar IP en blacklists principales
VPS_IP=$(curl -s ifconfig.me)
check_service "Spamhaus" "!dig +short \$(echo $VPS_IP | awk -F. '{print $4"."$3"."$2"."$1}').zen.spamhaus.org"

echo ""
echo "==========================="
if [ $ERRORS -eq 0 ]; then
    echo -e "\${GREEN}✓ Todos los checks pasaron\${NC}"
else
    echo -e "\${RED}✗ $ERRORS errores encontrados\${NC}"
    exit 1
fi`}</CodeBlock>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Uptime Kuma (Docker)</h3>
        <CodeBlock lang="docker-compose (añadir al compose)">{`  uptime-kuma:
    image: louislam/uptime-kuma:latest
    volumes:
      - uptime_kuma_data:/app/data
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.kuma.rule=Host(\`status.midominio.com\`)"
      - "traefik.http.routers.kuma.entrypoints=websecure"
      - "traefik.http.routers.kuma.tls.certresolver=letsencrypt"
    networks:
      - mail_network
    restart: unless-stopped`}</CodeBlock>
      </>
    ),
  },
  {
    id: 'backups',
    title: 'Backups',
    icon: '💾',
    content: (
      <>
        <p className="text-dark-200">Estrategia de backups cifrados e incrementales con restic.</p>

        <h3 className="text-lg font-bold text-white mt-6 mb-3">Política de backups</h3>
        <Table
          headers={['Dato', 'Frecuencia', 'Retención', 'Destino']}
          rows={[
            ['Buzones de correo', 'Cada 6 horas', '30 días', 'Backblaze B2 / local'],
            ['Base de datos', 'Cada hora', '7 días', 'B2 + local'],
            ['Configuración', 'Cada 24h', '90 días', 'B2 + GitHub (encrypted)'],
            ['Claves DKIM', 'Cada cambio', 'Indefinido', 'B2 + vault'],
            ['Certificados', 'Cada renovación', '1 año', 'Local (Traefik auto)'],
            ['Logs', 'Cada 24h', '30 días', 'Local (rotación)'],
          ]}
        />

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Script de backup con restic</h3>
        <CodeBlock lang="infrastructure/scripts/backup.sh">{`#!/bin/bash
# backup.sh - Backup cifrado con restic
# Ejecutar via cron: 0 */6 * * * /opt/mailforge/scripts/backup.sh

set -e

RESTIC_REPO="b2:mailforge-backups"
RESTIC_PASSWORD_FILE="/root/.restic-password"
export RESTIC_PASSWORD_FILE

# Variables
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/mailforge/backup.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=== Starting backup $BACKUP_DATE ==="

# 1. Backup base de datos
log "Backing up PostgreSQL..."
docker compose exec -T postgres pg_dumpall -U mailforge | gzip > /tmp/mailforge_db_$BACKUP_DATE.sql.gz

# 2. Backup buzones de correo (incremental)
log "Backing up mailboxes..."
restic backup /var/mail/vhosts \\
    --tag mailboxes \\
    --exclude="*.tmp" \\
    --exclude="dovecot*"

# 3. Backup base de datos a restic
log "Backing up database dump..."
restic backup /tmp/mailforge_db_$BACKUP_DATE.sql.gz \\
    --tag database

# 4. Backup configuración
log "Backing up configuration..."
restic backup /opt/mailforge/infrastructure \\
    --tag config \\
    --exclude="*.env"

# 5. Backup claves DKIM
log "Backing up DKIM keys..."
restic backup /opt/mailforge/dkim \\
    --tag dkim

# 6. Limpieza: mantener política de retención
log "Pruning old backups..."
restic forget \\
    --keep-hourly 24 \\
    --keep-daily 30 \\
    --keep-weekly 12 \\
    --keep-monthly 12 \\
    --prune

# 7. Verificar integridad
log "Verifying backup integrity..."
restic check --read-data-subset=5%

# 8. Limpieza temporal
rm -f /tmp/mailforge_db_$BACKUP_DATE.sql.gz

log "=== Backup completed successfully ==="`}</CodeBlock>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Restauración completa</h3>
        <CodeBlock lang="infrastructure/scripts/restore.sh">{`#!/bin/bash
# restore.sh - Restauración completa del sistema
# Uso: ./restore.sh [snapshot-id]

set -e

RESTIC_REPO="b2:mailforge-backups"
RESTIC_PASSWORD_FILE="/root/.restic-password"
export RESTIC_PASSWORD_FILE

SNAPSHOT=\${1:-latest}

echo "=== MailForge Restore ==="
echo "Snapshot: $SNAPSHOT"
echo ""

# 1. Detener servicios
echo "Stopping mail services..."
docker compose stop postfix dovecot

# 2. Restaurar buzones
echo "Restoring mailboxes..."
restic restore $SNAPSHOT --tag mailboxes --target /var/mail/vhosts

# 3. Restaurar base de datos
echo "Restoring database..."
restic restore $SNAPSHOT --tag database --target /tmp/
gunzip /tmp/mailforge_db_*.sql.gz
docker compose exec -T postgres psql -U mailforge < /tmp/mailforge_db_*.sql

# 4. Restaurar configuración
echo "Restoring configuration..."
restic restore $SNAPSHOT --tag config --target /opt/mailforge/infrastructure

# 5. Restaurar DKIM
echo "Restoring DKIM keys..."
restic restore $SNAPSHOT --tag dkim --target /opt/mailforge/dkim

# 6. Reiniciar servicios
echo "Starting mail services..."
docker compose up -d

# 7. Verificar
echo "Verifying restoration..."
docker compose exec postfix postfix status
docker compose exec dovecot doveconf -n

echo ""
echo "=== Restore completed ==="
echo "Verify by checking mail delivery and IMAP access."`}</CodeBlock>

        <InfoCard title="Probar backups regularmente" variant="warning">
          <p>Un backup no probado no es un backup. Ejecutar restauración de prueba al menos una vez al mes en un entorno aislado.</p>
        </InfoCard>
      </>
    ),
  },
  {
    id: 'deliverability',
    title: 'Entregabilidad',
    icon: '📬',
    content: (
      <>
        <p className="text-dark-200">Aspecto crítico: conseguir que los correos lleguen a Gmail, Outlook, Yahoo sin ir a spam.</p>

        <h3 className="text-lg font-bold text-white mt-6 mb-3">Factores de entregabilidad</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard title="IP y reputación" variant="danger">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>IP de datacenter</strong> (nunca residencial)</li>
              <li>Verificar que no esté en blacklists</li>
              <li>PTR/Reverse DNS correcto</li>
              <li>IP dedicada preferible a compartida</li>
              <li>Calentamiento progresivo (warmup)</li>
            </ul>
          </InfoCard>

          <InfoCard title="Autenticación" variant="success">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>SPF</strong> — Autoriza tu servidor</li>
              <li><strong>DKIM</strong> — Firma criptográfica</li>
              <li><strong>DMARC</strong> — Política de manejo</li>
              <li>Los 3 son OBLIGATORIOS hoy</li>
              <li>Gmail/Yahoo los exigen desde 2024</li>
            </ul>
          </InfoCard>

          <InfoCard title="TLS" variant="success">
            <ul className="list-disc list-inside space-y-1">
              <li>TLS en todas las conexiones SMTP</li>
              <li>Certificado válido (no autofirmado)</li>
              <li>MTA-STS para forzar TLS</li>
              <li>TLSRPT para reportes</li>
            </ul>
          </InfoCard>

          <InfoCard title="Contenido" variant="warning">
            <ul className="list-disc list-inside space-y-1">
              <li>Evitar palabras spam-trigger</li>
              <li>Ratio texto/imágenes adecuado</li>
              <li>Links a dominios con buena reputación</li>
              <li>Unsubscribe header (List-Unsubscribe)</li>
              <li>HTML bien formado</li>
            </ul>
          </InfoCard>
        </div>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Calentamiento de IP (Warmup)</h3>
        <CodeBlock lang="bash">{`# Plan de calentamiento progresivo
# Semana 1: 20 correos/día (a cuentas propias)
# Semana 2: 50 correos/día (mezcla propias + conocidos)
# Semana 3: 100 correos/día
# Semana 4: 200 correos/día
# Semana 5+: Volumen normal

# Herramienta útil: mail-tester.com
# Enviar un correo de prueba y verificar score (objetivo: 10/10)

# Verificar blacklists:
# https://mxtoolbox.com/blacklists.aspx
# https://www.talosintelligence.com/reputation_center/

# Google Postmaster Tools:
# https://postmaster.google.com/ (requiere dominio verificado)`}</CodeBlock>

        <InfoCard title="Alternativa: SMTP Relay externo" variant="warning">
          <p>Si la entregabilidad es crítica y no quieres gestionar reputación de IP, usar un relay externo para envío:</p>
          <ul className="list-disc list-inside mt-1">
            <li><strong>Amazon SES</strong> — $0.10/1000 emails (casi gratis)</li>
            <li><strong>Mailgun</strong> — 5000 emails/mes free (3 meses)</li>
            <li><strong>SendGrid</strong> — 100 emails/día free</li>
            <li><strong>Brevo (Sendinblue)</strong> — 300 emails/día free</li>
          </ul>
          <p className="mt-2"><strong>Arquitectura híbrida:</strong> Recibir en tu servidor (IMAP), enviar vía relay externo. Tú controlas los buzones, el relay se encarga de la entregabilidad.</p>
        </InfoCard>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Checklist de entregabilidad</h3>
        <div className="space-y-2">
          {[
            'PTR/Reverse DNS configurado correctamente',
            'SPF record publicado y validado',
            'DKIM firmado y verificado',
            'DMARC publicado (al menos p=none para empezar)',
            'TLS obligatorio en SMTP',
            'IP no está en blacklists principales',
            'Calentamiento de IP completado',
            'Google Postmaster Tools registrado',
            'Microsoft SNDS registrado',
            'List-Unsubscribe header en emails masivos',
            'Bounce processing configurado',
            'Feedback loop con ISPs principales',
            'Monitoreo de reputation score',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-dark-200 bg-dark-800/50 rounded px-3 py-2">
              <span className="w-5 h-5 rounded border border-dark-600 flex items-center justify-center text-xs text-dark-400">{i + 1}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'mvp',
    title: 'MVP Mínimo',
    icon: '🚀',
    content: (
      <>
        <p className="text-dark-200">Infraestructura mínima para tener correo funcional con dominio propio.</p>

        <div className="architecture-diagram">
          <h4 className="text-white font-semibold mb-4 text-center">🎯 MVP — 5 componentes, ~5€/mes</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-sm">
            <div className="bg-dark-800 rounded-lg p-3 border border-primary-800/50">
              <div className="text-2xl mb-1">🌐</div>
              <div className="text-white font-semibold">Cloudflare</div>
              <div className="text-dark-400 text-xs">DNS</div>
              <div className="text-accent text-xs mt-1">Gratis</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-3 border border-primary-800/50">
              <div className="text-2xl mb-1">🖥️</div>
              <div className="text-white font-semibold">Hetzner VPS</div>
              <div className="text-dark-400 text-xs">Postfix+Dovecot</div>
              <div className="text-accent text-xs mt-1">~5€/mes</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-3 border border-primary-800/50">
              <div className="text-2xl mb-1">🐳</div>
              <div className="text-white font-semibold">Docker</div>
              <div className="text-dark-400 text-xs">Todo containerizado</div>
              <div className="text-accent text-xs mt-1">Gratis</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-3 border border-primary-800/50">
              <div className="text-2xl mb-1">▲</div>
              <div className="text-white font-semibold">Vercel</div>
              <div className="text-dark-400 text-xs">Webmail/Admin</div>
              <div className="text-accent text-xs mt-1">Gratis</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-3 border border-primary-800/50">
              <div className="text-2xl mb-1">🗄️</div>
              <div className="text-white font-semibold">PostgreSQL</div>
              <div className="text-dark-400 text-xs">En VPS (Docker)</div>
              <div className="text-accent text-xs mt-1">Gratis</div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Servicios Docker mínimos para MVP</h3>
        <CodeBlock lang="docker-compose.yml (MVP)">{`# Solo 5 servicios esenciales
services:
  traefik:    # Proxy + TLS
  postfix:    # SMTP
  dovecot:    # IMAP
  postgres:   # Base de datos
  roundcube:  # Webmail (MVP, luego reemplazar)`}</CodeBlock>

        <h3 className="text-lg font-bold text-white mt-8 mb-3">Pasos para MVP funcional</h3>
        <div className="space-y-3">
          {[
            { step: '1', title: 'Comprar dominio', desc: 'Namecheap, Cloudflare, Porkbun (~10€/año)' },
            { step: '2', title: 'Contratar VPS', desc: 'Hetzner CX22, Ubuntu 22.04 (~5€/mes)' },
            { step: '3', title: 'Configurar DNS', desc: 'MX, A, SPF, DKIM, DMARC, PTR' },
            { step: '4', title: 'Docker Compose up', desc: 'Levanta los 5 servicios' },
            { step: '5', title: 'Crear dominio en DB', desc: 'INSERT INTO domains ...' },
            { step: '6', title: 'Crear buzón', desc: 'INSERT INTO mailboxes ...' },
            { step: '7', title: 'Probar SMTP', desc: 'swaks --to test@gmail.com --server mail.midominio.com' },
            { step: '8', title: 'Probar IMAP', desc: 'Conectar con Thunderbird' },
            { step: '9', title: 'Webmail', desc: 'Acceder a webmail.midominio.com' },
            { step: '10', title: 'Deploy panel en Vercel', desc: 'Importar repo, configurar env vars' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 bg-dark-800/50 rounded-lg p-4 border border-dark-700">
              <span className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">{item.step}</span>
              <div>
                <h5 className="text-white font-semibold">{item.title}</h5>
                <p className="text-sm text-dark-300">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <InfoCard title="Coste total MVP" variant="success">
          <p><strong>Infraestructura:</strong> ~5€/mes (VPS Hetzner)</p>
          <p><strong>Dominio:</strong> ~10€/año</p>
          <p><strong>Todo lo demás:</strong> Gratis (Vercel, Cloudflare, Docker, Let's Encrypt)</p>
          <p className="mt-2 font-semibold">Total: ~6€/mes o ~72€/año</p>
        </InfoCard>
      </>
    ),
  },
  {
    id: 'roadmap',
    title: 'Roadmap',
    icon: '🗺️',
    content: (
      <>
        <p className="text-dark-200">Plan de desarrollo en 12 fases, de arquitectura a producción.</p>

        <div className="space-y-4">
          {[
            {
              phase: 'Fase 1',
              title: 'Arquitectura',
              duration: '1 día',
              tasks: ['Definir arquitectura final', 'Seleccionar proveedor VPS', 'Registrar dominio', 'Crear repositorio GitHub'],
              result: 'Repo inicial con README, estructura de directorios, docker-compose.yml base',
            },
            {
              phase: 'Fase 2',
              title: 'Dominio y DNS',
              duration: '1 día',
              tasks: ['Configurar Cloudflare DNS', 'Crear registros MX, A, SPF, DKIM, DMARC', 'Configurar PTR en VPS', 'Verificar con mxtoolbox'],
              result: 'DNS completamente configurado y verificado',
            },
            {
              phase: 'Fase 3',
              title: 'Infraestructura base',
              duration: '2 días',
              tasks: ['Provisionar VPS', 'Instalar Docker + Docker Compose', 'Configurar firewall UFW', 'Configurar Traefik con TLS', 'Levantar PostgreSQL + Redis'],
              result: 'VPS operativo con Docker, TLS y base de datos',
            },
            {
              phase: 'Fase 4',
              title: 'SMTP (Postfix)',
              duration: '2 días',
              tasks: ['Configurar Postfix con virtual domains', 'Configurar queries PostgreSQL', 'Configurar TLS', 'Probar envío con swaks', 'Configurar DKIM signing'],
              result: 'SMTP funcional: envío y recepción de correo',
            },
            {
              phase: 'Fase 5',
              title: 'IMAP (Dovecot)',
              duration: '2 días',
              tasks: ['Configurar Dovecot IMAP', 'Configurar auth SQL', 'Crear buzones de prueba', 'Probar con Thunderbird', 'Configurar LMTP para entrega'],
              result: 'IMAP funcional: clientes pueden conectarse y leer correo',
            },
            {
              phase: 'Fase 6',
              title: 'Seguridad',
              duration: '2 días',
              tasks: ['Configurar fail2ban', 'Hardening TLS (cipher suites)', 'Configurar rate limiting Redis', 'Auditar configuración', 'Probar con test SSL'],
              result: 'Sistema hardened contra ataques comunes',
            },
            {
              phase: 'Fase 7',
              title: 'Webmail',
              duration: '1 día',
              tasks: ['Desplegar Roundcube/SnappyMail', 'Conectar a Dovecot + Postfix', 'Configurar TLS', 'Probar interfaz completa'],
              result: 'Webmail accesible y funcional',
            },
            {
              phase: 'Fase 8',
              title: 'Panel de administración',
              duration: '3-5 días',
              tasks: ['Crear app Next.js', 'Implementar auth (NextAuth)', 'CRUD usuarios/dominios/buzones', 'Deploy en Vercel', 'Conectar a API del VPS'],
              result: 'Panel admin funcional en Vercel',
            },
            {
              phase: 'Fase 9',
              title: 'GitHub y CI/CD',
              duration: '1 día',
              tasks: ['Configurar GitHub Actions CI', 'Configurar deploy automático Vercel', 'Configurar deploy SSH al VPS', 'Branch protection rules'],
              result: 'CI/CD completo, deploy automático',
            },
            {
              phase: 'Fase 10',
              title: 'Antispam (Rspamd)',
              duration: '2 días',
              tasks: ['Configurar Rspamd', 'Integrar con Postfix (milter)', 'Configurar ClamAV', 'Entrenar filtro bayesiano', 'Probar con GTUBE'],
              result: 'Filtrado antispam y antivirus activo',
            },
            {
              phase: 'Fase 11',
              title: 'Monitorización y backups',
              duration: '1 día',
              tasks: ['Configurar Uptime Kuma', 'Configurar health checks', 'Configurar restic backups', 'Configurar alertas'],
              result: 'Monitorización activa y backups automáticos',
            },
            {
              phase: 'Fase 12',
              title: 'Producción',
              duration: '2 días',
              tasks: ['Calentamiento de IP', 'Registro en Google Postmaster', 'Registro en Microsoft SNDS', 'Verificar entregabilidad', 'Documentación final', 'Plan de mantenimiento'],
              result: 'Sistema en producción, correos llegando correctamente',
            },
          ].map((phase) => (
            <div key={phase.phase} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="badge bg-primary-900/50 text-primary-300 border border-primary-800/50">{phase.phase}</span>
                  <h4 className="text-white font-semibold">{phase.title}</h4>
                </div>
                <span className="text-xs text-dark-400 bg-dark-800 px-2 py-1 rounded">{phase.duration}</span>
              </div>
              <ul className="text-sm text-dark-200 space-y-1 mb-3">
                {phase.tasks.map((task, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                    {task}
                  </li>
                ))}
              </ul>
              <div className="text-xs text-accent bg-accent/10 rounded px-3 py-2 border border-accent/20">
                <strong>Resultado:</strong> {phase.result}
              </div>
            </div>
          ))}
        </div>

        <InfoCard title="Tiempo total estimado" variant="success">
          <p><strong>MVP funcional:</strong> 2-3 semanas (dedicación parcial)</p>
          <p><strong>Sistema completo:</strong> 4-6 semanas</p>
          <p><strong>Producción estable:</strong> 6-8 semanas (incluyendo warmup de IP)</p>
        </InfoCard>
      </>
    ),
  },
  {
    id: 'checklist',
    title: 'Checklist Producción',
    icon: '✅',
    content: (
      <>
        <p className="text-dark-200">Verificación final antes de poner el sistema en producción.</p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-3">DNS y Entregabilidad</h3>
            {[
              'MX record apunta al servidor correcto',
              'SPF record publicado y sin errores',
              'DKIM firmado y verificable',
              'DMARC publicado (p=quarantine o p=reject)',
              'PTR/Reverse DNS configurado en VPS',
              'IP no aparece en blacklists principales',
              'Autodiscover/Autoconfig funciona',
              'MTA-STS publicado (opcional)',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 text-sm text-dark-200">
                <span className="w-4 h-4 rounded border border-dark-600"></span>
                {item}
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-3">Seguridad</h3>
            {[
              'TLS 1.2+ obligatorio en SMTP e IMAP',
              'Certificados válidos (no autofirmados)',
              'Fail2ban activo y configurado',
              'Firewall UFW con solo puertos necesarios',
              'Contraseñas hasheadas con Argon2id',
              'Sin open relay (verificar con test)',
              'Rate limiting activo',
              'SSH con key-only authentication',
              'Secrets no están en el repositorio',
              'Variables de entorno en Vercel/GitHub Secrets',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 text-sm text-dark-200">
                <span className="w-4 h-4 rounded border border-dark-600"></span>
                {item}
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-3">Funcionalidad</h3>
            {[
              'Envío de correo funciona (verificar con Gmail, Outlook)',
              'Recepción de correo funciona',
              'IMAP: conexión con Thunderbird',
              'IMAP: conexión con cliente móvil',
              'Webmail: login funciona',
              'Webmail: leer, enviar, responder correos',
              'Panel admin: crear usuario/dominio/buzón',
              'Panel admin: crear alias',
              'Bounce messages se procesan',
              'Quotas de buzón funcionan',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 text-sm text-dark-200">
                <span className="w-4 h-4 rounded border border-dark-600"></span>
                {item}
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-3">Operaciones</h3>
            {[
              'Backups automáticos configurados',
              'Restauración probada',
              'Monitorización activa (Uptime Kuma)',
              'Alertas configuradas',
              'Logs centralizados',
              'Rotación de logs activa',
              'Actualizaciones de seguridad planificadas',
              'Documentación actualizada',
              'Plan de recuperación ante desastres',
              'Procedimiento de escalado documentado',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 text-sm text-dark-200">
                <span className="w-4 h-4 rounded border border-dark-600"></span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary-900/20 to-accent/10 border border-primary-800/30">
          <h3 className="text-xl font-bold text-white mb-3">🎯 Sistema listo para producción</h3>
          <p className="text-dark-200">
            Si todos los puntos anteriores están verificados, el sistema está listo para uso en producción con 1-5 cuentas de correo.
            La arquitectura está diseñada para escalar horizontalmente cuando sea necesario.
          </p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="bg-dark-800/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-primary-400">99.5%</div>
              <div className="text-xs text-dark-400">Uptime objetivo</div>
            </div>
            <div className="bg-dark-800/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-accent">~5€</div>
              <div className="text-xs text-dark-400">Coste mensual</div>
            </div>
            <div className="bg-dark-800/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-warning">A+</div>
              <div className="text-xs text-dark-400">SSL Labs score</div>
            </div>
            <div className="bg-dark-800/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-danger">10/10</div>
              <div className="text-xs text-dark-400">Mail-tester score</div>
            </div>
          </div>
        </div>
      </>
    ),
  },
];
