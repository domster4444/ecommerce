async function connectToAtlas() {
  const mongoose = await require('mongoose');
  let a = await mongoose.connect(process.env.DB_URL).then((data) => {
    console.log('database connected successfully');
  });
}

module.exports = connectToAtlas;
