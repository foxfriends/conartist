\c conartist;
SET ROLE conartist_admin;

INSERT INTO Users (email, password) VALUES
  ('cameldridge@gmail.com', '$2a$10$BOyxdknHm/74c/uUFkZAqOQ4USaXSypbYBooQDFQ8AlaqDQE0SzOO');

INSERT INTO Conventions (code, title, start_date, end_date) VALUES
  ('KEINX', 'Anime North', DATE '2017-05-26', DATE '2017-05-28'),
  ('XKWND', 'Summer G-Anime', DATE '2017-07-15', DATE '2017-07-16'),
  ('ZENBQ', 'Otakuthon', DATE '2017-08-04', DATE '2017-08-06'),
  ('APENZ', 'Coticon', DATE '2017-08-12', DATE '2017-08-12'),
  ('BHAIE', 'Fan Expo', DATE '2017-08-31', DATE '2017-09-03');
