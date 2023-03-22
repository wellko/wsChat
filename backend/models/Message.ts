import mongoose, {Types} from "mongoose";
import User from "./User";


const Schema = mongoose.Schema;
const MessageSchema = new Schema({
	text: {
		type: String,
		required: true,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		validate: {
			validator: async (value: Types.ObjectId) => User.findById(value),
			message: "User not found!",
		},
	},
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;