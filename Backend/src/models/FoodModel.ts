import mongoose, {Schema, Document} from "mongoose"

interface IFood extends Document{
    name:string
    category:string
    cuisine :string
    description:string
    images: string[]
}

const foodSchema = new Schema<IFood>({

    name: {
            type:String, 
            required:[true, "Name is Required"],
            minlength:[1,"Name must be at least 1 characters"]
    },

    category: {
                type:String, 
                required:[true, "category is Required"],
                minlength:[1,"category must be at least 1 characters"]
    },
    cuisine:{
                type:String,
                required:[true, "cuisines is Required"],
                minlength:[1,"cuisines must be at least 1 characters"]
    },
    description:{
                type:String,
                required:[true, "Description is Required"],
                minlength:[1,"Description must be at least 1 characters"]
    },
    images:[{
                type:String, 
                required:true
    }]
},{timestamps:true})

export const Food = mongoose.model<IFood>("food", foodSchema)