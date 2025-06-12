//Schema 
import mongoose from "mongoose";
import { model, Schema, Document } from "mongoose";
///connection 
mongoose.connect(process.env.MONGO_URI as string || "mongodb://localhost:27017/")
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log(err);
})  



// Interface for User document
export interface IUser extends Document {
    username: string;
    password: string;

}

// Interface for Content document
export interface IContent extends Document {
    title: string;
    links: Array<{
        url: string;
        type: string;
    }>;
    tags: mongoose.Types.ObjectId[];
    userId: mongoose.Types.ObjectId;
}

const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String }
});

const contentSchema = new Schema({
    title: { type: String, required: true },
    links: [{
        url: { type: String, required: true },
        type: { type: String, required: true }
    }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

    const linkSchema=new Schema({
    url:{type:String},
    title:{type:String},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,unique:true},
    contentId:{type:mongoose.Schema.Types.ObjectId,ref:"Content",required:true},



})

const LinkModel=model("Link",linkSchema);
const UserModel = model('User', UserSchema);
const ContentModel = model('Content', contentSchema);

export {UserModel,ContentModel,LinkModel};
