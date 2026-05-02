import express from "express";
import { randomUUID } from "crypto";
import { properties as sampleProperties } from "../data/properties.js";
import { Property } from "../models/Property.js";

export function createPropertyRouter({ useDatabase }) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const source = useDatabase ? await Property.find().lean() : sampleProperties;
      const filtered = filterProperties(source, req.query);
      res.json({
        total: filtered.length,
        items: filtered
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const item = useDatabase
        ? await Property.findById(req.params.id).lean()
        : sampleProperties.find((property) => slugify(property.title) === req.params.id);

      if (!item) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json(item);
    } catch (error) {
      next(error);
    }
  });

  router.post("/leads", express.json(), (req, res) => {
    const { name, phone, propertyTitle } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required." });
    }

    res.status(201).json({
      message: "Lead captured",
      lead: {
        id: randomUUID(),
        name,
        phone,
        propertyTitle,
        status: "New inquiry"
      }
    });
  });

  return router;
}

function filterProperties(properties, query) {
  const search = normalize(query.search);
  const city = normalize(query.city);
  const type = normalize(query.type);
  const status = normalize(query.status);
  const minPrice = Number(query.minPrice || 0);
  const maxPrice = Number(query.maxPrice || Number.MAX_SAFE_INTEGER);
  const bedrooms = Number(query.bedrooms || 0);

  return properties.filter((property) => {
    const searchable = normalize(
      [property.title, property.city, property.neighborhood, property.type, property.status, property.tags?.join(" ")]
        .filter(Boolean)
        .join(" ")
    );

    return (
      (!search || searchable.includes(search)) &&
      (!city || normalize(property.city) === city) &&
      (!type || normalize(property.type) === type) &&
      (!status || normalize(property.status) === status) &&
      property.price >= minPrice &&
      property.price <= maxPrice &&
      property.bedrooms >= bedrooms
    );
  });
}

function normalize(value = "") {
  return String(value).trim().toLowerCase();
}

function slugify(value) {
  return normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
