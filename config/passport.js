let User = require('../db/models/user');
let passport = require('passport');
let passportJWT = require('passport-jwt');
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.PRIVATE_KEY;

let strategy = new JwtStrategy(jwtOptions, async function(jwt_payload, next) {
    var user = await User.findById(jwt_payload._id);
    if (user) {
      next(null, {id:user.id,name:user.name});
    } else {
      next(null, false);
    }
  });
  // use the strategy
passport.use(strategy);
module.exports = passport;