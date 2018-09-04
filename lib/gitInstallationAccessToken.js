const axios = require("axios");
var fs = require('fs');
var jwt = require("jsonwebtoken");

var gitInstallationAccessToken = {
  
  genJWTToken: function(githubAppId, pemFilePath) {

    // Private key contents
    var private_key = fs.readFileSync(pemFilePath);

   // generate jwt
    const now = Math.round(Date.now() / 1000);
    const payload = {
      // issued at time
      iat : now,
      // expires in 10min
      exp : now + (8 * 60),
      // Github app id
      iss : githubAppId
    };

    const token = jwt.sign(payload, private_key, { algorithm: 'RS256' })
    return token;
  },

  getAccessTokensUrl: function(jwt, callback) {

    var installationsUrl = "https://api.github.com/app/installations";

    var instance = axios({
      method: "GET",
      url: installationsUrl,
      headers: {
        "Accept" : "application/vnd.github.machine-man-preview+json",
        "Authorization" : `Bearer ${jwt}`
      }
    })
    .then(function(response) {

      var accessTokensUrl = response.data[0].access_tokens_url;
      callback(accessTokensUrl);
    })
    .catch(function(error) {
      console.warn(`Unable to retrieve accessTokensUrl from ${installationsUrl}`);
      console.warn(`ERROR: ${error}`);
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response) {
        console.warn(`Status ${error.response.status}`);
        console.warn(`${error.response.data.message}`);
      }
    });
  },

  genInstallationAccessToken: function(githubAppId, pemFilePath, callback) {

    var jwt = gitInstallationAccessToken.genJWTToken(githubAppId, pemFilePath);

    gitInstallationAccessToken.getAccessTokensUrl(jwt, function(appAccessTokensUrl) {

      //console.log(`Retrieving access token from url: ${appAccessTokensUrl}`)

      var instance = axios({
        method: "POST",
        url: appAccessTokensUrl,
        headers: {
          "Accept" : "application/vnd.github.machine-man-preview+json",
          "Authorization" : `Bearer ${jwt}`
        }
      })
      .then(function(response) {
        var installationAccessToken = response.data.token;
        //console.log(`Installation Access Token: ${installationAccessToken}`)
        callback(installationAccessToken);
      })
      .catch(function(error) {
        console.warn("Unable to authenticate");
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response) {
          console.warn(`Status ${error.response.status}`);
          console.warn(`${error.response.data.message}`);
        }
      });
    });
  }
}

module.exports = gitInstallationAccessToken;