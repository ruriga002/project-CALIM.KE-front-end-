// Minimal backend server (CommonJS) to run under Node when project is
// configured as an ES module. Uses built-in http, no external deps.
const http = require('http')
const url = require('url')

const products = [
  { id: 1, name: 'Classic Hoodie', category: 'Hoodies', price: 4500 },
  { id: 2, name: 'Oversized T-Shirt', category: 'Tees', price: 2500 },
  { id: 3, name: 'Field Cargo Pants', category: 'Trousers', price: 6800 },
]

function sendJSON(res, status, data) {
  const body = JSON.stringify(data)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  })
  res.end(body)
}

function parseRequestBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'))
      } catch (e) {
        resolve({})
      }
    })
  })
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true)
  const { pathname } = parsed

  if (req.method === 'GET' && pathname === '/api/products') {
    return sendJSON(res, 200, products)
  }

  if (req.method === 'POST' && pathname === '/api/login') {
    const body = await parseRequestBody(req)
    return sendJSON(res, 200, { token: 'dev-token', user: { id: 1, name: 'Dev User', email: body.email || 'dev@example.com' } })
  }

  if (req.method === 'POST' && pathname === '/api/register') {
    const body = await parseRequestBody(req)
    return sendJSON(res, 201, { token: 'dev-token', user: { id: 2, name: body.name || 'New User', email: body.email || 'new@example.com' } })
  }

  if (req.method === 'GET' && pathname === '/api/profile') {
    const auth = req.headers['authorization'] || ''
    if (!auth.startsWith('Bearer')) {
      return sendJSON(res, 401, { error: 'Unauthorized' })
    }
    return sendJSON(res, 200, { id: 1, name: 'Dev User', email: 'dev@example.com' })
  }

  sendJSON(res, 404, { error: 'Not found' })
})

const PORT = 5000
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Dev backend listening on http://127.0.0.1:${PORT}`)
})
