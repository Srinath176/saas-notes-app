import bcrypt from "bcryptjs";
import Tenant from "../models/tenant.model";
import User from "../models/user.model";
import Note from "../models/note.model";
import { connectDatabase, disconnectDatabase } from "../config/database";

const seedDatabase = async () => {
  try {
    await connectDatabase();
    console.log("MongoDB connected for seeding...");

    // Clear existing data
    await Tenant.deleteMany({});
    await User.deleteMany({});
    await Note.deleteMany({});
    console.log("Cleared existing data.");

    // Create Tenants
    const acmeTenant = await Tenant.create({ name: "Acme", slug: "acme" });
    const globexTenant = await Tenant.create({
      name: "Globex",
      slug: "globex",
    });
    console.log("Tenants created.");

    // Hash password
    const hashedPassword = await bcrypt.hash("password", 10);

    // Create Users
    await User.create([
      {
        email: "admin@acme.test",
        password: hashedPassword,
        role: "admin",
        tenantId: acmeTenant._id,
      },
      {
        email: "user@acme.test",
        password: hashedPassword,
        role: "member",
        tenantId: acmeTenant._id,
      },
      {
        email: "admin@globex.test",
        password: hashedPassword,
        role: "admin",
        tenantId: globexTenant._id,
      },
      {
        email: "user@globex.test",
        password: hashedPassword,
        role: "member",
        tenantId: globexTenant._id,
      },
    ]);
    console.log("Users created.");

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await disconnectDatabase();
    console.log("MongoDB disconnected.");
  }
};

seedDatabase();
