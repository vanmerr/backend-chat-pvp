const express = require('express');
const cors = require('cors');
const router = require('./routes/index');
const setupSocket = require('./socket');

const app = express();
app.use(express.json());

// Cấu hình CORS (cho phép từ mọi origin hoặc chỉ định origin cụ thể)
app.use(cors({
  origin: '*', // hoặc ['http://localhost:3000'] nếu chỉ cho phép frontend local
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


const PORT = process.env.PORT || 5000;

// Tạo server HTTP để dùng với socket.io
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Tách socket.io ra file riêng
const io = setupSocket(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/v1', router);
app.use((req, res, next) => {
  req.io = io;
  next();
});

