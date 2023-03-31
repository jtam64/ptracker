const nodemailer = require('nodemailer');
const User = require('../models/user');
const Role = require('../models/role');
const Section = require('../models/section');

module.exports = class Email {

    /**
    * Create nodemailer transporter instance
    */
    static transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
    });
    
    /**
     * Send email to the recipient
     * @param {string} recipient - The email recipient
     * @param {string} subject - The email subject
     * @param {string} content - The email content
     */
    static async send(recipient, subject, content) {
        try {
            await Email.transporter.sendMail({
                from: `PTracker Notifications ${process.env.EMAIL_USERNAME}`,
                to: recipient,
                subject: subject,
                text: content,
            });
        } catch (error) {
            console.error(new Error(error));
        }
    }
    
    /**
     * Send email to all admin recipients
     * @param {string} subject - The email subject
     * @param {string} content - The email content
     */
    static async sendToAdmins(subject, content) {
        try {
            await Email.transporter.sendMail({
                from: `PTracker Notifications ${process.env.EMAIL_USERNAME}`,
                to: Email.getAdminRecipients().join(', '),
                subject: subject,
                text: content,
            });
        } catch (error) {
            console.error(new Error(error));
        }
    }

    /**
     * Send email to the section instructor recipient
     * @param {number} sectionId - The section id
     * @param {string} subject - The email subject
     * @param {string} content - The email content
     */
    static async sendToSectionInstructor(sectionId, subject, content) {
        const instructorEmail = Email.getSectionInstructorRecipient(sectionId);

        if (!instructorEmail) {
            return;
        }

        try {
            await Email.transporter.sendMail({
                from: `PTracker Notifications ${process.env.EMAIL_USERNAME}`,
                to: instructorEmail,
                subject: subject,
                text: content,
            });
        } catch (error) {
            console.error(new Error(error));
        }
    }

    /**
     * Get all admin email recipients
     * @returns {string[]} - The list of admin email recipients
     */
    static async getAdminRecipients() {
        const adminEmails = [];
        const users = await User.all();

        for (const user of users) {
            if (user.role === Role.ADMIN && user.emailNotifications) {
                adminEmails.push(user.email);
            }
        }

        return adminEmails;
    }

    /**
     * Get the email recipient for the section instructor
     * @param {number} sectionId - The section id
     * @returns {string|null} - The email recipient for the section instructor or null if the instructor has email notifications disabled
     */
    static async getSectionInstructorRecipient(sectionId) {
        const section = await Section.find(parseInt(sectionId));
        const instructor = await User.find(section.instructorId);

        if (!instructor.emailNotifications) {
            return null;
        }

        return instructor.email;
    }
}
