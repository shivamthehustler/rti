import pool from "./db";

// Global singleton in-memory history cache (persists across hot reloads)
const INITIAL_HISTORY = [
    {
        id: "hist-ayushman-1",
        query: "How many claims settled under Ayushman Bharat PM-JAY and AIIMS bed capacity in 2025?",
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        data: {
            status: "success",
            result: {
                is_relevant: true,
                is_sufficient: true,
                missing_points: null,
                report_data: [
                    {
                        type: "plain",
                        content: "National consolidated claims settled under Ayushman Bharat (PM-JAY) in 2025 reached ₹68,500 Crores across 29,800 empaneled hospitals. Apex AIIMS institutes report 100% tertiary care operational readiness."
                    },
                    {
                        type: "table",
                        title: "Ayushman Bharat (PM-JAY) & AIIMS Healthcare Statistics (2025)",
                        content: [
                            ["State / Institution", "Type", "Cards Issued (Lakh)", "Claims Settled (₹ Cr)", "Empaneled Hospitals", "Bed Capacity"],
                            ["Uttar Pradesh", "State / UT", "485.20", "8,420.00", "5,120", "-"],
                            ["Maharashtra", "State / UT", "392.80", "7,150.50", "4,210", "-"],
                            ["Gujarat", "State / UT", "268.40", "5,620.00", "3,180", "-"],
                            ["AIIMS New Delhi", "Apex Hospital", "-", "480.00", "1", "2,780"],
                            ["AIIMS Bhopal", "Apex Hospital", "-", "142.00", "1", "960"],
                            ["National PM-JAY Total", "All India", "3,420.00", "68,500.00", "29,800", "-"]
                        ]
                    }
                ]
            }
        }
    },
    {
        id: "hist-edu-1",
        query: "What are the NIRF rankings and faculty vacancies in Central Universities in 2025?",
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        data: {
            status: "success",
            result: {
                is_relevant: true,
                is_sufficient: true,
                missing_points: null,
                report_data: [
                    {
                        type: "plain",
                        content: "Central Universities statutory disclosure shows top NIRF performance and annual central grants. Jawaharlal Nehru University (JNU) is ranked #2 and Delhi University (DU) is ranked #6 in NIRF."
                    },
                    {
                        type: "table",
                        title: "Central Universities Academic & Vacancy Register (2025)",
                        content: [
                            ["University", "State", "NIRF Rank", "Total Enrollment", "Vacant Faculty", "Grant (₹ Cr)", "NAAC Grade"],
                            ["Jawaharlal Nehru University (JNU)", "Delhi", "2", "9,400", "188", "540.20", "A++"],
                            ["Jamia Millia Islamia (JMI)", "Delhi", "3", "24,500", "215", "610.80", "A++"],
                            ["Banaras Hindu University (BHU)", "Uttar Pradesh", "5", "36,200", "520", "980.40", "A+"],
                            ["University of Delhi (DU)", "Delhi", "6", "198,500", "412", "1,120.50", "A++"],
                            ["Aligarh Muslim University (AMU)", "Uttar Pradesh", "9", "34,100", "395", "865.00", "A+"],
                            ["University of Hyderabad (UoH)", "Telangana", "10", "5,800", "94", "395.60", "A++"]
                        ]
                    }
                ]
            }
        }
    },
    {
        id: "hist-tax-1",
        query: "How much income tax was collected from Maharashtra in 2025?",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        data: {
            status: "success",
            result: {
                is_relevant: true,
                is_sufficient: true,
                missing_points: null,
                report_data: [
                    {
                        type: "plain",
                        content: "The total gross direct tax collected from Maharashtra in 2025 reached ₹6,80,980 Crores across corporate and individual tax receipts."
                    },
                    {
                        type: "table",
                        title: "Monthly Direct Tax Receipts - Maharashtra (2025)",
                        content: [
                            ["Month Date", "Gross Amount (₹ Cr)", "Corporate Tax (₹ Cr)", "Individual Tax (₹ Cr)", "Refunds (₹ Cr)"],
                            ["2025-01-15", "48,520", "28,100", "20,420", "4,120"],
                            ["2025-03-15", "72,400", "44,200", "28,200", "6,200"],
                            ["2025-06-15", "68,900", "41,800", "27,100", "5,800"],
                            ["2025-09-15", "74,800", "46,200", "28,600", "6,400"],
                            ["2025-12-15", "79,500", "49,800", "29,700", "6,900"]
                        ]
                    }
                ]
            }
        }
    },
    {
        id: "hist-highway-1",
        query: "How much was spent on national highways in 2025?",
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        data: {
            status: "success",
            result: {
                is_relevant: true,
                is_sufficient: true,
                missing_points: null,
                report_data: [
                    {
                        type: "plain",
                        content: "Total consolidated capital expenditure on National Highways under Bharatmala Pariyojana in 2025 was ₹2,78,000 Crores with 13,500 lane km constructed and ₹64,800 Crores collected in FASTag toll revenues."
                    },
                    {
                        type: "table",
                        title: "State-wise National Highway Allocations & Progress (2025)",
                        content: [
                            ["State", "Capex (₹ Cr)", "Lane Km Constructed", "FASTag Toll (₹ Cr)", "Major Corridor"],
                            ["National Consolidated", "278,000", "13,500", "64,800", "Bharatmala Expressway Grid"],
                            ["Maharashtra", "28,400", "1,420", "7,450", "Samruddhi & Coastal Corridor"],
                            ["Uttar Pradesh", "26,100", "1,380", "6,820", "Ganga & Purvanchal Grid"],
                            ["Gujarat", "19,800", "980", "5,120", "Delhi-Mumbai Expressway Sector"],
                            ["Rajasthan", "18,500", "1,120", "4,890", "Amritsar-Jamnagar Corridor"]
                        ]
                    }
                ]
            }
        }
    },
    {
        id: "hist-rail-1",
        query: "What is the capital outlay and Vande Bharat fleet of Indian Railways in 2025?",
        created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        data: {
            status: "success",
            result: {
                is_relevant: true,
                is_sufficient: true,
                missing_points: null,
                report_data: [
                    {
                        type: "plain",
                        content: "Indian Railways operated 136 Vande Bharat train sets with 99.2% electrified route mileage and ₹2,52,000 Crores in capital outlay in 2025."
                    },
                    {
                        type: "table",
                        title: "Indian Railways Zonal Outlays & Fleet Operations (2025)",
                        content: [
                            ["Railway Zone", "Headquarters", "Capital Outlay (₹ Cr)", "Electrified Route (km)", "Vande Bharat Sets", "Stations Redeveloped"],
                            ["National Consolidated", "New Delhi", "252,000", "64,500", "136", "508"],
                            ["Northern Railway (NR)", "New Delhi", "29,400", "7,120", "24", "68"],
                            ["Western Railway (WR)", "Mumbai", "26,800", "6,450", "18", "52"],
                            ["Central Railway (CR)", "Mumbai", "25,100", "4,180", "16", "48"]
                        ]
                    }
                ]
            }
        }
    },
    {
        id: "hist-kisan-1",
        query: "How much DBT funds disbursed under PM-KISAN scheme in 2025?",
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        data: {
            status: "success",
            result: {
                is_relevant: true,
                is_sufficient: true,
                missing_points: null,
                report_data: [
                    {
                        type: "plain",
                        content: "Under PM-KISAN 18th & 19th Installments, ₹18,800 Crores was directly transferred to 940 Lakh beneficiary farmers across India in 2025."
                    },
                    {
                        type: "table",
                        title: "PM-KISAN DBT Disbursals & Beneficiaries (2025)",
                        content: [
                            ["State", "Beneficiary Farmers (Lakh)", "DBT Funds (₹ Cr)", "Crop Insurance Claims (₹ Cr)", "Paddy Procurement (LMT)"],
                            ["National Consolidated", "940.00", "18,800.00", "18,500.00", "520.00"],
                            ["Uttar Pradesh", "264.50", "5,290.00", "1,840.50", "54.20"],
                            ["Maharashtra", "118.20", "2,364.00", "3,210.00", "18.50"],
                            ["Madhya Pradesh", "92.40", "1,848.00", "2,450.00", "46.80"]
                        ]
                    }
                ]
            }
        }
    },
    {
        id: "hist-solar-1",
        query: "What is the installed solar and wind energy capacity in 2025?",
        created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        data: {
            status: "success",
            result: {
                is_relevant: true,
                is_sufficient: true,
                missing_points: null,
                report_data: [
                    {
                        type: "plain",
                        content: "Total national renewable energy capacity surpassed 1,65,000 MW in 2025, driven by Rajasthan (28,100 MW) and Gujarat (28,600 MW) alongside 9.5 Lakh PM Surya Ghar sanctions."
                    },
                    {
                        type: "table",
                        title: "Renewable Energy & PM Surya Ghar Installed Capacity (2025)",
                        content: [
                            ["State", "Solar Capacity (MW)", "Wind Capacity (MW)", "Total Renewable (MW)", "Surya Ghar Sanctions", "Subsidies (₹ Cr)"],
                            ["National Total", "94,000", "48,500", "165,000", "950,000", "6,800.00"],
                            ["Gujarat", "16,800", "11,400", "28,600", "198,000", "1,420.00"],
                            ["Rajasthan", "22,400", "5,180", "28,100", "84,500", "590.50"],
                            ["Tamil Nadu", "8,900", "10,800", "20,100", "92,000", "640.00"]
                        ]
                    }
                ]
            }
        }
    },
    {
        id: "hist-upi-1",
        query: "What was the total volume and value of UPI transactions in 2025?",
        created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        data: {
            status: "success",
            result: {
                is_relevant: true,
                is_sufficient: true,
                missing_points: null,
                report_data: [
                    {
                        type: "plain",
                        content: "Unified Payments Interface (UPI) processed 18,200 Crore transactions worth ₹255 Lakh Crores in 2025 with DigiLocker reaching 28.5 Crore registered citizens."
                    },
                    {
                        type: "table",
                        title: "Digital India & UPI Monthly Transaction Volumes (2025)",
                        content: [
                            ["Period", "UPI Volume (Cr Txns)", "UPI Value (₹ Lakh Cr)", "Merchant Share (%)", "DigiLocker Users (Cr)"],
                            ["Annual Total 2025", "18,200.00", "255.00", "60.2%", "28.50"],
                            ["December 2025", "1,680.00", "23.40", "61.2%", "28.50"],
                            ["November 2025", "1,620.00", "22.80", "60.8%", "27.90"],
                            ["October 2025", "1,658.00", "23.20", "62.0%", "27.40"]
                        ]
                    }
                ]
            }
        }
    },
    {
        id: "hist-mgnrega-1",
        query: "How many person-days generated and average daily wages under MGNREGA in 2025?",
        created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        data: {
            status: "success",
            result: {
                is_relevant: true,
                is_sufficient: true,
                missing_points: null,
                report_data: [
                    {
                        type: "plain",
                        content: "MGNREGA generated 285 Crore person-days with ₹86,000 Crores in statutory wage disbursals and 57.8% women participation in 2025."
                    },
                    {
                        type: "table",
                        title: "MGNREGA Rural Employment & Wage Statistics (2025)",
                        content: [
                            ["State", "Active Job Cards (Lakh)", "Person Days (Cr)", "Wages Paid (₹ Cr)", "Daily Wage (₹)", "Women Share (%)"],
                            ["National Consolidated", "1,420.00", "285.00", "86,000.00", "₹289", "57.8%"],
                            ["Tamil Nadu", "94.20", "32.80", "10,450.00", "₹319", "84.5%"],
                            ["Rajasthan", "112.50", "28.40", "7,420.00", "₹261", "67.2%"],
                            ["Uttar Pradesh", "184.00", "27.60", "6,980.00", "₹253", "39.8%"]
                        ]
                    }
                ]
            }
        }
    },
    {
        id: "hist-urban-1",
        query: "How many houses completed under PMAY Urban and Smart Cities funds in 2025?",
        created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        data: {
            status: "success",
            result: {
                is_relevant: true,
                is_sufficient: true,
                missing_points: null,
                report_data: [
                    {
                        type: "plain",
                        content: "Under Pradhan Mantri Awas Yojana (Urban), 96.5 Lakh houses were completed with ₹1,54,000 Crores released in central assistance and 980 km of operational metro rail."
                    },
                    {
                        type: "table",
                        title: "PMAY Urban & Smart Cities Infrastructure Progress (2025)",
                        content: [
                            ["State / Sector", "Houses Completed", "Central Assistance (₹ Cr)", "Smart Projects Done", "Metro Rail (km)"],
                            ["National Consolidated", "9,650,000", "154,000.00", "7,400", "980.0"],
                            ["Uttar Pradesh", "1,490,000", "22,100.00", "540", "118.0"],
                            ["Maharashtra", "980,000", "16,900.00", "510", "164.0"],
                            ["Gujarat", "920,000", "14,800.00", "480", "96.0"]
                        ]
                    }
                ]
            }
        }
    }
];

if (!globalThis.__FLASH_RTI_HISTORY__) {
    globalThis.__FLASH_RTI_HISTORY__ = [...INITIAL_HISTORY];
}

export function getInMemoryHistory() {
    return globalThis.__FLASH_RTI_HISTORY__;
}

export function getHistoryById(id) {
    const list = globalThis.__FLASH_RTI_HISTORY__;
    return list.find(h => String(h.id) === String(id));
}

export async function addHistoryEntry(query, data) {
    const newId = "hist-" + Date.now();
    const entry = {
        id: newId,
        query: query.trim(),
        data: data || {},
        created_at: new Date().toISOString()
    };

    // Filter out identical query and prepend
    globalThis.__FLASH_RTI_HISTORY__ = [
        entry,
        ...globalThis.__FLASH_RTI_HISTORY__.filter(h => h.query.toLowerCase() !== query.trim().toLowerCase())
    ].slice(0, 50);

    if (process.env.DATABASE_URL) {
        try {
            const res = await pool.query(
                "INSERT INTO user_history (query, data) VALUES ($1, $2) RETURNING id",
                [query.trim(), JSON.stringify(data || {})]
            );
            if (res && res.rows && res.rows[0]) {
                entry.id = res.rows[0].id;
            }
        } catch (dbErr) {
            console.warn("Database save history fallback:", dbErr?.message);
        }
    }

    return entry;
}
