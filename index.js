const express = require('express');
const dotenv= require('dotenv');
const  web= require('./route/web')
const app = express();
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
dotenv.config();
const cluster = require('cluster');
const os = require('os');
console.log(dotenv.config());

const numCPUs = os.cpus().length;
const instances = parseInt(process.env.instances) || numCPUs - 1;

if (cluster.isMaster) {
  for (let i = 0; i < instances; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app.use(express.json());
  app.use(bodyParser.json());
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  app.use('/web/', web)
  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });
  
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
 
}
