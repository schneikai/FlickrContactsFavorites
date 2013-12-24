# FlickrContactsFavorites

Chrome extension that lets you view the favorite photos from your contacts on Flickr.

Favorites are displayed with the newest faved photo first.

## Installation

Download or clone the extension. Rename *api-credentials.js.example* to
*api-credentials.js* open the file and enter your Flickr API key and secret
that you can get via http://www.flickr.com/services/apps/create/apply.
When you've input your API key and secret save and close the file. Go to Chrome
an open the settings menu (click the button with the 3 bars right of the serach bar).
Click *Dools > Extensions*. Click *Loaded packed extension* and navigate to the
folder where you have downloaded the extension. Done. Open Flickr in a new tab
and read on.

## How does it work

Log in to your Flickr. In the main menu under *Following* you will find a new
menu entry *Favorites of*. Click once. If you have just installed the extension
you might need to log in again to aquire permission to access the Flickr API.
When thats done it will display a counter how many favorites where loaded.
Wait until the number doesn't increase any more or click *Stop loading* to display
what was loaded immediately.

## TODO
* make the layout nicer (display it how Flickr displays the photostream?)
* add a pager or endless scrolling to the favorites list

## Licence
This project uses MIT-LICENSE.
