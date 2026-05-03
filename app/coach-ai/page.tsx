export default function Page() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#f5f7fb',
      color: '#111'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Bienvenue sur Coach AI</h1>
      <p style={{ fontSize: '1.15rem', maxWidth: '28rem', textAlign: 'center', lineHeight: '1.6' }}>
        Cette page simple présente un espace de coaching sportif avec une interface claire et
        légère. Commencez par explorer les fonctionnalités ou adaptez le contenu à vos besoins.
      </p>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button style={{ padding: '0.85rem 1.5rem', borderRadius: '999px', border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer' }}>
          Découvrir
        </button>
        <button style={{ padding: '0.85rem 1.5rem', borderRadius: '999px', border: '1px solid #2563eb', background: 'transparent', color: '#2563eb', cursor: 'pointer' }}>
          En savoir plus
        </button>
      </div>
    </main>
  );
}
