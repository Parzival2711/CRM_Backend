module.exports = (app)=>{
    const ticketHandler = require('../controllers/ticket.controller');
    const authMiddleware = require('../middlewares/auth.middleware');
    const userMiddleware = require('../middlewares/user.middleware');
    app.route("/crm/api/V1/ticket/create").post(authMiddleware.isLoginRequired,ticketHandler.createTicket);
    app.route("/crm/api/V1/ticket/:ticketId").put(authMiddleware.isLoginRequired,ticketHandler.updateTicket);
}
