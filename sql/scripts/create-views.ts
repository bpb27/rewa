import { connectToDb } from '../general';

/*
    npm run view
    npx prisma db pull
    amend prisma schema file manually
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
            COALESCE(c.name, 'N/A') as director_name
        FROM movies m
        LEFT JOIN episodes e ON m.id = e.movie_id
        LEFT JOIN (
            SELECT com.movie_id, c.name
            FROM crew_on_movies com
            JOIN crew c ON com.crew_id = c.id
            WHERE com.job = 'Director'
            GROUP BY com.movie_id
        ) as c ON m.id = c.movie_id
        GROUP BY m.id; 
    `);
  db.close();
};

run();
