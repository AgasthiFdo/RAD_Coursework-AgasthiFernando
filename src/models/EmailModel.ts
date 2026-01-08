import mongoose, { Schema } from "mongoose";


interface IEmail extends Document{

    _id : mongoose.Types.ObjectId
    recipe: mongoose.Types.ObjectId
    user : mongoose.Types.ObjectId
    userEmail: string
    subject: string
    message: string
    sendAt: Date
    status : 'Success' | 'Failed'

}

const emailSchema = new Schema<IEmail>({
    
    recipe:{

        type: Schema.Types.ObjectId,
        ref: "Recipe",
        required: true

    },

    user:{

        type: Schema.Types.ObjectId,
        ref: "User",
        required: true

    },
    userEmail:{

        type:String,
        required: true

    },

    subject:{

        type: String,
        required:true

    },

    message:{

        type:String,
        required:true

    },

    sendAt:{

        type:Date, 
        required:true

    },

    status:{

        type:String,
        enum: ['Success' , 'Failed'],
        default: 'Success'

    }

})

export const Email = mongoose.model<IEmail>("Email", emailSchema)