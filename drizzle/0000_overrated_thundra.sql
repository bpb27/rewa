-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `movies` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`budget` integer NOT NULL,
	`tmdb_id` integer NOT NULL,
	`imdb_id` text NOT NULL,
	`overview` text NOT NULL,
	`poster_path` text NOT NULL,
	`release_date` text NOT NULL,
	`revenue` integer NOT NULL,
	`runtime` integer NOT NULL,
	`tagline` text NOT NULL,
	`title` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `actors` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`gender` integer NOT NULL,
	`tmdb_id` integer NOT NULL,
	`name` text NOT NULL,
	`profile_path` text
);
--> statement-breakpoint
CREATE TABLE `crew` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`gender` integer NOT NULL,
	`tmdb_id` integer NOT NULL,
	`name` text NOT NULL,
	`profile_path` text
);
--> statement-breakpoint
CREATE TABLE `genres` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `production_companies` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`tmdb_id` integer NOT NULL,
	`name` text NOT NULL,
	`logo_path` text
);
--> statement-breakpoint
CREATE TABLE `streamers` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`tmdb_id` integer NOT NULL,
	`logo_path` text
);
--> statement-breakpoint
CREATE TABLE `episodes` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL,
	`episode_order` integer NOT NULL,
	`date` text NOT NULL,
	`spotify_url` text NOT NULL,
	`movie_id` integer NOT NULL,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `hosts` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `actors_on_movies` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`movie_id` integer NOT NULL,
	`actor_id` integer NOT NULL,
	`character` text NOT NULL,
	`credit_id` text NOT NULL,
	`credit_order` integer NOT NULL,
	FOREIGN KEY (`actor_id`) REFERENCES `actors`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `crew_on_movies` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`movie_id` integer NOT NULL,
	`crew_id` integer NOT NULL,
	`known_for_department` text NOT NULL,
	`credit_id` text NOT NULL,
	`department` text NOT NULL,
	`job` text NOT NULL,
	FOREIGN KEY (`crew_id`) REFERENCES `crew`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `genres_on_movies` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`movie_id` integer NOT NULL,
	`genre_id` integer NOT NULL,
	FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `production_companies_on_movies` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`movie_id` integer NOT NULL,
	`production_company_id` integer NOT NULL,
	FOREIGN KEY (`production_company_id`) REFERENCES `production_companies`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `hosts_on_episodes` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`host_id` integer NOT NULL,
	`episode_id` integer NOT NULL,
	FOREIGN KEY (`episode_id`) REFERENCES `episodes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`host_id`) REFERENCES `hosts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `oscars_nominations` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`film_year` integer NOT NULL,
	`ceremony_year` integer NOT NULL,
	`won` numeric NOT NULL,
	`recipient` text NOT NULL,
	`movie_id` integer NOT NULL,
	`award_id` integer NOT NULL,
	`actor_id` integer,
	`crew_id` integer,
	FOREIGN KEY (`crew_id`) REFERENCES `crew`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`actor_id`) REFERENCES `actors`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`award_id`) REFERENCES `oscars_awards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `oscars_awards` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`category_id` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `oscars_categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `oscars_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`relevance` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `keywords` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `keywords_on_movies` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`movie_id` integer NOT NULL,
	`keyword_id` integer NOT NULL,
	FOREIGN KEY (`keyword_id`) REFERENCES `keywords`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ebert_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`movie_id` integer NOT NULL,
	`rating` real NOT NULL,
	`path` text,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `streamers_on_movies` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`movie_id` integer NOT NULL,
	`streamer_id` integer NOT NULL,
	FOREIGN KEY (`streamer_id`) REFERENCES `streamers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);

*/