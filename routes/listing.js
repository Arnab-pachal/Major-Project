const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const passport = require("passport");
const { isLogin, owner, validateListing } = require("../middleware.js");
const { index, rendernewForm, show, create, edit, update, Delet, filter } = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index route: List all listings or create a new listing
router.route("/")
  .get(wrapAsync(index))  // Fetch and display all listings
  .post(isLogin, upload.single('listing[image]'), validateListing, wrapAsync(create));  // Create a new listing

// New route: Render the form for creating a new listing

// Filter route: Filter listings based on a specific criterion
router.get("/:q/filter", isLogin, wrapAsync(filter));  // Note: Add validation for 'q' if needed

// Show, Edit, Update, and Delete routes for a specific listing
router.route("/:id")
  .get(wrapAsync(show))  // Display a specific listing
  .put(isLogin, owner, upload.single('listing[image]'), validateListing, wrapAsync(update))  // Update a specific listing
  .delete(isLogin, owner, wrapAsync(Delet));  // Delete a specific listing

// Edit route: Render the form for editing a specific listing
router.get("/:id/edit", isLogin, owner, wrapAsync(edit));  // Ensure the owner middleware validates the listing ownership
router.get("/new", isLogin, wrapAsync(rendernewForm));

module.exports = router;
