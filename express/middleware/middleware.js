const ExpressBrute = require('express-brute');

const bruteForce = (namespace, freeRetries, minWait) => {
  const bruteForceInstance = new ExpressBrute(
    new ExpressBrute.MemoryStore(),
    {
      freeRetries,
      minWait : minWait * 10000
    }
  );

  return (req, res, next) => {
    const key = req.ip + namespace;
    bruteForceInstance.prevent(req, res, next, key);
  };
};

exports.bruteForce = bruteForce;