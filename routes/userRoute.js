const express = require('express');
const authToken = require('../middleware/authToken');
const {Register, Authenticate, Update, Delete, Get, sendUser} = require('../middleware/user_api');

const router = express.Router();

router.post('/register', Register);

router.post('/login', Authenticate, authToken.sign);

router.post('/logout', authToken.signOut, (req, res) => res.json({message: 'logout successful'}));

router.put('/update', authToken.verify, Update);

router.delete('/delete', authToken.verify, Delete, authToken.signOut);

router.all('/', authToken.verify, Get);

module.exports = router;