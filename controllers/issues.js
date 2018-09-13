const BaseController = require("./baseController"),
  swagger = require("swagger-node-restify");

  class Issues extends BaseController {

    constructor(lib) {
      super();
      this.lib = lib;
    }

    list(req, res, next) {
      this.lib.db.model('Issues')
        .find()
        .exec((err, list) => {
          if(err) return next(this.RESTError('InternalServerError', err));
          this.writeHAL(res, list);
        });
    }

    details(req, res, next) {
      let id = req.params.id;
      if(id) {
        this.lib.db.model('Issues')
          .findOne({_id: id})
          .exec((err, issue) => {
            if(err) return next(err);
            if(!issue) {
              return next(this.RESTError('ResourceNotFoundError', 'Not found'));
            }
            this.writeHAL(res, issue);
          });
      } else {
        next( this.RESTError('InvalidArgumentError', 'Invalid id'));
      }
    }

    //For testing purposes only
    create(req, res, next) {
      let data = req.body;
      if(data) {
        let newIssue = this.lib.db.model('Issues')(data);
        console.log(newIssue);
        newIssue.save((err, issue) => {
          if(err) return next(this.RESTError('InternalServerError', err));
          this.writeHAL(res, issue);
        });
      } else {
        next(this.RESTError('InvalidArgumentError', 'No data received'));
      }
    }

    update(req, res, next) {
      let data = req.body;
      let id = req.params.id;
      if(id) {
        this.lib.db.model('Issues')
          .findOne({_id: id})
          .exec((err, updateIssue) => {
            if(err) return next(this.RESTError('InternalServerError', err));
            updateIssue = Object.assign(updateIssue, data);
            updateIssue.save((err, issue) => {
              if(err) return next(this.RESTError('InternalServerError', err));
              this.writeHAL(res, issue);
            });
          });
      }
      else if(data) {
        let newIssue = this.lib.db.model('Issues')(data);
        console.log(newIssue);
        newIssue.save((err, issue) => {
          if(err) return next(this.RESTError('InternalServerError', err));
          this.writeHAL(res, issue);
        });
      } else {
        next(this.RESTError('InvalidArgumentError', 'No data received'));
      }
    }    

    remove(req, res, next) {
      let collectionContents = this.lib.db.model('Issues');
      collectionContents.deleteMany({}, (err, result) => {
        if(err) return next(this.RESTError('InternalServerError', err));
        this.writeHAL(res, result);
      });
    }

 /*   update(req, res, next) {
      let data = req.body;
      let id = req.params.id;
      if(id) {
        this.lib.db.model('Issues')
          .findOne({_id: id})
          .exec((err, updateIssue) => {
            if(err) return next(this.RESTError('InternalServerError', err));
            updateIssue = Object.assign(updateIssue, data);
            updateIssue.save((err, issue) => {
              if(err) return next(this.RESTError('InternalServerError', err));
              this.writeHAL(res, issue);
            });
          });
      }
    }*/
  }

  module.exports = function(lib) {
    let controller = new Issues(lib);
    let v1path = '/api/v1';

    controller.addAction({
      'path': v1path + '/issues',
      'method': 'GET',
      'summary': 'Returns the list of issues across all repos',
      'responseClass': 'Issues',
      'nickname': 'getIssues'
    }, controller.list);

    controller.addAction({
      'path': v1path + '/issues',
      'method': 'DELETE',
      'summary': 'Delete all issues from the list',
      'responseClass': 'Issues',
      'nickname': 'deleteIssues'
    }, controller.remove);

    //For testing purposes only
    controller.addAction({
      'path': v1path + '/issues',
      'method': 'POST',
      'params': [swagger.bodyParam('issues', 'The JSON data of the issues', 'string')],
      'summary': 'Adds a new issue to the list',
      'responseClass': 'Issues',
      'nickname': 'newIssue'
    }, controller.create);

    controller.addAction({
      'path': v1path + '/issues/{id}',
      'method': 'GET',
      'params': [swagger.pathParam('id', 'The id of the issue', 'string')],
      'summary': 'Returns the data of an issue',
      'responseClass': 'Issues',
      'nickname': 'getIssue'
    }, controller.details);

    controller.addAction({
      'path': v1path + '/issues/{id}',
      'method': 'PUT',
      'summary': "UPDATES the issues's information",
      'params': [swagger.pathParam('id', 'The id of the issue', 'string'),
        swagger.bodyParam('issue', 'the new information to update', 'string')],
      'responseClass': 'Issues',
      'nickname': 'updateIssue'
    }, controller.update);

    return controller;

  }