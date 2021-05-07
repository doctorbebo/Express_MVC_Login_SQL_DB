
// REMOVE AFTER MODEL IS SET UP.
// This is just a testing enviroment set up. 

const userArray = [];

// Create
function Create(user)
{
    newUser = {
        id: Date.now(),
        email: user.email,
        password: user.password
    }
    userArray.push(newUser)
    return newUser;
}

// Read
function Find(key, value)
{
    return userArray.find((user) => user[key] === value);
}

// Update
const Update = (id, keyToChange, newValue)=>
{
    try {
        const user = Find('id', id);
        user[keyToChange] = newValue;
        return user;
    } catch {
        return undefined; 
    }
}

// Delete
const Delete = (id)=>
{
    const index = userArray.findIndex(element => element.id === id);
    if(index === -1)
        return false; 

    userArray.splice(index, 1);
    return true;
}

module.exports = 
{
    Create,
    Find,
    Update,
    Delete
}