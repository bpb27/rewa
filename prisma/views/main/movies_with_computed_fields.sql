SELECT
  m.id AS movie_id,
  m.budget,
  m.release_date,
  m.revenue,
  m.runtime,
  m.title,
  (
    CASE
      WHEN budget <> 0 THEN ROUND(((revenue * 1000 - budget) / budget) * 100, 0)
      ELSE 0
    END
  ) AS profit_percentage,
  COALESCE(e.episode_order, 0) AS episode_order,
  COALESCE(c.name, 'N/A') AS director_name
FROM
  movies AS m
  LEFT JOIN episodes AS e ON m.id = e.movie_id
  LEFT JOIN (
    SELECT
      com.movie_id,
      c.name
    FROM
      crew_on_movies AS com
      JOIN crew AS c ON com.crew_id = c.id
    WHERE
      com.job = 'Director'
    GROUP BY
      com.movie_id
  ) AS c ON m.id = c.movie_id
GROUP BY
  m.id;