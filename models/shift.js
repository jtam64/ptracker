/**
 * A class representing a Shift.
 */
const { PrismaClient } = require("@prisma/client");

module.exports = class Shift {

    /**
     * Prisma client instance.
     * @type {PrismaClient}
     * @static
     */
    static prisma = new PrismaClient();

    /**
     * Create a new Shift.
     * @param {Object} data - The data for creating a new Shift.
     * @param {number} data.userId - The ID of the User.
     * @param {number} data.siteId - The ID of the Site.
     * @param {string} data.date - The date of the Shift.
     * @param {string} data.type - The type of the Shift.
     * @param {string} data.preceptor - The preceptor of the Shift.
     * @returns {Promise<void>}
     * @static
     */
    static create = async (data) => {
        await Shift.prisma.shift.create({
            data: {
                user: { connect: { id: parseInt(data.userId) } },
                site: { connect: { id: parseInt(data.siteId) } },
                date: new Date(data.date),
                type: data.type,
                status: 'NORMAL',
                preceptor: data.preceptor
            }
        });
    }

    /**
     * Update an existing Shift.
     * @param {number} id - The ID of the Shift.
     * @param {Object} data - The data for updating an existing Shift.
     * @param {number} data.userId - The ID of the User.
     * @param {number} data.siteId - The ID of the Site.
     * @param {string} data.date - The date of the Shift.
     * @param {string} data.type - The type of the Shift.
     * @param {string} data.preceptor - The preceptor of the Shift.
     * @returns {Promise<void>}
     * @static
     */
    static update = async (id, data) => {
        await Shift.prisma.shift.update({
            where: {
                id: parseInt(id)
            },
            data: {
                userId: parseInt(data.userId),
                siteId: parseInt(data.siteId),
                date: new Date(data.date),
                type: data.type,
                preceptor: data.preceptor
            }
        })
    }

    /**
     * Get all Shifts.
     * @returns {Promise<Object[]>}
     * @static
     */
    static all = () => {
        return Shift.prisma.shift.findMany({
            include: {
                user: true,
                site: true
            }
        });
    }

    /**
     * Find a Shift by ID.
     * @param {number} id - The ID of the Shift.
     * @returns {Promise<Object>}
     * @static
     */
    static find = async (id) => {
        return await Shift.prisma.shift.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                user: true,
                site: true
            }
        });
    }

    /**
     * Get all Shifts for a logged in user.
     * @param {number} userId - The ID of the User.
     * @returns {Promise<Object[]>}
     * @static
     */
    static allForLoggedInUser = async (userId) => {
        return await Shift.prisma.shift.findMany({
            where: { userId },
            include: {
                user: true,
                site: true
            }
        });
    }

}
