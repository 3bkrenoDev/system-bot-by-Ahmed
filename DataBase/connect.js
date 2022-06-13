const mongoose = require("mongoose");
  mongoose.connect(process.env.mongoose, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
	console.log('connected mongoDB');
}).catch(console.error);

mongoose.connection.on('disconnected', () => console.log('-> lost connection'));
mongoose.connection.on('reconnect', () => console.log('-> reconnected'));
mongoose.connection.on('connected', () => console.log('-> connected'));
