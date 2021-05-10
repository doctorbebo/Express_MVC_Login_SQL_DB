const db = require('../db');
const util = require('../util/util');

const table = 'users';

const Role =  {
    BASIC: 'Basic',
    ADMIN: 'Admin'
}

const Create = async(email, password, firstName, lastName, role = 'Basic') => {

    if(!email || !password || !firstName || !lastName)
        throw 'email password firstName lastName must be valid';

    if(role !== Role.BASIC && role !== Role.ADMIN)
        throw 'role must be "Basic" or "Admin"';

    if(!util.validateEmail(email))
        return 'email must be a valid email';

    try {
        const ret = await db.Create(table, {email, password, firstName, lastName, role});
        console.log(ret);
        return await db.Get(ret.insertId);
    } catch (err) {
        throw err;
    }
}

const Get = async (emailOrId) => {

    try {
        if(util.validateEmail(emailOrId))
        return await db.Get(table, 'email', emailOrId);
        else
        return await db.Get(table, 'id', emailOrId);
    } catch (err) {
        throw err;
    }
}

const GetMany = async (key, value) => {

    try {
        if(!key || !value)
        return 'key and/or value must be valid';
        
        if(key == 'password')
        return 'cannot retrieve users via password';
        
        const ret = await db.Get(table, key, value);
        ret.forEach(val => delete val.password);
        return ret;
    } catch(err) {
        throw err;
    }
}

const Update =  async (id, key, newValue) => {
    console.log;
    if(!key.length || (typeof key === 'string' ||  myVar instanceof String)) {
        key = [key];
        newValue = [newValue];
    }
    try {
        return await db.Update(table, key, newValue, id);
    } catch(err) {
        throw err;
    }
}

const Delete = async (id) => {
    try {
        const obj = await db.Delete(table, id);
        if(obj.affectedRows === 0)
            throw false;
        else
            return true;
    } catch(err) {
        throw err;
    }
} 

// (async () => {
//     try {
//         console.log(await Update(5, 'password', '123456789'));
//     } catch(err) {console.error(err)}
// })();
// Create
// Read
// Update
// Delete