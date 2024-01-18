var db = require("../config/connection");
var collection = require("../config/collections");
const bcrypt = require("bcrypt");
var objectId = require("mongodb").ObjectID;

module.exports = {
  findAdmin: () => {
    return new Promise(async (resolve, reject) => {
      let admin = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne();
      resolve(admin);
    });
  },
  doLoginUser: (userData) => {
    //get the data from the db and return
        console.log(userData,"Dlogin")
        const { email, password } = userData;
          return new Promise(async (resolve,reject) =>{
            const user = await db
            .get()
            .collection(collection.USER_COLLECTION)
            .findOne({ email, password });
            if (user) {
              // If staff with given mobile and username is found, resolve with the staff details
              console.log(user,"found!")
              resolve(user);
          } else {
              // If staff credentials are invalid or not found, reject with appropriate message
              reject('Invalid credentials');
          }
        })
  },
  createAdmin: () => {
    return new Promise(async (resolve, reject) => {
      let password = await bcrypt.hash("admin", 10);
      let admin = {
        username: "admin",
        password: password,
      };
      db.get()
        .collection(collection.ADMIN_COLLECTION)
        .insertOne(admin)
        .then(() => {
          resolve();
        });
    });
  },
  createUser: (data) => {
    try {
      return new Promise(async (resolve, reject) => {
        console.log(data)
      db.get()
        .collection(collection.USER_COLLECTION)
        .insertOne(data)
        .then(() => {
          resolve();
        });
    });
    } catch (error) {
      console.logI(error)
    }
  },
  doLogin: (details) => {
    return new Promise(async (resolve, reject) => {
      let admin = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ username: details.username });
      if (admin) {
        bcrypt.compare(details.password, admin.password).then((response) => {
          if (response) {
            let data = { admin };
            resolve(data);
          } else {
            resolve({ loginErr: "Incorect Password" });
          }
        });
      } else {
        resolve({ loginErr: "Incorect Admin Id" });
      }
    });
  },
};
