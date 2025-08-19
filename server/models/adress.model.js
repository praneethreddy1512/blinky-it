import mongoose from "mongoose";

const adressSchema = new mongoose.Schema({
    adress_line :{
        type : String,
    },
    city :{
        type : String
    },
    state : {
        type : String,
    },
    pin :{
        type : Number
    },
    country : {
        type : String
    },
    mobile : {
        type : Number,
        default: null
    }
},{
    timestamps : true
})

const AdressModel = mongoose.model('address',adressSchema)

export default AdressModel
