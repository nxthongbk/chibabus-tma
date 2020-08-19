let mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGO_PATH, { useNewUrlParser: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
	console.log("Database Connected");
});
