import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    phase: 'Fase 1 - Estructura y Documentación',
    services: {
      web: 'operational',
      api: 'operational',
      database: 'pending (Fase 3)',
      smtp: 'pending (Fase 4)',
      imap: 'pending (Fase 5)',
      antispam: 'pending (Fase 9)',
    },
  });
}
