const Ticket = require('../models/ticket.model');
const constants = require('../utils/constants');

//Logic to generate ticket - "T-0001"
async function generateTicketId(){
    const highestTicket = await Ticket.findOne(
        {}//filter
        ,{}//projection
        ,{sort:{ticketId:-1},limit:1}//Query Options to sort in descending order and pick the 1st one
    );
    let serialnumber =  10001;
    if(highestTicket){
        const parts = highestTicket.ticketId.split("-");
        serialnumber = parseInt(parts[parts.length-1]);
    }
    serialnumber += 1;
    const ticketId = `T-${serialnumber}`;
    console.log(ticketId);
    return ticketId;
}

//Creating the ticket
exports.createTicket = async(req,res)=>{
    var newTicket = new Ticket(req.body);
    newTicket.ticketId = await generateTicketId();//generate ticketID
    newTicket.reporter = req.user.userId;
    try{
        const result = await newTicket.save();
        res.status(200).send(result);
    }catch(err){
        console.log(err);
        res.status(500).send({
            message:"Ticket could not be logged"
        })
    }
}
//Admin updation of Tickets
exports.updateTicketAdmin = async(req,res)=>{
    var ticket = new Ticket();
    ticket.assignee = req.body.assignee;
    ticket.status = constants.ticketStatus.assigned;
    ticket.ticketId = req.params.ticketId;
    if(req.body.priority){
        ticket.priority = req.body.priority;
    }
    try{
        const result = await Ticket.findOneAndUpdate(
            {ticketId:ticket.ticketId},
            {
                assignee:ticket.assignee,
                status:ticket.status,
                priority:ticket.priority,
                updatedAt:Date.now()
            }
        );
        res.status(200).send({
            message:"Data has been updated successfully"
        })
    }catch(err){
        console.log("Data Couldn't be updated");
        res.status(500).send({
            message:"Some Internal error occurred"
        });
    }
}