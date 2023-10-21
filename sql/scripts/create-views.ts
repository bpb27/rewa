import { connectToDb } from '../general';

/*
    npm run views
    npx prisma db pull
    amend prisma schema file manually, add proper type where it says unsupported
    npx prisma generate
*/

const run = () => {
  const db = connectToDb();
  db.exec(`DROP VIEW IF EXISTS movies_with_computed_fields`);
  db.exec(`
        CREATE VIEW movies_with_computed_fields AS
        SELECT
            m.id as movie_id,
            m.budget,
            m.release_date,
            m.revenue,
            m.runtime,
            m.title,
            (CASE 
                WHEN budget != 0 THEN ROUND(((revenue * 1000 - budget) / budget) * 100, 0)
                ELSE 0
            END) as profit_percentage,
            COALESCE(e.episode_order, 0) as episode_order,
            COALESCE(c.name, 'N/A') as director_name,
            COALESCE(o.total_nominations, 0) AS total_oscar_nominations,
            COALESCE(o.total_wins, 0) AS total_oscar_wins,
            COALESCE(eb.rating, 0) AS ebert_rating
        FROM movies m
        LEFT JOIN episodes e ON m.id = e.movie_id
        LEFT JOIN ebert_reviews eb ON m.id = eb.movie_id
        LEFT JOIN (
            SELECT com.movie_id, c.name
            FROM crew_on_movies com
            JOIN crew c ON com.crew_id = c.id
            WHERE com.job = 'Director'
            GROUP BY com.movie_id
        ) as c ON m.id = c.movie_id
        LEFT JOIN (
            SELECT
            movie_id,
            COUNT(*) AS total_nominations,
            SUM(CASE WHEN won THEN 1 ELSE 0 END) AS total_wins
            FROM oscars_nominations
            GROUP BY movie_id
        ) AS o ON m.id = o.movie_id
        GROUP BY m.id; 
    `);
  db.close();
};

run();
