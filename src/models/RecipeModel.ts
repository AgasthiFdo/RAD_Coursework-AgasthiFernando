import mongoose, { Schema,Document, Date } from "mongoose";


interface IRecipe extends Document{
    
    _id: mongoose.Types.ObjectId
    user: mongoose.Types.ObjectId
    food: mongoose.Types.ObjectId
    title:string
    ingredients: string[]
    step: string
    readyIn : string
    date: Date
    images?: string[]
    status: 'Pending' | 'Approved' | 'Reject'

}

const recipeSchema = new Schema<IRecipe>({

    user:{

        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "UserId is required"]

    },

    food:{

        type: Schema.Types.ObjectId,
        ref: "food",
        required: [true, "FoodId is required"]

    },
    
    title:{

        type:String, 

        required:[true, "Title is Required"],
        minlength:[1,"Title must be at least 1 characters"]

    },

    ingredients:[{

        type:String, 
        required:[true, "Ingredients is Required"],
        minlength:[1,"Ingredients must be at least 1 characters"]

    }],

    step:{

        type:String, 

        required:[true, "Step is Required"],
        minlength:[1,"Step must be at least 1 characters"]
    },

    readyIn:{

        type:String,
        required:[true, "Step is Required"],
        minlength:[1,"Step must be at least 1 characters"]
    },

    date:{

        type:Date, 
        required:[true, "date is Required"],
           
    },

    images:[{

        type:String, 
        required:false

    }],

    status:{

        type:String,
        
        enum: ['Pending','Approved', 'Reject'],
        default: 'Pending'

    }
   
},

{timestamps:true}

)

export const Recipe = mongoose.model<IRecipe>("recipie", recipeSchema)