/**
 *Middleware to pass the current authenticated user to the view
 *@param {object} req - Express request object
 *@param {object} res - Express response object
 *@param {function} next - Express next middleware function
 */
const passUser = (req, res, next) => {
    res.locals.user = req.user;
    next();
};

module.exports = passUser;
