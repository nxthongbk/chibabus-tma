"use strict";

var Device = require('../db/models/device');

module.exports = {
  createDevice: function createDevice(req, res) {
    console.log('create device', req.body);
    var _req$body = req.body,
        license_plate = _req$body.license_plate,
        driver = _req$body.driver,
        line = _req$body.line;
    if (!license_plate || !driver || !line) return res.sendStatus(400);
    Device.create(req.body).then(function () {
      res.status(200).send({
        status: "ok"
      });
    })["catch"](function (err) {
      console.log(err);
      res.status(400).send({
        status: "fail"
      });
    });
  },
  getDevices: function getDevices(req, res) {
    Device.find({}).populate('blueprint_id').then(function (devices) {
      res.status(200).json(devices);
    })["catch"](function (err) {
      console.log(err);
      res.sendStatus(400);
    });
  },
  getDevice: function getDevice(req, res) {
    Device.findById(req.params.id).populate('blueprint_id').then(function (device) {
      res.status(200).json(device);
    })["catch"](function (err) {
      console.log(err);
      res.sendStatus(400);
    });
  },
  updateDevice: function updateDevice(req, res) {
    Device.findOneAndUpdate({
      _id: req.params.id
    }, req.body).then(function () {
      res.sendStatus(200);
    })["catch"](function (err) {
      console.log(err);
      res.sendStatus(400);
    });
  },
  deleteDevice: function deleteDevice(req, res) {
    var id = req.body.id;
    if (!id) return res.sendStatus(400);
    Device.findByIdAndDelete(id).then(function () {
      return res.sendStatus(200);
    })["catch"](function (err) {
      res.sendStatus(400);
      throw new Error(err);
    });
  },
  test: function test(req, res) {
    return regeneratorRuntime.async(function test$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            Device.aggregate([{
              $project: {
                license_plate: 1,
                driver: 1
              }
            }, {
              $group: {
                _id: "$driver",
                count: {
                  $sum: 1
                }
              }
            }]).then(function (aggregate) {
              res.send(aggregate);
            });

          case 1:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};