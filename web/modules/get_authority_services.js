import pool from "@/lib/db";

const DEFAULT_AUTHORITY_SERVICES = {
    // Central Board of Direct Taxes (2824)
    2824: [
        {
            id: 1,
            authority_id: 2824,
            name: "Monthly Income Tax Collection by State and Financial Year",
            description: "Provides state-wise monthly gross and net income tax collection records, breakdown across individual and corporate receipts in ₹ Crores.",
            endpoint: "/api/mock/income-tax-state-month",
            method: "GET",
            documentation: "Parameters: from (MMYYYY, e.g. 012025), to (MMYYYY, e.g. 122025), state (State Name, e.g. Maharashtra, or 'all'). Query returns amount (₹ Cr), corporate_tax, individual_tax, refunds_issued, date, and state."
        },
        {
            id: 2,
            authority_id: 2824,
            name: "State Direct Tax Collection Register",
            description: "Direct tax receipts, corporate tax breakdown, TDS remittance, and annual collection figures for Indian States and Union Territories.",
            endpoint: "/api/mock/income-tax-state-month",
            method: "GET",
            documentation: "Parameters: from (MMYYYY), to (MMYYYY), state (State Name or 'all'). Returns monthly amount in ₹ Crores."
        }
    ],

    // Ministry of Finance (2801)
    2801: [
        {
            id: 3,
            authority_id: 2801,
            name: "Monthly Income Tax & Direct Tax Receipts Register",
            description: "Direct tax revenue summaries, state-wise gross collection, corporate receipts and refunds.",
            endpoint: "/api/mock/income-tax-state-month",
            method: "GET",
            documentation: "Parameters: from (MMYYYY), to (MMYYYY), state (State Name or 'all')."
        }
    ],

    // Ministry of Education (2802) & UGC (2826)
    2802: [
        {
            id: 10,
            authority_id: 2802,
            name: "Central Universities Annual Enrollment, NIRF & Vacancy Directory",
            description: "Comprehensive statutory statistics of all Central Universities in India: NIRF rankings, UG/PG/PhD student enrollment, faculty vacancies, NAAC accreditations, and annual central grants in ₹ Crores.",
            endpoint: "/api/mock/central-universities",
            method: "GET",
            documentation: "Parameters: university (University Name, e.g. 'Delhi University' or 'JNU' or 'all'), state (State Name or 'all'), year (YYYY, e.g. 2025). Returns enrollment, faculty vacancy count, and grant allocation."
        },
        {
            id: 11,
            authority_id: 2802,
            name: "Higher Education Faculty Vacancies & Research Grants Register",
            description: "Faculty sanctioned posts, recruitment backlog, and central budget allocations across Central Universities.",
            endpoint: "/api/mock/central-universities",
            method: "GET",
            documentation: "Parameters: state (State Name or 'all'), year (YYYY)."
        }
    ],
    2826: [
        {
            id: 12,
            authority_id: 2826,
            name: "UGC Central Universities Database & Accreditation Registry",
            description: "University Grants Commission central institutions registry, NAAC ratings, and research scholar enrollment stats.",
            endpoint: "/api/mock/central-universities",
            method: "GET",
            documentation: "Parameters: university (University Name or 'all'), state (State Name or 'all'), year (YYYY)."
        }
    ],

    // National Highways Authority of India (2805) & MoRTH (2804)
    2805: [
        {
            id: 4,
            authority_id: 2805,
            name: "National Highway Construction & Capital Expenditure Tracker",
            description: "State-wise national highway capital expenditure, Bharatmala Pariyojana outlay, FASTag toll collections, and lane construction progress.",
            endpoint: "/api/mock/highway-expenditure",
            method: "GET",
            documentation: "Parameters: year (YYYY, e.g. 2025), state (State Name, e.g. Maharashtra, or 'all'). Returns expenditure in ₹ Crores, lane km, FASTag revenue, and physical progress."
        },
        {
            id: 13,
            authority_id: 2805,
            name: "FASTag Toll Plaza Collections & Corridor Outlays",
            description: "Corridor-level highway expenditure and electronic toll collections.",
            endpoint: "/api/mock/highway-expenditure",
            method: "GET",
            documentation: "Parameters: year (YYYY), state (State Name or 'all')."
        }
    ],
    2804: [
        {
            id: 5,
            authority_id: 2804,
            name: "National Highways & Road Transport Annual Outlay",
            description: "Central road infrastructure fund allocation, highway spending, and capital expenditure breakdown.",
            endpoint: "/api/mock/highway-expenditure",
            method: "GET",
            documentation: "Parameters: year (YYYY, e.g. 2025), state (State Name or 'all'). Returns capital expenditure in ₹ Crores."
        }
    ],

    // Indian Railways (2806)
    2806: [
        {
            id: 6,
            authority_id: 2806,
            name: "Indian Railways Capital Outlay, Electrification & Vande Bharat Fleet Tracker",
            description: "Zone-wise capital outlay in ₹ Crores, 100% track electrification progress (route km), Vande Bharat fleet operated, Amrit Bharat station redevelopments, and passenger safety budgets.",
            endpoint: "/api/mock/railway-infrastructure",
            method: "GET",
            documentation: "Parameters: zone (Railway Zone, e.g. 'NR', 'WR', 'CR', or 'all'), year (YYYY, e.g. 2025). Returns capital outlay in ₹ Cr, route km electrified, and fleet counts."
        },
        {
            id: 14,
            authority_id: 2806,
            name: "Amrit Bharat Station Redevelopment & Passenger Safety Outlay",
            description: "Station upgrades and track renewal investment records across all railway zones.",
            endpoint: "/api/mock/railway-infrastructure",
            method: "GET",
            documentation: "Parameters: zone (Zone Name or 'all'), year (YYYY)."
        }
    ],

    // Ministry of Health & Family Welfare (2803) & NHA (2827)
    2803: [
        {
            id: 15,
            authority_id: 2803,
            name: "Ayushman Bharat PM-JAY Hospitalization & Claims Settlement Register",
            description: "State-wise Ayushman Bharat PM-JAY cards issued (in Lakhs), authorized hospital admissions, total claim settlements in ₹ Crores, empaneled hospital counts, and AIIMS hospital capacities.",
            endpoint: "/api/mock/healthcare-infrastructure",
            method: "GET",
            documentation: "Parameters: state (State Name or Institute, e.g. 'Uttar Pradesh' or 'AIIMS New Delhi' or 'all'), year (YYYY, e.g. 2025)."
        },
        {
            id: 16,
            authority_id: 2803,
            name: "AIIMS Institutes Infrastructure & Bed Capacity Directory",
            description: "Central AIIMS institutes bed capacity, faculty strength, and annual patient footfall.",
            endpoint: "/api/mock/healthcare-infrastructure",
            method: "GET",
            documentation: "Parameters: state (Institute Name or 'all'), year (YYYY)."
        }
    ],
    2827: [
        {
            id: 17,
            authority_id: 2827,
            name: "National Health Authority PM-JAY Transaction Repository",
            description: "Real-time PM-JAY claims disbursal and hospital empanelment records.",
            endpoint: "/api/mock/healthcare-infrastructure",
            method: "GET",
            documentation: "Parameters: state (State Name or 'all'), year (YYYY)."
        }
    ],

    // Ministry of Agriculture and Farmers Welfare (2811)
    2811: [
        {
            id: 18,
            authority_id: 2811,
            name: "PM-KISAN DBT Disbursals, MSP Procurement & Crop Insurance Register",
            description: "State-wise PM-KISAN installment payments, beneficiary farmers (Lakhs), Direct Benefit Transfer amount in ₹ Crores, PM Fasal Bima Yojana claims, and MSP wheat/paddy procurement volume (LMT).",
            endpoint: "/api/mock/agriculture-pm-kisan",
            method: "GET",
            documentation: "Parameters: state (State Name, e.g. 'Uttar Pradesh' or 'all'), year (YYYY, e.g. 2025)."
        },
        {
            id: 19,
            authority_id: 2811,
            name: "Pradhan Mantri Fasal Bima Yojana & Soil Health Register",
            description: "Crop loss compensation disbursals and farmer beneficiary coverage.",
            endpoint: "/api/mock/agriculture-pm-kisan",
            method: "GET",
            documentation: "Parameters: state (State Name or 'all'), year (YYYY)."
        }
    ],

    // Ministry of New and Renewable Energy (2828) & Ministry of Power (2814)
    2828: [
        {
            id: 20,
            authority_id: 2828,
            name: "National Renewable Energy Installed Capacity & PM Surya Ghar Solar Registry",
            description: "State-wise installed solar capacity (MW), wind power capacity (MW), total renewable energy capacity, PM Surya Ghar Muft Bijli Yojana rooftop solar sanctions, and solar parks.",
            endpoint: "/api/mock/renewable-energy",
            method: "GET",
            documentation: "Parameters: state (State Name, e.g. 'Rajasthan', 'Gujarat', or 'all'), year (YYYY, e.g. 2025)."
        },
        {
            id: 21,
            authority_id: 2828,
            name: "PM Surya Ghar Rooftop Solar Sanctions & Green Corridor Outlay",
            description: "Rooftop solar subsidies disbursed and renewable energy grid investment.",
            endpoint: "/api/mock/renewable-energy",
            method: "GET",
            documentation: "Parameters: state (State Name or 'all'), year (YYYY)."
        }
    ],
    2814: [
        {
            id: 22,
            authority_id: 2814,
            name: "National Grid Power Generation & Clean Energy Capacity",
            description: "Installed power capacities, solar/wind generation, and interstate transmission.",
            endpoint: "/api/mock/renewable-energy",
            method: "GET",
            documentation: "Parameters: state (State Name or 'all'), year (YYYY)."
        }
    ],

    // Ministry of Electronics and Information Technology (2816) & Communications (2817)
    2816: [
        {
            id: 23,
            authority_id: 2816,
            name: "Digital India, UPI Monthly Transactions & Semiconductor Mission Ledger",
            description: "Monthly UPI transaction volume (Crore transactions), transaction value (₹ Lakh Cr), merchant payment share, DigiLocker registered users (Crores), BharatNet connectivity, and India Semiconductor Mission outlay.",
            endpoint: "/api/mock/digital-india-upi",
            method: "GET",
            documentation: "Parameters: month (Month name, e.g. 'December 2025' or 'all'), year (YYYY, e.g. 2025)."
        },
        {
            id: 24,
            authority_id: 2816,
            name: "India Semiconductor Mission & Digital Governance Outlays",
            description: "Semiconductor incentive disbursals, BharatNet fiber connections, and digital public infrastructure stats.",
            endpoint: "/api/mock/digital-india-upi",
            method: "GET",
            documentation: "Parameters: year (YYYY), month (Month name or 'all')."
        }
    ],
    2817: [
        {
            id: 25,
            authority_id: 2817,
            name: "BharatNet Rural Connectivity & Telecom Infrastructure",
            description: "Gram panchayats connected via optical fiber network and telecom outreach.",
            endpoint: "/api/mock/digital-india-upi",
            method: "GET",
            documentation: "Parameters: year (YYYY), month (Month or 'all')."
        }
    ],

    // Ministry of Rural Development (2809)
    2809: [
        {
            id: 7,
            authority_id: 2809,
            name: "MGNREGA Rural Employment & Wage Disbursal Register",
            description: "State-level MGNREGA person-days generated (Crores), total wages paid in ₹ Crores, average daily wage rate (₹/day), women participation percentage, and PMGSY road length completed (km).",
            endpoint: "/api/mock/rural-development-mgnrega",
            method: "GET",
            documentation: "Parameters: state (State Name, e.g. 'Bihar', 'Uttar Pradesh', or 'all'), year (YYYY, e.g. 2025)."
        },
        {
            id: 26,
            authority_id: 2809,
            name: "Pradhan Mantri Gram Sadak Yojana (PMGSY) Road Length Completed",
            description: "Rural road connectivity mileage and water conservation works created.",
            endpoint: "/api/mock/rural-development-mgnrega",
            method: "GET",
            documentation: "Parameters: state (State Name or 'all'), year (YYYY)."
        }
    ],

    // Ministry of Housing and Urban Affairs (2810) & CPWD (2823)
    2810: [
        {
            id: 8,
            authority_id: 2810,
            name: "Pradhan Mantri Awas Yojana (Urban) & Smart Cities Mission Register",
            description: "PMAY-Urban houses sanctioned and completed, central assistance released in ₹ Crores, Smart Cities Mission completed projects and funds utilized, and operational Metro Rail network length (km).",
            endpoint: "/api/mock/urban-housing-smartcities",
            method: "GET",
            documentation: "Parameters: state (State or City Name, e.g. 'Maharashtra', 'Delhi NCR', or 'all'), year (YYYY, e.g. 2025)."
        },
        {
            id: 27,
            authority_id: 2810,
            name: "Smart Cities Mission Fund Utilization & Metro Rail Tracker",
            description: "Urban infrastructure project completions, AMRUT water tap connections, and rapid transit mileage.",
            endpoint: "/api/mock/urban-housing-smartcities",
            method: "GET",
            documentation: "Parameters: state (State or City or 'all'), year (YYYY)."
        }
    ],
    2823: [
        {
            id: 28,
            authority_id: 2823,
            name: "CPWD Urban Infrastructure & Central Sanctions Registry",
            description: "Central government urban works, municipal infrastructure, and Smart Cities allocations.",
            endpoint: "/api/mock/urban-housing-smartcities",
            method: "GET",
            documentation: "Parameters: state (State or 'all'), year (YYYY)."
        }
    ]
};

export async function getAuthorityServices(authority_id) {
    const numericId = typeof authority_id === 'string' ? parseInt(authority_id, 10) : authority_id;

    // 1. Fetch from PostgreSQL database first when configured
    if (process.env.DATABASE_URL) {
        try {
            const result = await pool.query(
                `
                SELECT
                    id,
                    name,
                    description,
                    endpoint,
                    method,
                    documentation
                FROM authority_services
                WHERE authority_id = $1
                ORDER BY id
                `,
                [numericId]
            );

            if (result && result.rows && result.rows.length > 0) {
                return result.rows;
            }
        } catch (dbError) {
            console.warn("Database query failed in getAuthorityServices, using built-in authority services catalog:", dbError?.message);
        }
    }

    // 2. Fallback to built-in verified services catalog
    const services = DEFAULT_AUTHORITY_SERVICES[numericId] || DEFAULT_AUTHORITY_SERVICES[2824] || [];
    return services;
}