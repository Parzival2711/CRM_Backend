module.exports = function(app){     
    const userHandler = require('../controllers/user.controller');
    const userMiddleware = require('../middlewares/user.middleware');
    const ticketHandler = require('../controllers/ticket.controller');
    app.route("/crm/api/V1/admin/users").get(userMiddleware.isAdmin,userHandler.getUsers);
    app.route('/crm/api/V1/admin/update/:userId').put(userMiddleware.isAdmin,userMiddleware.validateUpdate,userHandler.adminUpdate);
    app.route('/crm/api/V1/user/update').put(userMiddleware.validateUpdate,userHandler.userUpdate);
    app.route('/crm/api/V1/admin/ticket/update/:ticketId').put(userMiddleware.isAdmin,userMiddleware.validateUpdate,ticketHandler.updateTicketAdmin);
}
