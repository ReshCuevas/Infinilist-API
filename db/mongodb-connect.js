const mongoose = require('mongoose');

const dbUrl = "mongodb+srv://adminman:justapassword@data.ipbv33b.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log("Ahoy sailor"))
  .catch((err)=>console.log("Something's wrong matey", err));

module.exports = mongoose;