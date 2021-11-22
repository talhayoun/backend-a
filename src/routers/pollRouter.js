const express = require("express");
const { verifyKey } = require("../middleware/utils");
const Poll =  require("../models/pollSchema");
const router = express.Router();

router.post("/api/poll/add-poll", verifyKey, async(req, res)=>{
    try {
        if(!req.body.title || !req.body.options)
            return res.send({err: "Title and options are required"});
        const newPoll = await new Poll({title: req.body.title, options: req.body.options});
        if(!newPoll) return res.send({err: "Failed to add new poll"});
        await newPoll.save();
        res.send({newPoll})
    } catch (error) {
        
    }
})

router.get("/api/polls", async(req, res)=> {
    try {
        let pageNumber = req.query.page
        console.log(pageNumber)
        let count = pageNumber >= 0 ? ((pageNumber - 1) * 3) : 0;
    console.log(count)
        if(!req.query.page) return res.send({err: "Page is not defined"});


        let totalPages = Poll.countDocuments()
        const polls = await Poll.find({}).limit(3).skip(count);
        if(!polls) return res.send({err: "Failed to find polls"});

        let pollsData = [];
        for(let i = 0 ; i < polls.length; i++){
            pollsData.push(polls[i]);
        }
        let data = {
            data: [
               ...pollsData
            ],
            complete: totalPages >= count ? false : true,
            page:Math.floor(req.query.page / 3)

        }
        // console.log(data)
        res.send(data)
    } catch (error) {
        
    }
})

router.post("/api/poll/:number/vote/:option", async(req, res)=>{
    try {
        const poll = await Poll.findOne({id: req.params.number});
        if(!poll) return res.send({err: "Failed to find poll"});
        const updatedVote = poll.options[req.params.option].votes + 1.
        const findOption = poll.options[req.params.option].option;
        const updatedPoll  = await Poll.findOneAndUpdate(
            {id: req.params.number, "options.option": findOption}, 
            {$set:
                { "options.$.votes" : updatedVote}
            }
        )
        await updatedPoll.save();
        res.send(updatedPoll);
    } catch (error) {
        
    }
})

module.exports = router;