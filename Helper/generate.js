const crypto = require('crypto');
module.exports.generateRandomString = (length) =>{
    const character = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = " ";
    for(let i = 0 ; i < length ; i++){
        result += character.charAt(Math.floor(Math.random()*character.length))
    }
    return result;
}
module.exports.getSecureRandomNumbers = () => {
    return crypto.randomInt(10**7,10**8-1)+'';
}