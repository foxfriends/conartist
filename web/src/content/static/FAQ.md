# ConArtist FAQ

## How do I create products?

On the website:

1.  Go to the Products page.
2.  Click the Edit button at the top right.
3.  Click the New Product Type button to add a new product type. Use this to group your products
    however you like. Well chosen product types will make setting prices and recording sales a lot
    easier. You can set the name, as well as the colour that is used to represent this type in the
    graphs (you can see those once you've sold some stuff).
4.  Click the + button at the bottom right of the product type box to add a new product. Give it a
    name, and record how many you have in your inventory.
5.  Repeat for as many products as you like!
6.  Don't forget to click Save when you're finished.

On the app:

1.  Go to Settings, then to Manage Products.
2.  Tap the + button to create a new product type.
3.  Give it a name (you can't pick colours from the app), and tap Save.
4.  Navigate into your new product type, and tap the + button to create a new product.
5.  Give it a name and record your inventory, then tap Save.
6.  Repeat for as many products as you like!

## I already have my products recorded elsewhere. Can I import that?

Yes you can! Go to the Products page on the website, and then press the Import button at
the top. You are expected to upload a CSV file, which is organized similarly to the provided
example. You can export a CSV file from most spreadsheet programs.

The IDs can only be used when you're re-importing previously exported ConArtist data, so if this is
your first time importing, you should probably disable the "Includes IDs" option.

Leave "Includes titles" checked if the first line of your CSV file should be ignored because it just
says "Type, Product, Quantity".

Here's an example of a full product list, with titles included:

```
Type,   Product, Quantity
Print,  Print 1,        3
Print,  Print 2,        5
Print,  Print 3,        1
Print,  Print 4,        8
Button, Button 1,      16
Button, Button 2,      25
Button, Button 3,      19
```

You can also use the Import feature to update existing products. If you export your products with
IDs, you can edit them in your preferred spreadsheet program, and then re-import them easily. If you
don't have IDs exported, it will try to match by name, so make sure the names are correct!

## How do I set prices?

Once you've created some products, you can set prices for them so that the costs can be
automatically calculated whenever you make a sale. You'll still be able to override the price
manually when you actually sell the item, but most often the calculations will be correct.

On the website:

1.  Go to the Prices page. You should see all your product types listed.
2.  Click the Edit button at the top right.
3.  Press the + button at the bottom right of a product type box to add a new entry.
4.  You can pick a specific product to set the price of, or just leave the product selector set to
    Any. Set the quantity and the price.
5.  Add as many rows as you like! Rows with the same product, but with a larger quantity can be used
    to set bulk discounts (like, 1 for $10, 2 for $15) which will automatically be calculated.
6.  Don't forget to click Save when you're finished.

From the app:

1.  Go to Settings, then to Manage Prices.
2.  Navigate into a product type, and tap the + button to create a new entry.
3.  You can pick a specific product to set the price of, or just leave the product selector set to
    Any. Set the quantity and the price. Tap Save when you're done.
4.  Add as many rows as you like! Rows with the same product, but with a larger quantity can be used
    to set bulk discounts (like, 1 for $10, 2 for $15) which will automatically be calculated.

## How do I sell things?

Please note that ConArtist only helps you record your sales. It does not actually facilitate the
selling in any way.

That being said, to actually start recording your sales, first find a convention using the
convention search, and tap the star icon of one you wish to attend. Once a convention is starred, it
should show up on the home page of the app. When the day comes, the convention will move up to the
Today section, and you'll be able to record sales!

Until the convention starts you cannot record sales, but you can put some expenses in early (like
table fees or arranged hotel costs) so you don't forget.

## A convention I plan to attend is not listed. What to do?

Just send an email, or a message on Discord, and we'll try to add your convention as soon as
possible. There are links to contact us on the settings page!

Provide as much of this information as you can find:

*   Convention name
*   Dates
*   Website
*   Address
*   Geographic coordinates (plug the address into Google Maps)
*   Artist Alley hours

If you want to be super helpful (and are willing to get a bit more technical), fill in
[this template](https://github.com/OinkIguana/conartist/blob/master/dev/import-conventions/sample/convention.toml)
to the best of your abilities, and send that to me!

## I use an Android phone. Can I use this app?

Right now, unfortunately not. It takes some time to develop an app, and I wanted to get the iOS
version out as soon as possible, but an Android app is definitely in the plans for the future. Feel
free to send some motivating messages, and maybe I'll try to speed up development a bit!

You can, however, visit the website from your phone. It has pretty much all the same features as
the app!
