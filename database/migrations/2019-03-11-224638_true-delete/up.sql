ALTER TABLE ProductTypes ADD deleted BOOLEAN NOT NULL DEFAULT (FALSE);
ALTER TABLE Products ADD deleted BOOLEAN NOT NULL DEFAULT (FALSE);