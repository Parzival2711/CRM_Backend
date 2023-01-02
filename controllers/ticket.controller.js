const Ticket = require('../models/ticket.model');
const constants = require('../utils/constants');
const User = require('../models/user.model');
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
//updation of Tickets
exports.updateTicket = async(req,res)=>{
    var ticket = new Ticket();
    ticket.title = req.body.title;
    ticket.description = req.body.description;
    ticket.status = req.body.status;
    if(req.body.assignee){
        if(req.user.userId[0]=="C"){
            res.status(200).send({
                message:"You're not authorized to assign tickets. Please contact Admin"
            })
        }
        else{
            const user = await User.findOne({userId:req.body.assignee});
            if(user){
                ticket.assignee = req.body.assignee;
            }
            else{
                res.status(500).send({
                    message:"Invalid Assignee ID"
                })
            }
            
        }
    }
    if(req.body.reporter){
        if(req.user.userId[0]=="E"){
            res.status(200).send({
                message:"You're not authorized to change reporter. Please contact Admin"
            })
        }
        else{
            const user = await User.findOne({userId:req.body.reporter});
            if(user){
                ticket.reporter = req.body.reporter;
            }
            else{
                res.status(500).send({
                    message:"Invalid Reporter ID"
                })
            }
            
        }
    }
    try{
        const result = await Ticket.findOneAndUpdate(
            {ticketId:req.params.ticketId},
            {
                title:ticket.title,
                description:ticket.description,
                status:ticket.status,
                assignee:ticket.assignee,
                reporter:ticket.reporter
            }
        );
        console.log(result);
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
