export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">MailForge</h1>
          <p className="text-lg text-slate-400">Sistema de Correo Electrónico Propio</p>
        </div>

        {/* Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            <h2 className="text-xl font-semibold text-white">Fase 1 — Completada</h2>
          </div>
          <p className="text-slate-300 mb-4">
            Estructura del repositorio, documentación de arquitectura y base del entorno de desarrollo.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Estructura', status: '✅' },
              { label: 'Documentación', status: '✅' },
              { label: 'Docker Compose', status: '✅' },
              { label: 'CI/CD', status: '✅' },
            ].map((item) => (
              <div key={item.label} className="bg-slate-900/50 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">{item.status}</div>
                <div className="text-xs text-slate-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-blue-400">▲</span> Vercel
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                Frontend Next.js
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                Webmail
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                Panel de Administración
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                API Serverless
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-emerald-400">🖥️</span> VPS (Servidor Cloud)
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Postfix (SMTP)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Dovecot (IMAP)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Rspamd + ClamAV
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                PostgreSQL + Redis
              </li>
            </ul>
          </div>
        </div>

        {/* Roadmap */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-5 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Roadmap</h3>
          <div className="space-y-2">
            {[
              { phase: 'Fase 1', name: 'Estructura y Documentación', done: true },
              { phase: 'Fase 2', name: 'Dominio y DNS', done: false },
              { phase: 'Fase 3', name: 'Infraestructura Base', done: false },
              { phase: 'Fase 4', name: 'SMTP (Postfix)', done: false },
              { phase: 'Fase 5', name: 'IMAP (Dovecot)', done: false },
              { phase: 'Fase 6', name: 'Seguridad', done: false },
              { phase: 'Fase 7', name: 'Webmail', done: false },
              { phase: 'Fase 8', name: 'Panel de Administración', done: false },
            ].map((item) => (
              <div key={item.phase} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${item.done ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-slate-900/30'}`}>
                <span className={`text-xs font-mono font-bold ${item.done ? 'text-emerald-400' : 'text-slate-500'}`}>{item.phase}</span>
                <span className={`text-sm ${item.done ? 'text-emerald-300' : 'text-slate-400'}`}>{item.name}</span>
                {item.done && <span className="ml-auto text-emerald-400">✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>Documentación completa en <code className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded">docs/architecture.md</code></p>
          <p className="mt-2">Frontend principal en <code className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded">apps/web/</code> (Next.js)</p>
        </div>
      </div>
    </div>
  );
}
