var express = require('express');
var router = express.Router();

const fetch = require('node-fetch');
const User = require('../models/users');

const {checkBody} = require('../modules/checkBody');



router.post('/signup', (req, res) => {

const userEmail = req.body.email;
const userPassword = req.body.password;
const userName = req.body.name;


    /* Si l’email ou le mdp renvoyé est indéfini ou vide, renvoyez : { result:   false, error: 'Missing or empty fields' }. */

    if (!checkBody(req.body, ['email','password'])) {
        return res.json({ result: false, error: 'Missing or empty fields' });
    }

    /* Si l’email est déjà enregistré dans la base de données, renvoyez : { result: false, error: 'User already exists' }. */


User.findOne({email : { $regex : new RegExp(userEmail, 'i') } } ).then (dbData => {
    if (dbData) {
        res.json({ result: false, error: 'User already exists' })
    } else {
            // Creates new document with user data
    const newUser = new User({
        name: userName,
        email: userEmail, 
        password: userPassword,
    });

    // Finally save in database
    newUser.save().then(newDoc => {
        res.json({ result: true, user: newDoc })});
    }
});
});


router.post('/signin', (req, res) => {


const userEmail = req.body.email;
const userPassword = req.body.password
const userName = req.body.name;

if (!checkBody(req.body, ['email','password'])) {
        return res.json({ result: false, error: 'Missing or empty fields' });
    }

    User.findOne({email : { $regex : new RegExp(userEmail , 'i') } } ). then( dbData => {
        if (dbData) {
            if (dbData.password === userPassword) {
                return res.json({result : true})
            }
            else {
                return res.json({result : false, error:'wrong password'})
            }
        } else {
            return res.json({result:false, error:'User not found'})
        }
    })
})

    

router.get('/', (req, res) => {
    User.find()
    .then (data => 
        res.json(data)
    )
}) 

module.exports = router;
