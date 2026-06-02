import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    stock: { 
        type: Number, 
        required: true, 
        default: 1 
    },
    images:[
        {
            public_id:{type:String,required:true},
            url:{type:String,required:true}
        }
    ],
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    averageRating: { 
        type: Number, 
        default: 0 
    },
    numOfReviews: { 
        type: Number, 
        default: 0 
    }
},{ 
    timestamps: true,
    toJSON: { virtuals: true }, // Virtuals ko JSON mein show karne ke liye
    toObject: { virtuals: true }
});

productSchema.virtual("productReviews", {
    ref: "Review",           // Kis model se data lana hai
    localField: "_id",       // Is product ki ID
    foreignField: "product", // Review model me kis field se match karna hai
    justOne: false           // Hame array chahiye, single object nahi
});

export const productModel = mongoose.model("Product",productSchema);