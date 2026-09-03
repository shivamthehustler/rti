-- ====================================================================
-- FLASH RTI - 10 SECTORS GOVERNMENT OF INDIA MOCK DATABASE & SERVICES SEED
-- ====================================================================

-- 0. Authority Services Catalog Table
CREATE TABLE IF NOT EXISTS authority_services (
    id SERIAL PRIMARY KEY,
    authority_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) DEFAULT 'GET',
    documentation TEXT
);

-- 1. Sector 1: Central Universities & Higher Education (Ministry of Education / UGC)
CREATE TABLE IF NOT EXISTS central_universities (
    id SERIAL PRIMARY KEY,
    university VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL DEFAULT 2025,
    nirf_rank INTEGER,
    total_enrollment INTEGER,
    ug_students INTEGER,
    pg_students INTEGER,
    phd_scholars INTEGER,
    sanctioned_faculty INTEGER,
    vacant_faculty_posts INTEGER,
    annual_central_grant_cr NUMERIC(10, 2),
    naac_grade VARCHAR(10)
);

-- 2. Sector 2: National Highways & Road Infrastructure (MoRTH / NHAI)
CREATE TABLE IF NOT EXISTS highway_expenditure (
    id SERIAL PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL DEFAULT 2025,
    capital_expenditure_cr NUMERIC(12, 2),
    lane_km_constructed INTEGER,
    fastag_toll_collection_cr NUMERIC(10, 2),
    scheme VARCHAR(255)
);

-- 3. Sector 3: Direct Taxes & Revenue Collection (CBDT / Ministry of Finance)
CREATE TABLE IF NOT EXISTS income_tax_collection (
    id SERIAL PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    corporate_tax NUMERIC(12, 2),
    individual_tax NUMERIC(12, 2),
    refunds_issued NUMERIC(12, 2)
);

-- 4. Sector 4: Indian Railways Infrastructure (Ministry of Railways)
CREATE TABLE IF NOT EXISTS railway_infrastructure (
    id SERIAL PRIMARY KEY,
    zone VARCHAR(100) NOT NULL,
    headquarters VARCHAR(100),
    year INTEGER NOT NULL DEFAULT 2025,
    capital_outlay_cr NUMERIC(12, 2),
    electrified_route_km INTEGER,
    electrification_percentage NUMERIC(5, 2),
    vande_bharat_trains_operated INTEGER,
    amrit_bharat_stations_redeveloped INTEGER,
    safety_and_track_renewal_cr NUMERIC(10, 2),
    passenger_footfall_crore NUMERIC(10, 2)
);

-- 5. Sector 5: Healthcare & Ayushman Bharat (MoHFW / NHA / AIIMS)
CREATE TABLE IF NOT EXISTS healthcare_infrastructure (
    id SERIAL PRIMARY KEY,
    state_or_institute VARCHAR(150) NOT NULL,
    type VARCHAR(50),
    year INTEGER NOT NULL DEFAULT 2025,
    ayushman_cards_issued_lakh NUMERIC(10, 2),
    authorized_hospital_admissions_lakh NUMERIC(10, 2),
    claims_settled_amount_cr NUMERIC(12, 2),
    empaneled_hospitals_total INTEGER,
    public_hospitals_empaneled INTEGER,
    private_hospitals_empaneled INTEGER,
    active_pmjay_claims_percentage NUMERIC(5, 2),
    bed_capacity INTEGER,
    opd_patients_annual_lakh NUMERIC(10, 2),
    sanctioned_faculty INTEGER
);

-- 6. Sector 6: Agriculture & PM-KISAN (Ministry of Agriculture)
CREATE TABLE IF NOT EXISTS agriculture_pm_kisan (
    id SERIAL PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL DEFAULT 2025,
    installment_period VARCHAR(100),
    beneficiary_farmers_lakh NUMERIC(10, 2),
    dbt_funds_disbursed_cr NUMERIC(12, 2),
    pm_fasal_bima_claims_cr NUMERIC(10, 2),
    paddy_procurement_lmt NUMERIC(10, 2),
    wheat_procurement_lmt NUMERIC(10, 2),
    soil_health_cards_issued_lakh NUMERIC(10, 2)
);

-- 7. Sector 7: Renewable Energy & Solar (MNRE / Ministry of Power)
CREATE TABLE IF NOT EXISTS renewable_energy (
    id SERIAL PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL DEFAULT 2025,
    installed_solar_mw NUMERIC(10, 2),
    installed_wind_mw NUMERIC(10, 2),
    total_renewable_mw NUMERIC(10, 2),
    rooftop_solar_applications_sanctioned INTEGER,
    pm_surya_ghar_subsidy_cr NUMERIC(10, 2),
    major_solar_parks TEXT,
    green_energy_corridor_investment_cr NUMERIC(10, 2)
);

-- 8. Sector 8: Digital India, UPI & IT (MeitY)
CREATE TABLE IF NOT EXISTS digital_india_upi (
    id SERIAL PRIMARY KEY,
    month VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL DEFAULT 2025,
    upi_volume_crore_transactions NUMERIC(10, 2),
    upi_value_lakh_cr NUMERIC(10, 2),
    p2m_merchant_share_percentage NUMERIC(5, 2),
    digilocker_registered_users_crore NUMERIC(10, 2),
    bharatnet_gram_panchayats_connected INTEGER,
    semiconductor_mission_outlay_cr NUMERIC(10, 2),
    cowin_ayushman_digital_accounts_cr NUMERIC(10, 2)
);

-- 9. Sector 9: Rural Development & MGNREGA (Ministry of Rural Development)
CREATE TABLE IF NOT EXISTS rural_development_mgnrega (
    id SERIAL PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL DEFAULT 2025,
    active_job_cards_lakh NUMERIC(10, 2),
    person_days_generated_cr NUMERIC(10, 2),
    total_wages_paid_cr NUMERIC(12, 2),
    average_daily_wage_rs INTEGER,
    women_participation_percentage NUMERIC(5, 2),
    pmgsy_road_length_completed_km INTEGER,
    water_conservation_works_completed INTEGER
);

-- 10. Sector 10: Urban Housing & Smart Cities (MoHUA)
CREATE TABLE IF NOT EXISTS urban_housing_smartcities (
    id SERIAL PRIMARY KEY,
    city_or_state VARCHAR(150) NOT NULL,
    year INTEGER NOT NULL DEFAULT 2025,
    pmay_houses_sanctioned INTEGER,
    pmay_houses_completed INTEGER,
    central_assistance_released_cr NUMERIC(12, 2),
    smart_cities_projects_completed INTEGER,
    smart_cities_funds_utilized_cr NUMERIC(12, 2),
    metro_operational_km NUMERIC(10, 2),
    amrut_tap_connections_lakh NUMERIC(10, 2)
);

-- History Table
CREATE TABLE IF NOT EXISTS user_history (
    id SERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- SEED DATA INSERTION
-- ====================================================================

-- Authority Services Seed
TRUNCATE TABLE authority_services RESTART IDENTITY;

INSERT INTO authority_services (authority_id, name, description, endpoint, method, documentation) VALUES
(2824, 'Monthly Income Tax Collection by State and Financial Year', 'State-wise monthly gross and net income tax collection records in ₹ Crores.', '/api/mock/income-tax-state-month', 'GET', 'Parameters: from, to, state'),
(2824, 'State Direct Tax Collection Register', 'Direct tax receipts, corporate tax breakdown, and TDS remittance figures.', '/api/mock/income-tax-state-month', 'GET', 'Parameters: from, to, state'),
(2801, 'Monthly Income Tax & Direct Tax Receipts Register', 'Direct tax revenue summaries, state-wise gross collection and refunds.', '/api/mock/income-tax-state-month', 'GET', 'Parameters: from, to, state'),
(2802, 'Central Universities Annual Enrollment, NIRF & Vacancy Directory', 'NIRF rankings, student enrollment, faculty vacancies, and annual central grants.', '/api/mock/central-universities', 'GET', 'Parameters: university, state, year'),
(2826, 'UGC Central Universities Database & Accreditation Registry', 'University Grants Commission central institutions registry and NAAC ratings.', '/api/mock/central-universities', 'GET', 'Parameters: university, state, year'),
(2805, 'National Highway Construction & Capital Expenditure Tracker', 'State-wise national highway capital expenditure, FASTag toll collections, and lane progress.', '/api/mock/highway-expenditure', 'GET', 'Parameters: year, state'),
(2804, 'National Highways & Road Transport Annual Outlay', 'Central road infrastructure fund allocation and highway spending.', '/api/mock/highway-expenditure', 'GET', 'Parameters: year, state'),
(2806, 'Indian Railways Capital Outlay, Electrification & Vande Bharat Fleet Tracker', 'Zone-wise capital outlay, track electrification, Vande Bharat fleet, and Amrit Bharat stations.', '/api/mock/railway-infrastructure', 'GET', 'Parameters: zone, year'),
(2803, 'Ayushman Bharat PM-JAY Hospitalization & Claims Settlement Register', 'PM-JAY cards issued, claims settled, empaneled hospitals, and AIIMS hospital capacities.', '/api/mock/healthcare-infrastructure', 'GET', 'Parameters: state, year'),
(2827, 'National Health Authority PM-JAY Transaction Repository', 'Real-time PM-JAY claims disbursal and hospital empanelment records.', '/api/mock/healthcare-infrastructure', 'GET', 'Parameters: state, year'),
(2811, 'PM-KISAN DBT Disbursals, MSP Procurement & Crop Insurance Register', 'PM-KISAN installment payments, DBT funds, Fasal Bima claims, and MSP procurement volume.', '/api/mock/agriculture-pm-kisan', 'GET', 'Parameters: state, year'),
(2828, 'National Renewable Energy Installed Capacity & PM Surya Ghar Solar Registry', 'Solar capacity, wind capacity, and PM Surya Ghar rooftop solar sanctions.', '/api/mock/renewable-energy', 'GET', 'Parameters: state, year'),
(2814, 'National Grid Power Generation & Clean Energy Capacity', 'Installed power capacities, solar/wind generation, and interstate transmission.', '/api/mock/renewable-energy', 'GET', 'Parameters: state, year'),
(2816, 'Digital India, UPI Monthly Transactions & Semiconductor Mission Ledger', 'Monthly UPI transaction volume, value, DigiLocker users, and India Semiconductor Mission outlay.', '/api/mock/digital-india-upi', 'GET', 'Parameters: month, year'),
(2809, 'MGNREGA Rural Employment & Wage Disbursal Register', 'MGNREGA person-days generated, total wages paid, average daily wage, and PMGSY road mileage.', '/api/mock/rural-development-mgnrega', 'GET', 'Parameters: state, year'),
(2810, 'Pradhan Mantri Awas Yojana (Urban) & Smart Cities Mission Register', 'PMAY-Urban houses sanctioned/completed, Smart Cities funds, and Metro Rail length.', '/api/mock/urban-housing-smartcities', 'GET', 'Parameters: state, year');

-- Central Universities Seed (Pre-sorted by NIRF rank ascending)
TRUNCATE TABLE central_universities RESTART IDENTITY;
INSERT INTO central_universities (university, state, year, nirf_rank, total_enrollment, ug_students, pg_students, phd_scholars, sanctioned_faculty, vacant_faculty_posts, annual_central_grant_cr, naac_grade) VALUES
('Jawaharlal Nehru University (JNU)', 'Delhi', 2025, 2, 9400, 1200, 3900, 4300, 914, 188, 540.20, 'A++'),
('Jamia Millia Islamia (JMI)', 'Delhi', 2025, 3, 24500, 15200, 6900, 2400, 994, 215, 610.80, 'A++'),
('Banaras Hindu University (BHU)', 'Uttar Pradesh', 2025, 5, 36200, 21500, 10400, 4300, 2110, 520, 980.40, 'A+'),
('University of Delhi (DU)', 'Delhi', 2025, 6, 198500, 142000, 48000, 8500, 1706, 412, 1120.50, 'A++'),
('Aligarh Muslim University (AMU)', 'Uttar Pradesh', 2025, 9, 34100, 20800, 9800, 3500, 1840, 395, 865.00, 'A+'),
('University of Hyderabad (UoH)', 'Telangana', 2025, 10, 5800, 1100, 3100, 1600, 512, 94, 395.60, 'A++'),
('Visva-Bharati University', 'West Bengal', 2025, 48, 9200, 5400, 2600, 1200, 685, 172, 340.50, 'A'),
('Pondicherry University', 'Puducherry', 2025, 68, 7400, 2900, 3300, 1200, 542, 126, 310.20, 'A'),
('Central University of Punjab', 'Punjab', 2025, 83, 3100, 400, 2100, 600, 265, 48, 185.40, 'A+'),
('Central University of Rajasthan', 'Rajasthan', 2025, 89, 3450, 650, 2200, 600, 280, 54, 192.00, 'A++');

-- Highway Expenditure Seed (Pre-sorted by capex descending)
TRUNCATE TABLE highway_expenditure RESTART IDENTITY;
INSERT INTO highway_expenditure (state, year, capital_expenditure_cr, lane_km_constructed, fastag_toll_collection_cr, scheme) VALUES
('National Consolidated', 2025, 278000.00, 13500, 64800.00, 'Bharatmala Pariyojana & Expressway Grid'),
('Maharashtra', 2025, 28400.00, 1420, 7450.00, 'Samruddhi & Coastal Expressway Corridor'),
('Uttar Pradesh', 2025, 26100.00, 1380, 6820.00, 'Ganga & Purvanchal Connectivity Grid'),
('Gujarat', 2025, 19800.00, 980, 5120.00, 'Delhi-Mumbai Expressway Gujarat Sector'),
('Rajasthan', 2025, 18500.00, 1120, 4890.00, 'Amritsar-Jamnagar Economic Corridor'),
('Karnataka', 2025, 17400.00, 910, 4780.00, 'Bengaluru-Mysuru Access Controlled Expansion'),
('Tamil Nadu', 2025, 16900.00, 890, 4620.00, 'Chennai-Bengaluru Expressway Link'),
('Madhya Pradesh', 2025, 15600.00, 830, 3840.00, 'Atal Pragathipath (Chambal Expressway)'),
('Bihar', 2025, 14200.00, 740, 2950.00, 'Ganga Bridge & Patna-Kolkata Expressway');

-- Railway Infrastructure Seed
TRUNCATE TABLE railway_infrastructure RESTART IDENTITY;
INSERT INTO railway_infrastructure (zone, headquarters, year, capital_outlay_cr, electrified_route_km, electrification_percentage, vande_bharat_trains_operated, amrit_bharat_stations_redeveloped, safety_and_track_renewal_cr, passenger_footfall_crore) VALUES
('Northern Railway (NR)', 'New Delhi', 2025, 29400.00, 7120, 99.40, 24, 42, 5800.00, 68.40),
('Western Railway (WR)', 'Mumbai', 2025, 26800.00, 6480, 98.90, 18, 36, 5100.00, 84.20),
('Central Railway (CR)', 'Mumbai CSMT', 2025, 25900.00, 4190, 100.00, 16, 38, 4950.00, 91.50),
('Southern Railway (SR)', 'Chennai', 2025, 21500.00, 5080, 99.10, 14, 32, 4200.00, 52.80),
('Eastern Railway (ER)', 'Kolkata', 2025, 19800.00, 2840, 100.00, 12, 28, 3900.00, 64.10),
('South Central Railway (SCR)', 'Secunderabad', 2025, 22400.00, 6310, 99.60, 14, 34, 4450.00, 46.20),
('National Indian Railways Consolidated', 'Rail Bhavan, New Delhi', 2025, 252000.00, 64500, 99.20, 136, 508, 48000.00, 720.00);

-- Healthcare Infrastructure Seed
TRUNCATE TABLE healthcare_infrastructure RESTART IDENTITY;
INSERT INTO healthcare_infrastructure (state_or_institute, type, year, ayushman_cards_issued_lakh, authorized_hospital_admissions_lakh, claims_settled_amount_cr, empaneled_hospitals_total, public_hospitals_empaneled, private_hospitals_empaneled, active_pmjay_claims_percentage, bed_capacity, opd_patients_annual_lakh, sanctioned_faculty) VALUES
('Uttar Pradesh', 'State / UT', 2025, 485.20, 62.40, 8420.00, 5120, 2840, 2280, 97.20, NULL, NULL, NULL),
('Maharashtra', 'State / UT', 2025, 392.80, 54.10, 7150.50, 4210, 2180, 2030, 98.40, NULL, NULL, NULL),
('Gujarat', 'State / UT', 2025, 268.40, 41.80, 5620.00, 3180, 1620, 1560, 98.80, NULL, NULL, NULL),
('Bihar', 'State / UT', 2025, 312.00, 38.60, 4890.20, 2640, 1590, 1050, 95.60, NULL, NULL, NULL),
('AIIMS New Delhi', 'Apex Autonomous Hospital', 2025, 0.00, 2.80, 480.00, 1, 1, 0, 99.90, 2780, 42.50, 750),
('AIIMS Bhopal', 'Apex Autonomous Hospital', 2025, 0.00, 0.95, 142.00, 1, 1, 0, 98.70, 960, 12.80, 310);

-- Agriculture PM-KISAN Seed
TRUNCATE TABLE agriculture_pm_kisan RESTART IDENTITY;
INSERT INTO agriculture_pm_kisan (state, year, installment_period, beneficiary_farmers_lakh, dbt_funds_disbursed_cr, pm_fasal_bima_claims_cr, paddy_procurement_lmt, wheat_procurement_lmt, soil_health_cards_issued_lakh) VALUES
('Uttar Pradesh', 2025, '18th & 19th Installment', 264.50, 5290.00, 1840.50, 54.20, 42.80, 14.50),
('Maharashtra', 2025, '18th & 19th Installment', 118.20, 2364.00, 3210.00, 18.50, 8.20, 9.80),
('Madhya Pradesh', 2025, '18th & 19th Installment', 92.40, 1848.00, 2450.00, 46.80, 71.50, 8.20),
('Punjab', 2025, '18th & 19th Installment', 22.40, 448.00, 310.00, 124.00, 121.50, 4.80),
('National PM-KISAN Consolidated', 2025, '18th & 19th Installment', 940.00, 18800.00, 18500.00, 520.00, 265.00, 88.00);

-- Renewable Energy Seed
TRUNCATE TABLE renewable_energy RESTART IDENTITY;
INSERT INTO renewable_energy (state, year, installed_solar_mw, installed_wind_mw, total_renewable_mw, rooftop_solar_applications_sanctioned, pm_surya_ghar_subsidy_cr, major_solar_parks, green_energy_corridor_investment_cr) VALUES
('Rajasthan', 2025, 22400.00, 5180.00, 28100.00, 84500, 590.50, 'Bhadla Solar Park, Fatehgarh Mega Park', 4200.00),
('Gujarat', 2025, 15600.00, 11400.00, 27800.00, 182000, 1240.00, 'Khavda Hybrid RE Park, Charanka Solar Park', 5100.00),
('Tamil Nadu', 2025, 8900.00, 10600.00, 21200.00, 76000, 530.00, 'Kamuthi Solar Facility', 3100.00),
('National Renewable Energy Total', 2025, 94000.00, 48500.00, 165000.00, 950000, 6800.00, 'All India Solar & Wind Hybrid Network', 28500.00);

-- Digital India UPI Seed
TRUNCATE TABLE digital_india_upi RESTART IDENTITY;
INSERT INTO digital_india_upi (month, year, upi_volume_crore_transactions, upi_value_lakh_cr, p2m_merchant_share_percentage, digilocker_registered_users_crore, bharatnet_gram_panchayats_connected, semiconductor_mission_outlay_cr, co_win_ayushman_digital_accounts_cr) VALUES
('December 2025', 2025, 1680.00, 23.40, 61.20, 28.50, 214000, 8900.00, 54.00),
('November 2025', 2025, 1620.00, 22.80, 60.80, 27.90, 212500, 8200.00, 53.20),
('October 2025', 2025, 1658.00, 23.20, 62.00, 27.40, 211000, 7600.00, 52.60),
('Annual Consolidated 2025', 2025, 18200.00, 255.00, 60.20, 28.50, 214000, 76000.00, 54.00);

-- Rural Development Seed
TRUNCATE TABLE rural_development_mgnrega RESTART IDENTITY;
INSERT INTO rural_development_mgnrega (state, year, active_job_cards_lakh, person_days_generated_cr, total_wages_paid_cr, average_daily_wage_rs, women_participation_percentage, pmgsy_road_length_completed_km, water_conservation_works_completed) VALUES
('Bihar', 2025, 162.50, 24.80, 6150.00, 245, 54.20, 3420, 48500),
('Uttar Pradesh', 2025, 198.00, 31.20, 7920.00, 254, 42.80, 4180, 62100),
('Tamil Nadu', 2025, 94.20, 32.80, 10450.00, 319, 84.50, 1980, 36500),
('National MGNREGA Consolidated', 2025, 1420.00, 285.00, 86000.00, 289, 57.80, 38500, 680000);

-- Urban Housing Seed
TRUNCATE TABLE urban_housing_smartcities RESTART IDENTITY;
INSERT INTO urban_housing_smartcities (city_or_state, year, pmay_houses_sanctioned, pmay_houses_completed, central_assistance_released_cr, smart_cities_projects_completed, smart_cities_funds_utilized_cr, metro_operational_km, amrut_tap_connections_lakh) VALUES
('Maharashtra', 2025, 1480000, 1240000, 18450.00, 485, 7920.00, 142.50, 38.40),
('Uttar Pradesh', 2025, 1760000, 1490000, 22100.00, 540, 8650.00, 118.00, 46.20),
('Delhi NCR', 2025, 320000, 285000, 4200.00, 180, 3100.00, 393.00, 16.50),
('National Urban Infrastructure Consolidated', 2025, 11800000, 9650000, 154000.00, 7400, 74500.00, 980.00, 310.00);
