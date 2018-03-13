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
  ('Mini-Mini Con', DATE '2018-05-05', DATE '2018-05-05'),
  ('Ottawa Comic-Con', DATE '2018-05-11', DATE '2018-05-13'),
  ('Fan Expo', DATE '2018-08-30', DATE '2018-09-02'),
  ('Anime North', DATE '2018-05-25', DATE '2018-05-27');

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

INSERT INTO ConventionImages (con_id, image_uuid) VALUES
  (5, 'deea166f-5984-4481-9759-b465f7312c78');

UPDATE Conventions
   SET extra_info = 
  '[
    { "title": "Address", "info": "EY Centre\n 4899 Uplands Dr.\nOttawa, ON, Canada", "actionText": "View on map", "action": "conartist://map?coords=[45.3322119,-75.6563272]" },
    { "title": "Website", "actionText": "ottawacomiccon.com", "action": "https://ottawacomiccon.com" },
    { "title": "Hours", "info": [["2018-05-11T12:00:00-04:00", "2018-05-11T20:00:00-04:00"], ["2018-05-12T10:00:00-04:00", "2018-05-12T19:00:00-04:00"], ["2018-05-13T10:30:00-04:00", "2018-05-13T17:00:00-04:00"]] }
  ]'::JSON
 WHERE title = 'Ottawa Comic-Con';

UPDATE Conventions
   SET extra_info = 
  '[
    { "title": "Address", "info": "Toronto Congress Center\n650 Dixon Rd.\nEtobicoke, ON, Canada", "actionText": "View on map", "action": "conartist://map?coords=[43.6910669,-79.580327]" },
    { "title": "Website", "actionText": "animenorth.com", "action": "http://animenorth.com" },
    { "title": "Hours", "info": [["2018-05-25T17:00:00-04:00", "2018-05-26T01:00:00-04:00"], ["2018-05-26T10:00:00-04:00", "2018-05-27T01:00:00-04:00"], ["2018-05-27T10:00:00-04:00", "2018-05-27T17:00:00-04:00"]] }
  ]'::JSON
 WHERE title = 'Anime North';

UPDATE Conventions
   SET extra_info = '[]'::JSON
 WHERE title = 'Fan Expo';
