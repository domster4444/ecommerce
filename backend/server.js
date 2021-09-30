const app = require('./app');
const dotenv = require('dotenv');
const connectToAtlas = require('./config/database');

//handling uncaught exception error
process.on('uncaughtException', (err) => {
  console.log(`Error : ${err.message}`);
  console.log('Shutting down server due to uncaught exception error');

  process.exit(1);
});

//*config
dotenv.config({ path: './backend/config/config.env' });

//todo :connect db
connectToAtlas();

const server = app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost::${process.env.PORT}`);
});

//uncaught error
//// console.log(youtube);

//!unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`err: ${err.message}`);
  console.log('sutting donw th server due to undhandled promise rejection');
  server.close(() => {
    process.exit(1);
  });
});
