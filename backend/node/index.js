const express = require('express');
const path = require('path');
const routes = require('./routes');

require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const app = express();
const PORT = process.env.PORT_MAIN || 4000;

app.use(express.json());
app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Main backend API started at http://localhost:${PORT}`);
});
