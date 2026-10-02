export const environment = {
  production: true,
  // En producción (Vercel o Nginx), /api y /ws-brasas-socket se rutean automáticamente al backend
  apiUrl: '/api',
  backendUrl: '',
  wsUrl: (typeof window !== 'undefined' && window.location.protocol === 'https:')
    ? `wss://${window.location.host}/ws-brasas-socket`
    : (typeof window !== 'undefined' ? `ws://${window.location.host}/ws-brasas-socket` : 'ws://localhost:8080/ws-brasas-socket')
};
