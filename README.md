# Inventory tracker

Tracks sales over a period of time, providing the collected data at the end for
easy analysis.

Currently supported product types (with resource keys) include:
*   11x17 Print (`Print11x17`);
*   5x7 Prints (`Print5x7`);
*   Stickers (`Sticker`);
*   Holo Stickers (`HoloSticker`);
*   Charms (`Charm`);
*   Buttons (`Button`); and
*   "Other" (`Other`)

## Usage

Ensure you put your data in csv format into the `data` folder. You may need to
create this folder.

There are three formats of csv files used:

1.  Product format, storing the actual products. The file name is used as the
    type of product, and must be one of the resource keys above (case sensitive,
    e.g. `Button.csv`)

    Each line lists variations of that type of product, and the quantity in stock.

    Example:
    ```csv
    Apple,  3
    Orange, 4
    ```

2.  Prices format, storing the default prices for some quantity of each product.
    There is only one price format file, and it is named `prices.csv`.

    The lines list the type of product, as a resource key from above, how many of
    them, and the price for that many.

    Example:
    ```csv
    Print11x17, 1,  15
    Print11x17, 2,  20
    Print5x7,   1,  5
    Print5x7,   2,  10
    ```

3.  Records format, storing the transaction records. There is only one record format
    file, named `records.csv`.

    Each line lists the type of product purchased as a resource key, how many, the names
    of the specific product variations (separated by semicolons), the total amount
    paid for them, and a timestamp corresponding to when they the transaction was
    made.

    Example:
    ```csv
    Button,     1, Apple,             2,  1495414501411
    Button,     3, Apple;Orange;Pear, 5,  1495427109779
    Print11x17, 2, Cats;Fish,         20, 1495427459202
    ```
