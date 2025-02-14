export async function fetchDeploymentDetails() {
    const username = "ajinkyamalhotra";
    const repo = "ajinkyamalhotra.github.io";
    const githubToken = "";

    const versionElement = document.getElementById("versionCount");
    const dateElement = document.getElementById("versionDate");
    const shaElement = document.getElementById("versionSHA");
    const deployerElement = document.getElementById("versionDeployer");

    let allDeployments = [];
    let page = 1;
    const perPage = 100;

    try {
        versionElement.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
        dateElement.innerHTML = "Fetching...";
        shaElement.innerHTML = "Fetching...";
        deployerElement.innerHTML = "Fetching...";

        const headers = githubToken ? { "Authorization": `token ${githubToken}` } : {};

        while (true) {
            const url = `https://api.github.com/repos/${username}/${repo}/deployments?page=${page}&per_page=${perPage}`;
            const response = await fetch(url, { headers });
            if (!response.ok) {
                throw new Error(`E: ${response.status} ${response.statusText}`);
            }
            const deployments = await response.json();
            if (deployments.length === 0) break;
            allDeployments = allDeployments.concat(deployments);
            page++;
        }

        if (allDeployments.length === 0) {
            throw new Error("No deployments found.");
        }

        const latestDeployment = allDeployments[0];
        const count = allDeployments.length;
        const deploymentDate = new Date(latestDeployment.created_at);
        const commitSHA = latestDeployment.sha || "Unknown";
        const deployer = latestDeployment.creator?.login || "Unknown";

        const options = {
            timeZone: "America/New_York",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        };
        const formattedDate = deploymentDate.toLocaleString("en-US", options);

        versionElement.innerHTML =
            `<span class="fancy-number">${count}</span>`;
        dateElement.innerHTML =
            `<span class="date-text">${formattedDate} EST</span>`;
        shaElement.innerHTML =
            `<span class="geek-text">${commitSHA}</span>`;
        deployerElement.innerHTML =
            `<span class="geek-text">${deployer}</span>`;
    } catch (error) {
        console.error("Error fetching deployments:", error);
        versionElement.innerHTML =
            `<span style="color: #ff4d4d;">N/A</span>`;
        dateElement.innerHTML =
            `<span style="color: #ff4d4d;">Unavailable</span>`;
        shaElement.innerHTML =
            `<span style="color: #ff4d4d;">Unknown</span>`;
        deployerElement.innerHTML =
            `<span style="color: #ff4d4d;">Unknown</span>`;
    }
}
