const router = require('express').Router();
let User = require('../models/user.model');

//Check User Login Status
router.route('/loginStatus').get((req, res) => {
    // console.log('Current req.session', req.session)
    if(req.session.loggedIn) {
        res.json({loggedIn: true, user: req.session.user})
    }
})

//Log User Out
router.route('/logOut').get((req, res) => {
    //req.session.login = false;
    req.session.destroy()
    res.send('success')
})

//Register a User
router.route('/register').post((req, res) => {
    const username = req.body.username;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;

    const newUser = new User({username, firstname, lastname, email, password});

    newUser.save()
        .then(() => res.json('User registered!'))
         .catch(err => res.status(400).json('Error: ' + err));
});



module.exports = router;