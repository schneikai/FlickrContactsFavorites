// Handle sign in to use the Flickr API.
// 2013, Kai Schneider, https://github.com/schneikai

// Sign in with your account to use the Flickr API.
function signIn(){
  if(!localStorage["frob"]) {
    // Get frob.
    var frob;
    var sig = MD5(apiSecret + "api_key" + apiKey + "method" + "flickr.auth.getFrob");

    $.ajax({
      url: apiUrl + 'flickr.auth.getFrob&api_key=' + apiKey + "&api_sig=" + sig,
      dataType: "xml",
      async: false,

      success: function(data, textStatus, xhr) {
        frob = $(data).find('frob').text();
        if(!frob) {
          alert("Failed to get frob. (" + xhr.responseText + ")");
          return false;
        }

        // save the frob
        localStorage["frob"] = frob;

        // Create login url.
        sig = MD5(apiSecret + "api_key" + apiKey + "frob" + frob + "permswrite");
        login_url = "http://www.flickr.com/services/auth/?api_key=" + apiKey + "&perms=write&frob=" + frob + "&api_sig=" + sig;
        window.open(login_url);
        alert("Start download agin when you completed the Flickr login.");
      }
    });

  } else { // empty frob
    if(!localStorage["token"]) {
      // get auth token
      var sig = MD5(apiSecret + "api_key" + apiKey + "frob" + localStorage["frob"] + "method" + "flickr.auth.getToken");
      var token;

      $.ajax({
        url: apiUrl + 'flickr.auth.getToken&api_key=' + apiKey + "&frob=" + localStorage["frob"] + "&api_sig=" + sig,
        dataType: "xml",
        async: false,

        success: function(data, textStatus, xhr) {
          token = $(data).find('token').text();
          if(!token) {
            alert("Failed to get auth token. (" + xhr.responseText + ")");
            localStorage.removeItem("frob");
            return false;
          }

          // save the token
          localStorage["token"] = token;
        }
      });

      if(localStorage["token"]) return true;

    } else {
      // Check if token is stil valid
      var sig = MD5(apiSecret + "api_key" + apiKey + "auth_token" + localStorage["token"] + "method" + "flickr.auth.checkToken");
      var isValid = false;

      $.ajax({
        url: apiUrl + "flickr.auth.checkToken&api_key=" + apiKey + "&api_sig=" + sig + "&auth_token=" + localStorage["token"],
        dataType: "xml",
        async: false,

        success: function(data, textStatus, xhr) {
          token = $(data).find('token').text();
          if(!token) {
            alert("Failed to validate token. Please login again. (" + xhr.responseText + ")");
            localStorage.removeItem("frob");
            localStorage.removeItem("token");
            return false;
          }
          isValid = true;
        }
      });

      if(isValid) return true;

    } // empty token

  } // empty frob

  return false;
} // signIn
