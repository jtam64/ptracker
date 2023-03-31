/**
 * Middleware function that checks if there are flash messages in the session object
 * and assigns them to res.locals to be used in the view. Deletes the messages from the session
 * object after they have been assigned to res.locals.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const flashMessages = (req, res, next) => {
    if (req.session.success_message) {
        res.locals.success_message = req.session.success_message;
        delete req.session.success_message;
    }
    if (req.session.error_message) {
        res.locals.error_message = req.session.error_message;
        res.locals.error_perm = req.session.error_perm;
        delete req.session.error_message;
        delete req.session.error_perm;
    }
    next();
};

module.exports = flashMessages;
