const express = require('express'),
      router = express.Router();

router.unsubscribe('/users', require('./users'));

module.exports = router;