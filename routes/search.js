const { Router } = require('express');

const {searchGet} = require('../controllers/search')

const router = Router();

router.get('/:collection/:termino', searchGet)


module.exports = router