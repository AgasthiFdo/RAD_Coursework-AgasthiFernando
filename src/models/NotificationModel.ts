import { timeStamp } from "console";
import mongoose, { Schema } from "mongoose";


interface INotification extends Document{

    _id : mongoose.Types.ObjectId
    recipeId : mongoose.Types.ObjectId
    userId : mongoose.Types.ObjectId
    recipeTitle : string
    foodName : string
    userName : string
    message : string
    read : boolean
    createdAt : Date

}

const notificationSchema = new Schema<INotification>({

    recipeId : {

        type: Schema.Types.ObjectId,
        ref: "Recipes",
        required : true

    },

    userId : {

        type: Schema.Types.ObjectId,
        ref: "User",
        required : true

    },

    recipeTitle : {

        type : String,
        required : true

    },

    foodName : {

        type : String,
        required : true

    },

    userName : {

        type : String,
        required : true

    },

    message : {

        type : String,
        required : true

    },

    read : {

        type : Boolean,
        required : true

    },

    createdAt:{

        type:Date, 
        required:true

    },

},

{timestamps :true}

)

export const Notification = mongoose.model<INotification>("Notification" , notificationSchema)