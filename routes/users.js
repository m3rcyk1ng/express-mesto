const router = require('express').Router();
const { findUsers, findUserId, postUser, updateProfileInfo, updateProfileAvatar } = require('../contollers/users');

router.get('/users', findUsers);
router.get('/users/:userId', findUserId);

router.post('/users', postUser);

router.patch('/users/me', updateProfileInfo);
router.patch('/users/me/avatar', updateProfileAvatar);
module.exports = router;
