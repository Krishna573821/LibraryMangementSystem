import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  contactAddress: { type: String, required: true },
  aadhaarNo: { type: String, required: true },
  startDate: { type: Date, required: true, default: Date.now },
  endDate: { type: Date }, 

  plan: {
    type: String,
    enum: ['6-months', '1-year', '2-years'],
    required: true
  },

  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to calculate endDate
membershipSchema.pre('save', function (next) {
  if (!this.endDate) {
    const start = this.startDate ? new Date(this.startDate) : new Date();

    switch (this.plan) {
      case '6-months':
        this.endDate = new Date(start.setMonth(start.getMonth() + 6));
        break;
      case '1-year':
        this.endDate = new Date(start.setFullYear(start.getFullYear() + 1));
        break;
      case '2-years':
        this.endDate = new Date(start.setFullYear(start.getFullYear() + 2));
        break;
    }
  }
  next();
});


const Membership = mongoose.model('Membership', membershipSchema);
export default Membership;
