select sum(price), producttypes.name from
  (select price, products[1] as product_id from records) as r
  inner join products on products.product_id = r.product_id
  inner join producttypes on products.type_id = producttypes.type_id
group by producttypes.name;
