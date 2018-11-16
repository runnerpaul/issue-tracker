var gitInstallationAccessToken = require('./gitInstallationAccessToken'),
  config = require("config");

var githubService = {

  retrieveIssues: function({repoOrg, repoName, callback, octoKitArgs, octoKitAuthArgs}) {

    const octokit = require('@octokit/rest')(octoKitArgs);
    let data = null;
  
    octokit.authenticate(octoKitAuthArgs);
  
    async function paginate(method) {
      let response;
      if (octoKitArgs == undefined) {
        response = await method({
          q: "repo:" + repoOrg + "/" + repoName + " is:issue" + " state:open",
            per_page: 100
        });
      }
      else {
        response = await method({
          q: "repo:" + repoOrg + "/" + repoName + " is:issue" + " label:sdk" + " state:open",
            per_page: 100
        });
      }
      data = response.data.items;
      var count = 0;
      while (octokit.hasNextPage(response)) {
        count++;
        console.log(`request n°${count}`);
        response = await octokit.getNextPage(response);
        data = data.concat(response.data.items);
      }
      //callback(data);
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