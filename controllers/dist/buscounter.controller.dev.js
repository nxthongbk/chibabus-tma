"use strict";

var BusCounter = require("../db/models/bus_counter");

module.exports = {
  createBusCounter: function createBusCounter(req, res) {
    var _req$body = req.body,
        state = _req$body.state,
        lat = _req$body.lat,
        _long = _req$body["long"],
        age = _req$body.age,
        gender = _req$body.gender,
        device_id = _req$body.device_id;
    if (!state || typeof lat === "undefined" || typeof _long === "undefined" || typeof age === "undefined" || gender === "undefined" || !device_id) return res.sendStatus(400);
    BusCounter.create({
      state: state,
      image: req.file ? req.file.originalname : "unknow_image",
      lat: lat,
      "long": _long,
      age: age,
      gender: gender,
      device_id: device_id
    }).then(function () {
      return res.sendStatus(200);
    })["catch"](function (err) {
      res.sendStatus(400);
      throw new Error(err);
    });
  },
  getBusCounters: function getBusCounters(req, res) {
    BusCounter.find({}).populate("device_id").then(function (buscounters) {
      res.status(200).json(buscounters);
    })["catch"](function (err) {
      console.log(err);
      res.sendStatus(400);
    });
  },
  getBusCounter: function getBusCounter(req, res) {
    BusCounter.findById(req.params.id).populate("device_id").then(function (buscounters) {
      res.status(200).json(buscounters);
    })["catch"](function (err) {
      console.log(err);
      res.sendStatus(400);
    });
  },
  getBusCounterBasedDevice: function getBusCounterBasedDevice(req, res) {
    BusCounter.find({
      device_id: req.params.id
    }).populate("device_id").then(function (buscounters) {
      res.status(200).json(buscounters);
    })["catch"](function (err) {
      res.sendStatus(400);
      throw new Error(err);
    });
  },
  updateBusCounter: function updateBusCounter(req, res) {
    BusCounter.findOneAndUpdate({
      _id: req.params.id
    }, req.body).then(function () {
      return res.sendStatus(200);
    })["catch"](function (err) {
      res.sendStatus(400);
      throw new Error(err);
    });
  },
  deleteBusCounter: function deleteBusCounter(req, res) {
    var id = req.body.id;
    if (!id) return res.sendStatus(400);
    BusCounter.findByIdAndDelete(id).then(function () {
      return res.sendStatus(200);
    })["catch"](function (err) {
      res.sendStatus(400);
      throw new Error(err);
    });
  },
  getCustomerOnDay: function getCustomerOnDay(req, res) {
    BusCounter.aggregate([{
      $project: {
        state: 1,
        timestamp: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$timestamp"
          }
        }
      }
    }, {
      $group: {
        _id: "$timestamp",
        count: {
          $sum: 1
        }
      }
    }]).sort({
      _id: 1
    }).limit(7).then(function (data) {
      return res.send(data);
    })["catch"](function (err) {
      return res.send(err);
    });
  },
  getCustomerOnMonth: function getCustomerOnMonth(req, res) {
    BusCounter.aggregate([{
      $project: {
        state: 1,
        timestamp: {
          $dateToString: {
            format: "%Y-%m",
            date: "$timestamp"
          }
        }
      }
    }, {
      $group: {
        _id: "$timestamp",
        count: {
          $sum: 1
        }
      }
    }]).sort({
      _id: 1
    }).limit(7).then(function (data) {
      return res.send(data);
    })["catch"](function (err) {
      return res.send(err);
    });
  },
  getBusCounterBasedMonth: function getBusCounterBasedMonth(req, res) {
    var year, month, data;
    return regeneratorRuntime.async(function getBusCounterBasedMonth$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            year = req.params.month.split("-")[0];
            month = req.params.month.split("-")[1];
            _context.next = 4;
            return regeneratorRuntime.awrap(BusCounter.aggregate([{
              $project: {
                state: 1,
                image: 1,
                lat: 1,
                "long": 1,
                age: 1,
                gender: 1,
                device_id: 1,
                timestamp: 1,
                month: {
                  $month: '$timestamp'
                },
                year: {
                  $year: '$timestamp'
                }
              }
            }, {
              $match: {
                month: parseInt(month),
                year: parseInt(year)
              }
            }]));

          case 4:
            data = _context.sent;
            res.json(data);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  getBusCounterBasedDate: function getBusCounterBasedDate(req, res) {
    var date, data;
    return regeneratorRuntime.async(function getBusCounterBasedDate$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            date = req.params.date;
            _context2.next = 3;
            return regeneratorRuntime.awrap(BusCounter.aggregate([{
              $project: {
                state: 1,
                image: 1,
                lat: 1,
                "long": 1,
                age: 1,
                gender: 1,
                device_id: 1,
                timestamp: 1,
                date: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: '$timestamp'
                  }
                }
              }
            }, {
              $match: {
                date: date
              }
            }]));

          case 3:
            data = _context2.sent;
            res.json(data);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
};