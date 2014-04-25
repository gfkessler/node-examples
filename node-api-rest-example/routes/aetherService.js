
module.exports = function(app) {
  
  var fs = require('fs');
  var Aether = require('../models/aetherModel.js');
  var http = require("http"),
    url = require("url"),
    path = require("path"),
    crypto = require('crypto'),
    fs = require("fs"),
    port = process.argv[2] || 8888;

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

  uploadFile = function(req, res, next) {
	console.log(req);	
	console.log(req.body);
    console.log(req.files);
    console.log('llego');
	//console.log(req.body.fileData)

	fs.readFile(req.body.fileName, function (err, data) {
  	
        var dat = new Buffer(req.body.fileData, 'base64');
        
        var hash = crypto.createHash('md5').update(dat.toString()).digest("hex");
        console.log(hash);
        
        //var fd = fs.createReadStream(dat);
        //var hash = crypto.createHash('md5');
        //hash.setEncoding('hex');

        //fd.on('end', function() {
        //    hash.end();
        //    console.log(hash.read()); // the desired sha1sum
        //});
        
		var fileName = hash + '.' + req.body.fileName.split('.')[1];
  		var newPath = path.join(process.cwd(), "/resource/", fileName);
  		fs.writeFile(newPath, dat, function (err) {
			console.log(dat);
			console.log(newPath);    			
			res.send(fileName);
  		});
  	}); 
 }
  

  findResourceByName = function(req, res) {
      
      var uri = url.parse(req.url).pathname,
          fileName = path.join(process.cwd(), uri);
      
      console.log(req.params.name);
      console.log(uri);
      console.log(fileName);
      console.log(process.cwd());
      
      fs.exists(fileName, function(exists) {
        if(!exists) {
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.write("404 Not Found\n");
            res.end();
            return;
        }
 
        if (fs.statSync(fileName).isDirectory()) fileName += '/index.html';
 
        fs.readFile(fileName, "binary", function(err, file) {
            if(err) {        
                res.writeHead(500, {"Content-Type": "text/plain"});
                res.write(err + "\n");
                res.end();
                return;
            }
 
            res.writeHead(200);
            res.write(file, "binary");
            res.end();
        });
      });
    
  };
    

  //Link routes and functions
  app.get('/comments', findAllComments);
  app.get('/comment/:id', findById);
  app.get('/resource/:name', findResourceByName);
  app.post('/comment', addComment);
  app.put('/comment/:id', updateComment);
  app.delete('/comment/:id', deleteComment);
  app.post('/resource', uploadFile);

}
