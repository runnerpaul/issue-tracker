var getGitHubIssues = require('./lib/getPublicGitHubIssues'),
getEnterpriseGitHubIssues = require('./lib/getEnterpriseGitHubIssues');


getGitHubIssues.deleteFromDb('', function() {
//getGitHubIssues.extractToDb();
getEnterpriseGitHubIssues.extractToDb();
});

//Test delete
//getGitHubIssues.deleteFromDb('', function() {}