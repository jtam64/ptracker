/**
 * Middleware that checks if the user has accepted the NDA.
 * If the user has not accepted the NDA and the path is not related to the NDA or authentication, the user is redirected to the NDA page.
 * If the user is not logged in, the request is passed to the next middleware.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function to be called.
 * @returns {void} - The next middleware function or a redirect response.
 */
const ndaChecker = (req, res, next) => {
    if (req.user) {
        if (req.user.acceptedNda || req.path.includes('nda') || req.path.includes('auth')) {
            return next();
        }

        return res.redirect('/nda');
    }

    return next();
};

module.exports = ndaChecker;
