const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://28sujalshaw_db_user:Sujal28102004@cluster0.697qouk.mongodb.net/ticket_booking?appName=Cluster0");
    console.log("MongoDB connected");
};

module.exports = connectDB;