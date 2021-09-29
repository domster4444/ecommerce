async function connectToAtlas() {
  const mongoose = await require('mongoose');
  let a = await mongoose.connect(process.env.DB_URL, () => {
    console.log('______________DB CONNECTED SUCCESS');
  });
}

module.exports = connectToAtlas;
