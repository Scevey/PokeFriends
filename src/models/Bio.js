module.exports.Account = require('./Account.js');
module.exports.Bio = require('./Bio.js');

var mongoose = require('mongoose');
var _ = require('underscore');

var BioModel;

var setName = function(name){
	return _.escape(name).trim();
};
var BioSchema = new mongoose.Schema({
	first: {
		type: String,
		required: true,
		trim: true,
		set: setName
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
		//required: true
	},
  weight:{
		type:Number,
		min: 0
		//required: true
	},
  gender:{
		type:String,
		trim: true,
		//required: true
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
	owner:{
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Account'
	},
	createdData:{
		type:Date,
		default: Date.now
	}
});

BioSchema.methods.toAPI = function(){
	return{
		first: this.first,
		last: this.last,
		age: this.age,
		weight: this.weight,
		height: this.height,
		gender: this.gender,
    image: this.image,
		id: this._id,
		location: this.location
	};
};

BioSchema.statics.findByOwner = function(ownerId, callback){
	var search = {
		owner: mongoose.Types.ObjectId(ownerId),
	};
	return BioModel.find(search).select("first last age weight height gender image location").exec(callback);
};
BioSchema.statics.findByName = function(name, callback) {

    var search = {
        name: name
    };

    return BioModel.findOne(search).select("first last age weight height gender image location").exec(callback);
};
BioSchema.statics.findByID = function(tag, callback) {

    var search = {
        _id: tag
    };

    return BioModel.findOne(search, callback);
};
BioModel = mongoose.model('Bio', BioSchema);

module.exports.BioModel = BioModel;
module.exports.BioSchema = BioSchema;