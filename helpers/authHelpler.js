const bcrpyt = require("bcrypt");

exports.hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrpyt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrpyt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};


//decryt pass
exports.comparePassword = (password, hashed) =>{
    return bcrpyt.compare(password, hashed)
}