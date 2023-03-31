/**
 * Represents a user role in the system.
 * @class
 * @static
 */
module.exports = class Role {

    /**
     * The student role.
     * @type {string}
     * @static
     * @constant
     */
    static STUDENT = 'STUDENT';

    /**
     * The instructor role.
     * @type {string}
     * @static
     * @constant
     */
    static INSTRUCTOR = 'INSTRUCTOR';

    /**
     * The admin role.
     * @type {string}
     * @static
     * @constant
     */
    static ADMIN = 'ADMIN';
}
