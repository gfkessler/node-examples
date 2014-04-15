
module.exports = function(app) {

  var Aether = require('../models/aetherModel.js');

  //GET - Return all comments in the DB
  findAllComments = function(req, res) {
  	Aether.find(function(err, comments) {
  		if(!err) {
        		console.log('GET /comments')
  			res.jsonp(comments);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  //GET - Return a comment with specified ID
  findById = function(req, res) {
  	Aether.findById(req.params.id, function(err, comment) {
  		if(!err) {
		        console.log('GET /comment/' + req.params.id);
  			res.jsonp(comment);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  //POST - Insert a new comment in the DB
  addComment = function(req, res) {
  	console.log('POST');
  	console.log(req.body);

  	var comment = new Aether({
  		userId:    	req.body.userId,
  		comment: 	req.body.comment,
  		positionLat:  	req.body.positionLat,
  		positionLng:   	req.body.positionLng,
  		date:  		req.body.date
  	});

  	comment.save(function(err) {
  		if(!err) {
  			console.log('Created');
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});

  	res.jsonp(comment);
  };

  //PUT - Update a register already exists
  updateComment = function(req, res) {
  	Aether.findById(req.params.id, function(err, comment) {
  		comment.comment = req.body.comment;
  		comment.positionLat = req.body.positionLat;
  		comment.positionLng = req.body.positionLng;
  		comment.date = req.body.date;

  		comment.save(function(err) {
  			if(!err) {
  				console.log('Updated');
  			} else {
  				console.log('ERROR: ' + err);
  			}
  			res.jsonp(comment);
  		});
  	});
  }

  //DELETE - Delete a comment with specified ID
  deleteComment = function(req, res) {
  	Aether.findById(req.params.id, function(err, comment) {
  		Aether.remove(function(err) {
  			if(!err) {
  				console.log('Removed');
  			} else {
  				console.log('ERROR: ' + err);
  			}
  		})
  	});
  }

  //Link routes and functions
  app.get('/comments', findAllComments);
  app.get('/comment/:id', findById);
  app.post('/comment', addComment);
  app.put('/comment/:id', updateComment);
  app.delete('/comment/:id', deleteComment);

}
