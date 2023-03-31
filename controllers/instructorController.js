// Prisma
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

// Axios
const axios = require("axios");

// Models
const Section = require("../models/section");
const User = require("../models/user");


async function changeSection(req, res, userId, newSection) {
    const section = await Section.find(newSection);
    if (!section) {
        req.session.error_message = `Section #${newSection} does not exist`;
        return res.redirect('.././instr_panel');
    }

    await User.prisma.user.update({
        where: {id: parseInt(userId)},
        data: {
            section: {connect: {id: section.id}}
        }
    });

    let URL = process.env.APP_URL;
    if (URL.endsWith('/')) {
        URL = URL.slice(0, -1);
    }

    const user = await User.find(parseInt(userId));

    await axios.post(URL + '/email/userAssignedSection', {
        sendTo: user.email,
        sectionName: section.name,
    });

    req.session.success_message = `Set section of user #${userId} to ${section.name}`;

    return res.redirect('.././instr_panel');
}


module.exports = {
    changeSection,
}
