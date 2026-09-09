// Check before mounting R3F: renderer initialization can reject asynchronously,
// outside a React error boundary, when a browser has disabled graphics contexts.
let cachedSupport;
export function supportsWebGL2() {
  if (cachedSupport !== undefined) return cachedSupport;
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    cachedSupport = Boolean(context);
    context?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    cachedSupport = false;
  }
  return cachedSupport;
}
