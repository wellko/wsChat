import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";

const run = async () => {
	mongoose.set("strictQuery", false);
	await mongoose.connect(config.db);
	const db = mongoose.connection;
	try {
		await db.dropCollection("users");
		await db.dropCollection("messages");
	} catch (e) {
		console.log("Collections were not present, skipping drop...");
	}

await User.create(
	{
		username: "admin",
		password: "admin",
		displayName: "admin",
		role: "moderator",
		token: "admin",
	},
	{
		username: "user",
		password: "user",
		displayName: "user",
		role: "user",
		token: "user",
	})
	await db.close();
};

run().catch(console.error);