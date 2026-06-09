const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: function() { return !this.googleId; }, select: false },
  role:     { type: String, enum: ['intern', 'mentor', 'admin', 'superadmin'], default: 'intern' },
  sp:       { type: Number, default: 0 },
  langPref: { type: String, default: 'en' },
  joinDate: { type: Date, default: Date.now },
  googleId: { type: String, unique: true, sparse: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password helper
UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
