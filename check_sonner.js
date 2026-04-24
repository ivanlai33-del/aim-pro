try {
  const path = require.resolve('sonner');
  console.log('Sonner found at:', path);
} catch (e) {
  console.error('Sonner NOT found:', e.message);
}
