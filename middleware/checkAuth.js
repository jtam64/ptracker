module.exports = {
/**
 * Middleware function to check if the user is authenticated.
 * If the user is authenticated, it calls the next middleware function.
 * If the user is not authenticated, it returns a 401 Unauthorized status and an error message.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
    isAuthenticated: (req, res, next) => {
        if (req.user) {
            return next();
        }

        return res.status(401).json({
            message: 'You are not authenticated'
        });
    },

/**
 * Middleware function to check if the user is an instructor.
 * If the user is an instructor, it calls the next middleware function.
 * If the user is not an instructor, it returns a 401 Unauthorized status and an error message.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
    isInstructor: (req, res, next) => {
        if (req.user.isInstructor()) {
            return next();
        }

        return res.status(401).json({
            message: 'You are not authorized'
        });
    },

/**
 * Middleware function to check if the user is an administrator.
 * If the user is an administrator, it calls the next middleware function.
 * If the user is not an administrator, it returns a 401 Unauthorized status and an error message.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
    isAdmin: (req, res, next) => {
        if (req.user.isAdmin()) {
            return next();
        }

        return res.status(401).json({
            message: 'You are not authorized'
        });
    },

/**
 * Middleware function to check if the user is authenticated.
 * If the user is authenticated, it calls the next middleware function.
 * If the user is not authenticated, it redirects to the login page.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
    ensureAuthenticated: (req, res, next) => {
        return req.isAuthenticated()
            ? next()
            : res.redirect('/auth/login');
    },
    
/**
 * Middleware function to check if the user is not authenticated.
 * If the user is not authenticated, it calls the next middleware function.
 * If the user is authenticated, it redirects to the dashboard page.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
    forwardIfAuthenticated: (req, res, next) => {
        return !req.isAuthenticated()
            ? next()
            : res.redirect('/dashboard');
    },
};
