"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var remeda_1 = require("remeda");
var better_sqlite3_1 = __importDefault(require("better-sqlite3"));
var movies_json_1 = __importDefault(require("../src/db/movies.json"));
var episodes_json_1 = __importDefault(require("../src/db/episodes.json"));
var streamers_json_1 = __importDefault(require("../src/db/streamers.json"));
var providers_json_1 = __importDefault(require("../src/db/providers.json"));
var create_tables_1 = require("./create-tables");
var movies = movies_json_1.default;
var episodes = episodes_json_1.default;
var streamers = streamers_json_1.default;
var streamersOnMovies = providers_json_1.default;
var db = new better_sqlite3_1.default('./sql/db.sqlite', {
    readonly: false,
    timeout: 5000,
    // verbose: console.log,
});
var insert = function (table, fields) {
    return "\n    INSERT OR IGNORE INTO ".concat(table, " (\n        ").concat(fields.join(','), "\n    ) VALUES (\n        ").concat(fields.map(function (f) { return '@' + f; }).join(','), "\n    )\n");
};
db.pragma('journal_mode = WAL');
// primary tables
db.prepare(create_tables_1.createMoviesTableSql).run();
db.prepare(create_tables_1.createActorsTableSql).run();
db.prepare(create_tables_1.createCrewTableSql).run();
db.prepare(create_tables_1.createGenresTableSql).run();
db.prepare(create_tables_1.creatProductionCompaniesSql).run();
db.prepare(create_tables_1.createStreamersTableSql).run();
db.prepare(create_tables_1.createEpisodesTableSql).run();
db.prepare(create_tables_1.createHostsTableSql).run();
// join tables
db.prepare(create_tables_1.createActorsOnMoviesTableSql).run();
db.prepare(create_tables_1.createCrewOnMoviesSql).run();
db.prepare(create_tables_1.createGenresOnMoviesTableSql).run();
db.prepare(create_tables_1.createProductionCompaniesOnMoviesSql).run();
db.prepare(create_tables_1.createStreamersOnMoviesTable).run();
db.prepare(create_tables_1.createHostsOnEpisodesSql).run();
var insertMovie = db.prepare(insert('movies', [
    'budget',
    'tmdb_id',
    'imdb_id',
    'overview',
    'poster_path',
    'release_date',
    'revenue',
    'runtime',
    'tagline',
    'title',
]));
var insertGenre = db.prepare(insert('genres', ['name']));
var insertGenreOnMovie = db.prepare(insert('genres_on_movies', ['movie_id', 'genre_id']));
var insertProductionCompany = db.prepare(insert('production_companies', ['name', 'tmdb_id', 'logo_path']));
var insertProductionCompanyOnMovie = db.prepare(insert('production_companies_on_movies', [
    'movie_id',
    'production_company_id',
]));
var insertActor = db.prepare(insert('actors', ['gender', 'tmdb_id', 'name', 'profile_path']));
var insertActorOnMovie = db.prepare(insert('actors_on_movies', [
    'movie_id',
    'actor_id',
    'character',
    'credit_id',
    'credit_order',
]));
var insertCrew = db.prepare(insert('crew', ['gender', 'tmdb_id', 'name', 'profile_path']));
var insertCrewOnMovie = db.prepare(insert('crew_on_movies', [
    'movie_id',
    'crew_id',
    'known_for_department',
    'credit_id',
    'department',
    'job',
]));
var insertEpisode = db.prepare(insert('episodes', [
    'title',
    'episode_order',
    'date',
    'spotify_url',
    'movie_id',
]));
var insertHostOnEpisode = db.prepare(insert('hosts_on_episodes', ['host_id', 'episode_id']));
var insertStreamer = db.prepare(insert('streamers', ['tmdb_id', 'name', 'logo_path']));
var insertStreamerOnMovie = db.prepare(insert('streamers_on_movies', ['streamer_id', 'movie_id']));
var insertHost = db.prepare(insert('hosts', ['name']));
var getMovieByTmdbId = db.prepare("\n  SELECT id AS movie_id FROM movies WHERE tmdb_id = ?;\n");
var getGenreByName = db.prepare("\n  SELECT id AS genre_id FROM genres WHERE name = ?;\n");
var getCompanyByTmdbId = db.prepare("\n  SELECT id AS production_company_id FROM production_companies WHERE tmdb_id = ?;\n");
var getActorByTmdbId = db.prepare("\n  SELECT id AS actor_id FROM actors WHERE tmdb_id = ?;\n");
var getCrewByTmdbId = db.prepare("\n  SELECT id AS crew_id FROM crew WHERE tmdb_id = ?;\n");
var getHostByName = db.prepare("\n  SELECT id AS host_id FROM hosts WHERE name = ?;\n");
var getEpisodeByUrl = db.prepare("\n  SELECT id AS episode_id FROM episodes WHERE spotify_url = ?;\n");
var getStreamerByName = db.prepare("\n  SELECT id AS streamer_id FROM streamers WHERE name = ?;\n");
var insertMovies = db.transaction(function (movies) {
    var _a;
    var _loop_1 = function (movie) {
        var moviePayload = __assign(__assign({}, (0, remeda_1.pick)(movie, [
            'budget',
            'imdb_id',
            'overview',
            'poster_path',
            'release_date',
            'revenue',
            'runtime',
            'tagline',
            'title',
        ])), { tmdb_id: movie.id });
        insertMovie.run(moviePayload);
        var movie_id = getMovieByTmdbId.get(moviePayload.tmdb_id).movie_id;
        // GENRES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        for (var _b = 0, _c = movie.genres; _b < _c.length; _b++) {
            var genre = _c[_b];
            var genrePayload = (0, remeda_1.pick)(genre, ['name']);
            insertGenre.run(genrePayload);
            var genre_id = getGenreByName.get(genrePayload.name).genre_id;
            insertGenreOnMovie.run({ movie_id: movie_id, genre_id: genre_id });
        }
        // PROD COMPANIES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        for (var _d = 0, _e = movie.production_companies; _d < _e.length; _d++) {
            var company = _e[_d];
            var companyPayload = __assign(__assign({}, (0, remeda_1.pick)(company, ['name', 'logo_path'])), { tmdb_id: company.id });
            insertProductionCompany.run(companyPayload);
            var production_company_id = getCompanyByTmdbId.get(companyPayload.tmdb_id).production_company_id;
            insertProductionCompanyOnMovie.run({ movie_id: movie_id, production_company_id: production_company_id });
        }
        // ACTORS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        for (var _f = 0, _g = movie.credits.cast; _f < _g.length; _f++) {
            var actor = _g[_f];
            var actorPayload = __assign(__assign({}, (0, remeda_1.pick)(actor, ['gender', 'name', 'profile_path'])), { tmdb_id: actor.id });
            insertActor.run(actorPayload);
            var actor_id = getActorByTmdbId.get(actorPayload.tmdb_id).actor_id;
            var actorOnMoviePayload = {
                actor_id: actor_id,
                movie_id: movie_id,
                character: actor.character,
                credit_id: actor.credit_id,
                credit_order: actor.order,
            };
            insertActorOnMovie.run(actorOnMoviePayload);
        }
        // CREW ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        for (var _h = 0, _j = movie.credits.crew; _h < _j.length; _h++) {
            var crew = _j[_h];
            var crewPayload = __assign(__assign({}, (0, remeda_1.pick)(crew, ['gender', 'name', 'profile_path'])), { tmdb_id: crew.id });
            insertCrew.run(crewPayload);
            var crew_id = getCrewByTmdbId.get(crewPayload.tmdb_id).crew_id;
            var crewOnMoviePayload = {
                crew_id: crew_id,
                movie_id: movie_id,
                credit_id: crew.credit_id,
                department: crew.department,
                known_for_department: crew.known_for_department,
                job: crew.job,
            };
            insertCrewOnMovie.run(crewOnMoviePayload);
        }
        // EPISODES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var episode = episodes.find(function (e) { return e.movieId === moviePayload.tmdb_id; });
        if (episode) {
            var episodePayload = {
                title: episode.title,
                episode_order: episode.id,
                date: episode.date,
                spotify_url: episode.url,
                movie_id: movie_id,
            };
            insertEpisode.run(episodePayload);
            var episode_id = getEpisodeByUrl.get(episodePayload.spotify_url).episode_id;
            for (var _k = 0, _l = episode.hosts; _k < _l.length; _k++) {
                var host = _l[_k];
                var hostPayload = { name: host };
                insertHost.run(hostPayload);
                var host_id = getHostByName.get(hostPayload.name).host_id;
                var hostOnEpisodePayload = { host_id: host_id, episode_id: episode_id };
                insertHostOnEpisode.run(hostOnEpisodePayload);
            }
        }
        // STREAMERS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        for (var _m = 0, streamers_1 = streamers; _m < streamers_1.length; _m++) {
            var streamer = streamers_1[_m];
            var streamerPayload = {
                tmdb_id: streamer.id,
                logo_path: streamer.logo_path,
                name: streamer.provider_name,
            };
            insertStreamer.run(streamerPayload);
        }
        // STREAMERS_ON_MOVIE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var soms = (_a = streamersOnMovies.find(function (s) { return s.id === moviePayload.tmdb_id; })) === null || _a === void 0 ? void 0 : _a.providers;
        if (soms) {
            for (var _o = 0, soms_1 = soms; _o < soms_1.length; _o++) {
                var streamerName = soms_1[_o];
                var streamer_id = getStreamerByName.get(streamerName).streamer_id;
                if (streamer_id) {
                    var streamerOnMoviePayload = { movie_id: movie_id, streamer_id: streamer_id };
                    insertStreamerOnMovie.run(streamerOnMoviePayload);
                }
            }
        }
    };
    for (var _i = 0, movies_1 = movies; _i < movies_1.length; _i++) {
        var movie = movies_1[_i];
        _loop_1(movie);
    }
});
insertMovies(movies);
db.close();
