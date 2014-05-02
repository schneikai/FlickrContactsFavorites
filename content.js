// FlickrContactFavorites
// 2013, Kai Schneider, https://github.com/schneikai

const apiUrl = "//api.flickr.com/services/rest/?method=";
var favorites = [];
var checkLoadCompleteTimer;

// Add link to +Favorites of friends+ in main menue under +Following+
var action = $('<li class="gn-subnav-item"><a href="#" id="favorites-of-friends">Favorites of</a></li>');

action.click(function(e) {
  e.stopPropagation();
  e.preventDefault();
  if (signIn()) {
    loadFavorites();
    checkLoadCompleteTimer = window.setInterval(checkLoadComplete, 3000);
  }
});

$('#contacts-panel ul').append(action);

/**
 * Loading the favorites is a asynchronous operation.
 * If found no good way to check when loading has completed so I just
 * display a button the user can click to display the loaded favorites on the website.
 */
function checkLoadComplete() {
  var elm = $('#main');
  elm.empty();
  elm.css('padding', '60px');
  elm.append($('<h1>Your Contacts Favorites</h1>'));
  elm.append($('<p>Loading ' + favorites.length + "</p>"));
  elm.append($('<button id="stop-loading">Stop loading</button>'));
  $('#stop-loading').click(function(){
    window.clearInterval(checkLoadCompleteTimer);
    showFavorites();
  });
}

/**
 * Function displays the favorite photos on the website.
 */
function showFavorites() {
  var elm = $('#main');
  elm.empty();
  elm.css('padding', '60px');
  elm.append($('<h1>Your Contacts Favorites</h1>'));

  // Sort favorites by date when the where faved.
  favs = favorites.sort(function(obj1, obj2) { return parseInt(obj2.date_faved, 10) - parseInt(obj1.date_faved, 10); });
  // Limit the number of photos in the array.
  // If we have to many photos to display it can really hurt the browser.
  // Maybe we can add a paging here?
  if(favs.length > 3000) favs = favs.slice(0, 3000);

  $.each(favs, function(index,photo) {
    elm.append($('<a href="' + photo.href + '" style="margin: 5px; display: block; float: left;"><img src="' + photo.src + '" /></a>'));
  });

}

/**
 * Initiates loading of all favorit photos of your contacts on Flickr.
 * This function triggers *loadFavoritesOfUser* for each of you contacts and add
 * favorite photos to the *favorites* array.
 */
function loadFavorites() {
  var sig = MD5(apiSecret + "api_key" + apiKey + "auth_token" + localStorage["token"] + "method" + "flickr.contacts.getList");

  $.ajax({
    url: apiUrl + "flickr.contacts.getList" + "&api_key=" + apiKey + "&api_sig=" + sig + "&auth_token=" + localStorage["token"],
    dataType: "xml",
    success: function(data, textStatus, xhr) {
      $(data).find("contact").each(function(index,contact) {
        loadFavoritesOfUser($(contact).attr('nsid'));
      });
    },
    error: function (xhr, textStatus, errorThrown) {
      alert(xhr.status + ": " + errorThrown);
    }
  });
}


/**
 * Add favorites of a given user to the +favorites+ array.
 */
function loadFavoritesOfUser(id) {
  var per_page = 25;
  var thumbnail = "url_s";
  var sig = MD5(apiSecret + "api_key" + apiKey + "auth_token" + localStorage["token"] + "extras" + thumbnail + "method" + "flickr.favorites.getList" + "per_page" + per_page + "user_id" + id);

  $.ajax({
    url: apiUrl + "flickr.favorites.getList&user_id=" + id + "&extras=" + thumbnail + "&per_page=" + per_page + "&api_key=" + apiKey + "&api_sig=" + sig + "&auth_token=" + localStorage["token"],
    dataType: "xml",
    success: function(data, textStatus, xhr) {
      $(data).find("photo").each(function(index,photo) {
        photo = $(photo);
        var photo_data = { "date_faved": photo.attr('date_faved'), "title": photo.attr('title'), "src": photo.attr(thumbnail), "href": "//www.flickr.com/photos/" + photo.attr('owner') + "/" + photo.attr('id') };
        favorites.push(photo_data);
      });
    },
    error: function (xhr, textStatus, errorThrown) {
      alert(xhr.status + ": " + errorThrown);
    }
  });
}
