const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const flash = require("connect-flash");
const env = require("dotenv").config();
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

const sessionStore = new MongoStore({
    uri: process.env.MONGO_URL,
    collection: 'sessions',
})

//ROUTES
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');

//DATABASE CONNECTION
const dbConnect = require('./config/dbConnection');
const { connect } = require('http2');

const PORT = process.env.PORT || 3000;
dbConnect();




//BODY-PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan("dev"));
app.use(flash());



//SESSION MANAGEMENT
app.use(function (req, res, next) {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    next();
    })
app.use(session(
    {secret:"key",
    cookie:{maxAge:1*60*60*1000},
    resave:false,
    saveUninitialized:true,
    store: sessionStore,
}
));



//VIEW ENGINE SETUP
app.set('view engine','ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(userRoute);
app.use(adminRoute);

//ROUTES
app.use('/',userRoute);
app.use('/admin',adminRoute);




//SERVER CREATION
app.listen(PORT, () => {
    console.log(`Server is started at port ${PORT}`);
});
