/**
 * A class representing a Section in a school.
 */
const {PrismaClient} = require("@prisma/client");
const User = require("./user");
const { update } = require("./shift");
const Role = require('./role');

module.exports = class Section {

    /**
     * A Prisma client for performing database operations.
     */
    static prisma = new PrismaClient();

    /**
     * Finds a section with the given ID.
     * @param {number} id - The ID of the section to find.
     * @returns {Promise<object>} A Promise that resolves to the section object.
     */
    static find = async (id) => {
        return await Section.prisma.section.findUnique({
            where: {id: parseInt(id)},
        });
    }

    /**
     * Retrieves all sections.
     * @returns {Promise<object[]>} A Promise that resolves to an array of section objects.
     */
    static all = async () => {
        return await Section.prisma.section.findMany();
    }

    /**
     * Finds the section where the given instructor is teaching.
     * @param {number} instructorId - The ID of the instructor.
     * @returns {Promise<object>} A Promise that resolves to the section object.
     */
    static whereIsInstructor = async (instructorId) => {
        return await Section.prisma.section.findUnique({
            where: {instructorId: parseInt(instructorId)},
        });
    }

    /**
     * Creates a new section.
     * @param {string} sectionName - The name of the section.
     * @param {number} sectionInstructor - The ID of the instructor teaching the section.
     * @returns {Promise<void>} A Promise that resolves when the section is created.
     */
    static create = async (sectionName, sectionInstructor) => {
        await Section.prisma.section.create({
            data: {
                name: sectionName,
                instructorId: parseInt(sectionInstructor),
            }
        });
    }

    /**
     * Deletes a section and updates all associated users to have section ID 1 (pending).
     * @param {number} sectionId - The ID of the section to delete.
     * @returns {Promise<object>} A Promise that resolves to the deleted section object.
     */
    static delete = async (sectionId) => {
        // Update all Students to be PENDING sectionId (1)
        await User.prisma.user.updateMany({
            where: {
                sectionId: parseInt(sectionId),
                role: { 
                    in: [Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN],
                },
            },
            data: {
                sectionId: 1,
            }
        })

        return await Section.prisma.section.delete({
            where: {
                id: parseInt(sectionId)
            }
        })
    }

    /**
     * Finds the instructor for the given section ID.
     * @param {number} sectionId - The ID of the section.
     * @returns {Promise<object[]>} A Promise that resolves to an array of user objects representing the instructor.
     */
    static findInstructor = async (sectionId) => {
        return await User.prisma.user.findMany({
            where: {
                sectionId: parseInt(sectionId),
                role: Role.INSTRUCTOR,
            },
        });
    }
}
