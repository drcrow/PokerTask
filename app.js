const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const connectDB = require('./config/db');

// Load config
dotenv.config({ path: './config/config.env' });

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

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));

// Port
const PORT = process.env.PORT || 3000;

// Start
app.listen(
    PORT,
    console.log(`Server in ${ process.env.NODE_ENV } mode on port ${ PORT }`)
);