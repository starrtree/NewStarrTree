import { useCallback, useState } from 'react';
import StarrScene from './components/StarrScene.jsx';

export default function App() {
  const [modelReady, setModelReady] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [modelError, setModelError] = useState('');

  const handleModelReady = useCallback(() => {
    setModelReady(true);
    setModelError('');
  }, []);

  const handleModelError = useCallback((message) => {
    setModelError(message);
  }, []);

  const handleInteractive = useCallback(() => {
    setInteractive(true);
  }, []);

  return (
    <main className={`app-shell ${interactive ? 'is-interactive' : ''}`}>
      <section className="scene-shell" aria-label="Cinematic introduction to StarrTree">
        <StarrScene
          onModelReady={handleModelReady}
          onModelError={handleModelError}
          onInteractive={handleInteractive}
        />
      </section>

      <header className="brand-mark" aria-label="NewStarrTree">
        <span className="brand-star">✦</span>
        <span>STARRTREE</span>
      </header>

      <div className="status-panel" aria-live="polite">
        {!modelReady && !modelError && (
          <>
            <span className="status-dot" />
            <span>Preparing StarrX</span>
          </>
        )}
        {modelReady && !interactive && <span>Light signature detected</span>}
        {interactive && (
          <>
            <span className="status-dot is-ready" />
            <span>Drag to orbit · Scroll to zoom</span>
          </>
        )}
      </div>

      {modelError && (
        <aside className="model-warning">
          <strong>AxStarr model not found</strong>
          <span>
            Place <code>AxStarr.glb</code> in{' '}
            <code>public/assets/models/</code> and redeploy.
          </span>
        </aside>
      )}

      <div className="intro-title" aria-hidden={!interactive}>
        <span className="eyebrow">A LIVING CONSTELLATION</span>
        <h1>NewStarrTree</h1>
        <p>The personal universe of Max Starr.</p>
      </div>

      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </main>
  );
}
