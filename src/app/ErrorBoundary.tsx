import React from 'react';

interface State { hasError: boolean; error: Error | null; errorCount: number; lastErrorTime: number; }

function logError(err: Error): void {
  try {
    const logs = JSON.parse(localStorage.getItem('fp-v3:errors') ?? '[]') as Array<{ message: string; time: string }>;
    logs.unshift({ message: err.message, time: new Date().toISOString() });
    localStorage.setItem('fp-v3:errors', JSON.stringify(logs.slice(0, 50)));
  } catch {}
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, error: null, errorCount: 0, lastErrorTime: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    logError(error);
    const now = Date.now();
    const { errorCount, lastErrorTime } = this.state;
    const inWindow = now - lastErrorTime < 10000;
    const newCount = inWindow ? errorCount + 1 : 1;
    if (newCount >= 5) {
      localStorage.removeItem('fp-v3:errors');
      this.setState({ hasError: false, error: null, errorCount: 0, lastErrorTime: now });
    } else {
      this.setState({ errorCount: newCount, lastErrorTime: now });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#0F172A', color: '#F1F5F9', textAlign: 'center', gap: '16px' }}>
          <div style={{ fontSize: '64px' }}>⚠️</div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Algo salió mal</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', maxWidth: '400px', margin: 0 }}>{this.state.error?.message ?? 'Error inesperado'}</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => this.setState({ hasError: false, error: null })} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#3B82F6,#6366F1)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: '14px' }}>
              Reintentar
            </button>
            <a href="/" style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', color: '#CBD5E1', cursor: 'pointer', fontWeight: 600, fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              Ir al inicio
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
