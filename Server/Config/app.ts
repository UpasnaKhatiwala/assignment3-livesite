//modules for express server
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

//modules for authentication
import session  from 'express-session';
import passport from 'passport';
import passprotLocal from 'passport-local';

// authentication objects
let strategy = passprotLocal.Strategy; // alias
import User from '../Models/user';

//database modules
import mongoose from 'mongoose';
import db from './db';

mongoose.connect(db.remoteURI);

//DB connection events
mongoose.connection.on('connected', () =>{
    console.log(`connected to MongoDB`);
});

mongoose.connection.on('disconnected', () =>{
    console.log(`Disconnected from MongoDB`);
})

import indexRouter from '../Routes/index';

let app = express();

//middleware modules
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// setup express session
app.use(session({
    secret: db.secret,
    saveUninitialized: false,
    resave: false
   }));

   // initialize passport
app.use(passport.initialize());
app.use(passport.session());

// implement an Auth Strategy
passport.use(User.createStrategy());

// serialize and deserialize user data
passport.serializeUser(User.serializeUser() as any);
passport.deserializeUser(User.deserializeUser());


app.use('/api/', indexRouter);

export default app;
