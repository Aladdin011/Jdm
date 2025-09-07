-- Seed default department accounts with bcrypt-hashed passwords
-- Password hashes generated with bcrypt salt rounds 10

-- Admin@123 -> $2b$10$d.4kvqgVMjDV3yKTTL.gz.mLpzROing/efQVO8OW7YWUSBgMOaQVm
-- Acc@123 -> $2b$10$lJtxM7On6F0F2.sa7EnbYOin.R7ITdy58a8RzBEQyFni9JklEI8I6
-- Acct@123 -> $2b$10$r/SSRElWw33aBJxlWQJXx.ocPMS90fVDLzLbIW1cOXQFAZzrhXj3e
-- BA@123 -> $2b$10$JR.2dhzqb.OeW0BxvppszOr7nYopEhmac5F/JLMDlibkS3GFEm7bq
-- BD@123 -> $2b$10$GILrGZfWVcDlAhLbdwmyi.h.hFTXebEwgl04E00UYzwPBTvog52lq
-- Mkt@123 -> $2b$10$XAg0X.q.7hCXNyhU0ATxau12J4SyGA9R9cms/6sP4PNALdvhFIDby
-- Hr@123 -> $2b$10$WA8gABnX/L8IvtCzam4B4OG/I7J9NQ427YnHOop5nOTtRU2CWdHi2
-- Proj@123 -> $2b$10$rgW0BtoiLt8VtpEYnkgBa.TTZRwrbPhL3MGs5fDpbke8VZhz7ZtEy
-- Sec@123 -> $2b$10$RsrM9lSckK5ZgbNKPOXZTeMP/q/pvmvF3wbXdlpQFSHktGsHmdAdW
-- Gen@123 -> $2b$10$.HZjNMzXODGXk7dWZcw.N.tpfUwf8w5qAN1d4EN1vOlZf6qH3TJg.

INSERT IGNORE INTO users (email, password, role, department, department_code, code_expires_at) VALUES
('admin@jdmarcng.com', '$2b$10$d.4kvqgVMjDV3yKTTL.gz.mLpzROing/efQVO8OW7YWUSBgMOaQVm', 'admin', 'Admin', 'SA1234', DATE_ADD(NOW(), INTERVAL 7 DAY)),
('accounts@jdmarcng.com', '$2b$10$lJtxM7On6F0F2.sa7EnbYOin.R7ITdy58a8RzBEQyFni9JklEI8I6', 'staff', 'Accounts', 'AC5930', DATE_ADD(NOW(), INTERVAL 7 DAY)),
('accounting@jdmarcng.com', '$2b$10$r/SSRElWw33aBJxlWQJXx.ocPMS90fVDLzLbIW1cOXQFAZzrhXj3e', 'staff', 'Accounting', 'AC1702', DATE_ADD(NOW(), INTERVAL 7 DAY)),
('busadmin@jdmarcng.com', '$2b$10$JR.2dhzqb.OeW0BxvppszOr7nYopEhmac5F/JLMDlibkS3GFEm7bq', 'staff', 'Business Administration', 'BA4268', DATE_ADD(NOW(), INTERVAL 7 DAY)),
('busdev@jdmarcng.com', '$2b$10$GILrGZfWVcDlAhLbdwmyi.h.hFTXebEwgl04E00UYzwPBTvog52lq', 'staff', 'Business Development', 'BD3127', DATE_ADD(NOW(), INTERVAL 7 DAY)),
('marketing@jdmarcng.com', '$2b$10$XAg0X.q.7hCXNyhU0ATxau12J4SyGA9R9cms/6sP4PNALdvhFIDby', 'staff', 'Digital Marketing', 'DM7582', DATE_ADD(NOW(), INTERVAL 7 DAY)),
('hr@jdmarcng.com', '$2b$10$WA8gABnX/L8IvtCzam4B4OG/I7J9NQ427YnHOop5nOTtRU2CWdHi2', 'staff', 'HR', 'HR6049', DATE_ADD(NOW(), INTERVAL 7 DAY)),
('projects@jdmarcng.com', '$2b$10$rgW0BtoiLt8VtpEYnkgBa.TTZRwrbPhL3MGs5fDpbke8VZhz7ZtEy', 'staff', 'Projects', 'PM1856', DATE_ADD(NOW(), INTERVAL 7 DAY)),
('secretariat@jdmarcng.com', '$2b$10$RsrM9lSckK5ZgbNKPOXZTeMP/q/pvmvF3wbXdlpQFSHktGsHmdAdW', 'staff', 'Secretariat', 'SA9273', DATE_ADD(NOW(), INTERVAL 7 DAY)),
('general@jdmarcng.com', '$2b$10$.HZjNMzXODGXk7dWZcw.N.tpfUwf8w5qAN1d4EN1vOlZf6qH3TJg.', 'user', 'General Users', NULL, NULL);
