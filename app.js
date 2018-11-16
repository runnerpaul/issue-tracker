var getGitHubIssues = require('./lib/getPublicGitHubIssues'),
getEnterpriseGitHubIssues = require('./lib/getEnterpriseGitHubIssues');
getStackoverflowQuestions = require('./lib/getStackoverflowQuestions'),


getGitHubIssues.deleteFromDb('', function() {
  getGitHubIssues.extractToDb();
  getEnterpriseGitHubIssues.extractToDb();
//getStackoverflowQuestions.retrieveQuestions();
});

//Test delete
//getGitHubIssues.deleteFromDb('', function() {}