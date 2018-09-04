const octokit = require('@octokit/rest')()
var gitInstallationAccessToken = require('./gitInstallationAccessToken');
var config = require("config");

var githubService = {

  retrieveIssues: function(githubAppId, pemFilePath, repoOrg, repoName, callback) {
    let data = null;
    gitInstallationAccessToken.genInstallationAccessToken(githubAppId, pemFilePath, (installationAccessToken) => {

    octokit.authenticate({
      type: 'app',
      token: `${installationAccessToken}`
    });
    
    async function paginate(method) {
      let response = await method({
        q: "repo:" + repoOrg + "/" + repoName + " is:issue",
        per_page: 100
      });
      data = response.data.items;
      var count = 0;
      while (octokit.hasNextPage(response)) {
        count++;
        console.log(`request n°${count}`);
        response = await octokit.getNextPage(response);
        data = data.concat(response.data.items);
      }
      return data;
    }
    
    paginate(octokit.search.issues)
      .then(data => {
        callback(data);
      })
      .catch(error => {
        console.log(error);
      })
    });
  }
}

module.exports = githubService;