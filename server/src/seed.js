import "dotenv/config";
import mongoose from "mongoose";
import { properties } from "./data/properties.js";
import { Property } from "./models/Property.js";

if (!process.env.MONGO_URI) {
  console.error("Set MONGO_URI in server/.env before seeding.");
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);
await Property.deleteMany({});
await Property.insertMany(properties);
await mongoose.disconnect();

console.log(`Seeded ${properties.length} properties.`);
