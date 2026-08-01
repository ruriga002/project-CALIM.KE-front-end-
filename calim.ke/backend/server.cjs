// Minimal backend server (CommonJS) to run under Node when project is
// configured as an ES module. Uses built-in http, no external deps.
const http = require('http')
const url = require('url')

const sessions = {}
let sessionIdCounter = 1
let productIdCounter = 4
let orderIdCounter = 1003
let collectionIdCounter = 4
let customerIdCounter = 4

const products = [
  { id: 1, name: 'CALIM Beanie', category: 'Accessories', price: 1500, stock: 25, image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhbmllcyUyMHdpdGglMjByaXZldHN8ZW58MHx8MHx8fDA%3D' },
  { id: 2, name: 'CALIM Jeans', category: 'Bottoms', price: 5000, stock: 40, image: 'https://images.unsplash.com/photo-1697678207628-6758ecf9a2cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGN1c3RvbSUyMGJhZ2d5JTIwamVhbnN8ZW58MHx8MHx8fDA%3D' },
  { id: 3, name: 'CALIM Leather Jacket', category: 'Outerwear', price: 2000, stock: 50, image: 'https://plus.unsplash.com/premium_photo-1731950912462-9caa3905627d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y3VzdG9tJTIwbGVhdGhlciUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D' },
]

const collections = [
  { id: 1, name: 'Hoodies' },
  { id: 2, name: 'Tees' },
  { id: 3, name: 'Trousers' },
]

const customers = [
  { id: 1, full_name: 'Alice Mwangi', email: 'alice@example.com', phone: '+254700000001', role: 'customer' },
  { id: 2, full_name: 'Brian Otieno', email: 'brian@example.com', phone: '+254700000002', role: 'customer' },
  { id: 3, full_name: 'Chris Wanjiru', email: 'chris@example.com', phone: '+254700000003', role: 'admin' },
]

const orders = [
  { id: 1001, customer_name: 'Alice Mwangi', total: 7000, status: 'Pending', created_at: '2026-07-30T12:00:00Z' },
  { id: 1002, customer_name: 'Brian Otieno', total: 4500, status: 'Delivered', created_at: '2026-07-28T09:30:00Z' },
]

const userProfile = {
  id: 1,
  full_name: 'Dev User',
  email: 'dev@example.com',
  phone: '+254700000000',
}

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

function getSession(token) {
  return sessions[token] || null
}

function requireAuth(req, res) {
  const auth = req.headers['authorization'] || ''
  if (!auth.startsWith('Bearer ')) {
    sendJSON(res, 401, { error: 'Unauthorized' })
    return false
  }
  const token = auth.slice(7).trim()
  const session = getSession(token)
  if (!session) {
    sendJSON(res, 401, { error: 'Invalid token' })
    return false
  }
  req.session = session
  return true
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true)
  const { pathname } = parsed

  if (req.method === 'GET' && pathname === '/api/products') {
    return sendJSON(res, 200, products)
  }

  if (req.method === 'GET' && pathname.match(/^\/api\/products\/\d+$/)) {
    const productId = Number(pathname.split('/').pop())
    const product = products.find((p) => p.id === productId)
    if (!product) return sendJSON(res, 404, { error: 'Product not found' })
    return sendJSON(res, 200, product)
  }

  if (req.method === 'POST' && ['/api/login', '/api/auth/login', '/auth/login', '/login'].includes(pathname)) {
    const body = await parseRequestBody(req)
    const email = (body.email || 'dev@example.com').toLowerCase()
    const role = email === 'admin@calim.com' ? 'admin' : 'customer'
    const full_name = body.full_name || body.name || (role === 'admin' ? 'Admin User' : 'Dev User')
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
    const user = {
      id: sessionIdCounter++,
      name: full_name,
      full_name,
      email,
      phone: body.phone || '+254700000000',
      role,
    }
    sessions[token] = user
    return sendJSON(res, 200, { token, user })
  }

  if (req.method === 'POST' && ['/api/register', '/api/auth/register', '/auth/register', '/register'].includes(pathname)) {
    const body = await parseRequestBody(req)
    const email = (body.email || 'new@example.com').toLowerCase()
    const full_name = body.full_name || body.name || 'New User'
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
    const user = {
      id: sessionIdCounter++,
      name: full_name,
      full_name,
      email,
      phone: body.phone || '+254700000000',
      role: 'customer',
    }
    sessions[token] = user
    return sendJSON(res, 201, { token, user })
  }

  if (['/api/profile', '/profile', '/api/auth/profile', '/auth/profile'].includes(pathname)) {
    if (req.method === 'GET') {
      if (!requireAuth(req, res)) return
      return sendJSON(res, 200, req.session)
    }

    if (req.method === 'PUT') {
      if (!requireAuth(req, res)) return
      const body = await parseRequestBody(req)
      Object.assign(req.session, {
        full_name: body.full_name || req.session.full_name,
        name: body.full_name || req.session.name,
        email: body.email || req.session.email,
        phone: body.phone || req.session.phone,
      })
      return sendJSON(res, 200, { message: 'Profile updated successfully', profile: req.session })
    }
  }

  if (['/api/auth/change-password', '/auth/change-password'].includes(pathname) && req.method === 'PUT') {
    if (!requireAuth(req, res)) return
    const body = await parseRequestBody(req)
    if (!body.current_password || !body.new_password) {
      return sendJSON(res, 400, { error: 'Missing password fields' })
    }
    return sendJSON(res, 200, { message: 'Password updated successfully' })
  }

  if (req.method === 'POST' && ['/api/products', '/products'].includes(pathname)) {
    if (!requireAuth(req, res)) return
    const body = await parseRequestBody(req)
    const product = {
      id: productIdCounter++,
      name: body.name || 'Untitled product',
      description: body.description || '',
      price: Number(body.price) || 0,
      stock: Number(body.stock) || 0,
      image: body.image || '',
      collection_id: body.collection_id || null,
    }
    products.push(product)
    return sendJSON(res, 201, { message: 'Product added', product })
  }

  // Public orders API for users
  if (req.method === 'POST' && ['/api/orders', '/orders'].includes(pathname)) {
    if (!requireAuth(req, res)) return
    const body = await parseRequestBody(req)
    const order = {
      id: orderIdCounter++,
      customer_name: req.session.full_name || req.session.name || req.session.email,
      customer_email: req.session.email,
      items: Array.isArray(body.items) ? body.items : [],
      total: Number(body.total) || 0,
      status: 'Pending',
      created_at: new Date().toISOString(),
    }
    orders.push(order)
    return sendJSON(res, 201, { message: 'Order created', order })
  }

  if (req.method === 'GET' && pathname === '/api/orders') {
    if (!requireAuth(req, res)) return
    // Admins see all orders
    if (req.session && req.session.role === 'admin') {
      return sendJSON(res, 200, { orders })
    }
    // Regular users see their own orders
    const userOrders = orders.filter(o => o.customer_email === req.session.email || o.customer_name === req.session.full_name)
    return sendJSON(res, 200, { orders: userOrders })
  }

  if (req.method === 'DELETE' && pathname.match(/^\/api\/products\/\d+$/)) {
    if (!requireAuth(req, res)) return
    const productId = Number(pathname.split('/').pop())
    const index = products.findIndex((item) => item.id === productId)
    if (index === -1) {
      return sendJSON(res, 404, { error: 'Product not found' })
    }
    products.splice(index, 1)
    return sendJSON(res, 200, { message: 'Product deleted' })
  }

  // Admin endpoints (orders/customers/collections) — minimal stubs

  if (req.method === 'GET' && pathname === '/api/admin/orders') {
    if (!requireAuth(req, res)) return
    return sendJSON(res, 200, { orders })
  }

  if (req.method === 'PATCH' && pathname.match(/^\/api\/admin\/orders\/\d+$/)) {
    if (!requireAuth(req, res)) return
    const orderId = Number(pathname.split('/').pop())
    const order = orders.find((item) => item.id === orderId)
    if (!order) return sendJSON(res, 404, { error: 'Order not found' })
    const body = await parseRequestBody(req)
    order.status = body.status || order.status
    return sendJSON(res, 200, { message: 'Order updated', order })
  }

  if (req.method === 'GET' && pathname === '/api/admin/customers') {
    if (!requireAuth(req, res)) return
    return sendJSON(res, 200, { customers })
  }

  if (req.method === 'DELETE' && pathname.match(/^\/api\/admin\/customers\/\d+$/)) {
    if (!requireAuth(req, res)) return
    const customerId = Number(pathname.split('/').pop())
    const index = customers.findIndex((item) => item.id === customerId)
    if (index === -1) {
      return sendJSON(res, 404, { error: 'Customer not found' })
    }
    customers.splice(index, 1)
    return sendJSON(res, 200, { message: 'Customer deleted' })
  }

  if (req.method === 'GET' && pathname === '/api/collections') {
    return sendJSON(res, 200, { collections })
  }

  if (req.method === 'POST' && pathname === '/api/collections') {
    if (!requireAuth(req, res)) return
    const body = await parseRequestBody(req)
    const collection = {
      id: collectionIdCounter++,
      name: body.name || 'Untitled collection',
    }
    collections.push(collection)
    return sendJSON(res, 201, { message: 'Collection created', collection })
  }

  if (req.method === 'PUT' && pathname.match(/^\/api\/collections\/\d+$/)) {
    if (!requireAuth(req, res)) return
    const collectionId = Number(pathname.split('/').pop())
    const collection = collections.find((item) => item.id === collectionId)
    if (!collection) return sendJSON(res, 404, { error: 'Collection not found' })
    const body = await parseRequestBody(req)
    collection.name = body.name || collection.name
    return sendJSON(res, 200, { message: 'Collection updated', collection })
  }

  if (req.method === 'DELETE' && pathname.match(/^\/api\/collections\/\d+$/)) {
    if (!requireAuth(req, res)) return
    const collectionId = Number(pathname.split('/').pop())
    const index = collections.findIndex((item) => item.id === collectionId)
    if (index === -1) {
      return sendJSON(res, 404, { error: 'Collection not found' })
    }
    collections.splice(index, 1)
    return sendJSON(res, 200, { message: 'Collection deleted' })
  }

  sendJSON(res, 404, { error: 'Not found' })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})