-- Admin user (password: Admin@4sjss)
INSERT INTO "admin_users" ("email", "password_hash", "name", "role")
VALUES ('admin@saps.edu.np', '$2b$10$Wp8LCYlN9pB6Q1TN79SkueF/TO.zBFbINz8i2dcwYMTMQYUuB.LHq', 'Admin', 'admin')
ON CONFLICT ("email") DO NOTHING;

-- Site settings
INSERT INTO "site_settings" ("key", "value") VALUES
('school_motto_en', 'Knowledge, Character, Service'),
('school_motto_np', 'ज्ञान, चरित्र, सेवा'),
('total_students', '847'),
('total_staff', '42'),
('established_year_bs', '2066'),
('phone', '099422015, 9801701958'),
('email', 'alankarpublicschool@gmail.com'),
('address_en', 'Punarbas-8, Prithvibasti, Kanchanpur, Nepal'),
('address_np', 'पुनर्वास-८, पृथ्वीबस्ती, कञ्चनपुर, नेपाल'),
('emis', '720120015')
ON CONFLICT ("key") DO NOTHING;

-- Notices
INSERT INTO "notices" ("title_en", "title_np", "content_en", "content_np", "category", "is_pinned") VALUES
('Admission Open for PG to Eight (Academic Year 2081 BS)', 'कक्षा १-१० को लागि भर्ना खुला (शैक्षिक वर्ष २०८१)', 'Shree Alankar Public School is pleased to announce that admissions are now open for the academic year 2081 BS for all classes from PG to Grade 8.', 'श्री अलंकार पब्लिक स्कूलले सूचित गर्दछ कि शैक्षिक वर्ष २०८१ को लागि कक्षा १ देखि १० सम्मका सबै कक्षाहरूमा भर्ना खुला भएको छ।', 'admission', true),
('SEE 2080 Results Published', 'SEE २०८० नतिजा प्रकाशित', 'The SEE 2080 results have been published. Students can check using their roll number on the Results page.', 'SEE २०८० को नतिजा प्रकाशित भएको छ।', 'results', true),
('Annual Sports Day - Ashad 15', 'वार्षिक खेलकुद दिवस - असार १५', 'The annual sports day will be held on Ashad 15 at the school grounds.', 'वार्षिक खेलकुद दिवस असार १५ मा आयोजना गरिनेछ।', 'event', false)
ON CONFLICT DO NOTHING;

-- Staff
INSERT INTO "staff" ("name_en", "name_np", "role_en", "role_np", "department", "qualification", "display_order") VALUES
('Pusp Raj Ojha', 'पुष्प राज ओझा', 'Principal', 'प्रधानाध्यापक', 'administration', 'M.Ed. (Education Management)', 1),
('Ram Prasad Sharma', 'राम प्रसाद शर्मा', 'Head of Science Department', 'विज्ञान विभाग प्रमुख', 'science', 'B.Sc., B.Ed.', 2),
('Sita Devi Joshi', 'सीता देवी जोशी', 'Mathematics Teacher', 'गणित शिक्षिका', 'science', 'B.Sc. (Mathematics), B.Ed.', 3),
('Hari Bahadur Bist', 'हरि बहादुर बिष्ट', 'Nepali & Social Studies Teacher', 'नेपाली र सामाजिक शिक्षक', 'arts', 'M.A. (Nepali), B.Ed.', 4),
('Kamala Thapa', 'कमला थापा', 'English Teacher', 'अंग्रेजी शिक्षिका', 'arts', 'M.A. (English), B.Ed.', 5),
('Gopal Krishna Pandey', 'गोपाल कृष्ण पाण्डेय', 'Computer Science Teacher', 'कम्प्युटर विज्ञान शिक्षक', 'science', 'B.C.S., B.Ed.', 6)
ON CONFLICT DO NOTHING;
