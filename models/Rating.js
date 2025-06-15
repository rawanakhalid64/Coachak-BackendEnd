const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Rating must belong to a user"],
    },
    trainer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Rating must be for a trainer"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Please provide a comment with your rating"],
    }
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate ratings from the same user for the same trainer
ratingSchema.index({ user: 1, trainer: 1 }, { unique: true });

// Calculate average rating after save
ratingSchema.statics.calcAverageRating = async function(trainerId) {
  const stats = await this.aggregate([
    {
      $match: { trainer: trainerId }
    },
    {
      $group: {
        _id: '$trainer',
        avgRating: { $avg: '$rating' },
        numRatings: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('User').findByIdAndUpdate(trainerId, {
      avgRating: stats[0].avgRating.toFixed(1)
    });
  }
};

// Call calcAverageRating after save
ratingSchema.post('save', function() {
  this.constructor.calcAverageRating(this.trainer);
});

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;