module.exports = function(app){
    var authHandler = require('../controllers/auth.controller');
    var authMiddleware = require('../middlewares/auth.middleware');
    app.route('/crm/api/v1/auth/signup').post(authHandler.sign_up);
    app.route('/crm/api/v1/auth/signin').post(authHandler.sign_in);
    app.route('/crm/api/v1/home').post(authMiddleware.isLoginRequired,authMiddleware.get_profile);
}
