var _ = require('underscore');
var models = require('../models');

var Bio = models.Bio;
var mainPage = function(req,res){
	Bio.BioModel.findByOwner(req.session.account._id, function(err, docs){
		if(err){
			console.log(err);
			return res.status(400).json({error: 'An error occured'});
		}
		res.render('app',{csrfToken: req.csrfToken(), bios:docs});
	});
};
var acctPage = function(req,res){
		res.render('acct',{csrfToken: req.csrfToken()});
};
var makeBio= function(req,res){
  var defHeight = 0;
  var defWeight = 0;
  var defGender = "NA";
  var defLocation = "Earth";
	if(!req.body.first|| !req.body.last|| !req.body.age){
		return res.status(400).json({error: "First, last, and age are required"});
	}
  if(req.body.height){
    defHeight = req.body.height;
  }
  if(req.body.weight){
    defWeight = req.body.weight;
  }
  if(req.body.gender){
    defGender = req.body.gender;
  } 
  if(req.body.location){
    defLocation = req.body.location;
  }
	var bioData = {
		first: req.body.first,
		last: req.body.last,
		age: req.body.age,
		height: defHeight,
		weight: defWeight,
		gender: defGender,
		location: defLocation,
		owner: req.session.account._id
	};
	
	var newBio = new Bio.BioModel(bioData);
	
	newBio.save(function(err){
		if(err){
			console.log(err);
			return res.status(400).json({error: "An error occurred"});
		}
		res.json({redirect: '/main'});
	});
};
var deleteBio = function(req,res){
	var  bioData = {
		first: req.body.delFirst,
		last: req.body.delLast,
		age: req.body.delAge,
		id: req.body.delID,
		owner: req.session.account._id
	};
	
    Bio.BioModel.findByID(req.body.delID, function(err, doc) {
        //errs, handle them
        if(err) {
            return res.json({err:err}); //if error, return it            
        }
        
        //if no matches, let them know (does not necessarily have to be an error since technically it worked correctly)
        if(!doc) {
            return res.json({error: "No Domos found"});
        }
		doc.remove(function(err) {
			if(err) {
				return res.json({err:err}); //if error, return it
			}
        
        //return success
			res.json({redirect: '/maker'});
		});

    });
};	
module.exports.mainPage = mainPage;
module.exports.acctPage = acctPage;
module.exports.make = makeBio;
module.exports.del = deleteBio;