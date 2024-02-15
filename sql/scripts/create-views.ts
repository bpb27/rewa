import { connectToDb } from '../general';

/*
    npm run views
    npx prisma db pull
    amend prisma schema file manually, add proper type where it says unsupported
    npx prisma generate

    view movies_with_computed_fields {
        movie_id                Int              @unique
        budget                  Int
        release_date            String
        revenue                 Int
        runtime                 Int
        title                   String
        profit_percentage       Int
        episode_order           Int
        total_oscar_nominations Int
        total_oscar_wins        Int
        ebert_rating            Int
        movie                   movies?          @relation(fields: [movie_id], references: [id])
    }

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
            CAST(
                (CASE 
                    WHEN budget != 0 THEN ROUND(((revenue * 1000 - budget) / budget) * 100, 0)
                    ELSE 0
                END) AS FLOAT
            ) as profit_percentage,
            CAST(COALESCE(e.episode_order, 0) AS INTEGER) as episode_order,
            CAST(COALESCE(o.total_nominations, 0) AS INTEGER) AS total_oscar_nominations,
            CAST(COALESCE(o.total_wins, 0) AS INTEGER) AS total_oscar_wins,
            CAST(COALESCE(eb.rating, 0) AS FLOAT) AS ebert_rating
        FROM movies m
        LEFT JOIN episodes e ON m.id = e.movie_id
        LEFT JOIN ebert_reviews eb ON m.id = eb.movie_id
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
