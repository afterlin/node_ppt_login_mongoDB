const express = require('express');
const router = express.Router();
const {ensureAuthenticated, forwardAuthenticated} = require('../config/auth');

// render to the view of welcome.ejs
router.get('/', forwardAuthenticated, (req, res)=>res.render('welcome'));

//Dashboard, will render the dashboard view  (dashboard.ejs)
router.get('/dashboard', ensureAuthenticated, (req, res)=>res.render('dashboard', {
    name:req.user.name
}));

module.exports = router;