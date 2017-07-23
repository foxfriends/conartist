\c conartist;
SET ROLE conartist_admin;

INSERT INTO Users (email, password) VALUES
  ('cameldridge@gmail.com', '$2a$10$BOyxdknHm/74c/uUFkZAqOQ4USaXSypbYBooQDFQ8AlaqDQE0SzOO');

INSERT INTO Conventions (code, title, start_date, end_date) VALUES
  ('keinx', 'Anime North', DATE '2017-05-26', DATE '2017-05-28'),
  ('xkwnd', 'Summer G-Anime', DATE '2017-07-15', DATE '2017-07-16'),
  ('zenbq', 'Otakuthon', DATE '2017-08-04', DATE '2017-08-06'),
  ('apenz', 'Coticon', DATE '2017-08-12', DATE '2017-08-12');
