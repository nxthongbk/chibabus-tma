require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT;
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('./config/passport');

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(passport.initialize());
app.use(bodyParser.json())
require('./db/connect') 

const userController = require("./controllers/user.controller");
const deviceController = require("./controllers/device.controller");
const busCounterController = require("./controllers/buscounter.controller");
const blueprintController = require("./controllers/blueprintController");

app.post('/api/login',userController.login)
app.post('/api/user',userController.createUser)

//passport for private route
app.use(passport.authenticate('jwt', { session: false }))
app.get('/api/user',userController.getUsers);
app.get('/api/user/id/:id',userController.getUser);
app.put('/api/user/id/:id',userController.updateUser)
app.delete('/api/user',userController.deleteUser)

//route for device
app.get('/api/device', deviceController.getDevices);
app.get('/api/device/id/:id', deviceController.getDevice)
app.post('/api/device', deviceController.createDevice);
app.put('/api/device/id/:id', deviceController.updateDevice)
app.delete('/api/device', deviceController.deleteDevice)

//route for bus_counter
app.get('/api/buscounter', busCounterController.getBusCounters);
app.get('/api/buscounter/id/:id', busCounterController.getBusCounter);
app.get('/api/buscounter/device_id/:id', busCounterController.getBusCounterBasedDevice);
app.post('/api/buscounter', busCounterController.createBusCounter);
app.put('/api/buscounter/id/:id', busCounterController.updateBusCounter);
app.delete('/api/buscounter', busCounterController.deleteBusCounter);

//route for blueprint.
app.get('/api/blueprint', blueprintController.getBlueprints);
app.get('/api/blueprint/id/:id', blueprintController.getBlueprint);
app.get('/api/blueprint/user/:id', blueprintController.getBlueprintBasedOnUser);
app.post('/api/blueprint', blueprintController.createBlueprint);
app.put('/api/blueprint/id/:id', blueprintController.updateBlueprint);
app.delete('/api/blueprint', blueprintController.deleteBlueprint);

server.listen(port, ()=>console.log(`server is running on ${port}`));