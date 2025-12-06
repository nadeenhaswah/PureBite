PureBite – Nutrition Assessment Form Builder

PureBite is a web-based platform designed for a nutrition specialist to help clients improve their lifestyle through structured health and nutrition assessment forms.
The system provides two user roles:

Admin (Nutritionist)

User (Client)

The project is fully built using HTML, CSS, and JavaScript, with all data stored locally using localStorage and sessionStorage (no backend required).

1. Project Overview

PureBite is a health-focused Form Builder inspired by Google Forms.
The nutritionist (Admin) can create customized forms related to eating habits, activity level, medical background, goals, and weekly follow-up.
The client (User) can register, log in, view active forms, and submit answers.

2. Theme – Health & Nutrition

The entire platform follows a health and nutrition theme, reflected by:

A color palette inspired by wellness (green for health, orange for energy).

Images of nutritionists, fruits, vegetables, and medical tools.

Clean UI elements that give the feeling of a healthy lifestyle journey.

The theme is consistently applied in:
Home page, Login/Signup pages, Dashboard, Forms pages, and overall UI components.

3. Main Features
3.1 Public Landing Page (index.html)

Includes:

A hero section introducing PureBite.

About, Features, and Feedback sections.

Call-to-action buttons for Login and Signup.

3.2 Authentication (Login & Signup)

Signup (signup.html):

Create a new user account (username, email, password, confirm password).

Front-end validation.

Login (login.html):

Login using email and password.

Links to create a new account or return to Home.

3.3 User Roles
Admin (Nutritionist)

After logging in, the Admin has access to:

1. Dashboard (dashbord.html)

Displays number of users and number of forms.

Quick navigation to Users and Forms management.

Shows recent or important stats.

2. Forms Management

addForm.html → Create a new form.

listForm.html → View all forms in a table.

Features include:

Add, edit or delete a form.

Activate/Deactivate forms.

Add questions with multiple types:

Text

Radio

Select (Dropdown)

Add/remove options for multiple-choice questions.

Set correct answers for scoring.

3. Users Management

addUser.html → Admin can manually add a new client.

listUsers.html → View all users with actions like edit/delete.

4. Admin Profile

View profile information.

Update personal details.

Change password.

User (Client)

After logging in, the user has access to:

allForms.html → View all active forms available for submission.

myForms.html → View own form history or assigned forms.

User Profile page → View and update user information and password.

Users can fill forms, submit answers, and (if applicable) see their score.

4. Data Storage (localStorage / sessionStorage)

This project uses Web Storage to simulate a backend.

Estimated storage structure:

users → List of all users { id, username, email, password, role }

forms → List of created forms { formId, title, description, status, questions[] }

submissions → User form answers and scores { submissionId, formId, userId, answers[], score }

All authentication, form creation, and submissions are stored in the browser.

5. API Integration

The project includes (or is designed to include) one Public API, such as:

Daily nutrition tip

Motivational quote

Random healthy recipes

World countries list for form questions

This API can be used on:

Home page

Dashboard

Form pages

(You can update this section later once the API is implemented.)

6. Tech Stack

HTML5

CSS3

Bootstrap

JavaScript (no frameworks)

Web Storage (localStorage & sessionStorage)

CSS Files:

style.css (public pages)

login.css (auth pages)

inner.css (inner layout)

dashbord.css (dashboard styling)

JS Files:

login.js, signup.js

storge.js

addUserByAdmin.js, displayUsers.js

adminProfile.js, userProfile.js

aside_links.js

7. How to Run the Project

Download or clone the repository:

git clone <repository-link>


Open the project folder.

Run the website by opening:

index.html


Use Login and Signup to access the system.

Login as Admin to access Dashboard, Forms, Users, and Profile pages.

Login as User to access Active Forms and User Profile.

8. File Structure (Simplified)
.
├── index.html
├── auth/
│   ├── login.html
│   └── signup.html
├── admin/
│   ├── dashbord.html
│   ├── addForm.html
│   ├── listForm.html
│   ├── addUser.html
│   ├── listUsers.html
│   └── profile.html
├── user/
│   ├── allForms.html
│   ├── myForms.html
│   └── profile.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/

9. Team Members

Nadeen – UI/UX Designer (fully design and implmented)

Khalil – JavaScript Developer and Test project

Hamza – JavaScript Developer