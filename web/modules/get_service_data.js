// Safe allowlisted mock service endpoints
const ALLOWED_ENDPOINT_PREFIXES = [
    "/api/mock/agriculture-pm-kisan",
    "/api/mock/central-universities",
    "/api/mock/digital-india-upi",
    "/api/mock/healthcare-infrastructure",
    "/api/mock/highway-expenditure",
    "/api/mock/income-tax-state-month",
    "/api/mock/railway-infrastructure",
    "/api/mock/renewable-energy",
    "/api/mock/rural-development-mgnrega",
    "/api/mock/urban-housing-smartcities"
];

export async function getService(endpoint) {
    if (!endpoint || typeof endpoint !== "string") {
        throw new Error("Invalid endpoint specified");
    }

    let targetUrl;
    const base = process.env.NEXT_PUBLIC_APP_URL || 
                 (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
        targetUrl = new URL(endpoint);
        // SSRF Guard: Disallow external hostnames or metadata endpoints
        const baseUrl = new URL(base);
        if (targetUrl.hostname !== "localhost" && targetUrl.hostname !== "127.0.0.1" && targetUrl.hostname !== baseUrl.hostname) {
            throw new Error("Access to external or unapproved network destinations is forbidden");
        }
    } else {
        // Must be a relative path
        if (!endpoint.startsWith("/")) {
            throw new Error("Endpoint must be an absolute path starting with /");
        }
        targetUrl = new URL(endpoint, base);
    }

    // SSRF Guard: Ensure path is strictly within the allowed mock service paths
    const isAllowedPath = ALLOWED_ENDPOINT_PREFIXES.some(prefix => targetUrl.pathname.startsWith(prefix));
    if (!isAllowedPath) {
        throw new Error("Requested endpoint is not in the authorized service catalog");
    }

    console.log("Fetching verified service endpoint:", targetUrl.pathname + targetUrl.search);

    const response = await fetch(targetUrl.toString());

    if (!response.ok) {
        throw new Error(
            `Service request failed with status ${response.status}`
        );
    }

    return response.json();
}