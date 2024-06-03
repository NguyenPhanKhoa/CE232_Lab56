import React, {useState, useEffect} from "react";
import {LineChart, Line, XAxis, CartesianGrid, Tooltip, YAxis, Legend} from 'recharts';
import axios from 'axios';
import "./App.css";

function App() {
  const [data, setData] = useState([])
  useEffect(()=>{
    const interval = setInterval(() => {
      axios.get(`http://localhost:4001/data`)
        .then(res => setData(res.data))
        .catch(err => console.error(err));
    }, 10000);
    return () => clearInterval(interval);
  },[])

  return (
    <div>
      <h1 className ="Title">Nhiệt độ, độ ẩm</h1>
      
      <div className="chart1">
        <LineChart width={730} height={250} data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
          <XAxis dataKey= "time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#f5f5f5" />
          <Line name = 'temperature' type="monotone" dataKey="temperature" stroke="#8884d8" />
        </LineChart>
      </div>

      <div className="chart1">
        <LineChart width={730} height={250} data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend displayName='humidity: %'/>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
          <Line name = 'humidity' type="monotone" dataKey="humidity" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
}

export default App;