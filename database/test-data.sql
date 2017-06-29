\c conartist;
SET ROLE conartist_admin;

INSERT INTO Users (email, password) VALUES
  ('cameldridge@gmail.com', '$2a$10$BOyxdknHm/74c/uUFkZAqOQ4USaXSypbYBooQDFQ8AlaqDQE0SzOO');

INSERT INTO Conventions (code, title, start_date, end_date) VALUES
  ('keinx', 'Anime North 2017', TIMESTAMP '2017-06-10 0:0:0', TIMESTAMP '2017-06-12 23:59:59'),
  ('apenz', 'Coticon 2017', TIMESTAMP '2017-07-12 0:0:0', TIMESTAMP '2017-07-12 23:59:59'),
  ('xkwnd', 'G-Anime 2017', TIMESTAMP '2017-07-25 0:0:0', TIMESTAMP '2017-07-26 23:59:59'),
  ('zenbq', 'Otakuthon 2017', TIMESTAMP '2017-08-04 0:0:0', TIMESTAMP '2017-08-08 23:59:59');
