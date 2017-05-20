# Inventory tracker

Tracks sales over a period of time, providing the data at the end for
easy analysis.

Put your data in the `data/` folder, and watch it go!

Currently optimized for selling art at conventions, this could easily be adapted
to support different sets of products.

## Usage

Ensure you put your data in .csv format into the data folder. You may need to
create this folder.

There are 3 formats for the .csv files, which each do different things:

1.  Product format: The first line lists the type of product, and the word
    "Quantity". The rest of the lines list variations of that type of product,
    and the quantity in stock.

    Example:
    ```csv
    Food,       Quantity
    Hamburger,  3
    Hot dog,    4
    ```

2.  Prices format: The first line reads "Type, Quantity, Price". The rest of the
    lines list the type of product, how many of them, and the price for that many.

    Example:
    ```csv
    Type, Quantity, Price
    Food, 1,        5
    Food, 3,        12
    Food, 5,        20
    Toy,  1,        3
    Toy,  2,        5
    ```

3.  Records format: The first line reads "Type, Quantity, Names, Price, Time".
    The rest of the lines list the type of product purchased, how many, the names
    of the specific product variations (separated by semicolons), the total amount
    paid for them, and a timestamp corresponding to when they the transaction was
    made.

    Example:
    ```csv
    Type, Quantity, Names,                        Price,  Time
    Food, 1,        Hamburger,                    5,      10000030
    Food, 3,        Hamburger;Hamburger;Hot dog,  12,     10000330
    Toy,  2,        Rocket;Ball,                  5,      10003330
    ```

    All records files will be read in, but new data will be appended to the file
    `data/records.csv`.

Once the data is in place, start the server and the app should now be available
wherever you have hosted it.

## Contributing

Modify whatever you like for your own set of products. The supported product types
are currently hard-coded in, so you'll have to if you aren't selling those exact
things.

If you make a significant improvement, send a pull request and maybe it will get merged.
