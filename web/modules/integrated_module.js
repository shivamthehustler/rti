import { identify_authority } from "@/modules/authority";
import { getAuthorityServices } from "@/modules/get_authority_services";
import { select_service } from "@/modules/api_selection";
import { getService } from "@/modules/get_service_data";
import { data_presentation } from "@/modules/presentation_module";
import pool from "@/lib/db";

async function saveHistoryToDb(query, data) {
    try {
        const res = await pool.query(
            "INSERT INTO user_history (query, data) VALUES ($1, $2) RETURNING id",
            [query, JSON.stringify(data)]
        );
        return res.rows[0].id;
    } catch (dbErr) {
        console.error("Error saving user history in database:", dbErr);
        return null;
    }
}

export async function integrated_module(query, onProgress) {
    const steps = [
        { text: "Identify concerned public authority", status: "default", estimated: 13 },
        { text: "Find available government data sources", status: "default", estimated: 5 },
        { text: "Select most relevant data source", status: "default", estimated: 14 },
        { text: "Retrieve necessary information the source", status: "default", estimated: 5 },
        { text: "Convert raw data to presentable form", status: "default", estimated: 60 },
    ];

    const notify = (step, status, details = null) => {
        if (steps[step]) {
            steps[step].status = status;
            if (status === "done" && steps[step + 1] && steps[step + 1].status === "default") {
                steps[step + 1].status = "working";
            }
        }
        if (onProgress) {
            onProgress(step, status, details);
        }
    };

    const saveAndReturn = async (result, isSuccess = true) => {
        const stepsCopy = steps.map(s => ({ ...s }));
        const historyId = await saveHistoryToDb(query, {
            status: isSuccess ? "success" : "error",
            steps: stepsCopy,
            result: isSuccess ? result : null,
            error: isSuccess ? null : (result?.message || String(result))
        });
        if (result && typeof result === "object") {
            result._history_id = historyId;
        }
        return result;
    };

    try {
        // 1. Identify concerned authority
        notify(0, "working");
        const authorityResult = await identify_authority(query);
        console.log("WORKFLOW_LOG : MODULE_1_END", authorityResult);

        const authorityData =
            typeof authorityResult === "string"
                ? JSON.parse(authorityResult)
                : authorityResult;

        // Query doesn't target Central Government
        if (authorityData.jurisdiction !== "center") {
            const errResult = {
                is_relevant: false,
                is_sufficient: false,
                missing_points: "That doesn't come under Government of India",
                report_data: []
            };
            notify(0, "error", errResult);
            return await saveAndReturn(errResult);
        }

        // No authority identified
        if (!authorityData.authority) {
            const errResult = {
                is_relevant: false,
                is_sufficient: false,
                missing_points: "Could not find Concerned Public Authority",
                report_data: []
            };
            notify(0, "error", errResult);
            return await saveAndReturn(errResult);
        }

        const authority_id = authorityData.authority.id;
        notify(0, "done", authorityData);

        // 2. Fetch services from the authority
        notify(1, "working");
        const services = await getAuthorityServices(authority_id);
        console.log("WORKFLOW_LOG : MODULE_2_END", services);

        if (services.length === 0) {
            const errResult = {
                is_relevant: false,
                is_sufficient: false,
                missing_points: "No data apis available from Authority",
                report_data: []
            };
            notify(1, "error", errResult);
            return await saveAndReturn(errResult);
        }
        notify(1, "done", services);

        // 3. Select relevant service
        notify(2, "working");
        const serviceResult = await select_service(
            services,
            query
        );
        console.log("WORKFLOW_LOG : MODULE_3_END", serviceResult);

        const serviceData =
            typeof serviceResult === "string"
                ? JSON.parse(serviceResult)
                : serviceResult;

        // No suitable service
        if (!serviceData.service) {
            const errResult = {
                is_relevant: false,
                is_sufficient: false,
                missing_points: "No available service can provide the requested information.",
                report_data: []
            };
            notify(2, "error", errResult);
            return await saveAndReturn(errResult);
        }

        const { endpoint } = serviceData.service;

        if (!endpoint) {
            throw new Error("Error : No endpoint available in selected service");
        }
        notify(2, "done", serviceData);

        // 4. Fetch actual data from selected service
        notify(3, "working");
        const data = await getService(endpoint);
        console.log("WORKFLOW_LOG : MODULE_4_END", data);
        notify(3, "done", data);

        // 5. Present fetched data according to user query
        notify(4, "working");
        const report = await data_presentation(data, query);
        console.log("WORKFLOW_LOG : MODULE_5_END", report);
        notify(4, "done", report);

        return await saveAndReturn(report);
    } catch (error) {
        console.error("Error in integrated_module:", error);
        // Find which step is currently working and flag as error
        const stepsOnError = steps.map(s =>
            s.status === "working" ? { ...s, status: "error" } : s
        );

        try {
            const historyId = await saveHistoryToDb(query, {
                status: "error",
                steps: stepsOnError,
                result: null,
                error: error.message || "Error occurred while agents working"
            });
            error.historyId = historyId;
        } catch (dbErr) {
            console.error("Failed to save error state to history:", dbErr);
        }

        throw error;
    }
}