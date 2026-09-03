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
