var express = require('express');
var router = express.Router();
const {DAOvinaStore} = require('../controller/store_vina.controller')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/freedom-crawler', DAOvinaStore);

module.exports = router;
