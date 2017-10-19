SELECT
  count(*),
  p.name AS product,
  t.name AS type
FROM
  (SELECT unnest(products) AS product_id FROM records) AS r
  INNER JOIN Products p ON r.product_id = p.product_id
  INNER JOIN ProductTypes t ON p.type_id = t.type_id
GROUP BY r.product_id, p.name, t.name
ORDER BY r.product_id;
