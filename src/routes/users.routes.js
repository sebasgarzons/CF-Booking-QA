const {Router} = require('express');
const router = Router();

const {renderSignUpForm, renderSigninForm, signup, signin, logout } = require('../controllers/user.controllers')

router.get('/user/signup', renderSignUpForm);
router.post('/user/signup', signup);
router.get('/user/signin', renderSigninForm);
router.post('/user/signin', signin);
router.get('/user/logout', logout);

module.exports = router;