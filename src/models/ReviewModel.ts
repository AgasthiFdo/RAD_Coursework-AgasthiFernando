import mongoose, { Schema } from "mongoose";


interface IReview extends Document{

    _id: mongoose.Types.ObjectId
    user: mongoose.Types.ObjectId
    recipe: mongoose.Types.ObjectId
    rating: number
    description : string
    date: Date

}

const reviewSchema = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "UserId is required"]

    },

    recipe:{

        type: Schema.Types.ObjectId,
        ref: "recipie",
        required: [true, "RecipeId is required"]

    },

    rating:{

        type: Number,
        required: true

    },

    description:{

        type: String,
        required: true

    },

    date:{

        type:Date,
        required: true

    }

})

export const Review = mongoose.model<IReview>("Review", reviewSchema)

















