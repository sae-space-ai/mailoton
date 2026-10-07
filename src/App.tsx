import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { sections } from './data/sections';

export default function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = document.querySelectorAll('[data-section]');
      sectionElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom > 100) {
          setActiveSection(el.getAttribute('data-section') || '');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-800 rounded-lg border border-dark-700"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <Sidebar
        activeSection={activeSection}
        onSectionChange={(id) => {
          setActiveSection(id);
          setSidebarOpen(false);
          document.querySelector(`[data-section="${id}"]`)?.scrollIntoView({ behavior: 'smooth' });
        }}
        isOpen={sidebarOpen}
      />

      <main className="flex-1 lg:ml-72 p-6 lg:p-12 max-w-5xl">
        <div className="animate-fade-in">
          {sections.map((section) => (
            <section key={section.id} data-section={section.id} className="mb-16 scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-2xl lg:text-3xl font-bold text-white">{section.title}</h2>
              </div>
              <div className="space-y-6">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
