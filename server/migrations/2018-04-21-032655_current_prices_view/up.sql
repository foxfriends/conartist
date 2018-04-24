CREATE VIEW CurrentPrices AS
     SELECT user_id, type_id, product_id, quantity, MAX(mod_date) as mod_date
       FROM Prices
   GROUP BY user_id, type_id, product_id, quantity;
