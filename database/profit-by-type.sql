SELECT
  SUM(price),
  t.name
FROM
  (SELECT price, products[1] AS product_id FROM Records) AS r
  INNER JOIN Products p ON p.product_id = r.product_id
  INNER JOIN ProductTypes t ON p.type_id = t.type_id
GROUP BY t.name;
