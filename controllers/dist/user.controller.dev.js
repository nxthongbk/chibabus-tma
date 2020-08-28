"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var User = require('../db/models/user');

var bcrypt = require('bcryptjs');

module.exports = {
  createUser: function createUser(req, res) {
    var _req$body = req.body,
        email = _req$body.email,
        password = _req$body.password;
    if (!email || !password) return res.sendStatus(400);
    User.create(req.body).then(function (result) {
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
  login: function login(req, res) {
    var _req$body2, email, password, user, token;

    return regeneratorRuntime.async(function login$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
            console.log(req.body);

            if (!(!email || !password)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", res.status(400).send({
              'error': "require email and password"
            }));

          case 4:
            _context.next = 6;
            return regeneratorRuntime.awrap(User.findByCredentials(email, password));

          case 6:
            user = _context.sent;

            if (user) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return", res.status(401).send({
              error: 'Login failed! Check authentication credentials'
            }));

          case 9:
            _context.next = 11;
            return regeneratorRuntime.awrap(user.generateAuthToken());

          case 11:
            token = _context.sent;
            res.status(200).send({
              auth: true,
              token: token
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  deleteUser: function deleteUser(req, res) {
    var user_id = req.body.user_id;
    if (!user_id) return res.sendStatus(400);
    User.findByIdAndDelete(user_id).then(function () {
      return res.sendStatus(200);
    })["catch"](function (err) {
      res.sendStatus(401);
      throw new Error(err);
    });
  },
  getUsers: function getUsers(req, res) {
    User.find({}).then(function (users) {
      return res.status(200).json(users);
    })["catch"](function (err) {
      res.sendStatus(400);
      throw new Error(err);
    });
  },
  getUser: function getUser(req, res) {
    User.findById(req.params.id).then(function (users) {
      return res.status(200).json(users);
    })["catch"](function (err) {
      res.sendStatus(400);
      throw new Error(err);
    });
  },
  updateUser: function updateUser(req, res) {
    var data;
    return regeneratorRuntime.async(function updateUser$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            data = _objectSpread({}, req.body);
            if (data.email) delete data["email"];
            if (data._id) delete data["_id"];

            if (!data.password) {
              _context2.next = 7;
              break;
            }

            _context2.next = 6;
            return regeneratorRuntime.awrap(bcrypt.hash(data.password, 8));

          case 6:
            data.password = _context2.sent;

          case 7:
            _context2.next = 9;
            return regeneratorRuntime.awrap(User.findById(req.params.id).then(function (user) {
              data.email = user.email;
            })["catch"](function (err) {
              res.sendStatus(400);
              throw new Error(err);
            }));

          case 9:
            User.findByIdAndUpdate(req.params.id, data).then(function () {
              return res.sendStatus(200);
            })["catch"](function (err) {
              res.sendStatus(400);
              throw new Error(err);
            });

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
};