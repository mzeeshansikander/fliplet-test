var express = require('express');
const { bruteForce } = require('../middleware/middleware');
var router = express.Router();

router.get('/', (req, res) => {
    res.send('/v1');
});

router.get('/users', bruteForce('users', 10, 1), (req, res) => {
    res.send('/v1/users');
});
  
router.get('/apps', async (req, res) => {
    try {
      // Promise-based middleware
      await bruteForce('apps', 3, 1)(req, res, () => {
        res.send('/v1/apps');
      });
      // Route handler code
    } catch (err) {

      res.status(429).send(`Too many requests for the ${err.key} namespace. Please retry in ${err.message} minutes.`);

    }
});

module.exports = router;
