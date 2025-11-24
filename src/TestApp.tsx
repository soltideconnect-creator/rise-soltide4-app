// Minimal test component to verify React is working
export function TestApp() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ fontSize: '4rem' }}>🔥</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Streak App Test</h1>
      <p style={{ color: '#666' }}>If you see this, React is working!</p>
      <button 
        onClick={() => alert('Button works!')}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          background: '#5E5CE6',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer'
        }}
      >
        Test Button
      </button>
    </div>
  );
}
