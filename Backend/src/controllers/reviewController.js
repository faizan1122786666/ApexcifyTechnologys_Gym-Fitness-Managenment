const Review = require('../models/Review');
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).populate('user', 'name role avatar').sort('-createdAt').limit(10);
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.createReview = async (req, res) => {
  try {
    const review = await Review.create({
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
      status: 'approved' // Auto-approve for demo
    });
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
