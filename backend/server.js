const app = require('./app');
const dotenv = require('dotenv');
const connectToAtlas = require('./config/database');
//*config
dotenv.config({ path: './backend/config/config.env' });

//todo :connect db
connectToAtlas();

const server = app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost::${process.env.PORT}`);
});

//unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`err: ${err.message}`);
  console.log('sutting donw th server due to undhandled promise rejection');
  server.close(() => {
    process.exit(1);
  });
});
