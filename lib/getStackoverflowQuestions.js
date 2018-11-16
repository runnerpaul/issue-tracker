var stackexchange = require('stackexchange'),
getGitHubIssues = require('./getPublicGitHubIssues');

var getStackoverflowQuestions = {

  retrieveQuestions: function() {
     
    var options = { version: 2.2 };
    var context = new stackexchange(options);
    
    var filter = {
      key: 'key',
      pagesize: 100,
      tagged: 'octokit',
      answered: false
    };
    
    // Get all the questions (http://api.stackexchange.com/docs/questions)
    context.questions.questions(filter, function(err, results){
      if (err) throw err;
      
      console.log(results.items);
      console.log(results.has_more);
      var stackIssues = JSON.stringify(results.items);
        console.log('gitIssues: ', stackIssues);
        stackIssues = JSON.parse(stackIssues);
        //gitIssues = gitIssues.filter(i => i.state === 'open');
        let issueFormatForDb = null;
        for(var i = 0; i < stackIssues.length; i++) {
            issueFormatForDb = stackIssues[i];
            const body = '{' +
              '"stack_id": "' + issueFormatForDb.question_id + '",' +
              '"issue_title": "' + issueFormatForDb.title + '",' +
              '"issue_accepted_answer": "' + issueFormatForDb.accepted_answer_id + '",' +
              '"issue_url": "' + issueFormatForDb.link + '",' +
              '"issue_state_answered": "' + issueFormatForDb.is_answered + '"' +  
            '}';
            console.log('Body: ', body);
            getGitHubIssues.postToDb(body);
        }
    });
  }
}

module.exports = getStackoverflowQuestions;