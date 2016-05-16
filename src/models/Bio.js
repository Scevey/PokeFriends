module.exports.Account = require('./Account.js');
module.exports.Bio = require('./Bio.js');

var mongoose = require('mongoose');
var _ = require('underscore');

var BioModel;

//all the things a bio needs
var BioSchema = new mongoose.Schema({
	first: {
		type: String,
		required: true,
		trim: true,

	}, 
 	last: {
		type: String,
		required: true,
		trim: true,
		set: setName
	}, 
	age: {
		type: Number,
		min: 0,
		required: true
	},
	height:{
		type:Number,
		min: 0
	},
  weight:{
		type:Number,
		min: 0
	},
  gender:{
		type:String,
		trim: true,
	},
   location:{
		type:String,
		trim: true,
		required: true
	},
    image:{
		type:String,
		trim: true,
	},
    number:{
      type: Number,
      min: 0,
      required: true
    },
	owner:{
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Account'
	},
  isLinked:{
    type: Boolean
  },
	createdData:{
		type:Date,
		default: Date.now
	}
});

//makes bio data accessible
BioSchema.methods.toAPI = function(){
	return{
		first: this.first,
		last: this.last,
		age: this.age,
		weight: this.weight,
		height: this.height,
		gender: this.gender,
		image: this.image,
		number: this.number,
    isLinked: this.isLinked,
		id: this._id,
		location: this.location
	};
};

//find a bio by its owners username
BioSchema.statics.findByOwner = function(ownerId, callback){
	var search = {
		owner: mongoose.Types.ObjectId(ownerId),
	};
	return BioModel.find(search).select("first last age weight height gender image number isLinked location").exec(callback);
};
//find a bio by its name
BioSchema.statics.findByName = function(name, callback) {

    var search = {
        name: name
    };

    return BioModel.findOne(search).select("first last age weight height gender image number location").exec(callback);
};
//find a bio by its id
BioSchema.statics.findByID = function(tag, callback) {

    var search = {
        _id: tag
    };

    return BioModel.findOne(search, callback);
};
BioModel = mongoose.model('Bio', BioSchema);

module.exports.BioModel = BioModel;
module.exports.BioSchema = BioSchema;