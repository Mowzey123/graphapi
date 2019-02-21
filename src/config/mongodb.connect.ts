import mongoose = require('mongoose');

 const MONGO_URI = 'mongodb://localhost/mygraphapi';
 try {
    mongoose.set('useFindAndModify', false);
    mongoose.connect(MONGO_URI || process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true
    });
 } catch (error) {
     console.log(error);
 }
 