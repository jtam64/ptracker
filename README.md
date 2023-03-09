# pTracker
## Clone of the PTracker app developed by BCIT CIT students
pTracker is a scheduling app for Nursing students to help them track preceptorship shifts at hospitals.
#1
## Usage

- see the [Usage Guide](./README.md)


## Structure (after refactoring)

- `app.js` - main entry point
- `views/` - all the ejs templates 
- `public/` - all the static files (css, js, images)
- `routes/` - all the routes (api, auth, etc)
- `models/` - all the models (user, shift, etc)
- TBD
-

## Development

- [source code repo](https://issues.ltc.bcit.ca/web-apps/ptracker)

1. `docker-compose up --build`
1. Navigate to `http://localhost:8007`
1. Login with the first/seed email: `dev@bcit.ca`

## Testing
- run "npm i mocha"
- You can test the app with `npm run test`

## Contacts

- **Sponsor:** Ania Aibin - aaibin@bcit.ca
- **Technical Operations:** LTC Course Production - courseproduction@bcit.ca

## Views

The following portion will be going over the different views and what they do

### Admin

The following wll be going over each file in the admin folder
What they do and anything note worthy

#### Add Site

Under **Admin panel**
In the **Sites** tab

You can add more sites that students may possibly be at

```
This feature is still in development as of 02/16/2023
```

#### Over View

This goes over the **Admin Panel**

**Tab Labels** is a little nav bar that allows you to pick between *Users*, *Instructors*, *Sites* ad *Sections*

***Users Tab Content*** is for the users tab

The tr in thead is used for labeling the Name, Role, Section and Delete columns

In the tbody before the tr
1. A for loop is used to check if the users are students
2. If they are students the for loop will continue and label the students with the appropriate information
3. If they're a admin or a instructor it'll just display their name and their role

The first form in the tr is responsible for assining the roles as well as changing the roles
    - Since it's a admin panel we can change the roles of Students, Instructors and other Admins

The next td after the forms end checks if the user is a student, if they are they will assign the students to their proper section
    - The section the student is under is a way to catagorize them by instructor
    - Some students that aren't assigned to a section will be in a **Pending Users Section**

The next td contains the delete button
    - This can be used for removing users that are no longer needed

***Instructors Tab Content***

The Instructors tab in admin panel consits of 3 columns
They are :
    Instructor
    Section
    Delete

Just like the students instructors can be assigned to sections, instructors without sections will be in the **Pending Users Section**

***Sites Tab Content***

Students can be assigned different sites, this tab manages those sites

There are 2 columns for the sites tab as well as a button, the name of the site and the delete button
The button **Add Site** allows more sites to be added, it opens the addsite.ejs file

***Sections Tab Content***

The tr in the thead is responsible for naming the 3 columns used for this section
The 3 columns used are:
    Name
    Instructor
    Delete

The Names are the sections, the instructors are the ones assigned to the sections

The for loop in the tbody just adds all existing sections under the names column

The next for loop inside the tbody but in the forms allows for changing the sections

Delete button just deletes


***Reset Button***

This will call the resetPtracker.ejs page


#### Reset Ptracker

This will delete all data permanently (Except instructors, admins and sections)

The first div is the button that lets you have the option to delete it

1.  The <dialog> and everything inside it will ask you to confirm if you want to delete it
2.  There's a X button to close out of it, there is a comment for it in the code
3.  There's another button inside that asks if you would like to delete it, if it it deleted you will be taken back to admin land

### Auth

This is the authentication folder
It's only login.ejs right now but incase anything else gets added Im pre setting this

#### Login

The form asks for the email and if it's one of the pre-set ones it'll give you access

This will be changed in the future but for now it's just these test emails

The pre-set emails we use are

dev@bcit.ca
instructor@bcit.ca
student@bcit.ca
