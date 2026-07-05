import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;

// ── Inline schemas (avoid circular imports) ──────────────────────────────────
const roleSchema = new mongoose.Schema(
    { roleName: { type: String, unique: true }, permissions: [] },
    { timestamps: true, versionKey: false }
);
const Role = mongoose.model('Role', roleSchema);

const employeeSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, unique: true },
        email: { type: String, lowercase: true, trim: true, default: '' },
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
        contact: { type: String, trim: true, default: '' },
        gender: { type: String, enum: ['male', 'female'], default: 'male' },
        password: { type: String, default: '' },
        profileImage: { type: String, default: '' },
    },
    { versionKey: false, timestamps: true }
);
const Employee = mongoose.model('employee', employeeSchema);

// ── Config ────────────────────────────────────────────────────────────────────
const ADMIN_EMAIL    = 'admin@mackfarlane.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_FIRST    = 'Super';
const ADMIN_LAST     = 'Admin';

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Create or find SuperAdmin role
    let role = await Role.findOne({ roleName: 'SuperAdmin' });
    if (!role) {
        role = await Role.create({ roleName: 'SuperAdmin', permissions: [] });
        console.log('✅ SuperAdmin role created');
    } else {
        console.log('ℹ️  SuperAdmin role already exists');
    }

    // 2. Check if admin already exists
    const existing = await Employee.findOne({ email: ADMIN_EMAIL });
    if (existing) {
        console.log(`ℹ️  Admin already exists → email: ${ADMIN_EMAIL}`);
        await mongoose.disconnect();
        return;
    }

    // 3. Hash password & create employee
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await Employee.create({
        userId: `ADMIN-001`,
        firstName: ADMIN_FIRST,
        lastName: ADMIN_LAST,
        email: ADMIN_EMAIL,
        password: hashed,
        contact: '+919999999999',
        gender: 'male',
        role: role._id,
        profileImage: '',
    });

    console.log('\n🎉 Admin created successfully!');
    console.log('─────────────────────────────────');
    console.log(`   Email    : ${ADMIN_EMAIL}`);
    console.log(`   Password : ${ADMIN_PASSWORD}`);
    console.log('─────────────────────────────────');
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
});
