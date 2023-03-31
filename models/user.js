const {PrismaClient} = require('@prisma/client');
const Role = require('./role');

/**
 * Represents a user.
 */
module.exports = class User {
    static prisma = new PrismaClient();
    /**
     * Creates a new instance of a User.
     * @param {Object} data - The data for the user.
     */
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.picture = data.picture;
        this.googleId = data.googleId;
        this.section = data.section;
        this.shifts = data.shift;
        this.role = data.role;
        this.acceptedNda = data.acceptedNda;
        this.emailNotif = data.emailNotifications;
    }

    /**
     * Checks if the user has the role of a student.
     * @returns {boolean} - True if the user is a student, false otherwise.
     */
    isStudent() {
        return this.role === Role.STUDENT;
    }

    /**
     * Checks if the user has the role of an instructor.
     * @returns {boolean} - True if the user is an instructor or admin, false otherwise.
     */
    isInstructor() {
        return this.role === Role.INSTRUCTOR || this.isAdmin();
    }

    /**
     * Checks if the user has the role of an admin.
     * @returns {boolean} - True if the user is an admin, false otherwise.
     */
    isAdmin() {
        return this.role === Role.ADMIN;
    }

    /**
     * Finds a user by their ID.
     * @param {number} id - The ID of the user to find.
     * @returns {User} - A User object.
     */
    static find = async (id) => {
        return new User(await User.prisma.user.findUnique({
            where: {id: parseInt(id)},
            include: {
                section: true,
                shift: true,
            },
        }));
    }

    /**
     * Finds a user by their email.
     * @param {string} email - The email of the user to find.
     * @returns {User} - A User object.
     */
    static findByEmail = async (email) => {
        return new User(await User.prisma.user.findUnique({
            where: {email: email},
            include: {
                section: true,
                shift: true,
            },
        }));
    }

    /**
     * Gets all users.
     * @returns {User[]} - An array of User objects.
     */
    static all = async () => {
        return await User.prisma.user.findMany({
            include: {
                section: true,
                shift: true,
            },
        });
    }

    /**
     * Gets all users in a section.
     * @param {number} sectionId - The ID of the section to get users from.
     * @returns {User[]} - An array of User objects.
     */
    static allInSection = async (sectionId) => {
        return await User.prisma.user.findMany({
            where: {
                sectionId: parseInt(sectionId),
                role: Role.STUDENT,
            },
            include: {
                section: true,
                shift: true,
            },
        });
    }

    /**
     * Updates a user's data.
     * @param {number} id - The ID of the user to update.
     * @param {Object} data - The new data for the user.
     * @returns {User} - A User object.
     */
    static update = async (id, data) => {
        return await User.prisma.user.update({
            where: {id: parseInt(id)},
            data: data,
        });
    }
}
