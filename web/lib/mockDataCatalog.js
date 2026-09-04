import pool from "./db.js";

// ==============================================================================
// 1. NATIONAL HIGHWAY INFRASTRUCTURE & EXPENDITURE
// ==============================================================================
export const HIGHWAY_DATA = [
  { state: "National Consolidated", year: 2025, capital_expenditure_cr: 278000, lane_km_constructed: 13500, fastag_toll_collection_cr: 64800, scheme: "Bharatmala Pariyojana & Expressway Grid" },
  { state: "Maharashtra", year: 2025, capital_expenditure_cr: 28400, lane_km_constructed: 1420, fastag_toll_collection_cr: 7450, scheme: "Samruddhi & Coastal Expressway Corridor" },
  { state: "Uttar Pradesh", year: 2025, capital_expenditure_cr: 26100, lane_km_constructed: 1380, fastag_toll_collection_cr: 6820, scheme: "Ganga & Purvanchal Connectivity Grid" },
  { state: "Gujarat", year: 2025, capital_expenditure_cr: 19800, lane_km_constructed: 980, fastag_toll_collection_cr: 5120, scheme: "Delhi-Mumbai Expressway Gujarat Sector" },
  { state: "Rajasthan", year: 2025, capital_expenditure_cr: 18500, lane_km_constructed: 1120, fastag_toll_collection_cr: 4890, scheme: "Amritsar-Jamnagar Economic Corridor" },
  { state: "Karnataka", year: 2025, capital_expenditure_cr: 17400, lane_km_constructed: 910, fastag_toll_collection_cr: 4780, scheme: "Bengaluru-Mysuru Access Controlled Expansion" },
  { state: "Tamil Nadu", year: 2025, capital_expenditure_cr: 16900, lane_km_constructed: 890, fastag_toll_collection_cr: 4620, scheme: "Chennai-Bengaluru Expressway Link" },
  { state: "Madhya Pradesh", year: 2025, capital_expenditure_cr: 15600, lane_km_constructed: 830, fastag_toll_collection_cr: 3840, scheme: "Atal Pragathipath (Chambal Expressway)" },
  { state: "Bihar", year: 2025, capital_expenditure_cr: 14200, lane_km_constructed: 740, fastag_toll_collection_cr: 2950, scheme: "Ganga Bridge & Patna-Kolkata Expressway" },
  { state: "Andhra Pradesh", year: 2025, capital_expenditure_cr: 13800, lane_km_constructed: 710, fastag_toll_collection_cr: 3410, scheme: "Visakhapatnam-Chennai Industrial Corridor" },
  { state: "West Bengal", year: 2025, capital_expenditure_cr: 12400, lane_km_constructed: 640, fastag_toll_collection_cr: 3120, scheme: "Kolkata-Siliguri Highway Upgrade" }
];

export async function getHighwayData({ year = "2025", state = "all" } = {}) {
  if (process.env.DATABASE_URL) {
    try {
      const query = `
        SELECT state, year, capital_expenditure_cr, lane_km_constructed, fastag_toll_collection_cr, scheme
        FROM highway_expenditure
        WHERE (LOWER($1) = 'all' OR LOWER(state) LIKE '%' || LOWER($1) || '%')
          AND (LOWER($2) = 'all' OR CAST(year AS TEXT) = $2)
        ORDER BY capital_expenditure_cr DESC
      `;
      const result = await pool.query(query, [state, year]);
      if (result?.rows?.length > 0) return result.rows;
    } catch (dbErr) {
      console.warn("Postgres query failed in getHighwayData, using fallback dataset:", dbErr?.message);
    }
  }

  const filtered = HIGHWAY_DATA.filter((item) => {
    const matchesYear = year.toLowerCase() === "all" || String(item.year) === String(year);
    const matchesState = state.toLowerCase() === "all" || item.state.toLowerCase().includes(state.toLowerCase());
    return matchesYear && matchesState;
  });

  return (filtered.length > 0 ? filtered : HIGHWAY_DATA).sort((a, b) => (b.capital_expenditure_cr || 0) - (a.capital_expenditure_cr || 0));
}

// ==============================================================================
// 2. CENTRAL UNIVERSITIES & NIRF RANKING
// ==============================================================================
export const CENTRAL_UNIVERSITIES_DATA = [
  { university: "Jawaharlal Nehru University (JNU)", state: "Delhi", year: 2025, nirf_rank: 2, total_enrollment: 9400, ug_students: 1200, pg_students: 3900, phd_scholars: 4300, sanctioned_faculty: 914, vacant_faculty_posts: 188, annual_central_grant_cr: 540.2, naac_grade: "A++" },
  { university: "Jamia Millia Islamia (JMI)", state: "Delhi", year: 2025, nirf_rank: 3, total_enrollment: 24500, ug_students: 15200, pg_students: 6900, phd_scholars: 2400, sanctioned_faculty: 994, vacant_faculty_posts: 215, annual_central_grant_cr: 610.8, naac_grade: "A++" },
  { university: "Banaras Hindu University (BHU)", state: "Uttar Pradesh", year: 2025, nirf_rank: 5, total_enrollment: 36200, ug_students: 21500, pg_students: 10400, phd_scholars: 4300, sanctioned_faculty: 2110, vacant_faculty_posts: 520, annual_central_grant_cr: 980.4, naac_grade: "A+" },
  { university: "University of Delhi (DU)", state: "Delhi", year: 2025, nirf_rank: 6, total_enrollment: 198500, ug_students: 142000, pg_students: 48000, phd_scholars: 8500, sanctioned_faculty: 1706, vacant_faculty_posts: 412, annual_central_grant_cr: 1120.5, naac_grade: "A++" },
  { university: "Aligarh Muslim University (AMU)", state: "Uttar Pradesh", year: 2025, nirf_rank: 9, total_enrollment: 34100, ug_students: 20800, pg_students: 9800, phd_scholars: 3500, sanctioned_faculty: 1840, vacant_faculty_posts: 395, annual_central_grant_cr: 865.0, naac_grade: "A+" },
  { university: "University of Hyderabad (UoH)", state: "Telangana", year: 2025, nirf_rank: 10, total_enrollment: 5800, ug_students: 1100, pg_students: 3100, phd_scholars: 1600, sanctioned_faculty: 512, vacant_faculty_posts: 94, annual_central_grant_cr: 395.6, naac_grade: "A++" },
  { university: "Visva-Bharati University", state: "West Bengal", year: 2025, nirf_rank: 48, total_enrollment: 9200, ug_students: 5400, pg_students: 2600, phd_scholars: 1200, sanctioned_faculty: 685, vacant_faculty_posts: 172, annual_central_grant_cr: 340.5, naac_grade: "A" },
  { university: "Pondicherry University", state: "Puducherry", year: 2025, nirf_rank: 68, total_enrollment: 7400, ug_students: 2900, pg_students: 3300, phd_scholars: 1200, sanctioned_faculty: 542, vacant_faculty_posts: 126, annual_central_grant_cr: 310.2, naac_grade: "A" },
  { university: "Central University of Punjab", state: "Punjab", year: 2025, nirf_rank: 83, total_enrollment: 3100, ug_students: 400, pg_students: 2100, phd_scholars: 600, sanctioned_faculty: 265, vacant_faculty_posts: 48, annual_central_grant_cr: 185.4, naac_grade: "A+" },
  { university: "Central University of Rajasthan", state: "Rajasthan", year: 2025, nirf_rank: 89, total_enrollment: 3450, ug_students: 650, pg_students: 2200, phd_scholars: 600, sanctioned_faculty: 280, vacant_faculty_posts: 54, annual_central_grant_cr: 192.0, naac_grade: "A++" },
  { university: "Central University of Karnataka", state: "Karnataka", year: 2025, nirf_rank: 104, total_enrollment: 2900, ug_students: 550, pg_students: 1850, phd_scholars: 500, sanctioned_faculty: 250, vacant_faculty_posts: 62, annual_central_grant_cr: 176.8, naac_grade: "A" },
  { university: "Central University of Kerala", state: "Kerala", year: 2025, nirf_rank: 112, total_enrollment: 2650, ug_students: 350, pg_students: 1800, phd_scholars: 500, sanctioned_faculty: 240, vacant_faculty_posts: 51, annual_central_grant_cr: 168.3, naac_grade: "A" }
];

export async function getCentralUniversitiesData({ university = "all", state = "all", year = "2025" } = {}) {
  if (process.env.DATABASE_URL) {
    try {
      const query = `
        SELECT nirf_rank, university, state, year, total_enrollment, ug_students, pg_students, phd_scholars, sanctioned_faculty, vacant_faculty_posts, annual_central_grant_cr, naac_grade
        FROM central_universities
        WHERE (LOWER($1) = 'all' OR LOWER(state) LIKE LOWER($1) || '%')
          AND (LOWER($2) = 'all' OR LOWER(university) LIKE '%' || LOWER($2) || '%')
          AND (LOWER($3) = 'all' OR CAST(year AS TEXT) = $3)
        ORDER BY nirf_rank ASC
      `;
      const result = await pool.query(query, [state, university, year]);
      if (result?.rows?.length > 0) return result.rows;
    } catch (dbErr) {
      console.warn("Postgres query failed in getCentralUniversitiesData:", dbErr?.message);
    }
  }

  const filtered = CENTRAL_UNIVERSITIES_DATA.filter((item) => {
    const matchState = state.toLowerCase() === "all" || item.state.toLowerCase().includes(state.toLowerCase());
    const matchUniv = university.toLowerCase() === "all" || item.university.toLowerCase().includes(university.toLowerCase());
    const matchYear = year.toLowerCase() === "all" || String(item.year) === String(year);
    return matchState && matchUniv && matchYear;
  });

  return (filtered.length > 0 ? filtered : CENTRAL_UNIVERSITIES_DATA).sort((a, b) => (a.nirf_rank || 999) - (b.nirf_rank || 999));
}

// ==============================================================================
// 3. INCOME TAX & DIRECT TAX REVENUE
// ==============================================================================
export const TAX_DATA = [
  { state: "Maharashtra", date: "2025-01-15", amount: 48520, corporate_tax: 28100, individual_tax: 20420, refunds_issued: 4120 },
  { state: "Maharashtra", date: "2025-02-15", amount: 46210, corporate_tax: 26800, individual_tax: 19410, refunds_issued: 3890 },
  { state: "Maharashtra", date: "2025-03-15", amount: 72400, corporate_tax: 44200, individual_tax: 28200, refunds_issued: 6200 },
  { state: "Maharashtra", date: "2025-04-15", amount: 42150, corporate_tax: 23900, individual_tax: 18250, refunds_issued: 3400 },
  { state: "Maharashtra", date: "2025-05-15", amount: 44300, corporate_tax: 25100, individual_tax: 19200, refunds_issued: 3650 },
  { state: "Maharashtra", date: "2025-06-15", amount: 68900, corporate_tax: 41800, individual_tax: 27100, refunds_issued: 5800 },
  { state: "Maharashtra", date: "2025-07-15", amount: 49200, corporate_tax: 28400, individual_tax: 20800, refunds_issued: 4200 },
  { state: "Maharashtra", date: "2025-08-15", amount: 51000, corporate_tax: 29800, individual_tax: 21200, refunds_issued: 4350 },
  { state: "Maharashtra", date: "2025-09-15", amount: 74800, corporate_tax: 46200, individual_tax: 28600, refunds_issued: 6400 },
  { state: "Maharashtra", date: "2025-10-15", amount: 53200, corporate_tax: 31000, individual_tax: 22200, refunds_issued: 4500 },
  { state: "Maharashtra", date: "2025-11-15", amount: 50800, corporate_tax: 29500, individual_tax: 21300, refunds_issued: 4300 },
  { state: "Maharashtra", date: "2025-12-15", amount: 79500, corporate_tax: 49800, individual_tax: 29700, refunds_issued: 6900 },
  { state: "Delhi", date: "2025-01-15", amount: 21300, corporate_tax: 12400, individual_tax: 8900, refunds_issued: 1800 },
  { state: "Delhi", date: "2025-02-15", amount: 19800, corporate_tax: 11500, individual_tax: 8300, refunds_issued: 1650 },
  { state: "Delhi", date: "2025-03-15", amount: 33400, corporate_tax: 20100, individual_tax: 13300, refunds_issued: 2800 },
  { state: "Delhi", date: "2025-06-15", amount: 29500, corporate_tax: 17800, individual_tax: 11700, refunds_issued: 2450 },
  { state: "Delhi", date: "2025-09-15", amount: 34100, corporate_tax: 20800, individual_tax: 13300, refunds_issued: 2900 },
  { state: "Delhi", date: "2025-12-15", amount: 36800, corporate_tax: 22500, individual_tax: 14300, refunds_issued: 3100 },
  { state: "Karnataka", date: "2025-01-15", amount: 19400, corporate_tax: 11200, individual_tax: 8200, refunds_issued: 1620 },
  { state: "Karnataka", date: "2025-03-15", amount: 29800, corporate_tax: 18100, individual_tax: 11700, refunds_issued: 2500 },
  { state: "Karnataka", date: "2025-09-15", amount: 31200, corporate_tax: 19200, individual_tax: 12000, refunds_issued: 2650 },
  { state: "Karnataka", date: "2025-12-15", amount: 34500, corporate_tax: 21400, individual_tax: 13100, refunds_issued: 2900 },
  { state: "Tamil Nadu", date: "2025-01-15", amount: 14200, corporate_tax: 8400, individual_tax: 5800, refunds_issued: 1180 },
  { state: "Tamil Nadu", date: "2025-03-15", amount: 22100, corporate_tax: 13400, individual_tax: 8700, refunds_issued: 1850 },
  { state: "Tamil Nadu", date: "2025-09-15", amount: 23400, corporate_tax: 14300, individual_tax: 9100, refunds_issued: 1950 },
  { state: "Gujarat", date: "2025-01-15", amount: 12800, corporate_tax: 7900, individual_tax: 4900, refunds_issued: 1050 },
  { state: "Gujarat", date: "2025-03-15", amount: 19400, corporate_tax: 12200, individual_tax: 7200, refunds_issued: 1600 },
  { state: "Gujarat", date: "2025-09-15", amount: 20500, corporate_tax: 13100, individual_tax: 7400, refunds_issued: 1700 },
  { state: "Uttar Pradesh", date: "2025-01-15", amount: 9600, corporate_tax: 4800, individual_tax: 4800, refunds_issued: 780 },
  { state: "Uttar Pradesh", date: "2025-03-15", amount: 14800, corporate_tax: 7900, individual_tax: 6900, refunds_issued: 1200 },
  { state: "All India Consolidated", date: "2025-12-31", amount: 2180000, corporate_tax: 1140000, individual_tax: 1040000, refunds_issued: 185000 }
];

export async function getIncomeTaxData({ from = "012025", to = "122025", state = "all" } = {}) {
  const fromDate = from && from.length === 6 ? `${from.slice(2)}-${from.slice(0, 2)}-01` : "2025-01-01";
  const toDate = to && to.length === 6 ? `${to.slice(2)}-${to.slice(0, 2)}-31` : "2025-12-31";

  if (process.env.DATABASE_URL) {
    try {
      const query = `
        SELECT amount, date, state, corporate_tax, individual_tax, refunds_issued
        FROM income_tax_collection
        WHERE date >= $1 AND date <= $2
          ${state.toLowerCase() === "all" ? "" : "AND LOWER(state) LIKE '%' || LOWER($3) || '%'"}
        ORDER BY date ASC, state ASC
      `;
      const values = state.toLowerCase() === "all" ? [fromDate, toDate] : [fromDate, toDate, state];
      const result = await pool.query(query, values);
      if (result?.rows?.length > 0) return result.rows;
    } catch (dbErr) {
      console.warn("Postgres query failed in getIncomeTaxData:", dbErr?.message);
    }
  }

  const filtered = TAX_DATA.filter((item) => {
    const matchesDate = item.date >= fromDate && item.date <= toDate;
    const matchesState = state.toLowerCase() === "all" || item.state.toLowerCase().includes(state.toLowerCase());
    return matchesDate && matchesState;
  });

  return filtered.length > 0 ? filtered : TAX_DATA.filter(d => d.state === "Maharashtra");
}

// ==============================================================================
// 4. INDIAN RAILWAYS & VANDE BHARAT
// ==============================================================================
export const RAILWAY_DATA = [
  { zone: "National Indian Railways Consolidated", headquarters: "Rail Bhavan, New Delhi", year: 2025, capital_outlay_cr: 252000, electrified_route_km: 64500, electrification_percentage: 99.2, vande_bharat_trains_operated: 136, amrit_bharat_stations_redeveloped: 508, safety_and_track_renewal_cr: 48000, passenger_footfall_crore: 720.0 },
  { zone: "Northern Railway (NR)", headquarters: "New Delhi", year: 2025, capital_outlay_cr: 29400, electrified_route_km: 7120, electrification_percentage: 99.4, vande_bharat_trains_operated: 24, amrit_bharat_stations_redeveloped: 68, safety_and_track_renewal_cr: 5800, passenger_footfall_crore: 112.0 },
  { zone: "Western Railway (WR)", headquarters: "Mumbai (Churchgate)", year: 2025, capital_outlay_cr: 26800, electrified_route_km: 6450, electrification_percentage: 99.8, vande_bharat_trains_operated: 18, amrit_bharat_stations_redeveloped: 52, safety_and_track_renewal_cr: 5100, passenger_footfall_crore: 98.0 },
  { zone: "Central Railway (CR)", headquarters: "Mumbai (CSMT)", year: 2025, capital_outlay_cr: 25100, electrified_route_km: 4180, electrification_percentage: 100.0, vande_bharat_trains_operated: 16, amrit_bharat_stations_redeveloped: 48, safety_and_track_renewal_cr: 4900, passenger_footfall_crore: 104.0 },
  { zone: "Southern Railway (SR)", headquarters: "Chennai", year: 2025, capital_outlay_cr: 22400, electrified_route_km: 5080, electrification_percentage: 99.1, vande_bharat_trains_operated: 14, amrit_bharat_stations_redeveloped: 45, safety_and_track_renewal_cr: 4200, passenger_footfall_crore: 78.0 },
  { zone: "Eastern Railway (ER)", headquarters: "Kolkata (Fairlie Place)", year: 2025, capital_outlay_cr: 21800, electrified_route_km: 2840, electrification_percentage: 100.0, vande_bharat_trains_operated: 12, amrit_bharat_stations_redeveloped: 42, safety_and_track_renewal_cr: 4100, passenger_footfall_crore: 84.0 },
  { zone: "South Central Railway (SCR)", headquarters: "Secunderabad", year: 2025, capital_outlay_cr: 20500, electrified_route_km: 5890, electrification_percentage: 99.5, vande_bharat_trains_operated: 12, amrit_bharat_stations_redeveloped: 39, safety_and_track_renewal_cr: 3900, passenger_footfall_crore: 69.0 }
];

export async function getRailwayData({ zone = "all", year = "2025" } = {}) {
  if (process.env.DATABASE_URL) {
    try {
      const query = `
        SELECT zone, headquarters, year, capital_outlay_cr, electrified_route_km, electrification_percentage, vande_bharat_trains_operated, amrit_bharat_stations_redeveloped, safety_and_track_renewal_cr, passenger_footfall_crore
        FROM railway_infrastructure
        WHERE (LOWER($1) = 'all' OR LOWER(zone) LIKE '%' || LOWER($1) || '%')
          AND (LOWER($2) = 'all' OR CAST(year AS TEXT) = $2)
        ORDER BY capital_outlay_cr DESC
      `;
      const result = await pool.query(query, [zone, year]);
      if (result?.rows?.length > 0) return result.rows;
    } catch (dbErr) {
      console.warn("Postgres query failed in getRailwayData:", dbErr?.message);
    }
  }

  const filtered = RAILWAY_DATA.filter((item) => {
    const matchZone = zone.toLowerCase() === "all" || item.zone.toLowerCase().includes(zone.toLowerCase());
    const matchYear = year.toLowerCase() === "all" || String(item.year) === String(year);
    return matchZone && matchYear;
  });

  return (filtered.length > 0 ? filtered : RAILWAY_DATA).sort((a, b) => (b.capital_outlay_cr || 0) - (a.capital_outlay_cr || 0));
}

// ==============================================================================
// 5. HEALTHCARE & AYUSHMAN BHARAT
// ==============================================================================
export const HEALTHCARE_DATA = [
  { state_or_institute: "National Consolidated PM-JAY", type: "All India Summary", year: 2025, ayushman_cards_issued_lakh: 3420.0, authorized_hospital_admissions_lakh: 480.0, claims_settled_amount_cr: 68500.0, empaneled_hospitals_total: 29800, public_hospitals_empaneled: 16500, private_hospitals_empaneled: 13300, active_pmjay_claims_percentage: 98.1 },
  { state_or_institute: "Uttar Pradesh", type: "State / UT", year: 2025, ayushman_cards_issued_lakh: 485.2, authorized_hospital_admissions_lakh: 62.4, claims_settled_amount_cr: 8420.0, empaneled_hospitals_total: 5120, public_hospitals_empaneled: 2840, private_hospitals_empaneled: 2280, active_pmjay_claims_percentage: 97.2 },
  { state_or_institute: "Maharashtra", type: "State / UT", year: 2025, ayushman_cards_issued_lakh: 392.8, authorized_hospital_admissions_lakh: 54.1, claims_settled_amount_cr: 7150.5, empaneled_hospitals_total: 4210, public_hospitals_empaneled: 2180, private_hospitals_empaneled: 2030, active_pmjay_claims_percentage: 98.4 },
  { state_or_institute: "Tamil Nadu", type: "State / UT", year: 2025, ayushman_cards_issued_lakh: 298.0, authorized_hospital_admissions_lakh: 49.3, claims_settled_amount_cr: 6380.0, empaneled_hospitals_total: 3450, public_hospitals_empaneled: 1890, private_hospitals_empaneled: 1560, active_pmjay_claims_percentage: 99.1 },
  { state_or_institute: "Gujarat", type: "State / UT", year: 2025, ayushman_cards_issued_lakh: 268.4, authorized_hospital_admissions_lakh: 41.8, claims_settled_amount_cr: 5620.0, empaneled_hospitals_total: 3180, public_hospitals_empaneled: 1620, private_hospitals_empaneled: 1560, active_pmjay_claims_percentage: 98.8 },
  { state_or_institute: "Madhya Pradesh", type: "State / UT", year: 2025, ayushman_cards_issued_lakh: 364.5, authorized_hospital_admissions_lakh: 44.2, claims_settled_amount_cr: 5410.8, empaneled_hospitals_total: 2980, public_hospitals_empaneled: 1720, private_hospitals_empaneled: 1260, active_pmjay_claims_percentage: 96.9 },
  { state_or_institute: "Bihar", type: "State / UT", year: 2025, ayushman_cards_issued_lakh: 312.0, authorized_hospital_admissions_lakh: 38.6, claims_settled_amount_cr: 4890.2, empaneled_hospitals_total: 2640, public_hospitals_empaneled: 1590, private_hospitals_empaneled: 1050, active_pmjay_claims_percentage: 95.6 },
  { state_or_institute: "AIIMS New Delhi", type: "Apex Autonomous Hospital", year: 2025, ayushman_cards_issued_lakh: 0, authorized_hospital_admissions_lakh: 2.8, claims_settled_amount_cr: 480.0, empaneled_hospitals_total: 1, public_hospitals_empaneled: 1, private_hospitals_empaneled: 0, active_pmjay_claims_percentage: 99.9, bed_capacity: 2780, opd_patients_annual_lakh: 42.5, sanctioned_faculty: 750 },
  { state_or_institute: "AIIMS Bhopal", type: "Apex Autonomous Hospital", year: 2025, ayushman_cards_issued_lakh: 0, authorized_hospital_admissions_lakh: 0.95, claims_settled_amount_cr: 142.0, empaneled_hospitals_total: 1, public_hospitals_empaneled: 1, private_hospitals_empaneled: 0, active_pmjay_claims_percentage: 98.7, bed_capacity: 960, opd_patients_annual_lakh: 12.8, sanctioned_faculty: 310 },
  { state_or_institute: "AIIMS Patna", type: "Apex Autonomous Hospital", year: 2025, ayushman_cards_issued_lakh: 0, authorized_hospital_admissions_lakh: 0.88, claims_settled_amount_cr: 135.5, empaneled_hospitals_total: 1, public_hospitals_empaneled: 1, private_hospitals_empaneled: 0, active_pmjay_claims_percentage: 98.2, bed_capacity: 960, opd_patients_annual_lakh: 11.4, sanctioned_faculty: 295 }
];

export async function getHealthcareData({ state = "all", year = "2025" } = {}) {
  if (process.env.DATABASE_URL) {
    try {
      const query = `
        SELECT state_or_institute, type, year, ayushman_cards_issued_lakh, authorized_hospital_admissions_lakh, claims_settled_amount_cr, empaneled_hospitals_total, public_hospitals_empaneled, private_hospitals_empaneled, active_pmjay_claims_percentage
        FROM healthcare_infrastructure
        WHERE (LOWER($1) = 'all' OR LOWER(state_or_institute) LIKE '%' || LOWER($1) || '%')
          AND (LOWER($2) = 'all' OR CAST(year AS TEXT) = $2)
        ORDER BY claims_settled_amount_cr DESC
      `;
      const result = await pool.query(query, [state, year]);
      if (result?.rows?.length > 0) return result.rows;
    } catch (dbErr) {
      console.warn("Postgres query failed in getHealthcareData:", dbErr?.message);
    }
  }

  const filtered = HEALTHCARE_DATA.filter((item) => {
    const matchState = state.toLowerCase() === "all" || item.state_or_institute.toLowerCase().includes(state.toLowerCase());
    const matchYear = year.toLowerCase() === "all" || String(item.year) === String(year);
    return matchState && matchYear;
  });

  return (filtered.length > 0 ? filtered : HEALTHCARE_DATA).sort((a, b) => (b.claims_settled_amount_cr || 0) - (a.claims_settled_amount_cr || 0));
}

// ==============================================================================
// 6. AGRICULTURE & PM-KISAN DBT
// ==============================================================================
export const AGRICULTURE_DATA = [
  { state: "National PM-KISAN Consolidated", year: 2025, installment_period: "18th & 19th Installment", beneficiary_farmers_lakh: 940.0, dbt_funds_disbursed_cr: 18800.0, pm_fasal_bima_claims_cr: 18500.0, paddy_procurement_lmt: 520.0, wheat_procurement_lmt: 265.0, soil_health_cards_issued_lakh: 88.0 },
  { state: "Uttar Pradesh", year: 2025, installment_period: "18th & 19th Installment", beneficiary_farmers_lakh: 264.5, dbt_funds_disbursed_cr: 5290.0, pm_fasal_bima_claims_cr: 1840.5, paddy_procurement_lmt: 54.2, wheat_procurement_lmt: 42.8, soil_health_cards_issued_lakh: 14.5 },
  { state: "Maharashtra", year: 2025, installment_period: "18th & 19th Installment", beneficiary_farmers_lakh: 118.2, dbt_funds_disbursed_cr: 2364.0, pm_fasal_bima_claims_cr: 3210.0, paddy_procurement_lmt: 18.5, wheat_procurement_lmt: 8.2, soil_health_cards_issued_lakh: 9.8 },
  { state: "Madhya Pradesh", year: 2025, installment_period: "18th & 19th Installment", beneficiary_farmers_lakh: 92.4, dbt_funds_disbursed_cr: 1848.0, pm_fasal_bima_claims_cr: 2450.0, paddy_procurement_lmt: 46.8, wheat_procurement_lmt: 71.5, soil_health_cards_issued_lakh: 8.2 },
  { state: "Bihar", year: 2025, installment_period: "18th & 19th Installment", beneficiary_farmers_lakh: 84.6, dbt_funds_disbursed_cr: 1692.0, pm_fasal_bima_claims_cr: 620.0, paddy_procurement_lmt: 32.1, wheat_procurement_lmt: 1.8, soil_health_cards_issued_lakh: 6.4 },
  { state: "Rajasthan", year: 2025, installment_period: "18th & 19th Installment", beneficiary_farmers_lakh: 76.8, dbt_funds_disbursed_cr: 1536.0, pm_fasal_bima_claims_cr: 2180.0, paddy_procurement_lmt: 2.4, wheat_procurement_lmt: 23.6, soil_health_cards_issued_lakh: 7.1 },
  { state: "Andhra Pradesh", year: 2025, installment_period: "18th & 19th Installment", beneficiary_farmers_lakh: 48.2, dbt_funds_disbursed_cr: 964.0, pm_fasal_bima_claims_cr: 1120.0, paddy_procurement_lmt: 38.6, wheat_procurement_lmt: 0.0, soil_health_cards_issued_lakh: 5.2 },
  { state: "Punjab", year: 2025, installment_period: "18th & 19th Installment", beneficiary_farmers_lakh: 22.4, dbt_funds_disbursed_cr: 448.0, pm_fasal_bima_claims_cr: 310.0, paddy_procurement_lmt: 124.0, wheat_procurement_lmt: 121.5, soil_health_cards_issued_lakh: 4.8 },
  { state: "Haryana", year: 2025, installment_period: "18th & 19th Installment", beneficiary_farmers_lakh: 19.8, dbt_funds_disbursed_cr: 396.0, pm_fasal_bima_claims_cr: 890.0, paddy_procurement_lmt: 54.0, wheat_procurement_lmt: 69.2, soil_health_cards_issued_lakh: 3.9 }
];

export async function getAgricultureData({ state = "all", year = "2025" } = {}) {
  if (process.env.DATABASE_URL) {
    try {
      const query = `
        SELECT state, year, installment_period, beneficiary_farmers_lakh, dbt_funds_disbursed_cr, pm_fasal_bima_claims_cr, paddy_procurement_lmt, wheat_procurement_lmt, soil_health_cards_issued_lakh
        FROM agriculture_pm_kisan
        WHERE (LOWER($1) = 'all' OR LOWER(state) LIKE '%' || LOWER($1) || '%')
          AND (LOWER($2) = 'all' OR CAST(year AS TEXT) = $2)
        ORDER BY dbt_funds_disbursed_cr DESC
      `;
      const result = await pool.query(query, [state, year]);
      if (result?.rows?.length > 0) return result.rows;
    } catch (dbErr) {
      console.warn("Postgres query failed in getAgricultureData:", dbErr?.message);
    }
  }

  const filtered = AGRICULTURE_DATA.filter((item) => {
    const matchState = state.toLowerCase() === "all" || item.state.toLowerCase().includes(state.toLowerCase());
    const matchYear = year.toLowerCase() === "all" || String(item.year) === String(year);
    return matchState && matchYear;
  });

  return (filtered.length > 0 ? filtered : AGRICULTURE_DATA).sort((a, b) => (b.dbt_funds_disbursed_cr || 0) - (a.dbt_funds_disbursed_cr || 0));
}

// ==============================================================================
// 7. RENEWABLE ENERGY & PM SURYA GHAR
// ==============================================================================
export const RENEWABLE_ENERGY_DATA = [
  { state: "National Renewable Energy Total", year: 2025, installed_solar_mw: 94000, installed_wind_mw: 48500, total_renewable_mw: 165000, rooftop_solar_applications_sanctioned: 950000, pm_surya_ghar_subsidy_cr: 6800.0, major_solar_parks: "All India Solar & Wind Hybrid Network", green_energy_corridor_investment_cr: 28500.0 },
  { state: "Rajasthan", year: 2025, installed_solar_mw: 22400, installed_wind_mw: 5180, total_renewable_mw: 28100, rooftop_solar_applications_sanctioned: 84500, pm_surya_ghar_subsidy_cr: 590.5, major_solar_parks: "Bhadla Solar Park, Fatehgarh Mega Park", green_energy_corridor_investment_cr: 4850.0 },
  { state: "Gujarat", year: 2025, installed_solar_mw: 16800, installed_wind_mw: 11400, total_renewable_mw: 28600, rooftop_solar_applications_sanctioned: 198000, pm_surya_ghar_subsidy_cr: 1420.0, major_solar_parks: "Khavda Hybrid Renewable Energy Park", green_energy_corridor_investment_cr: 5200.0 },
  { state: "Tamil Nadu", year: 2025, installed_solar_mw: 8900, installed_wind_mw: 10800, total_renewable_mw: 20100, rooftop_solar_applications_sanctioned: 92000, pm_surya_ghar_subsidy_cr: 640.0, major_solar_parks: "Kamuthi Solar Power Project", green_energy_corridor_investment_cr: 3400.0 },
  { state: "Karnataka", year: 2025, installed_solar_mw: 11200, installed_wind_mw: 6200, total_renewable_mw: 17800, rooftop_solar_applications_sanctioned: 74000, pm_surya_ghar_subsidy_cr: 520.0, major_solar_parks: "Pavagada Solar Park", green_energy_corridor_investment_cr: 2900.0 },
  { state: "Maharashtra", year: 2025, installed_solar_mw: 7400, installed_wind_mw: 5400, total_renewable_mw: 13200, rooftop_solar_applications_sanctioned: 145000, pm_surya_ghar_subsidy_cr: 1040.0, major_solar_parks: "Sakri Solar Plant, Shirdi Solar Grid", green_energy_corridor_investment_cr: 3100.0 },
  { state: "Madhya Pradesh", year: 2025, installed_solar_mw: 6200, installed_wind_mw: 2800, total_renewable_mw: 9200, rooftop_solar_applications_sanctioned: 52000, pm_surya_ghar_subsidy_cr: 365.0, major_solar_parks: "Rewa Ultra Mega Solar Park", green_energy_corridor_investment_cr: 2200.0 }
];

export async function getRenewableEnergyData({ state = "all", year = "2025" } = {}) {
  if (process.env.DATABASE_URL) {
    try {
      const query = `
        SELECT state, year, installed_solar_mw, installed_wind_mw, total_renewable_mw, rooftop_solar_applications_sanctioned, pm_surya_ghar_subsidy_cr, major_solar_parks, green_energy_corridor_investment_cr
        FROM renewable_energy
        WHERE (LOWER($1) = 'all' OR LOWER(state) LIKE '%' || LOWER($1) || '%')
          AND (LOWER($2) = 'all' OR CAST(year AS TEXT) = $2)
        ORDER BY total_renewable_mw DESC
      `;
      const result = await pool.query(query, [state, year]);
      if (result?.rows?.length > 0) return result.rows;
    } catch (dbErr) {
      console.warn("Postgres query failed in getRenewableEnergyData:", dbErr?.message);
    }
  }

  const filtered = RENEWABLE_ENERGY_DATA.filter((item) => {
    const matchState = state.toLowerCase() === "all" || item.state.toLowerCase().includes(state.toLowerCase());
    const matchYear = year.toLowerCase() === "all" || String(item.year) === String(year);
    return matchState && matchYear;
  });

  return (filtered.length > 0 ? filtered : RENEWABLE_ENERGY_DATA).sort((a, b) => (b.total_renewable_mw || 0) - (a.total_renewable_mw || 0));
}

// ==============================================================================
// 8. DIGITAL INDIA & UPI TRANSACTIONS
// ==============================================================================
export const DIGITAL_INDIA_DATA = [
  { month: "December 2025", year: 2025, upi_volume_crore_transactions: 1680.0, upi_value_lakh_cr: 23.4, p2m_merchant_share_percentage: 61.2, digilocker_registered_users_crore: 28.5, bharatnet_gram_panchayats_connected: 214000, semiconductor_mission_outlay_cr: 8900.0, cowin_ayushman_digital_accounts_cr: 54.0 },
  { month: "November 2025", year: 2025, upi_volume_crore_transactions: 1620.0, upi_value_lakh_cr: 22.8, p2m_merchant_share_percentage: 60.8, digilocker_registered_users_crore: 27.9, bharatnet_gram_panchayats_connected: 212500, semiconductor_mission_outlay_cr: 8200.0, cowin_ayushman_digital_accounts_cr: 53.2 },
  { month: "October 2025", year: 2025, upi_volume_crore_transactions: 1658.0, upi_value_lakh_cr: 23.2, p2m_merchant_share_percentage: 62.0, digilocker_registered_users_crore: 27.4, bharatnet_gram_panchayats_connected: 211000, semiconductor_mission_outlay_cr: 7600.0, cowin_ayushman_digital_accounts_cr: 52.6 },
  { month: "September 2025", year: 2025, upi_volume_crore_transactions: 1540.0, upi_value_lakh_cr: 21.6, p2m_merchant_share_percentage: 59.8, digilocker_registered_users_crore: 26.8, bharatnet_gram_panchayats_connected: 209500, semiconductor_mission_outlay_cr: 7100.0, cowin_ayushman_digital_accounts_cr: 51.9 },
  { month: "June 2025", year: 2025, upi_volume_crore_transactions: 1480.0, upi_value_lakh_cr: 20.9, p2m_merchant_share_percentage: 59.1, digilocker_registered_users_crore: 25.6, bharatnet_gram_panchayats_connected: 206000, semiconductor_mission_outlay_cr: 6400.0, cowin_ayushman_digital_accounts_cr: 50.1 },
  { month: "March 2025", year: 2025, upi_volume_crore_transactions: 1420.0, upi_value_lakh_cr: 20.1, p2m_merchant_share_percentage: 58.4, digilocker_registered_users_crore: 24.5, bharatnet_gram_panchayats_connected: 202500, semiconductor_mission_outlay_cr: 5800.0, cowin_ayushman_digital_accounts_cr: 48.7 },
  { month: "January 2025", year: 2025, upi_volume_crore_transactions: 1350.0, upi_value_lakh_cr: 19.2, p2m_merchant_share_percentage: 57.9, digilocker_registered_users_crore: 23.8, bharatnet_gram_panchayats_connected: 200000, semiconductor_mission_outlay_cr: 5200.0, cowin_ayushman_digital_accounts_cr: 47.5 },
  { month: "Annual Consolidated 2025", year: 2025, upi_volume_crore_transactions: 18200.0, upi_value_lakh_cr: 255.0, p2m_merchant_share_percentage: 60.2, digilocker_registered_users_crore: 28.5, bharatnet_gram_panchayats_connected: 214000, semiconductor_mission_outlay_cr: 76000.0, cowin_ayushman_digital_accounts_cr: 54.0 }
];

export async function getDigitalIndiaData({ month = "all", year = "2025" } = {}) {
  if (process.env.DATABASE_URL) {
    try {
      const query = `
        SELECT month, year, upi_volume_crore_transactions, upi_value_lakh_cr, p2m_merchant_share_percentage, digilocker_registered_users_crore, bharatnet_gram_panchayats_connected, semiconductor_mission_outlay_cr, cowin_ayushman_digital_accounts_cr
        FROM digital_india_upi
        WHERE (LOWER($1) = 'all' OR LOWER(month) LIKE '%' || LOWER($1) || '%')
          AND (LOWER($2) = 'all' OR CAST(year AS TEXT) = $2)
        ORDER BY upi_volume_crore_transactions DESC
      `;
      const result = await pool.query(query, [month, year]);
      if (result?.rows?.length > 0) return result.rows;
    } catch (dbErr) {
      console.warn("Postgres query failed in getDigitalIndiaData:", dbErr?.message);
    }
  }

  const filtered = DIGITAL_INDIA_DATA.filter((item) => {
    const matchMonth = month.toLowerCase() === "all" || item.month.toLowerCase().includes(month.toLowerCase());
    const matchYear = year.toLowerCase() === "all" || String(item.year) === String(year);
    return matchMonth && matchYear;
  });

  return filtered.length > 0 ? filtered : DIGITAL_INDIA_DATA;
}

// ==============================================================================
// 9. RURAL DEVELOPMENT & MGNREGA
// ==============================================================================
export const RURAL_DEVELOPMENT_DATA = [
  { state: "National MGNREGA Consolidated", year: 2025, active_job_cards_lakh: 1420.0, person_days_generated_cr: 285.0, total_wages_paid_cr: 86000.0, average_daily_wage_rs: 289, women_participation_percentage: 57.8, pmgsy_road_length_completed_km: 38500, water_conservation_works_completed: 680000 },
  { state: "Tamil Nadu", year: 2025, active_job_cards_lakh: 94.2, person_days_generated_cr: 32.8, total_wages_paid_cr: 10450.0, average_daily_wage_rs: 319, women_participation_percentage: 84.5, pmgsy_road_length_completed_km: 1980, water_conservation_works_completed: 54000 },
  { state: "Rajasthan", year: 2025, active_job_cards_lakh: 112.5, person_days_generated_cr: 28.4, total_wages_paid_cr: 7420.0, average_daily_wage_rs: 261, women_participation_percentage: 67.2, pmgsy_road_length_completed_km: 2640, water_conservation_works_completed: 68000 },
  { state: "Uttar Pradesh", year: 2025, active_job_cards_lakh: 184.0, person_days_generated_cr: 27.6, total_wages_paid_cr: 6980.0, average_daily_wage_rs: 253, women_participation_percentage: 39.8, pmgsy_road_length_completed_km: 4120, water_conservation_works_completed: 82000 },
  { state: "Andhra Pradesh", year: 2025, active_job_cards_lakh: 88.6, person_days_generated_cr: 24.2, total_wages_paid_cr: 6940.0, average_daily_wage_rs: 287, women_participation_percentage: 59.4, pmgsy_road_length_completed_km: 1840, water_conservation_works_completed: 46000 },
  { state: "Bihar", year: 2025, active_job_cards_lakh: 126.4, person_days_generated_cr: 21.5, total_wages_paid_cr: 5375.0, average_daily_wage_rs: 250, women_participation_percentage: 54.1, pmgsy_road_length_completed_km: 3450, water_conservation_works_completed: 51000 },
  { state: "Madhya Pradesh", year: 2025, active_job_cards_lakh: 96.8, person_days_generated_cr: 19.8, total_wages_paid_cr: 4890.0, average_daily_wage_rs: 247, women_participation_percentage: 42.6, pmgsy_road_length_completed_km: 2980, water_conservation_works_completed: 58000 }
];

export async function getRuralDevelopmentData({ state = "all", year = "2025" } = {}) {
  if (process.env.DATABASE_URL) {
    try {
      const query = `
        SELECT state, year, active_job_cards_lakh, person_days_generated_cr, total_wages_paid_cr, average_daily_wage_rs, women_participation_percentage, pmgsy_road_length_completed_km, water_conservation_works_completed
        FROM rural_development_mgnrega
        WHERE (LOWER($1) = 'all' OR LOWER(state) LIKE '%' || LOWER($1) || '%')
          AND (LOWER($2) = 'all' OR CAST(year AS TEXT) = $2)
        ORDER BY person_days_generated_cr DESC
      `;
      const result = await pool.query(query, [state, year]);
      if (result?.rows?.length > 0) return result.rows;
    } catch (dbErr) {
      console.warn("Postgres query failed in getRuralDevelopmentData:", dbErr?.message);
    }
  }

  const filtered = RURAL_DEVELOPMENT_DATA.filter((item) => {
    const matchState = state.toLowerCase() === "all" || item.state.toLowerCase().includes(state.toLowerCase());
    const matchYear = year.toLowerCase() === "all" || String(item.year) === String(year);
    return matchState && matchYear;
  });

  return (filtered.length > 0 ? filtered : RURAL_DEVELOPMENT_DATA).sort((a, b) => (b.person_days_generated_cr || 0) - (a.person_days_generated_cr || 0));
}

// ==============================================================================
// 10. URBAN HOUSING (PMAY-U) & SMART CITIES
// ==============================================================================
export const URBAN_HOUSING_DATA = [
  { city_or_state: "National Urban Infrastructure Consolidated", year: 2025, pmay_houses_sanctioned: 11800000, pmay_houses_completed: 9650000, central_assistance_released_cr: 154000.0, smart_cities_projects_completed: 7400, smart_cities_funds_utilized_cr: 74500.0, metro_operational_km: 980.0, amrut_tap_connections_lakh: 310.0 },
  { city_or_state: "Uttar Pradesh", year: 2025, pmay_houses_sanctioned: 1760000, pmay_houses_completed: 1490000, central_assistance_released_cr: 22100.0, smart_cities_projects_completed: 540, smart_cities_funds_utilized_cr: 8650.0, metro_operational_km: 118.0, amrut_tap_connections_lakh: 42.5 },
  { city_or_state: "Gujarat", year: 2025, pmay_houses_sanctioned: 1040000, pmay_houses_completed: 920000, central_assistance_released_cr: 14800.0, smart_cities_projects_completed: 480, smart_cities_funds_utilized_cr: 7920.0, metro_operational_km: 96.0, amrut_tap_connections_lakh: 34.0 },
  { city_or_state: "Maharashtra", year: 2025, pmay_houses_sanctioned: 1280000, pmay_houses_completed: 980000, central_assistance_released_cr: 16900.0, smart_cities_projects_completed: 510, smart_cities_funds_utilized_cr: 8400.0, metro_operational_km: 164.0, amrut_tap_connections_lakh: 38.0 },
  { city_or_state: "Madhya Pradesh", year: 2025, pmay_houses_sanctioned: 950000, pmay_houses_completed: 820000, central_assistance_released_cr: 12400.0, smart_cities_projects_completed: 420, smart_cities_funds_utilized_cr: 6850.0, metro_operational_km: 36.0, amrut_tap_connections_lakh: 28.5 },
  { city_or_state: "Tamil Nadu", year: 2025, pmay_houses_sanctioned: 840000, pmay_houses_completed: 710000, central_assistance_released_cr: 11200.0, smart_cities_projects_completed: 460, smart_cities_funds_utilized_cr: 7100.0, metro_operational_km: 54.0, amrut_tap_connections_lakh: 26.0 },
  { city_or_state: "Rajasthan", year: 2025, pmay_houses_sanctioned: 620000, pmay_houses_completed: 530000, central_assistance_released_cr: 8600.0, smart_cities_projects_completed: 380, smart_cities_funds_utilized_cr: 5400.0, metro_operational_km: 12.0, amrut_tap_connections_lakh: 19.5 }
];

export async function getUrbanHousingData({ state = "all", year = "2025" } = {}) {
  if (process.env.DATABASE_URL) {
    try {
      const query = `
        SELECT city_or_state, year, pmay_houses_sanctioned, pmay_houses_completed, central_assistance_released_cr, smart_cities_projects_completed, smart_cities_funds_utilized_cr, metro_operational_km, amrut_tap_connections_lakh
        FROM urban_housing_smartcities
        WHERE (LOWER($1) = 'all' OR LOWER(city_or_state) LIKE '%' || LOWER($1) || '%')
          AND (LOWER($2) = 'all' OR CAST(year AS TEXT) = $2)
        ORDER BY central_assistance_released_cr DESC
      `;
      const result = await pool.query(query, [state, year]);
      if (result?.rows?.length > 0) return result.rows;
    } catch (dbErr) {
      console.warn("Postgres query failed in getUrbanHousingData:", dbErr?.message);
    }
  }

  const filtered = URBAN_HOUSING_DATA.filter((item) => {
    const matchState = state.toLowerCase() === "all" || item.city_or_state.toLowerCase().includes(state.toLowerCase());
    const matchYear = year.toLowerCase() === "all" || String(item.year) === String(year);
    return matchState && matchYear;
  });

  return (filtered.length > 0 ? filtered : URBAN_HOUSING_DATA).sort((a, b) => (b.central_assistance_released_cr || 0) - (a.central_assistance_released_cr || 0));
}

// ==============================================================================
// CENTRAL IN-PROCESS SERVICE RESOLVER
// ==============================================================================
export async function resolveMockService(endpoint) {
  if (!endpoint || typeof endpoint !== "string") {
    throw new Error("Invalid endpoint specified");
  }

  // Parse relative or full url
  const dummyBase = "http://localhost";
  const parsedUrl = new URL(endpoint.startsWith("/") ? endpoint : `/${endpoint}`, dummyBase);
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  if (pathname.includes("highway-expenditure")) {
    const year = searchParams.get("year") || "2025";
    const state = searchParams.get("state") || "all";
    return await getHighwayData({ year, state });
  }

  if (pathname.includes("central-universities")) {
    const university = searchParams.get("university") || "all";
    const state = searchParams.get("state") || "all";
    const year = searchParams.get("year") || "2025";
    return await getCentralUniversitiesData({ university, state, year });
  }

  if (pathname.includes("income-tax-state-month")) {
    const from = searchParams.get("from") || "012025";
    const to = searchParams.get("to") || "122025";
    const state = searchParams.get("state") || "all";
    return await getIncomeTaxData({ from, to, state });
  }

  if (pathname.includes("railway-infrastructure")) {
    const zone = searchParams.get("zone") || "all";
    const year = searchParams.get("year") || "2025";
    return await getRailwayData({ zone, year });
  }

  if (pathname.includes("healthcare-infrastructure")) {
    const state = searchParams.get("state") || searchParams.get("institute") || "all";
    const year = searchParams.get("year") || "2025";
    return await getHealthcareData({ state, year });
  }

  if (pathname.includes("agriculture-pm-kisan")) {
    const state = searchParams.get("state") || "all";
    const year = searchParams.get("year") || "2025";
    return await getAgricultureData({ state, year });
  }

  if (pathname.includes("renewable-energy")) {
    const state = searchParams.get("state") || "all";
    const year = searchParams.get("year") || "2025";
    return await getRenewableEnergyData({ state, year });
  }

  if (pathname.includes("digital-india-upi")) {
    const month = searchParams.get("month") || "all";
    const year = searchParams.get("year") || "2025";
    return await getDigitalIndiaData({ month, year });
  }

  if (pathname.includes("rural-development-mgnrega")) {
    const state = searchParams.get("state") || "all";
    const year = searchParams.get("year") || "2025";
    return await getRuralDevelopmentData({ state, year });
  }

  if (pathname.includes("urban-housing-smartcities")) {
    const state = searchParams.get("state") || "all";
    const year = searchParams.get("year") || "2025";
    return await getUrbanHousingData({ state, year });
  }

  // Fallback to national highway capex if unrecognized mock path
  return await getHighwayData({ year: "2025", state: "all" });
}
