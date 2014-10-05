/*
 * This is the main router for the application. It will decide which route should
 * go to which sub module
 */

var router = require('express').Router();
var geoinwizRouter = require('routes/geoinwizRouter');

router.use('/geoinwiz', geoinwizRouter);
module.exports = router;
