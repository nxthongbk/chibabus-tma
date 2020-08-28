require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT;
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('./config/passport');
const cors = require('cors');

var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

app.use(cors());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
require('./db/connect');

const userController = require("./controllers/user.controller");
const deviceController = require("./controllers/device.controller");
const busCounterController = require("./controllers/buscounter.controller");
const blueprintController = require("./controllers/blueprintController");

app.get('/api/hello', (req,res)=>res.send('hello'))
app.post('/api/login',userController.login)
app.post('/api/user',userController.createUser)

//passport for private route
app.use(passport.authenticate('jwt', { session: false }))
app.get('/api/user',userController.getUsers);
app.get('/api/user/id/:id',userController.getUser);
app.put('/api/user/id/:id',userController.updateUser);
app.delete('/api/user',userController.deleteUser);

//route for device
app.get('/api/device', deviceController.getDevices);
app.get('/api/device/id/:id', deviceController.getDevice);
app.post('/api/device', deviceController.createDevice);
app.put('/api/device/id/:id', deviceController.updateDevice);
app.delete('/api/device', deviceController.deleteDevice);
app.get('/api/device/test', deviceController.test);

//route for bus_counter
app.get('/api/buscounter', busCounterController.getBusCounters);
app.get('/api/buscounter/id/:id', busCounterController.getBusCounter);
app.get('/api/buscounter/device_id/:id', busCounterController.getBusCounterBasedDevice);
app.get('/api/buscounter/month/:month', busCounterController.getBusCounterBasedMonth);
app.get('/api/buscounter/date/:date', busCounterController.getBusCounterBasedDate);
app.post('/api/buscounter', upload.single('file'), busCounterController.createBusCounter);
app.put('/api/buscounter/id/:id', busCounterController.updateBusCounter);
app.delete('/api/buscounter', busCounterController.deleteBusCounter);
app.get('/api/buscounter/statistic/customer_on_day', busCounterController.getCustomerOnDay);
app.get('/api/buscounter/statistic/customer_on_month', busCounterController.getCustomerOnMonth);

//route for blueprint.
app.get('/api/blueprint', blueprintController.getBlueprints);
app.get('/api/blueprint/id/:id', blueprintController.getBlueprint);
app.get('/api/blueprint/user/:id', blueprintController.getBlueprintBasedOnUser);
app.post('/api/blueprint', blueprintController.createBlueprint);
app.put('/api/blueprint/id/:id', blueprintController.updateBlueprint);
app.delete('/api/blueprint', blueprintController.deleteBlueprint);


server.listen(port, ()=>console.log(`server is running on ${port}`));
