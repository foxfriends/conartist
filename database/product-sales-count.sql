SELECT
  count(*),
  Products.name AS product,
  ProductTypes.name AS type
FROM
  (SELECT unnest(products) AS product_id FROM records) AS r
  INNER JOIN products ON r.product_id = products.product_id
  INNER JOIN producttypes ON products.type_id = producttypes.type_id
GROUP BY r.product_id, products.name, producttypes.name
ORDER BY r.product_id;
