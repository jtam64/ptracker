const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const {faker} = require('@faker-js/faker');
const Role = require('../models/role');

async function main() {
    const sections = [];

    sections.push({
        id: 1,
        name: 'Pending Users Section',
        instructorId: 0,
    });

    for (let i = 2; i <= 2; i++) {
        sections.push({
            id: i,
            name: `Section ${i}`,
            instructorId: i,
        });
    }

    await prisma.section.createMany({
        data: [
            ...sections,
        ]
    });

    const users = [];

    for (let i = 1; i < 1; i++) {
        users.push({
            id: i,
            name: faker.name.firstName() + ' ' + faker.name.lastName(),
            email: faker.internet.email(),
            googleId: faker.datatype.number({min: 11491216591676147997, max: 12691216591676147997}).toString(),
            role: i <= 4 ? Role.INSTRUCTOR : faker.helpers.arrayElement([
                Role.STUDENT,
                Role.INSTRUCTOR,
                Role.ADMIN
            ]),
            acceptedNda: true,
            sectionId: faker.helpers.arrayElement(sections.map(s => s.id)),
            emailNotifications: faker.datatype.boolean(),
        });
    }

    users.push({
        id: 101,
        name: 'DEVELOPER',
        email: 'dev@bcit.ca',
        googleId: faker.datatype.number({min: 11491216591676147997, max: 12691216591676147997}).toString(),
        role: Role.ADMIN,
        sectionId: 2,
        acceptedNda: true,
    });

    users.push({
        id: 102,
        name: 'INSTRUCTOR_A',
        email: 'instructor_A@bcit.ca',
        googleId: faker.datatype.number({min: 11491216591676147997, max: 12691216591676147997}).toString(),
        role: Role.INSTRUCTOR,
        sectionId: 1,
        acceptedNda: true,
    });
    users.push({
        id: 103,
        name: 'INSTRUCTOR_B',
        email: 'instructor_B@bcit.ca',
        googleId: faker.datatype.number({min: 11491216591676147997, max: 12691216591676147997}).toString(),
        role: Role.INSTRUCTOR,
        sectionId: 1,
        acceptedNda: true,
    });

    users.push({
        id: 104,
        name: 'INSTRUCTOR_C',
        email: 'instructor_C@bcit.ca',
        googleId: faker.datatype.number({min: 11491216591676147997, max: 12691216591676147997}).toString(),
        role: Role.INSTRUCTOR,
        sectionId: 1,
        acceptedNda: true,
    });

    users.push({
        id: 105,
        name: 'INSTRUCTOR_D',
        email: 'instructor_D@bcit.ca',
        googleId: faker.datatype.number({min: 11491216591676147997, max: 12691216591676147997}).toString(),
        role: Role.INSTRUCTOR,
        sectionId: 1,
        acceptedNda: true,
    });

    users.push({
        id: 106,
        name: 'STUDENT_1',
        email: 'student_1@bcit.ca',
        googleId: faker.datatype.number({min: 11491216591676147997, max: 12691216591676147997}).toString(),
        role: Role.STUDENT,
        sectionId: 1,
        acceptedNda: true,
    });

    users.push({
        id: 107,
        name: 'STUDENT_2',
        email: 'student_2@bcit.ca',
        googleId: faker.datatype.number({min: 11491216591676147997, max: 12691216591676147997}).toString(),
        role: Role.STUDENT,
        sectionId: 1,
        acceptedNda: true,
    });

    users.push({
        id: 108,
        name: 'STUDENT_3',
        email: 'student_3@bcit.ca',
        googleId: faker.datatype.number({min: 11491216591676147997, max: 12691216591676147997}).toString(),
        role: Role.STUDENT,
        sectionId: 1,
        acceptedNda: true,
    });

    users.push({
        id: 109,
        name: 'STUDENT_4',
        email: 'student_4@bcit.ca',
        googleId: faker.datatype.number({min: 11491216591676147997, max: 12691216591676147997}).toString(),
        role: Role.STUDENT,
        sectionId: 2,
        acceptedNda: true,
    });

    await prisma.user.createMany({
        data: [
            ...users,
        ],
    });

    const sites = [];
    const siteNames = ['RCH', 'SMH', 'RH'];

    for (let i = 1; i <= siteNames.length; i++) {
        sites.push({
            id: i,
            name: siteNames[i - 1],
        });
    }

    await prisma.site.createMany({
        data: [
            ...sites,
        ],
    });

    const shifts = [];

    for (let i = 1; i < 1; i++) {
        shifts.push({
            userId: faker.helpers.arrayElement(users.map(u => u.id)),
            siteId: faker.helpers.arrayElement(sites.map(s => s.id)),
            date: faker.datatype.boolean() ? faker.date.recent(7) : faker.date.soon(7),
            type: faker.helpers.arrayElement(['DAY', 'EVENING', 'NIGHT']),
            status: faker.helpers.arrayElement(['NORMAL', 'DELETED']),
        });
    }

    await prisma.shift.createMany({
        data: [
            ...shifts
        ],
    });
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
