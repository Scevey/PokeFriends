var _ = require('underscore');
var models = require('../models');

var Account = models.Account;
var Bio = models.Bio;
var mainPage = function(req,res){

	Bio.BioModel.findByOwner(req.session.account._id, function(err, docs){
		if(err){
			console.log(err);
			return res.status(400).json({error: 'An error occured'});
		}
    var tempSort = [];
    for (i = 0; i < docs.length; i++) { 
        tempSort[i] = docs[i];
    } 
 
    tempSort.sort(function(a, b){return a.number-b.number});
    docs = tempSort;
		res.render('app',{csrfToken: req.csrfToken(), bios:docs});
	});
};
var acctPage = function(req,res){
		res.render('acct',{csrfToken: req.csrfToken()});
};
var manualPage = function(req,res){
		res.render('manual',{csrfToken: req.csrfToken()});
};
var editPage = function(req,res){
    var pokeID = req.params.id;
	Bio.BioModel.findByID(pokeID, function(err, doc){
		if(err){
			console.log(err);
			return res.status(400).json({error: 'An error occured'});
		}
		res.render('edit',{csrfToken: req.csrfToken(), bios:doc});
	});
};
var makeBio= function(req,res){
  var defHeight = 0;
  var defWeight = 0;
  var defNum = req.session.account.numberOwned;
  var defLinked = false;
  var defGender = "NA";
  var defLocation = "Earth";
  var defImage = "/assets/img/pika.png";
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
  if(req.body.image){
    defImage = req.body.image;
  }
  if(req.body.number){
    defNum = req.body.number;
  }
  if(req.body.isLinked){
    defLinked = req.body.isLinked;
  }
	var bioData = {
		first: req.body.first,
		last: req.body.last,
		age: req.body.age,
		height: defHeight,
		weight: defWeight,
		gender: defGender,
		location: defLocation,
		image: defImage,
		number: req.session.account.numberOwned,
		isLinked: defLinked,
		owner: req.session.account._id
	};
	var newBio = new Bio.BioModel(bioData);
	newBio.save(function(err){
		if(err){
			console.log(err);
			return res.status(400).json({error: "An error occurred"});
		}
	
		Account.AccountModel.findByID(req.session.account._id, function(err, doc) {
        //errs, handle them
        if(err) {
            return res.json({err:err}); //if error, return it            
        }
        //if no matches, let them know (does not necessarily have to be an error since technically it worked correctly)
        if(!doc) {
            return res.json({error: "No Bios found"});
        }
        if(newBio.isLinked === true){
            doc.userDex = newBio._id;
        }    
        var numO = doc.numberOwned + 1;
        doc.numberOwned = numO;
		doc.save(function(err) {
			if(err) {
				return res.json({err:err}); //if error, return it
			}
				req.session.account = doc.toAPI();
				res.json({redirect: '/main'});
				});

			});
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
            return res.json({error: "No Bios found"});
        }
		doc.remove(function(err) {
			if(err) {
				return res.json({err:err}); //if error, return it
			}
        
        //return success
			res.json({redirect: '/main'});
		});

    });
};	
var editBio = function(req,res){
    Bio.BioModel.findByID(req.body.IDEdit, function(err, doc) {
        //errs, handle them
        if(err) {
            return res.json({err:err}); //if error, return it            
        }
        
        //if no matches, let them know (does not necessarily have to be an error since technically it worked correctly)
        if(!doc) {
            return res.json({error: "No Domos found"});
        }
        doc.first = req.body.firstEdit;
        doc.last = req.body.lastEdit;
        doc.age = req.body.ageEdit;
        doc.height = req.body.heightEdit;
        doc.weight = req.body.weightEdit;
        doc.gender = req.body.genderEdit;
        doc.image = req.body.imageEdit;
        doc.number = req.body.numberEdit;
        doc.location = req.body.locationEdit;        
        doc.save(function(err) {
        if(err) {
          return res.json({err:err}); //if error, return it
        }
          
          //return success
        res.json({redirect: '/main'});
      });

    });
};	
var searchBio= function(req,res){
	if(!req.body.name){
		return res.status(400).json({error: "user name required"});
	}
  		Account.AccountModel.findByUsername(req.body.name, function(err, acct) {
        //errs, handle them
        if(err) {
           handleError("username not valid");
           res.json({redirect: '/main'});        
        }
        //if no matches, let them know (does not necessarily have to be an error since technically it worked correctly)
        if(!acct) {
            return res.json({error: "No Bios found"});
        }
        var userBioID = acct.userDex;
        var newNum = acct.numberOwned + 1;
        acct.numberOwned = newNum;
        acct.save(function(err) {
        if(err) {
          return res.json({err:err}); //if error, return it
        }
          Bio.BioModel.findByID(userBioID, function(err, bio) {
          //errs, handle them
            if(err) {
                return res.json({err:err}); //if error, return it            
            }
            
            //if no matches, let them know (does not necessarily have to be an error since technically it worked correctly)
            if(!bio) {
                return res.json({error: "No Bios found"});
            }
            var bioData = {
              first: bio.first,
              last: bio.last,
              age: bio.age,
              height: bio.height,
              weight: bio.weight,
              gender: bio.gender,
              location: bio.location,
              image: bio.image,
              number: req.session.account.numberOwned,
              isLinked: false,
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
      });   
    });
  });
};



module.exports.mainPage = mainPage;
module.exports.acctPage = acctPage;
module.exports.editPage = editPage;
module.exports.manualPage = manualPage;
module.exports.make = makeBio;
module.exports.search = searchBio;
module.exports.edit = editBio;
module.exports.del = deleteBio;