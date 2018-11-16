const http = require('http'),
	gitHubService = require('./githubService'),
	config = require('config'),
	gitInstallationAccessToken = require('./gitInstallationAccessToken');

var getGitHubIssues = {
	
	postToDb: function(githubjson) {

		let v1path = '/api/v1';

		var options = {
			hostname: 'localhost',
			port: 9000,
			path: v1path + '/issues',
			method: 'POST',
			headers: {
					'Content-Type': 'application/json',
			},
			body: githubjson
		};
		console.log('options.path: ', options.path);
		var req = http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (body) {
				console.log('Body2: ' + body);
			});
		});
		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
		// write data to request body
		console.log('githubjson: ', githubjson)
		req.write(githubjson);
		req.end();

	},

	deleteFromDb: function(githubjson, callback) {

		let v1path = '/api/v1';
		
		var options = {
			hostname: 'localhost',
			port: 9000,
			path: v1path + '/issues',
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(githubjson)
			}
		};
		var req = http.request(options, function() {

		});
		req.write(githubjson);
		req.end();
		callback();
	},

	extractToDb: function() {
		let gitIssues = null;
		gitInstallationAccessToken.genInstallationAccessToken(config.github.app.id, config.github.app.pemFile, (installationAccessToken) => {
			for(var i = 0; i < config.github.orgs.length; i++) {
				for(var j = 0; j < config.github.orgs[i].repos.length; j++) {
					// call as public github
					gitHubService.retrieveIssues({
						repoOrg: config.github.orgs[i].owner,
						repoName: config.github.orgs[i].repos[j].repoName,
						octoKitArgs: undefined,
						octoKitAuthArgs: {type: 'app', token: `${installationAccessToken}`},
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
		});
	}
}
module.exports = getGitHubIssues;
