import slugify from "slugify";
import authModel from "../models/Auth/user.model.js"

/**
 * Generate a unique slug for any model and field
 * @param {String} text - Source text (e.g. productName, categoryName, etc.)
 * @param {Mongoose.Model} model - The mongoose model in which to check for duplicates
 * @param {String} field - The slug field in that model (default: "slug")
 * @returns {String} - A unique slug
 */
export const generateUniqueSlug = async (text, model, field = "slug") => {
    if (!text) return "";

    const baseSlug = slugify(text, { lower: true, strict: true, trim: true });
    let slug = baseSlug;
    let count = 0;
    while (await model.findOne({ [field]: slug })) {
        count++;
        slug = `${baseSlug}-${count}`;
    }

    return slug;
};

// // Genrate User Slug ::
export const generateUserSlug = async (email, model, field = "url") => {
    if (!email) return "";
    const usernamePart = email.split("@")[0];
    const baseSlug = slugify(usernamePart, { lower: true, strict: true, trim: true });
    let slug = baseSlug;
    let count = 0;
    while (await model.findOne({ [field]: slug })) {
        count++;
        slug = `${baseSlug}-${count}`;
    }

    return slug;
};

