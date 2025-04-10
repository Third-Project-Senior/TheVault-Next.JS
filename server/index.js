// server/index.js
const express = require('express');
const cors = require('cors');
const connection = require('./database/index.js');

const app = express();
const routes = require('./database/routers/index.js')
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});