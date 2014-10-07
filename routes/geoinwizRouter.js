var router = require('express').Router();
var geoinwiz = require('app/geoinwiz');

router.get('/:userid/notifications', geoinwiz.getUserNotifications);
router.get('/:userid/notifications/:notificationid', geoinwiz.getNotificationDetails);
router.get('/:userid/devices', geoinwiz.getDevicesByProximity);
router.post('/:userid/notifications/:notificationid/device/:deviceid', geoinwiz.updateDeviceStatus);
router.post('/:userid/notifications/:notificationid', geoinwiz.markNotificationAsRead);
router.post('/:userid/notifications/:notificationid', geoinwiz.updateNotificationStatus);
module.exports = router;
