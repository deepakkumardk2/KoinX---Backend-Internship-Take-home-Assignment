// api-server/server.js
const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});
