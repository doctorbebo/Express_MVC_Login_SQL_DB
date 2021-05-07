const userController = require('../controller/userController');
const authToken = require('./authToken');
const bcrypt = require('bcrypt');

const sendUser = (res, user) => {
    obj = {
        id: user.id,
        email: user.email
    };   
    res.json(obj);
}

// Verfies user credentials and calls next. Then, if header isn't sent, it sends user to client. 
const Authenticate = async (req, res, next) => {

    if(!req.body.email || !req.body.password)
        return res.status(400).json({error: 'email and password must be included in request body object'});

    const email  = req.body.email;
    const password = req.body.password;

    const user = userController.Find('email', email);
    if(!user)
        return res.status(400).json({error: 'Invalid email or password'});

    const isAuthenticated = await bcrypt.compare(password, user.password);
    if(!user || !isAuthenticated) 
        return res.status(401).json({error: 'Invalid email or password'});  
    
    req.body.id = user.id;
    authToken.sign(req, res);

    sendUser(res, user);
}

// Delets user then returns a success message to client.
const Delete = (req, res, next) => {

    const id = req.body.id;
    const password = req.body.password;

    if(!password)
        return res.status(400).json({error: 'password must be included to delete'});

    if(!id)
        return res.status(500).json({error: 'Server Error'});

    const user = userController.Find('id', id);
    if(!user)
        return res.status(500).json({error: 'Sever Error: did not find user'});

    if(!bcrypt.compare(password, user.password))
        return res.status(401).json({error: 'invalid password'});

    if(!userController.Delete(id))
        res.status(500).json({error: "delete failed!"});

    res.json({message: 'delete successful'});

    next();
}

// Registers a user then returns user to client
const Register = async (req, res) => {

    const user = req.body.user;

    if(!user)
        return res.status(400).json({error: 'user object must be included.'});

    if( !user.email || !user.password)
        return res.status(400).json({error: 'email and password must be included within user object.'});

    if(userController.Find('email' ,user.email)) 
        return res.status(400).json({error: `user with ${user.email} already exists.`});

    user.password = await bcrypt.hash(user.password, 10);
    const createdUser = userController.Create(user);
    sendUser(res, createdUser);
}

// Updates user then returns new user to client.
const Update = async (req, res) => {
      
    if(!req.body.key || !req.body.value || !req.body.password)
        return res.status(400).json({error: "invalid key, value or password."});

    const key = req.body.key;
    const value = req.body.value;
    const id = req.body.id;
    const password = req.body.password;

    const oldUser = userController.Find('id', id);

    if(!bcrypt.compare(password, oldUser.password))
        return res.status(401).json({error: 'Invalid password'});
      
    if(key == 'id' || key == '_id')
        return res.status(401).json({error: "Not permitted to change id of user"});

    if(key == 'password')
        value = await bcrypt.hash(value, 10);

    user = userController.Update(id, key, value)
    if(!user)
        return res.status(400).json({error: "improper key use: 'email', 'password', or 'name'"});

    sendUser(res, user);
}

// simply returns user to client; 
const Get = (req, res) => {
    
    if(!req.body.id)
        return res.status(400).json({error: "id required to get user info"});

    const id = req.body.id;
    const user = userController.Find('id', id);
    sendUser(res, user);
}

module.exports = {
    Authenticate,
    Register,
    Delete,
    Update,
    Get,
    sendUser
}
