// run in a separate script
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const mongoose = require('mongoose');
require('dotenv').config();

(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({ username: 'admin', password: hashedPassword });
    console.log('Admin created');
    process.exit();
})();
