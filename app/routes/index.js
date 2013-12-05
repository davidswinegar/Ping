// returns the main index page
exports.index = function(req, res){
    res.render('index', { title: 'Ping'});
};

// returns the login page
exports.login = function(req, res){
    res.render('login', {title: 'Ping'});
};

// returns the registration page
exports.registerAcc = function(req, res){
    res.render('register', {title: 'Ping'});
};