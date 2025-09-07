-- Create users table with proper schema
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert a sample admin user (password: 'admin123' - remember to change this!)
-- Password hash for 'admin123' using bcrypt with salt rounds 10
INSERT IGNORE INTO users (email, password, role) VALUES 
('admin@example.com', '$2b$10$rOzJqQZ8kGjJ5Y5YQZ8kGjJ5Y5YQZ8kGjJ5Y5YQZ8kGjJ5Y5YQZ8kG', 'admin');
