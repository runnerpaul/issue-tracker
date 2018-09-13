var gitInstallationAccessToken = require('./gitInstallationAccessToken'),
  config = require("config");

var githubService = {

  retrieveIssues: function(githubAppId, pemFilePath, repoOrg, repoName, callback) {
    const octokit = require('@octokit/rest')();
    let data = null;
    gitInstallationAccessToken.genInstallationAccessToken(githubAppId, pemFilePath, (installationAccessToken) => {

    octokit.authenticate({
      type: 'app',
      token: `${installationAccessToken}`
    });
    
    async function paginate(method) {
      let response = await method({
        q: "repo:" + repoOrg + "/" + repoName + " is:issue" + " state:open",
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
      });
    });
  },

  retrieveEnerpriseIssues: function(repoOrg, repoName, callback) { 
    const octokit = require('@octokit/rest')({
      baseUrl: config.githubEnterprise.baseUrl
    });
    let data = null;

    // token auth
    octokit.authenticate({
      type: 'basic',
      username: config.githubEnterprise.username,
      password: config.githubEnterprise.token
    });

    async function paginate(method) {
      let response = await method({
        q: "repo:" + repoOrg + "/" + repoName + " is:issue" + " label:sdk" + " state:open",
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
      });
  }
}

module.exports = githubService;