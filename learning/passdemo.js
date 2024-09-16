const bcrypt = require('bcrypt');



const hashed = async(password) => {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    await console.log(hash)
}

const cmp = async(password,hash) => {
    const res = await bcrypt.compare(password,hash);
    if(res){
        console.log('Matched')
    }
    else{
        console.log('SORRY')
    }
}

hashed('manda')

cmp('manda', '$2b$12$csOqXVqmvy3x6611LMTf0eFtI28lk2582P7HSnZzGOYkAu9aNNCt2');