export async function fetchDeploymentDetails() {
    const username = "ajinkyamalhotra";
    const repo = "ajinkyamalhotra.github.io";
    const githubToken = "";

    // Elements to update
    const versionElement = document.getElementById("versionCount");
    const dateElement = document.getElementById("versionDate");
    const shaElement = document.getElementById("versionSHA");
    const deployerElement = document.getElementById("versionDeployer");
    const starsElement = document.getElementById("repoStars");
    const forksElement = document.getElementById("repoForks");
    const issuesElement = document.getElementById("repoIssues");
    const prsElement = document.getElementById("repoPRs");

    let allDeployments = [];
    let page = 1;
    const perPage = 100;

    try {
        // Set initial loading state
        versionElement.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
        dateElement.innerHTML = "Fetching...";
        shaElement.innerHTML = "Fetching...";
        deployerElement.innerHTML = "Fetching...";
        starsElement.innerHTML = "Loading...";
        forksElement.innerHTML = "Loading...";
        issuesElement.innerHTML = "Loading...";
        prsElement.innerHTML = "Loading...";

        const headers = githubToken ? { "Authorization": `token ${githubToken}` } : {};

        // --- Fetch deployment details ---
        while (true) {
            const url = `https://api.github.com/repos/${username}/${repo}/deployments?page=${page}&per_page=${perPage}`;
            const response = await fetch(url, { headers });
            if (response.status === 403) {  // API rate limit exceeded
                console.warn("GitHub API rate limit exceeded!");
                document.getElementById("infoPopup").innerHTML = `
                    <p><i class="fas fa-exclamation-triangle"></i>
                    <strong>Oops! GitHub has decided to ration free API calls.
                    Website Info unavailable at the moment.</strong></p>
                    <p>🚀 Maybe it's time to get a GitHub Token?</p>
                    <p>🤷‍♂️ Or just chill for a while and try again later.
                `;
                return null;
            } else if (!response.ok) {
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

        // --- Fetch repository details ---
        const repoResponse = await fetch(`https://api.github.com/repos/${username}/${repo}`, { headers });
        const repoData = await repoResponse.json();

        starsElement.innerHTML = `<span class="fancy-number">${repoData.stargazers_count}</span>`;
        forksElement.innerHTML = `<span class="fancy-number">${repoData.forks_count}</span>`;

        // --- Fetch open issues & PRs ---
        const issuesResponse = await fetch(`https://api.github.com/repos/${username}/${repo}/issues?state=open`, { headers });
        const issuesData = await issuesResponse.json();
        issuesElement.innerHTML = `<span class="fancy-number">${issuesData.length}</span>`;

        const prsResponse = await fetch(`https://api.github.com/repos/${username}/${repo}/pulls?state=open`, { headers });
        const prsData = await prsResponse.json();
        prsElement.innerHTML = `<span class="fancy-number">${prsData.length}</span>`;

        // --- Fetch languages and draw bar chart ---
        const languagesResponse = await fetch(`https://api.github.com/repos/${username}/${repo}/languages`, { headers });
        const languagesData = await languagesResponse.json();

        let totalBytes = Object.values(languagesData).reduce((a, b) => a + b, 0);
        let languageLabels = [];
        let languageValues = [];

        for (let [lang, bytes] of Object.entries(languagesData)) {
            let percentage = ((bytes / totalBytes) * 100).toFixed(2);
            languageLabels.push(lang);
            languageValues.push(parseFloat(percentage));
        }

        // Function to get legend color based on theme
        function getThemeColors() {
            return document.body.classList.contains("light")
                ? { text: "#000000", grid: "rgba(0, 0, 0, 0.1)" }  // Light mode: Black text
                : { text: "#ffffff", grid: "rgba(255, 255, 255, 0.2)" }; // Dark mode: White text
        }

        let themeColors = getThemeColors();

        // Destroy existing chart if it exists
        if (window.languageChart) {
            window.languageChart.destroy();
        }

        // Render Bar Chart with Dynamic Theme
        const ctx = document.getElementById("languagesChart").getContext("2d");
        window.languageChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: languageLabels,
                datasets: [{
                    label: "Languages Usage (%)",
                    data: languageValues,
                    backgroundColor: "#00ffcc",  // Bright Cyan Bars
                    borderColor: "#00ffcc",
                    borderWidth: 2,
                    borderRadius: 6,
                    barThickness: 20
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: themeColors.text, // Dynamic legend color
                            font: {
                                size: 14,
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: themeColors.text, // X-axis labels color
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: themeColors.grid // Dynamic grid color
                        },
                        beginAtZero: true,
                        ticks: {
                            stepSize: 10,
                            color: themeColors.text, // Y-axis labels color
                            font: {
                                size: 12
                            },
                            callback: function (value) {
                                return value + "%";
                            }
                        }
                    }
                }
            }
        });

        // Listen for theme changes and update chart colors
        const observer = new MutationObserver(() => {
            themeColors = getThemeColors();
            window.languageChart.options.plugins.legend.labels.color = themeColors.text;
            window.languageChart.options.scales.x.ticks.color = themeColors.text;
            window.languageChart.options.scales.y.ticks.color = themeColors.text;
            window.languageChart.options.scales.y.grid.color = themeColors.grid;
            window.languageChart.update();
        });

        // Observe body class changes (to detect theme switch)
        observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
