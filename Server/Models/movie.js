"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const movieSchema = new mongoose_1.Schema({
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
    posterLink: { type: String, required: false },
    criticsRating: { type: Number, required: false }
});
let Movie = (0, mongoose_1.model)('Movie', movieSchema);
exports.default = Movie;
//# sourceMappingURL=movie.js.map