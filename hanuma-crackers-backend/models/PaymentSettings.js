const mongoose = require('mongoose');

const PaymentSettingsSchema = new mongoose.Schema(
  {
    primaryUpi: {
      type: String,
      required: [true, 'Primary UPI ID is required'],
      trim: true,
    },
    alternativeUpi: {
      type: String,
      trim: true,
    },
    qrCodeImage: {
      type: String,
      required: [true, 'QR code image is required'],
    },
    whatsappNumber: {
      type: String,
      required: [true, 'WhatsApp number is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure there's only one payment settings document
PaymentSettingsSchema.index({}, { unique: true });

module.exports = mongoose.model('PaymentSettings', PaymentSettingsSchema);