\c conartist;
SET ROLE conartist_admin;

INSERT INTO Users (email, name, password) VALUES
  ('kittyalyst@gmail.com', 'Kittyalyst', '$2a$10$BOyxdknHm/74c/uUFkZAqOQ4USaXSypbYBooQDFQ8AlaqDQE0SzOO'),
  ('cameldridge@gmail.com', 'OinkIguana', '$2a$10$BOyxdknHm/74c/uUFkZAqOQ4USaXSypbYBooQDFQ8AlaqDQE0SzOO');

INSERT INTO Conventions (title, start_date, end_date) VALUES
  ('Anime North', DATE '2017-05-26', DATE '2017-05-28'),
  ('Summer G-Anime', DATE '2017-07-15', DATE '2017-07-16'),
  ('Otakuthon', DATE '2017-08-04', DATE '2017-08-06'),
  ('Coticon', DATE '2017-08-12', DATE '2017-08-12'),
  ('Fan Expo', DATE '2017-08-31', DATE '2017-09-03'),
  ('Creepy Con', DATE '2017-10-13', DATE '2017-10-15'),
  ('Central Canada Comic Con', DATE '2017-10-27', DATE '2017-10-29'),
  ('GTA Comic Con', DATE '2017-11-12', DATE '2017-11-12'),
  ('Gatecon', DATE '2018-09-14', DATE '2018-09-16'),
  ('PAX South', DATE '2018-01-12', DATE '2018-01-14'),
  ('Desucon Frostbite', DATE '2018-01-26', DATE '2018-01-28'),
  ('Mini-Mini Con', DATE '2018-05-05', DATE '2018-05-05');

UPDATE Conventions 
   SET extra_info = '[
         { "title": "Address", "info": "Metro Toronto Convention Centre\n222 Bremner Blvd\nToronto, ON, Canada", "actionText": "View on map", "action": "conartist://map?coords=[43.6438286,-79.3889779]" },
         { "title": "Website", "actionText": "fanexpocanada.com", "action": "https://www.fanexpocanada.com/en/home.html" }
       ]'::JSON
 WHERE title = 'Fan Expo';

INSERT INTO ConventionInfo (con_id, user_id, information) VALUES
  (5, 1, 'Underground parking is available'),
  (5, 1, 'Badges must be picked up on Wednesday');

INSERT INTO ConventionInfoRatings (con_info_id, user_id, rating) VALUES
  (1, 1, true),
  (1, 2, true),
  (2, 1, true),
  (2, 2, false);
