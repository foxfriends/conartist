SELECT
  sum(price),
  ProductTypes.name
FROM
  (SELECT price, products[1] AS product_id FROM records) AS r
  INNER JOIN products ON Products.product_id = r.product_id
  INNER JOIN producttypes ON Products.type_id = ProductTypes.type_id
GROUP BY ProductTypes.name;
