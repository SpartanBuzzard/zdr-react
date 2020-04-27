const router = require('express').Router();
let User = require('../models/user.model');


router.route('/').all((req, res) => {
    console.log('FIRING CHECK FOR ADMIN')
    if(req.session.admin) {
        //This user is an admin
        console.log('(************ Now this should register the ADMIN')
        res.send('definitely admin from second check ')
    } else {
        res.redirect('http://localhost:3000') //direct to home page if not logged in as admin
    } 
})

//Get a List of Users
router.route('/users').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

//Delete a User by Id
router.route('/users/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json('User deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;