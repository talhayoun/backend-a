const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const pollSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    options:{
        type: Array
    }

})

pollSchema.pre("save", async function(next){
    const currentPoll = this;
    const options = []
    if(typeof currentPoll.options[0] !== 'object'){
        for(let i = 0; i< currentPoll.options.length; i++){
            let newObject = {option: currentPoll.options[i], votes: 0 };
            options.push(newObject);
        }
        currentPoll.options = options;
    }
    console.log(currentPoll, "2")
    next();
})


pollSchema.plugin(AutoIncrement, {inc_field: 'id'});
const Poll = mongoose.model("poll", pollSchema);

module.exports = Poll;