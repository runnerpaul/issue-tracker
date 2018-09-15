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
				gitHubService.retrieveEnerpriseIssues(
																			config.githubEnterprise.orgs[i].owner,
																			config.githubEnterprise.orgs[i].repos[j].repoName,
																			function(data, err) {
					if(err) {
							console.log('err: ', err);
					} else {
							gitIssues = data;
					}
					gitIssues = JSON.stringify(gitIssues);
					console.log('gitIssues: ', gitIssues);
					gitIssues = JSON.parse(gitIssues);
					//gitIssues = gitIssues.filter(i => i.state === 'open');
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
							console.log('Body: ', body);
								getGitHubIssues.postToDb(body);
						}
				});
      }
    }
  }
}
module.exports = getEnterpriseGitHubIssues;
