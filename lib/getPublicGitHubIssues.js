const http = require('http'),
	querystring = require('querystring'),
	gitHubService = require('./githubService'),
	config = require('config');

var getGitHubIssues = {

	postToDb: function(githubjson) {

		var options = {
			hostname: 'localhost',
			port: 9000,
			path: '/issues',
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

	deleteFromDb: function() {
		var options = {
			hostname: 'localhost',
			port: 9000,
			path: '/issues',
			method: 'DELETE'
		};
		var req = http.request(options, function() {

		});
		req.write();
	},

	extractToDb: function() {
		let gitIssues = null;
		for(var i = 0; i < config.github.orgs.length; i++) {
			for(var j = 0; j < config.github.orgs[j].repos.length; j++) {
				gitHubService.retrieveIssues(config.github.app.id,
																			config.github.app.pemFile,
																			config.github.orgs[i].owner,
																			config.github.orgs[i].repos[j].repoName,
																			function(data, err) {
						if(err) {
								console.log('err: ', err);
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
								console.log('Body: ', body);
								getGitHubIssues.deleteFromDb(function(){
									getGitHubIssues.postToDb(body);
								});
								
						}
					});
			}
		}
	}
}
module.exports = getGitHubIssues;