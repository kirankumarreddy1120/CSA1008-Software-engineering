-- ==============================================================================
-- WeatherGPT - Conversational AI for Weather Forecasting, Alerts & Climate
-- Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)
-- Database Schema: weathergpt_db (MySQL 8.0+)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS weathergpt_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE weathergpt_db;

-- 1. Locations Table (Master Registry of geocoded meteorological stations / cities)
CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    state_name VARCHAR(100) DEFAULT NULL,
    country VARCHAR(10) DEFAULT 'IN',
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    elevation_meters DECIMAL(8, 2) DEFAULT NULL,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_city (city_name),
    INDEX idx_coords (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Weather Queries Log Table (Analytical tracking of user inquiries)
CREATE TABLE IF NOT EXISTS weather_queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    location_name VARCHAR(150) NOT NULL,
    query_type VARCHAR(50) NOT NULL DEFAULT 'current',
    raw_query TEXT,
    detected_intent VARCHAR(50) DEFAULT 'weather_general',
    language VARCHAR(10) DEFAULT 'en',
    response_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session (session_id),
    INDEX idx_intent (detected_intent),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Chat History Table (Conversational turns for WeatherGPT AI Chatbot)
CREATE TABLE IF NOT EXISTS chat_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    role ENUM('user', 'assistant') NOT NULL,
    message TEXT NOT NULL,
    intent VARCHAR(50) DEFAULT NULL,
    language VARCHAR(10) DEFAULT 'en',
    location_name VARCHAR(150) DEFAULT NULL,
    metadata JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_chat_session (session_id),
    INDEX idx_chat_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Saved Locations Table (User bookmarked cities for quick dashboard access)
CREATE TABLE IF NOT EXISTS saved_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL DEFAULT 'default_user',
    city_name VARCHAR(100) NOT NULL,
    state_name VARCHAR(100) DEFAULT NULL,
    country VARCHAR(10) DEFAULT 'IN',
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    notes VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_saved_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Weather Alerts Log Table (Disaster Management Warning & Advisory Register)
CREATE TABLE IF NOT EXISTS weather_alerts_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(150) NOT NULL,
    alert_type VARCHAR(50) NOT NULL, -- 'HEAVY_RAIN', 'CYCLONE', 'HEATWAVE', 'THUNDERSTORM', 'COLDWAVE', 'FLOOD_WATCH'
    severity_level ENUM('Normal', 'Advisory', 'Warning', 'Severe') NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    advisory_details TEXT,
    valid_from DATETIME DEFAULT CURRENT_TIMESTAMP,
    valid_to DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_alert_location (location_name),
    INDEX idx_alert_severity (severity_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Climate & Historical Records Table (Multi-year climate and reanalysis indicators)
CREATE TABLE IF NOT EXISTS climate_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    avg_temp_c DECIMAL(5, 2) NOT NULL,
    max_temp_c DECIMAL(5, 2) NOT NULL,
    min_temp_c DECIMAL(5, 2) NOT NULL,
    total_rainfall_mm DECIMAL(7, 2) NOT NULL,
    anomaly_c DECIMAL(4, 2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_city_year_month (city_name, year, month),
    INDEX idx_climate_city (city_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Agricultural Advisory Catalog (Agro-meteorology reference templates)
CREATE TABLE IF NOT EXISTS agricultural_advisories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crop_category VARCHAR(100) NOT NULL,
    season VARCHAR(50) NOT NULL, -- 'Kharif', 'Rabi', 'Zaid', 'All'
    condition_trigger VARCHAR(100) NOT NULL,
    advisory_title VARCHAR(200) NOT NULL,
    advisory_body TEXT NOT NULL,
    action_required VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- SEED DATA
-- ==============================================================================

-- Seed Locations (Major Indian Meteorological Hubs)
INSERT INTO locations (city_name, state_name, country, latitude, longitude, elevation_meters) VALUES
('New Delhi', 'Delhi', 'IN', 28.6139, 77.2090, 216),
('Mumbai', 'Maharashtra', 'IN', 19.0760, 72.8777, 14),
('Chennai', 'Tamil Nadu', 'IN', 13.0827, 80.2707, 6),
('Kolkata', 'West Bengal', 'IN', 22.5726, 88.3639, 9),
('Bengaluru', 'Karnataka', 'IN', 12.9716, 77.5946, 920),
('Hyderabad', 'Telangana', 'IN', 17.3850, 78.4867, 542),
('Ahmedabad', 'Gujarat', 'IN', 23.0225, 72.5714, 53),
('Pune', 'Maharashtra', 'IN', 18.5204, 73.8567, 560),
('Jaipur', 'Rajasthan', 'IN', 26.9124, 75.7873, 431),
('Lucknow', 'Uttar Pradesh', 'IN', 26.8467, 80.9462, 123),
('Bhopal', 'Madhya Pradesh', 'IN', 23.2599, 77.4126, 500),
('Patna', 'Bihar', 'IN', 25.5941, 85.1376, 53),
('Bhubaneswar', 'Odisha', 'IN', 20.2961, 85.8245, 45),
('Guwahati', 'Assam', 'IN', 26.1445, 91.7362, 55),
('Thiruvananthapuram', 'Kerala', 'IN', 8.5241, 76.9366, 10),
('Shimla', 'Himachal Pradesh', 'IN', 31.1048, 77.1734, 2276),
('Srinagar', 'Jammu & Kashmir', 'IN', 34.0837, 74.7973, 1585),
('Visakhapatnam', 'Andhra Pradesh', 'IN', 17.6868, 83.2185, 45),
('Coimbatore', 'Tamil Nadu', 'IN', 11.0168, 76.9558, 411),
('Madurai', 'Tamil Nadu', 'IN', 9.9252, 78.1198, 101)
ON DUPLICATE KEY UPDATE city_name=city_name;

-- Seed Default Saved Locations
INSERT INTO saved_locations (session_id, city_name, state_name, country, latitude, longitude, is_default, notes) VALUES
('default_user', 'New Delhi', 'Delhi', 'IN', 28.6139, 77.2090, TRUE, 'National Capital Region IMD HQ'),
('default_user', 'Chennai', 'Tamil Nadu', 'IN', 13.0827, 80.2707, FALSE, 'Regional Meteorological Centre South'),
('default_user', 'Mumbai', 'Maharashtra', 'IN', 19.0760, 72.8777, FALSE, 'Coastal Meteorological Centre West'),
('default_user', 'Bengaluru', 'Karnataka', 'IN', 12.9716, 77.5946, FALSE, 'Deccan Plateau Hub')
ON DUPLICATE KEY UPDATE city_name=city_name;

-- Seed Agricultural Advisories
INSERT INTO agricultural_advisories (crop_category, season, condition_trigger, advisory_title, advisory_body, action_required) VALUES
('Paddy / Rice', 'Kharif', 'Heavy Rain (>50mm)', 'Drain Excess Field Water to Prevent Seedling Submergence', 'Maintain proper drainage channels in low-lying paddy nurseries to prevent water stagnation and root rot.', 'Open field bund outlets and suspend fertilizer broadcast.'),
('Cotton & Pulses', 'Kharif', 'High Humidity (>80%) + Warm Temp', 'Monitor for Sucking Pests & Fungal Leaf Blight', 'Extended high humidity promotes whitefly and fungal infection in cotton and pulse crops.', 'Apply bio-fungicides during dry breaks; avoid aerial spraying during strong wind.'),
('Wheat & Mustard', 'Rabi', 'Dry Spell & Rising Temperature', 'Schedule Light Furrow Irrigation', 'Ensure crown root initiation stage receives adequate soil moisture to protect tillering.', 'Apply light evening irrigation; avoid over-flooding.'),
('Vegetables & Horticulture', 'All', 'High Wind Speed (>35 km/h)', 'Provide Staking Support to Vine and Fruit Crops', 'Gusty winds can lodge tall crops like banana, tomato, and papaya plants.', 'Secure bamboo stakes and postpone pesticide spraying.'),
('All Crops', 'All', 'Extreme Heatwave (Temp >40°C)', 'Mulching and Frequent Micro-Irrigation', 'High evapotranspiration causes rapid soil moisture depletion and wilting.', 'Apply straw/plastic mulch and run drip irrigation in early morning or late evening.')
ON DUPLICATE KEY UPDATE advisory_title=advisory_title;

-- Seed Sample Historical Climate Records (New Delhi, Chennai, Mumbai, Bengaluru, Kolkata)
INSERT INTO climate_records (city_name, year, month, avg_temp_c, max_temp_c, min_temp_c, total_rainfall_mm, anomaly_c) VALUES
-- New Delhi Historical Months
('New Delhi', 2021, 1, 14.2, 21.4, 7.1, 19.5, -0.4),
('New Delhi', 2021, 4, 31.8, 38.6, 22.0, 11.2, +1.2),
('New Delhi', 2021, 7, 32.1, 36.5, 27.2, 235.0, +0.6),
('New Delhi', 2021, 10, 26.5, 33.1, 19.8, 48.0, -0.2),
('New Delhi', 2022, 1, 13.8, 20.1, 6.8, 25.0, -0.8),
('New Delhi', 2022, 4, 35.2, 42.1, 24.5, 0.5, +2.8),
('New Delhi', 2022, 7, 31.5, 35.8, 26.9, 286.0, +0.2),
('New Delhi', 2022, 10, 26.0, 32.5, 19.1, 128.0, +0.4),
('New Delhi', 2023, 1, 15.0, 22.3, 7.8, 14.0, +0.2),
('New Delhi', 2023, 4, 30.5, 37.2, 21.4, 32.0, -0.5),
('New Delhi', 2023, 7, 31.0, 35.0, 26.5, 384.0, +1.1),
('New Delhi', 2023, 10, 26.2, 33.0, 19.4, 5.0, +0.1),
-- Chennai Historical Months
('Chennai', 2021, 1, 25.2, 29.8, 21.0, 85.0, +0.3),
('Chennai', 2021, 5, 33.5, 38.9, 28.1, 42.0, +0.5),
('Chennai', 2021, 11, 26.8, 29.5, 23.8, 520.0, +1.5),
('Chennai', 2022, 1, 24.8, 29.2, 20.5, 12.0, -0.1),
('Chennai', 2022, 5, 34.0, 39.5, 28.5, 18.0, +0.8),
('Chennai', 2022, 11, 27.1, 30.0, 24.0, 390.0, +0.7),
('Chennai', 2023, 1, 25.5, 30.1, 21.2, 5.0, +0.4),
('Chennai', 2023, 5, 34.8, 40.2, 29.0, 30.0, +1.2),
('Chennai', 2023, 11, 27.5, 30.4, 24.5, 460.0, +1.0)
ON DUPLICATE KEY UPDATE avg_temp_c=avg_temp_c;
