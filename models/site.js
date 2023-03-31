/**
  *Class representing a Site.
  *@class
  */
const {PrismaClient} = require("@prisma/client");

module.exports = class Site {static prisma = new PrismaClient();

    /**
     * Finds a site by ID.
     * @param {number} id - The ID of the site.
     * @returns {Object} - Returns the site object.
     */
    static find = async (id) => {
        return await Site.prisma.site.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                shift: true,
            }
        })
    }
    
    /**
     * Returns all the sites.
     * @returns {Array} - Returns an array of site objects.
     */
    static all = async () => {
        return await Site.prisma.site.findMany({
            include: {
                shift: true,
            }
        });
    }
    
    /**
     * Creates a new site.
     * @param {Object} data - An object containing the site information.
     * @returns {Object} - Returns the created site object.
     */
    static create = async (data) => {
        return await Site.prisma.site.create({
            data: {
                name: data.site.toUpperCase(),
            }
        });
    }
    
    /**
     * Deletes a site by ID.
     * @param {number} id - The ID of the site to be deleted.
     * @returns {Object} - Returns the deleted site object.
     */
    static delete = async (id) => {
        // Adds the shifts to pending for admin approval
        const findSite = await Site.find(id)
        if (findSite.shift !== 0) {
            for (const shift of findSite.shift) {
                await Site.prisma.shift.update({
                    where: {
                        id: parseInt(shift.id)
                    },
                    data: {
                        status: 'DELETED'
                    }
                })
            }
        };
    
        return await Site.prisma.site.update({
            where: {
                id: parseInt(id)
            },
            data: {
                status: 'DELETED',
            }
        });
    }
}    