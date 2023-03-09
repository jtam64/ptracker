const Shift = require("../models/shift");
const User = require("../models/user");
const axios = require("axios");
const moment = require("moment");

let URL = process.env.APP_URL;
if (URL.endsWith('/')) {
    URL = URL.slice(0, -1);
}

async function create(req, res, {userId, siteId, date, end, type, preceptor}) {
    if (!(moment(date).isValid() || moment(end).isValid())) {
        req.session.error_message = 'Invalid date format!';
        return res.redirect('./calendar');
    } else if (date != end) {
        let start_date = moment(date, "YYYY-MM-DD", true);
        let end_date = moment(end, "YYYY-MM-DD", true);

        while (start_date.isBefore(end_date) || start_date.isSame(end_date)) {

            let date_date = start_date.format("YYYY-MM-DD");
            await Shift.create({
                userId,
                siteId,
                date: date_date,
                type,
                preceptor
            });

            start_date = moment(start_date).add(1, "days");
        }
    } else {
        await Shift.create({
            userId,
            siteId,
            date,
            type,
            preceptor
        });
    }

    // // Uncomment for email notification functionality

    // const user = await User.find(parseInt(userId));

    // if (process.env.NODE_ENV !== 'test') {
    //     await axios.post(URL + '/email/shiftCreated', {
    //         sectionId: user.section.id,
    //         studentName: user.name,
    //         shiftType: type,
    //         shiftDate: date,
    //         shiftEnd: end,
    //     });
    // }

    req.session.success_message = `Shift created successfully on ${date}!`;

    return res.redirect('./calendar');
}

async function update(req, res, shiftId, {userId, siteId, date, type, preceptor}) {
    await Shift.update(
        shiftId,
        {
            userId,
            siteId,
            date,
            type,
            preceptor
        }
    );

    req.session.success_message = `Shift updated successfully on ${date}!`;

    // const user = await User.find(parseInt(userId));

    // await axios.post(URL + '/email/shiftUpdated', {
    //     sectionId: user.section.id,
    //     studentName: user.name,
    //     shiftType: type,
    //     shiftDate: date.toLocaleString(),
    //     shiftEnd: date.toLocaleString(),
    // });

    return res.redirect('.././calendar');
}

async function del(req, res, shiftId, user) {
    const shift = await Shift.find(shiftId);

    if (shift.user.id !== user.id) {
        req.session.error_message = 'This is not your shift!';
        return res.redirect('.././calendar');
    }

    if (shift.status === 'DELETED') {
        req.session.error_message = 'You have already deleted this shift!';
        return res.redirect('.././calendar');
    }

    await Shift.prisma.shift.update({
        where: {id: parseInt(shiftId)},
        data: {
            status: 'DELETED',
        }
    });

    // await axios.post(URL + '/email/shiftDeleted', {
    //     sectionId: user.section.id,
    //     studentName: user.name,
    //     shiftDate: shift.date.toLocaleString(),
    // });

    req.session.success_message = `Shift deleted!`;

    return res.redirect('../.././calendar');
}

module.exports = {
    create,
    update,
    del,
}
