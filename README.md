[![Typing SVG](https://readme-typing-svg.demolab.com/?lines=Introducing+"Stutor";An+Innovative+Platform+Designed;Revolutionizing+The+Way+Of+Tuitions)](https://git.io/typing-svg)

# STUTOR.

Introducing "Stutor" - an innovative platform designed to revolutionize the way students receive tuition. Stutor is a peer-to-peer learning platform that connects students who excel in particular subjects with those who require additional guidance.

CLICK HERE TO GO TO THE LIVE WEBSITE https://stutor.vercel.app/
(P.S. It takes Around a minute to load )

## Features

- **Peer-to-Peer Learning:** Stutor facilitates peer-to-peer learning, allowing students who excel in specific subjects to connect with those seeking additional guidance.
  
- **Subject Specialization:** Students can find tutors who specialize in particular subjects, ensuring tailored support for their learning needs.

- **Flexible Scheduling:** With Stutor, users can schedule tutoring sessions at their convenience, providing flexibility to both tutors and students.

- **Interactive Learning Resources:** Access a variety of interactive learning resources, including quizzes, study guides, and educational videos, to supplement tutoring sessions.

- ## Badges



[![GPLv3 License](https://img.shields.io/badge/CSS-Style-blue.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/HTML5-WebDev-green.svg)](http://www.gnu.org/licenses/agpl-3.0)
Modernized full-stack version of STUTOR with:

- Responsive Bootstrap 5 UI and lazy-loaded media
- Working authentication (signup/login)
- Meeting scheduler (virtual/offline) with auto-generated Jitsi link or Google Meet option
- Real database via Prisma (SQLite in dev, Postgres supported)
- Node.js/Express backend serving APIs and static files

## Quick start

1) Backend setup

Copy server/.env.example to server/.env and adjust if needed.

2) Install and run

```
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

The app serves the static site and APIs at http://localhost:3000

## API

- POST /api/auth/signup { name, email, password }
- POST /api/auth/login { email, password }
- GET /api/meetings (Bearer token)
- POST /api/meetings { title, date, time, mode, link?, location?, notes? } (Bearer token)
- PUT /api/meetings/:id (Bearer token)
- DELETE /api/meetings/:id (Bearer token)

## Notes

- To use Postgres, set DATABASE_PROVIDER and DATABASE_URL in server/.env and run `npm run db:deploy`.
- Google Meet links require user action unless you configure Google APIs; we provide a one-click "New Meet" button and auto Jitsi link.
[![AGPL License](https://img.shields.io/badge/JavaScript-Backend-Orange.svg)](http://www.gnu.org/licenses/agpl-3.0)
[![AGPL License](https://img.shields.io/badge/Data-LocalStorage-purple.svg)](http://www.gnu.org/licenses/agpl-3.0)


## How it Works

1. **Sign Up:** Create an account on Stutor as either a student or a tutor.
   
2. **Browse Tutors/Students:** Explore profiles of tutors and students to find the right match for your learning needs.
   
3. **Schedule Sessions:** Schedule tutoring sessions at mutually convenient times using Stutor's scheduling system.
   
4. **Engage in Learning:** Participate in interactive tutoring sessions and utilize additional learning resources available on the platform.
   
5. **Provide Feedback:** After each session, provide feedback to help improve the learning experience for both tutors and students.

Here)
## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+![Uploading Screenshot 2024-03-16 at 12.31.17 AM.png…]()
+Here)
## Get Started

Ready to revolutionize your learning experience with Stutor? Follow these steps to get started:

1. **Clone the Repository:**
git clone https://github.com/yourusername/stutor.git


2. **Install Dependencies:**
cd stutor
npm install

3. **Run the Application:**
npm start


4. **Access the Platform:**
Open your web browser and go to https://stutor.vercel.app/ to access Stutor.

## Contributing

We welcome contributions from the community to enhance Stutor. If you have any ideas for new features or improvements, feel free to submit a pull request.

## Support

For any questions or assistance, please contact our support team at [support@stutor.com](mailto:support@stutor.com).
