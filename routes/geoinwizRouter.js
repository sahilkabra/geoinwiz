var router = require('express').Router();
var geoinwiz = require('app/geoinwiz');

router.get('/:userid/notifications', geoinwiz.getUserNotifications);
router.get('/:userid/devices', geoinwiz.getNotificationsByProximity);
router.use('/:userid/notifications/:notificationid/device/:deviceid', geoinwiz.updateDeviceStatus);
router.get('/:userid/notifications/:notificationid', geoinwiz.markNotificationAsRead);
router.get('/:userid/notifications/:notificationid', geoinwiz.updateNotificationStatus);
router.get('/:userid/notifications/:notificationid', geoinwiz.getNotificationDetails);
module.exports = router;
