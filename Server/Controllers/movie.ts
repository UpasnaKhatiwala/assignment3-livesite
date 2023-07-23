import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import User from '../Models/user';
import Movie from '../Models/movie';
import mongoose from 'mongoose';

// Utility function
function SanitizeArray(unsanitizedArray: string[]): string[] {
    let sanitizedArray: string[] = Array<string>();

    for (const unsanitizedString of unsanitizedArray) {
        sanitizedArray.push(unsanitizedString.trim());
    }
    return sanitizedArray;
}

/* Authentication functions */
export function ProcessRegistration(req: Request, res: Response, next: NextFunction): void {
    // instantiate a new user object
    let newUser = new User
        ({
            username: req.body.username,
            emailAddress: req.body.EmailAddress,
            displayName: req.body.FirstName + " " + req.body.LastName
        });

    User.register(newUser, req.body.password, (err) => {
       
        if(err instanceof mongoose.Error.ValidationError)
        {
            console.error("All fields are required");
            return res.json({ success: false, msg: 'Error: User not registered. All Fields are required!' })
        }
       
        if (err) {
            console.error('Error: Inserting New User');
            if (err.name == "UserExistsError") {
                console.error('Error: User Already Exists');
            }
            return res.json({ success: false, msg: 'User not Registered Successfully!' })
        }
        // if we had a front-end (Angular, React or a Mobile UI)...
        //return res.json({ success: true, msg: 'User Registered Successfully!' });

        // automatically login the user
        return passport.authenticate('local')(req, res, () => {
            return res.json({ success: true, msg: 'User Logged in Successfully!', user: newUser });
        });
    });
}


export function ProcessLogin(req: Request, res: Response, next: NextFunction): void {
    passport.authenticate('local', (err: any, user: any, info: any) => {
        // are there server errors?
        if (err) {
            console.error(err);
            return next(err);
        }
        // are the login errors?
        if (!user) {
            return res.json({ success: false, msg: 'Error: User Not Logged in.' });
        }
        req.login(user, (err) => {
            // are there DB errors?
            if (err) {
                console.error(err);
                return next(err);
            }

            // if we had a front-end (like Angular or React or Mobile UI)...
            return res.json({ success: true, msg: 'User Logged in Successfully!', user: user });
        });
    })(req, res, next);
}

export function ProcessLogout(req: Request, res: Response, next: NextFunction): void {
    req.logout(() => {
        console.log("User Logged Out");

    });
    // if we had a front-end (Angular, React or Mobile UI)...
    res.json({ success: true, msg: 'User Logged out Successfully!' });
}




/* API Functions */
export function DisplayMovieList(req: Request, res: Response, next: NextFunction): void {

    Movie.find({})
        .then(function (data) {
            res.status(200).json({success: true, msg: "Movie List displayed successfully", data: data});
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({success: false, msg: " something went wrong", data: null})
        });

}

export function DisplayMovieByID(req: Request, res: Response, next: NextFunction): void {
    
    try{
    let id = req.params.id;
    Movie.findById({ _id: id })
        .then(function (data) {

            if(data)
            {
            res.status(200).json({success: true, msg: " movie retrieved by id successfully", data: data});
            }
            else{
                res.status(404).json({success: false, msg: " movie retrieved by id unsuccessfull", data: null});
            }
        })
        .catch(function (err) {
            console.error(err);
            res.status(400).json({success: false, msg: " movie id not formatted successfully", data: null});
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({success: false, msg: " something went wrong", data: null})
    }

}

export function AddMovie(req: Request, res: Response, next: NextFunction): void {

    try 
    {
        if(req.body.genres == null || req.body.genres == undefined)
        {
            req.body.genres = "";
        }

        if(req.body.directors == null || req.body.genres == undefined)
        {
            req.body.directors = "";
        }

        if(req.body.writers == null || req.body.genres == undefined)
        {
            req.body.writers = "";
        }

        if(req.body.actors == null || req.body.genres == undefined)
        {
            req.body.actors = "";
        }

        let genres = SanitizeArray((req.body.genres as String).split(","));
        let directors = SanitizeArray((req.body.directors as String).split(","));
        let actors = SanitizeArray((req.body.actors as String).split(","));
        let writers = SanitizeArray((req.body.writers as String).split(","));
    
        let movie = new Movie({
            movieID: req.body.movieID,
            title: req.body.title,
            studio: req.body.studio,
            genres: genres,
            directors: directors,
            writers: writers,
            actors: actors,
            length: req.body.length,
            year: req.body.year,
            shortDescription: req.body.shortDescription,
            mpaRating: req.body.mpaRating,
            posterLink: req.body.posterLink,
            criticsRating: req.body.criticsRating
    
        });
        Movie.create(movie)
            .then(function (data) {
                res.status(200).json({success: true, msg: "movie added successfully", data: movie});
            })
            .catch(function (err) {
                console.error(err);
                if(err instanceof mongoose.Error.ValidationError)
                {
                    res.status(400).json({success: false, msg: "Error: movie addition unsuccessfull, all fields are required", data: null});    
                }
                else{
                    res.status(400).json({success: false, msg: "Error: movie addition unsuccessfull", data: null});
                }
                
            });
    }
    catch(err)
    {
        console.error(err);
                res.status(500).json({success: false, msg: "something went wrong", data: null});
    }
    
}

export function UpdateMovie(req: Request, res: Response, next: NextFunction): void {


    try
    {
        let id = req.params.id;


    let genres = SanitizeArray((req.body.genres as String).split(","));
    let directors = SanitizeArray((req.body.directors as String).split(","));
    let actors = SanitizeArray((req.body.actors as String).split(","));
    let writers = SanitizeArray((req.body.writers as String).split(","));

    let movieToUpdate = new Movie({
        _id: id,
        movieID: req.body.movieID,
        title: req.body.title,
        studio: req.body.studio,
        genres: genres,
        directors: directors,
        writers: writers,
        actors: actors,
        length: req.body.length,
        year: req.body.year,
        shortDescription: req.body.shortDescription,
        mpaRating: req.body.mpaRating,
        posterLink: req.body.posterLink,
        criticsRating: req.body.criticsRating

    });
    Movie.updateOne({ _id: id }, movieToUpdate)
        .then(function (data) 
        {
            res.status(200).json({success: true, msg: "movie updated successfully", data:movieToUpdate});
        })
        .catch(function (err) {
            console.error(err);
            if(err instanceof mongoose.Error.ValidationError)
            {
                res.status(400).json({success: false, msg: "Error: movie updation unsuccessfull, all fields are required", data: null});    
            }
            else{
                res.status(400).json({success: false, msg: "Error: movie updation unsuccessfull", data: null});
            }
        });
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({success: false, msg: "something went wrong", data: null});
    }
    
}

export function DeleteMovie(req: Request, res: Response, next: NextFunction): void {


    try 
    {
        let id = req.params.id;

        Movie.deleteOne({ _id: id })
            .then(function () {
                res.status(200).json({success: true, msg: " movie deleted successfully", data: id});
            })
            .catch(function (err) {
                console.error(err);
                res.status(400).json({success: false, msg: " movie id not formatted successfully", data: null});
            });
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({success: false, msg: "something went wrong", data: null});
    }
    
}