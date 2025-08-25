import dotenv from "dotenv";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Lead, { ENUMS } from "../models/Lead.js";

dotenv.config();

const TEST_USER = {
  name: "Test User",
  email: "testuser@example.com",
  password: "Test@12345"
};

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const makeLead = (userId) => {
  const first = faker.person.firstName();
  const last = faker.person.lastName();

  return {
    user: userId,
    first_name: first,
    last_name: last,
    email: faker.internet.email({ firstName: first, lastName: last }).toLowerCase(),
    phone: faker.phone.number(),
    company: faker.company.name(),
    city: faker.location.city(),
    state: faker.location.state(),
    source: randomFrom(ENUMS.SOURCES),
    status: randomFrom(ENUMS.STATUSES),
    score: faker.number.int({ min: 0, max: 100 }),
    lead_value: faker.number.int({ min: 0, max: 100000 }),
    last_activity_at: faker.datatype.boolean() ? faker.date.recent({ days: 60 }) : null,
    is_qualified: faker.datatype.boolean()
  };
};

const run = async () => {
  try {
    await connectDB();

    // Clear current DB (optional, keep if you want clean slate)
    await Promise.all([User.deleteMany({}), Lead.deleteMany({})]);

    // Create test user
    let user = await User.create(TEST_USER);

    // Create 150 leads for this user
    const leads = Array.from({ length: 150 }, () => makeLead(user._id));

    // ensure unique emails per user — regenerate collisions
    const emailSet = new Set();
    for (let i = 0; i < leads.length; i++) {
      while (emailSet.has(leads[i].email)) {
        const first = faker.person.firstName();
        const last = faker.person.lastName();
        leads[i].email = faker.internet.email({ firstName: first, lastName: last }).toLowerCase();
      }
      emailSet.add(leads[i].email);
    }

    await Lead.insertMany(leads);
    console.log("Seed complete.");
    console.log("Login with:");
    console.log(`  email: ${TEST_USER.email}`);
    console.log(`  password: ${TEST_USER.password}`);
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.connection.close();
  }
};

run();
