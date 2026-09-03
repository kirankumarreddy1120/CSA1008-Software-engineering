-- ==========================================================
-- PlaceTrack: Comprehensive Academic Sample Seed Data
-- ==========================================================

USE campus_placement_db;

-- 1. Insert Users (Password is 'Password@123' for all demo accounts)
INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'Dr. Rajesh Sharma (TPO Head)', 'admin@college.edu', '$2a$10$r8C95XR78teLGZUi9ANk6uhugFEixhFFGTVHFyUkHMAd7psGB6v82', 'admin'),
(2, 'Priya Nair (Google Campus HR)', 'recruiter@google.com', '$2a$10$r8C95XR78teLGZUi9ANk6uhugFEixhFFGTVHFyUkHMAd7psGB6v82', 'recruiter'),
(3, 'Vikram Malhotra (Microsoft HR)', 'recruiter@microsoft.com', '$2a$10$r8C95XR78teLGZUi9ANk6uhugFEixhFFGTVHFyUkHMAd7psGB6v82', 'recruiter'),
(4, 'Aarav Patel', 'student@college.edu', '$2a$10$r8C95XR78teLGZUi9ANk6uhugFEixhFFGTVHFyUkHMAd7psGB6v82', 'student'),
(5, 'Ananya Iyer', 'ananya.cse@college.edu', '$2a$10$r8C95XR78teLGZUi9ANk6uhugFEixhFFGTVHFyUkHMAd7psGB6v82', 'student'),
(6, 'Rohan Verma', 'rohan.ece@college.edu', '$2a$10$r8C95XR78teLGZUi9ANk6uhugFEixhFFGTVHFyUkHMAd7psGB6v82', 'student'),
(7, 'Sneha Roy', 'sneha.it@college.edu', '$2a$10$r8C95XR78teLGZUi9ANk6uhugFEixhFFGTVHFyUkHMAd7psGB6v82', 'student'),
(8, 'Kabir Singh', 'kabir.me@college.edu', '$2a$10$r8C95XR78teLGZUi9ANk6uhugFEixhFFGTVHFyUkHMAd7psGB6v82', 'student'),
(9, 'Neha Gupta', 'neha.ee@college.edu', '$2a$10$r8C95XR78teLGZUi9ANk6uhugFEixhFFGTVHFyUkHMAd7psGB6v82', 'student');

-- 2. Insert Students
INSERT INTO students (id, user_id, roll_no, department, degree, batch_year, cgpa, backlogs_count, phone, skills, resume_url, placement_status) VALUES
(1, 4, '2022CS0104', 'CSE', 'B.Tech', 2026, 8.85, 0, '+91-9876543210', 'React, Node.js, Python, Data Structures, SQL, Docker', 'https://example.com/resumes/aarav_patel.pdf', 'placed'),
(2, 5, '2022CS0118', 'CSE', 'B.Tech', 2026, 9.42, 0, '+91-9876543211', 'C++, Java, Algorithms, Distributed Systems, AWS', 'https://example.com/resumes/ananya_iyer.pdf', 'placed'),
(3, 6, '2022EC0205', 'ECE', 'B.Tech', 2026, 8.10, 0, '+91-9876543212', 'Embedded C, Verilog, IoT, Signal Processing, Python', 'https://example.com/resumes/rohan_verma.pdf', 'unplaced'),
(4, 7, '2022IT0301', 'IT', 'B.Tech', 2026, 7.65, 0, '+91-9876543213', 'Full Stack MERN, Next.js, PostgreSQL, Git, Linux', 'https://example.com/resumes/sneha_roy.pdf', 'unplaced'),
(5, 8, '2022ME0409', 'ME', 'B.Tech', 2026, 6.80, 1, '+91-9876543214', 'AutoCAD, SolidWorks, Thermodynamics, MATLAB', 'https://example.com/resumes/kabir_singh.pdf', 'unplaced'),
(6, 9, '2022EE0502', 'EE', 'B.Tech', 2026, 8.50, 0, '+91-9876543215', 'Power Systems, MATLAB, Control Systems, C++', 'https://example.com/resumes/neha_gupta.pdf', 'placed');

-- 3. Insert Companies
INSERT INTO companies (id, user_id, name, industry, website, contact_email, contact_phone, location, description) VALUES
(1, 2, 'Google India', 'Technology & Cloud', 'https://careers.google.com', 'recruiter@google.com', '+91-80-67210000', 'Bengaluru, Karnataka', 'Global technology leader in search, cloud computing, and AI systems.'),
(2, 3, 'Microsoft Corporation', 'Software & AI', 'https://careers.microsoft.com', 'recruiter@microsoft.com', '+91-40-66950000', 'Hyderabad, Telangana', 'World leader in enterprise platforms, developer tools, and intelligent cloud.'),
(3, NULL, 'Amazon Development Center', 'E-Commerce & AWS', 'https://amazon.jobs', 'campus@amazon.in', '+91-80-41000000', 'Bengaluru, Karnataka', 'Customer-centric technological innovation powering global e-commerce and cloud.'),
(4, NULL, 'Deloitte USI', 'Consulting & Technology', 'https://deloitte.com', 'campus@deloitte.com', '+91-40-71180000', 'Hyderabad & Bengaluru', 'Premier multinational professional services and enterprise tech advisory.'),
(5, NULL, 'Qualcomm Technologies', 'Semiconductor & Wireless', 'https://qualcomm.com', 'campus@qualcomm.com', '+91-80-66440000', 'Bengaluru & Noida', 'Pioneering foundational wireless technologies and next-gen chipsets.');

-- 4. Insert Job Postings / Placement Drives
INSERT INTO job_postings (id, company_id, title, job_role, job_location, job_type, ctc_lpa, stipend_monthly, min_cgpa, max_backlogs, eligible_departments, eligible_batches, description, selection_process, deadline, drive_date, status, created_by) VALUES
(1, 1, 'Google 2026 Campus Drive - Software Engineer I', 'Software Engineer (SWE-1)', 'Bengaluru / Hyderabad', 'Full-Time', 32.50, 85000.00, 8.00, 0, 'CSE,IT,ECE', '2026', 'Join Google engineering teams to build scalable distributed infrastructure, search algorithms, and machine learning models.', 'Round 1: Online Coding (2 DSA Problems)\nRound 2: Technical Interview (Data Structures & Systems)\nRound 3: Googleyness & Leadership Interview', '2026-09-30 23:59:59', '2026-10-05 09:00:00', 'active', 1),
(2, 2, 'Microsoft Aspire - Software Engineer (Azure / Cloud)', 'Software Development Engineer (SDE-1)', 'Hyderabad / Bengaluru / Noida', 'Full-Time', 28.00, 75000.00, 7.50, 0, 'CSE,IT,ECE,EE', '2026', 'Develop high-throughput cloud services, developer SDKs, and cognitive AI services on Microsoft Azure.', 'Round 1: Online Assessment (Codility)\nRound 2: Technical Deep Dive\nRound 3: System Design & Culture Fit', '2026-09-25 23:59:59', '2026-10-01 10:00:00', 'active', 1),
(3, 3, 'Amazon SDE-1 Graduate Drive', 'Software Development Engineer', 'Bengaluru / Hyderabad / Chennai', 'Full-Time', 24.00, 60000.00, 7.00, 0, 'CSE,IT,ECE', '2026', 'Design and implement customer-facing low-latency web services, supply-chain algorithms, and AWS cloud integrations.', 'Round 1: Online Assessment (Debug, Code, Aptitude)\nRound 2: 2 Technical Rounds\nRound 3: Bar Raiser', '2026-10-15 23:59:59', '2026-10-20 09:30:00', 'active', 1),
(4, 4, 'Deloitte Consulting - Technology Analyst', 'Associate Solution Advisor', 'Hyderabad / Bengaluru / Mumbai / Pune', 'Full-Time', 9.50, 25000.00, 6.50, 1, 'CSE,IT,ECE,EE,ME', '2026', 'Provide digital transformation consulting, cloud ERP implementation, and analytics solutions for Fortune 500 clients.', 'Round 1: Online Aptitude & Verbal Test\nRound 2: Group Discussion & Case Study\nRound 3: Partner Interview', '2026-09-18 23:59:59', '2026-09-22 09:00:00', 'active', 1),
(5, 5, 'Qualcomm - Hardware & Embedded Systems Engineer', 'Associate Engineer (Hardware/Embedded)', 'Bengaluru / Chennai', 'Full-Time', 18.50, 45000.00, 7.50, 0, 'ECE,EE', '2026', 'Firmware development, digital design verification, board bring-up, and low-level driver programming on Snapdragon SoC platforms.', 'Round 1: Online Technical Test (C, Digital Electronics)\nRound 2: Architecture & RTL Interview\nRound 3: HR Round', '2026-10-10 23:59:59', '2026-10-14 10:00:00', 'active', 1);

-- 5. Insert Applications
INSERT INTO applications (id, job_id, student_id, status, notes, applied_at) VALUES
(1, 1, 1, 'selected', 'Candidate performed exceptionally well in DSA round and system architecture.', '2026-09-01 10:30:00'),
(2, 1, 2, 'selected', 'Outstanding coding speed and algorithmic clarity.', '2026-09-01 11:00:00'),
(3, 2, 1, 'shortlisted', 'Scheduled for Technical Interview Round 2.', '2026-09-02 14:15:00'),
(4, 2, 3, 'in_progress', 'Cleared Round 1 Online Assessment with score 94%.', '2026-09-02 15:30:00'),
(5, 2, 4, 'applied', 'Application submitted, awaiting initial screening.', '2026-09-02 16:00:00'),
(6, 4, 5, 'rejected', 'Failed to clear minimum cut-off in numerical aptitude section.', '2026-09-01 12:00:00'),
(7, 5, 6, 'selected', 'Strong grasp of Signal Processing and Power Systems.', '2026-09-01 09:45:00');

-- 6. Insert Interview Rounds
INSERT INTO interview_rounds (id, application_id, round_number, round_name, scheduled_at, status, feedback) VALUES
(1, 1, 1, 'Online Coding Assessment', '2026-09-02 10:00:00', 'cleared', 'Solved both DP and Graph problems in 45 mins with 100% test cases.'),
(2, 1, 2, 'Technical & System Design', '2026-09-02 14:00:00', 'cleared', 'Excellent explanation of distributed cache and database indexing.'),
(3, 1, 3, 'Googleyness & Leadership', '2026-09-03 11:00:00', 'cleared', 'Strong cultural alignment, proactive communication, and leadership examples.'),
(4, 2, 1, 'Online Coding Assessment', '2026-09-02 10:00:00', 'cleared', 'All test cases passed.'),
(5, 2, 2, 'Technical & System Design', '2026-09-02 15:30:00', 'cleared', 'Very clean modular C++ code and edge case handling.'),
(6, 4, 1, 'Online Assessment (Codility)', '2026-09-02 16:00:00', 'cleared', 'High score in logic and algorithms.'),
(7, 4, 2, 'Technical Deep Dive', '2026-09-05 10:00:00', 'pending', 'Scheduled for upcoming Saturday.');

-- 7. Insert Offers
INSERT INTO offers (id, application_id, package_lpa, joining_date, offer_letter_url, status, issued_at) VALUES
(1, 1, 32.50, '2026-07-01', 'https://example.com/offers/google_aarav_patel.pdf', 'accepted', '2026-09-03 08:00:00'),
(2, 2, 32.50, '2026-07-01', 'https://example.com/offers/google_ananya_iyer.pdf', 'accepted', '2026-09-03 08:30:00'),
(3, 7, 18.50, '2026-07-15', 'https://example.com/offers/qualcomm_neha_gupta.pdf', 'accepted', '2026-09-02 18:00:00');

-- 8. Insert Announcements
INSERT INTO announcements (id, title, content, priority, target_role, posted_by, created_at) VALUES
(1, 'Google 2026 Campus Drive Registration Closing Soon', 'All eligible B.Tech CSE, IT, and ECE students with CGPA >= 8.00 and 0 active backlogs must submit their applications before September 30, 2026.', 'urgent', 'student', 1, '2026-09-02 09:00:00'),
(2, 'Pre-Placement Talk by Microsoft Azure Team', 'Microsoft will conduct a virtual pre-placement talk and Q&A session on September 24 at 5:00 PM IST via Teams. Attendance is mandatory for registered students.', 'important', 'student', 1, '2026-09-02 11:30:00'),
(3, 'Resume Verification & Profile Updates in TPO Portal', 'Students are advised to review and update their latest SGPA, overall CGPA, and uploaded resume PDFs before the upcoming recruitment season starts.', 'normal', 'student', 1, '2026-09-01 10:00:00'),
(4, 'Mock Interview & Aptitude Workshop by Placement Cell', 'Free weekend technical mock interviews and aptitude training sessions scheduled starting this Saturday in Seminar Hall A.', 'normal', 'all', 1, '2026-09-01 08:00:00');
