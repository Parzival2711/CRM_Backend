module.exports = function(app){     
    const userHandler = require('../controllers/user.controller');
    const userMiddleware = require('../middlewares/user.middleware');
    app.route("/crm/api/V1/admin/users").get(userMiddleware.isAdmin,userHandler.getUsers);
    app.route('/crm/api/V1/admin/update/:userId').put(userMiddleware.isAdmin,userHandler.adminUpdate);
}