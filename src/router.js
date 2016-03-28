var controllers = require('./controllers');
var mid = require('./middleware');
var router = function(app){
	app.get("/login", mid.requiresSecure,mid.requiresLogout, controllers.Account.loginPage);
	app.post("/login", mid.requiresSecure,mid.requiresLogout,controllers.Account.login);
	app.get("/signup",mid.requiresSecure,mid.requiresLogout, controllers.Account.signupPage);
	app.post("/signup",mid.requiresSecure,mid.requiresLogout, controllers.Account.signup);
	app.get("/logout",mid.requiresLogin, controllers.Account.logout);
	app.get("/main",mid.requiresLogin, controllers.Bio.mainPage);
	app.post("/main",mid.requiresLogin, controllers.Bio.make);	
  app.get("/maker",mid.requiresLogin, controllers.Bio.acctPage);
	app.post("/maker",mid.requiresLogin, controllers.Bio.make);
	app.post("/deleter",mid.requiresLogin, controllers.Bio.del);	
	app.get("/",mid.requiresSecure,mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;