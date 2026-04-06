const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình để đọc dữ liệu JSON từ body (nếu làm API)
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Dự án baocaonnptudm đã sẵn sàng!');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});