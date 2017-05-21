# Inventory tracker

Tracks sales over a period of time, providing the collected data at the end for
easy analysis.

Currently optimized for selling art at conventions, this could easily be adapted
to support different sets of products.

## Usage

Ensure you put your data in csv format into the `data` folder. You may need to
create this folder.

There are three formats of csv files used:

1.  Product format, storing the actual products. The file name is used as the
    type of product.

    Each line lists variations of that type of product, and the quantity in stock.

    Example:
    ```csv
    Hamburger,  3
    Hot dog,    4
    ```

2.  Prices format, storing the default prices for some quantity of each product.
    There is only one price format file, and it is named `prices.csv`.

    The lines list the type of product, how many of them, and the price for that many.

    Example:
    ```csv
    Food, 1,        5
    Food, 3,        12
    Food, 5,        20
    Toy,  1,        3
    Toy,  2,        5
    ```

3.  Records format, storing the transaction records. There is only one record format
    file, named `records.csv`.

    Each line lists the type of product purchased, how many, the names
    of the specific product variations (separated by semicolons), the total amount
    paid for them, and a timestamp corresponding to when they the transaction was
    made.

    Example:
    ```csv
    Food, 1,        Hamburger,                    5,      10000030
    Food, 3,        Hamburger;Hamburger;Hot dog,  12,     10000330
    Toy,  2,        Rocket;Ball,                  5,      10003330
    ```

## Contributing

Modify whatever you like for your own set of products. The supported product types
are currently hard-coded in, so you'll have to if you aren't selling those exact
things.

If you make a significant improvement, send a pull request and maybe it will get merged.
