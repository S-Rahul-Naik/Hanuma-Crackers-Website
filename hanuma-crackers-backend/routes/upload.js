const express = require('express');
const { upload, deleteImage } = require('../config/cloudinary');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Public product image upload (for admin panel)
// @route   POST /api/upload
// @access  Public (should be protected in production)
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    res.status(200).json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Upload single image
// @route   POST /api/upload/single
// @access  Private/Admin
router.post('/single', protect, authorize('admin'), upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private/Admin
router.post('/multiple', protect, authorize('admin'), upload.array('images', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      size: file.size
    }));

    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      count: uploadedFiles.length,
      data: uploadedFiles
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
router.delete('/:publicId', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { publicId } = req.params;
    
    const result = await deleteImage(publicId);
    
    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found or already deleted'
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;