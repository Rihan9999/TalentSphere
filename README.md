# TalentSphere — Intelligent Campus Recruitment & Career Management platform

TalentSphere is a centralized, digital platform designed to automate and streamline the complete college placement & campus recruitment lifecycle across **Students**, **College Placement Staff / TPOs**, **Recruiters / Partner Companies**, and **Super Administrators**.

Built with a high-performance modern tech stack, TalentSphere provides an automated academic eligibility calculator, drive-specific student data forwarding to recruiters with strict database privacy scoping, interactive placement analytics, and in-app notifications.

---

## 🌟 Key Highlights & Core Features

- **Automated Eligibility Engine**: Automatically evaluates student CGPA, active backlogs, department, branch, graduation year, and 10th/12th percentages against drive requirements. If ineligible, displays exact human-readable reasons (e.g. `❌ CGPA requirement is 7.5, your CGPA is 6.9`).
- **Drive-Specific Student Data Sharing**: Core workflow allowing placement officers to identify eligible candidates, select profiles, and forward batch data specifically to a recruiter for a particular drive. Recruiters never get unrestricted access to the college database.
- **Role-Based Access Control (RBAC)**: Strict JWT-authenticated authorization across four distinct roles (`student`, `staff`, `recruiter`, `admin`).
- **Visual Application Journey Timeline**: Students track their application status through animated milestones (`REGISTERED` → `ELIGIBILITY_VERIFIED` → `SHORTLISTED` → `INTERVIEW` → `SELECTED`).
- **Placement Celebration Screen**: Selected students get a confetti celebration screen showcasing company logo, designation, CTC package, and offer details.
- **Interactive Analytics & Data Export**: Branch-wise placement rates, company selection donut charts, monthly hiring trends, and CSV/Excel dataset exports.
- **Audit Logging**: Comprehensive audit trail for security operations (login, student data sharing, drive creation, shortlisting, offer updates).

---

## 🔑 Demo Credentials (1-Click Access)

| User Role | Demo Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Student** | `student@talentsphere.demo` | `Password@123` | Apply for drives, track applications, view interviews, profile completion |
| **Placement Staff** | `staff@talentsphere.demo` | `Password@123` | Create drives, evaluate eligibility, **Send Student Data to Company**, export CSV/Excel |
| **TCS Recruiter** | `recruiter@talentsphere.demo` | `Password@123` | View assigned drives, view ONLY shared student profiles, shortlist, select, schedule interviews |
| **Super Admin** | `admin@talentsphere.demo` | `Password@123` | Platform analytics, user provisioning, system activation/deactivation, audit logs |

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18 + Vite
- **Styling**: Tailwind CSS (Glassmorphism design system & Dark/Light mode)
- **State & Routing**: React Router v6, React Context API
- **Animations & VFX**: Framer Motion, Canvas Confetti
- **Icons & Charts**: Lucide React, Recharts
- **HTTP Client**: Axios

### Backend
- **Runtime & Server**: Node.js, Express.js (REST APIs)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs password hashing
- **File Uploads**: Multer with file type & size validation (PDF, DOCX, Images)
- **Database**: MongoDB & Mongoose ORM (with automatic embedded memory fallback)
- **Export Engine**: XLSX & CSV streaming

---

## 🚀 Quick Start & Installation

### 1. Clone & Install Dependencies

Root folder command:
```bash
npm run install:all
```
*Or install individually:*
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Start Backend & Database Auto-Seed

```bash
cd server
npm start
```
The server runs on `http://localhost:5000`. Upon launch, it automatically seeds realistic demo data for top companies (TCS, Infosys, Accenture, Wipro, Cognizant, Deloitte), sample drives, students, applications, and audit logs.

### 3. Start Frontend Dev Server

```bash
cd client
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📡 REST API Summary

- `POST /api/auth/login` — Authenticate user & receive JWT
- `POST /api/auth/register` — Student registration
- `GET /api/students/drives` — Get drives with auto-calculated eligibility
- `POST /api/students/drives/:id/apply` — Apply for placement drive
- `GET /api/staff/drives/:id/eligible-students` — Automated eligible student discovery
- `POST /api/staff/drives/:id/share-students` — Send student data to recruiter
- `GET /api/recruiter/drives/:id/students` — Scoped shared candidate profiles
- `PUT /api/recruiter/applications/:id/status` — Shortlist, select or reject student
- `POST /api/interviews` — Schedule candidate interview
- `GET /api/reports/students` — Download CSV / Excel reports
- `GET /api/admin/audit-logs` — Fetch security audit trail

---

## 🔒 Security & Privacy Architecture

- **JWT Session Tokens**: Stored in authorization headers.
- **bcrypt Password Hashing**: Passwords stored using 10-round salt hashing.
- **Recruiter Database Protection**: Recruiters can only query students who were explicitly forwarded via `StudentDataShare` records for their company's drives.
