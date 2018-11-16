const http = require('http'),
  gitHubService = require('./githubService'),
	getGitHubIssues = require('./getPublicGitHubIssues'),
	_ = require("underscore"),
	config = require('config');

var getEnterpriseGitHubIssues = {

  extractToDb: function() {
		let gitIssues = null;
		for(var i = 0; i < config.githubEnterprise.orgs.length; i++) {
      for(var j = 0; j < config.githubEnterprise.orgs[i].repos.length; j++) {
				// call as Enterprise github
				gitHubService.retrieveIssues({
					repoOrg: config.githubEnterprise.orgs[i].owner,
					repoName: config.githubEnterprise.orgs[i].repos[j].repoName,
					octoKitArgs: {baseUrl: config.githubEnterprise.baseUrl},
					octoKitAuthArgs: {type: 'basic', username: config.githubEnterprise.username, password: config.githubEnterprise.token},
					callback: function(data, err) {
						if(err) {
							console.debug('ERROR: ', err);
						} else {
							gitIssues = data;
						}
						gitIssues = JSON.stringify(gitIssues);
						gitIssues = JSON.parse(gitIssues);
						let issueFormatForDb = null;
						for(var i = 0; i < gitIssues.length; i++) {
							issueFormatForDb = gitIssues[i];
							const body = '{' +
								'"github_id": "' + issueFormatForDb.id + '",' +
								'"issue_title": "' + issueFormatForDb.title + '",' +
								'"issue_number": "' + issueFormatForDb.number + '",' +
								'"issue_url": "' + issueFormatForDb.url + '",' +
								'"issue_state": "' + issueFormatForDb.state + '"' +
								'}';
							getGitHubIssues.postToDb(body);
						}
					}
				});
			}
  	}
	}
}
module.exports = getEnterpriseGitHubIssues;
