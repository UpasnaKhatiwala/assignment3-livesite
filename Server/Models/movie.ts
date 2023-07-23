import { Schema, model } from 'mongoose';

interface IMovie {
    movieID: string,
    title: string,
    studio: string,
    genres: string[],
    directors: string[],
    writers: string[],
    actors: string[],
    year: number,
    length: number,
    shortDescription: string,
    mpaRating: string,
    posterLink: string,
    criticsRating: number
}

const movieSchema = new Schema<IMovie>({
    movieID: { type: String, required: true },
    title: { type: String, required: true },
    studio: { type: String, required: false },
    genres: { type: [String], required: true },
    directors: { type: [String], required: true },
    writers: { type: [String], required: true },
    actors: { type: [String], required: true },
    year: { type: Number, required: false },
    length: { type: Number, required: false },
    shortDescription: { type: String, required: false },
    mpaRating: { type: String, required: false },
    posterLink: { type: String, required: false},
    criticsRating: { type: Number, required: false }
});


let Movie = model<IMovie>('Movie', movieSchema);

export default Movie;