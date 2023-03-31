/**
 * Middleware that checks if a user has permission to access a section.
 * Redirects to the "pendingSection" page if the user's section is pending and they are not an admin.
 * Excludes the "auth", "pendingSection", and "nda" pages from checking.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */

const sectionChecker = (req, res, next) => {
    if (req.user) {
        if (req.path.includes('auth') || req.path.includes('pendingSection') || req.path.includes('nda')) {
            return next();
        }

        if (req.user.section.id === 1 && req.user.role !== 'ADMIN') {
            return res.redirect('./pendingSection');
        }
    }

    return next();
};

module.exports = sectionChecker;
