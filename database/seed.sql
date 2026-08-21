-- The password for both demo accounts is Password123!
INSERT INTO users (name, email, password_hash, role, headline, location) VALUES
('Demo Recruiter', 'recruiter@example.com', '$2a$12$RPrIoeYsh79qVyehJalep.nOIq739qlCL3cE1kpOHhHa0xHrCleO.', 'recruiter', 'Talent Partner', 'Bengaluru'),
('Demo Seeker', 'seeker@example.com', '$2a$12$RPrIoeYsh79qVyehJalep.nOIq739qlCL3cE1kpOHhHa0xHrCleO.', 'seeker', 'Frontend Developer', 'Pune')
ON CONFLICT (email) DO NOTHING;

INSERT INTO jobs (recruiter_id, title, company_name, location, employment_type, description, requirements, salary_min, salary_max)
SELECT id, 'React Developer', 'Northstar Labs', 'Remote', 'Full-time',
'Build thoughtful, accessible product experiences for a fast-growing SaaS platform.',
'Strong React and JavaScript fundamentals. Experience consuming REST APIs.', 700000, 1200000
FROM users WHERE email = 'recruiter@example.com'
AND NOT EXISTS (SELECT 1 FROM jobs WHERE title = 'React Developer' AND company_name = 'Northstar Labs');

INSERT INTO jobs (recruiter_id, title, company_name, location, employment_type, description, requirements, salary_min, salary_max)
SELECT id, 'Backend Engineer', 'Cobalt Systems', 'Bengaluru', 'Full-time',
'Design secure APIs and data services used by thousands of customers.',
'Node.js, PostgreSQL, API design, and testing experience.', 900000, 1600000
FROM users WHERE email = 'recruiter@example.com'
AND NOT EXISTS (SELECT 1 FROM jobs WHERE title = 'Backend Engineer' AND company_name = 'Cobalt Systems');

INSERT INTO jobs (recruiter_id, title, company_name, location, employment_type, description, requirements, salary_min, salary_max)
SELECT id, 'Product Design Intern', 'Canvas Works', 'Pune', 'Internship',
'Help shape simple and accessible experiences for a collaborative creative platform.',
'A portfolio showing UI thinking, research, and Figma fundamentals.', 240000, 360000
FROM users WHERE email = 'recruiter@example.com'
AND NOT EXISTS (SELECT 1 FROM jobs WHERE title = 'Product Design Intern' AND company_name = 'Canvas Works');

INSERT INTO skills (name) VALUES ('React'), ('JavaScript'), ('Node.js'), ('PostgreSQL'), ('CSS'), ('REST APIs'), ('Figma'), ('UI Design') ON CONFLICT DO NOTHING;

INSERT INTO job_skills (job_id, skill_id)
SELECT j.id, s.id FROM jobs j JOIN skills s ON
  (j.title='React Developer' AND s.name IN ('React','JavaScript','CSS','REST APIs')) OR
  (j.title='Backend Engineer' AND s.name IN ('Node.js','PostgreSQL','REST APIs')) OR
  (j.title='Product Design Intern' AND s.name IN ('Figma','UI Design'))
ON CONFLICT DO NOTHING;

INSERT INTO user_skills (user_id, skill_id)
SELECT u.id, s.id FROM users u CROSS JOIN skills s
WHERE u.email='seeker@example.com' AND s.name IN ('React','JavaScript','CSS')
ON CONFLICT DO NOTHING;
