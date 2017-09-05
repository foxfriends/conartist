select count(*), products.name as product, producttypes.name as type from
  (select unnest(products) as product_id from records) as r
  inner join products on r.product_id = products.product_id
  inner join producttypes on products.type_id = producttypes.type_id
group by r.product_id,products.name,producttypes.name
order by r.product_id;
