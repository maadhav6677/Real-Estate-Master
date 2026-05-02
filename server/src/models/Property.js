import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    phone: String,
    email: String,
    avatar: String
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    city: { type: String, required: true },
    neighborhood: { type: String, required: true },
    price: { type: Number, required: true },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number, required: true },
    yearBuilt: Number,
    featured: { type: Boolean, default: false },
    furnished: { type: Boolean, default: false },
    parking: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    lat: Number,
    lng: Number,
    tags: [String],
    amenities: [String],
    agent: agentSchema,
    image: String,
    gallery: [String],
    description: String
  },
  { timestamps: true }
);

export const Property = mongoose.model("Property", propertySchema);
