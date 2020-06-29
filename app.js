const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)

const path = require('path');
const connectDB = require('./config/db');

// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

// DB Connect
connectDB();

// APP
const app = express();

// Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Session
app.use(session({
    secret: 'chiponflicter',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

// Port
const PORT = process.env.PORT || 3000;

// Start
app.listen(
    PORT,
    console.log(`Server in ${ process.env.NODE_ENV } mode on port ${ PORT }`)
);