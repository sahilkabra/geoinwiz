var router = require('express').Router();
var geoinwiz = require('app/geoinwiz');

router.use('/:userid/notifications', geoinwiz.getUserNotifications);
router.use('/:userid/notifications/:notificationid', geoinwiz.getNotificationDetails);
router.use('/:userid/notifications/:notificationid/device/:deviceid', geoinwiz.updateDevice);
router.use('/:userid/notifications/:notificationid', geoinwiz.updateNotification);
module.exports = router;
