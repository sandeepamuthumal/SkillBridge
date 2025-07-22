import mongoose from 'mongoose';
import City from '../models/City.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const sriLankanCities = [
    { name: "Colombo", country: "Sri Lanka", isActive: true },
    { name: "Gampaha", country: "Sri Lanka", isActive: true },
    { name: "Kalutara", country: "Sri Lanka", isActive: true },
    { name: "Kandy", country: "Sri Lanka", isActive: true },
    { name: "Matale", country: "Sri Lanka", isActive: true },
    { name: "Nuwara Eliya", country: "Sri Lanka", isActive: true },
    { name: "Galle", country: "Sri Lanka", isActive: true },
    { name: "Matara", country: "Sri Lanka", isActive: true },
    { name: "Hambantota", country: "Sri Lanka", isActive: true },
    { name: "Jaffna", country: "Sri Lanka", isActive: true },
    { name: "Kilinochchi", country: "Sri Lanka", isActive: true },
    { name: "Mannar", country: "Sri Lanka", isActive: true },
    { name: "Vavuniya", country: "Sri Lanka", isActive: true },
    { name: "Mullaitivu", country: "Sri Lanka", isActive: true },
    { name: "Batticaloa", country: "Sri Lanka", isActive: true },
    { name: "Ampara", country: "Sri Lanka", isActive: true },
    { name: "Trincomalee", country: "Sri Lanka", isActive: true },
    { name: "Kurunegala", country: "Sri Lanka", isActive: true },
    { name: "Puttalam", country: "Sri Lanka", isActive: true },
    { name: "Anuradhapura", country: "Sri Lanka", isActive: true },
    { name: "Polonnaruwa", country: "Sri Lanka", isActive: true },
    { name: "Badulla", country: "Sri Lanka", isActive: true },
    { name: "Monaragala", country: "Sri Lanka", isActive: true },
    { name: "Ratnapura", country: "Sri Lanka", isActive: true },
    { name: "Kegalle", country: "Sri Lanka", isActive: true }
];

const seedCities = async() => {
    try {
        await mongoose.connect(MONGO_URI);
        await City.deleteMany({}); // optional: clear existing
        await City.insertMany(sriLankanCities);
        console.log('Cities inserted successfully');
        process.exit();
    } catch (err) {
        console.error('Error seeding cities:', err);
        process.exit(1);
    }
};

seedCities();