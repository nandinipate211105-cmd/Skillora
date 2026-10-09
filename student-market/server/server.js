import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Enable Real-Time WebSockets
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // React dev server port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Database Store (for immediate testing before connecting MongoDB)
let products = [
  { id: 1, title: "Sage Crochet Tote", price: 899, creator: "Ananya V.", category: "Handmade", stock: 8 },
  { id: 2, title: "Digital Portrait Art", price: 499, creator: "Rahul K.", category: "Digital", stock: 15 },
  { id: 3, title: "Scented Candle Set", price: 250, creator: "Sana M.", category: "Handmade", stock: 4 },
  { id: 4, title: "PCCOER Tech Hoodie", price: 1200, creator: "Tech Club", category: "Fashion", stock: 20 },
];

let orders = [];

// --- CORE BUSINESS API ROUTES ---

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Online', timestamp: new Date(), message: 'Skillora API is running' });
});

// 2. Product Management (Catalog & Inventory)
app.get('/api/products', (req, res) => {
  res.json({ success: true, count: products.length, data: products });
});

app.post('/api/products', (req, res) => {
  const { title, price, creator, category, stock } = req.body;
  const newProduct = {
    id: products.length + 1,
    title,
    price: Number(price),
    creator,
    category,
    stock: Number(stock) || 1,
  };
  products.push(newProduct);
  
  // Real-time broadcast: notify all connected buyers of new listing
  io.emit('product:added', newProduct);

  res.status(201).json({ success: true, data: newProduct });
});

// 3. Order Processing & Real-Time Tracking
app.post('/api/orders', (req, res) => {
  const { items, customerEmail, totalAmount } = req.body;

  const newOrder = {
    orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    items,
    customerEmail,
    totalAmount,
    status: 'Placed', // Placed -> Accepted -> Preparing -> Ready -> Delivered
    createdAt: new Date(),
  };

  orders.push(newOrder);

  // Real-time notification: Broadcast order update to seller dashboard
  io.emit('order:new', newOrder);

  res.status(201).json({ success: true, message: 'Order created', order: newOrder });
});

// 4. Update Order Status (Real-time Campus Delivery Workflow)
app.put('/api/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = orders.find((o) => o.orderId === orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  order.status = status;

  // Real-time broadcast to buyer's tracking screen
  io.emit('order:status_updated', { orderId, status });

  res.json({ success: true, data: order });
});

// 5. Reporting & Analytics API
app.get('/api/reports/summary', (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    activeCampus: 'PCCOER',
  });
});

// --- SOCKET.IO REAL-TIME CONNECTION ---
io.on('connection', (socket) => {
  console.log(`⚡ Student Client Connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Skillora Backend Server listening on http://localhost:${PORT}`);
});