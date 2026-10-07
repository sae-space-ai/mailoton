import { sections } from '../data/sections';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
  isOpen: boolean;
}

export function Sidebar({ activeSection, onSectionChange, isOpen }: SidebarProps) {
  return (
    <aside className={`fixed top-0 left-0 h-full w-72 bg-dark-900 border-r border-dark-800 overflow-y-auto z-40 transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 border-b border-dark-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">MailForge</h1>
            <p className="text-xs text-dark-400">Arquitectura de Correo</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`sidebar-link w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2.5 ${
              activeSection === section.id ? 'active' : 'text-dark-300 hover:text-white'
            }`}
          >
            <span className="text-base">{section.icon}</span>
            <span className="truncate">{section.title}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-4 mx-4 rounded-lg bg-dark-800/50 border border-dark-700">
        <p className="text-xs text-dark-400 mb-2">Stack Principal</p>
        <div className="flex flex-wrap gap-1.5">
          {['Postfix', 'Dovecot', 'Docker', 'Next.js', 'Vercel'].map(tech => (
            <span key={tech} className="badge bg-primary-900/50 text-primary-300 border border-primary-800/50">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
