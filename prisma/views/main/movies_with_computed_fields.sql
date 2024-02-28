SELECT
  m.id AS movie_id,
  m.budget,
  m.release_date,
  m.revenue,
  m.runtime,
  m.title,
  CAST(
    (
      CASE
        WHEN budget <> 0 THEN ROUND(((revenue * 1000 - budget) / budget) * 100, 0)
        ELSE 0
      END
    ) AS FLOAT
  ) AS profit_percentage,
  CAST(COALESCE(e.episode_order, 0) AS INTEGER) AS episode_order,
  CAST(COALESCE(o.total_nominations, 0) AS INTEGER) AS total_oscar_nominations,
  CAST(COALESCE(o.total_wins, 0) AS INTEGER) AS total_oscar_wins,
  CAST(COALESCE(eb.rating, 0) AS FLOAT) AS ebert_rating
FROM
  movies AS m
  LEFT JOIN episodes AS e ON m.id = e.movie_id
  LEFT JOIN ebert_reviews AS eb ON m.id = eb.movie_id
  LEFT JOIN (
    SELECT
      movie_id,
      COUNT(*) AS total_nominations,
      SUM(
        CASE
          WHEN won THEN 1
          ELSE 0
        END
      ) AS total_wins
    FROM
      oscars_nominations
    GROUP BY
      movie_id
  ) AS o ON m.id = o.movie_id
GROUP BY
  m.id;