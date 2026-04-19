const TARGET = 'https://soulspace-ye8o.onrender.com';

module.exports = async function handler(req, res) {
  try {
    const segments = Array.isArray(req.query.path)
      ? req.query.path
      : [req.query.path].filter(Boolean);
    const apiPath = segments.join('/');
    const search = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const targetUrl = `${TARGET}/api/${apiPath}${search}`;

    const headers = {};
    if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];
    if (req.headers['authorization']) headers['authorization'] = req.headers['authorization'];

    const options = { method: req.method, headers };
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body != null) {
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const upstream = await fetch(targetUrl, options);
    const text = await upstream.text();

    res.status(upstream.status);
    if (!text) { res.end(); return; }
    try { res.json(JSON.parse(text)); }
    catch { res.send(text); }
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(502).json({ error: 'Backend unreachable' });
  }
};
