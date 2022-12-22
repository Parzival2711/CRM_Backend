const express = require('express');
const mongoose = require('mongoose');
const app = express();
const serverConfig = require('./configs/server.config');
const dbConfig = require('./configs/db.config');
const routes = require('./routes/auth.routes');
const middlwares = require('./middlewares/auth.middleware');

//Connecting to database
mongoose.set('strictQuery', false);
mongoose.connect(dbConfig.DB_URL).then(function(){
        console.log("Connected to Mongo DB");
    },function(err){
        console.log("Error while connecting to DB");
    });
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(middlwares.isTokenValid);
routes(app);
//Starting the server
app.listen(serverConfig.PORT, ()=>{
    console.log("Application started on the port : "+serverConfig.PORT);
});
