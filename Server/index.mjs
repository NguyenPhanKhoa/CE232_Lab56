import express from 'express'
import http from 'http'
import * as socketio from 'socket.io'
import mongoose from 'mongoose';
import cors from 'cors'

const port = 4001;

const app = express()
const httpServer = http.createServer(app)

app.use(cors());

// Kết nối tới MongoDB
mongoose.connect('mongodb+srv://louissunny866:d@test0.krrssgc.mongodb.net/Sensor_Data', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async()=> {
    console.log('MongoDB connected');
})
  .catch(err => console.log(err));

// Định nghĩa mô hình dữ liệu
const DataSchema = new mongoose.Schema({
  id: Number,  
  time: Date,
  temperature: Number,
  humidity: Number,
});


const Data = mongoose.model('Data', DataSchema);

const server = new socketio.Server(httpServer, {
    cors: {
        origin: '*',
    }
})

app.get('/data', async (req, res) => {
    try {
      let data = await Data.find().sort({time: -1}).limit(5);

          // Chuyển đổi trường time trong mỗi đối tượng data
      data = data.map(item => {
      // Tạo một bản sao của đối tượng để không thay đổi đối tượng gốc
      const newItem = { ...item._doc };

      // Chuyển đổi trường time sang định dạng thông thường
      const date = new Date(newItem.time);
      newItem.time = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true  // Sử dụng định dạng 12 giờ (AM/PM)
      });

      // Nếu bạn cũng muốn hiển thị ngày tháng
      newItem.fullDate = date.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) + ' ' + newItem.time;

      return newItem;
    });

      res.send(data.reverse());
      console.log(data);
    } catch (error) {
      console.log(error)
      return res.status(500).send(error);
    }
  });

httpServer.listen(port)