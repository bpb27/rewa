-- CreateTable
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "adult" BOOLEAN NOT NULL,
    "backdrop_path" TEXT,
    "belongs_to_collection" TEXT,
    "budget" INTEGER NOT NULL,
    "homepage" TEXT,
    "imdb_id" TEXT,
    "original_language" TEXT NOT NULL,
    "original_title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "popularity" REAL NOT NULL,
    "poster_path" TEXT,
    "release_date" DATETIME NOT NULL,
    "revenue" BIGINT NOT NULL,
    "runtime" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "video" BOOLEAN NOT NULL,
    "vote_average" REAL NOT NULL,
    "vote_count" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Cast" (
    "adult" BOOLEAN NOT NULL,
    "gender" INTEGER NOT NULL,
    "known_for_department" TEXT,
    "name" TEXT NOT NULL,
    "original_name" TEXT,
    "popularity" REAL NOT NULL,
    "profile_path" TEXT,
    "character" TEXT,
    "credit_id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER,
    "cast_id" INTEGER,
    "movie_id" INTEGER NOT NULL,
    CONSTRAINT "Cast_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Crew" (
    "adult" BOOLEAN NOT NULL,
    "gender" INTEGER NOT NULL,
    "known_for_department" TEXT,
    "name" TEXT NOT NULL,
    "original_name" TEXT,
    "popularity" REAL NOT NULL,
    "profile_path" TEXT,
    "credit_id" TEXT NOT NULL PRIMARY KEY,
    "department" TEXT,
    "job" TEXT,
    "movie_id" INTEGER NOT NULL,
    CONSTRAINT "Crew_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GenresOnMovie" (
    "movieId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,

    PRIMARY KEY ("movieId", "genreId"),
    CONSTRAINT "GenresOnMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GenresOnMovie_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductionCompany" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "logo_path" TEXT,
    "name" TEXT NOT NULL,
    "origin_country" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProductionCompanyOnMovie" (
    "movieId" INTEGER NOT NULL,
    "productionCompanyId" INTEGER NOT NULL,

    PRIMARY KEY ("movieId", "productionCompanyId"),
    CONSTRAINT "ProductionCompanyOnMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductionCompanyOnMovie_productionCompanyId_fkey" FOREIGN KEY ("productionCompanyId") REFERENCES "ProductionCompany" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
