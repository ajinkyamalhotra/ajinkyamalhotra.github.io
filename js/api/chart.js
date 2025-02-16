// js/api/chart.js
import { logAction } from "../logger.js";

/**
 * Render a bar chart for programming languages usage.
 * @param {HTMLCanvasElement} canvasEl - The canvas element where the chart will be rendered.
 * @param {Object} languagesData - Object mapping languages to number of bytes.
 */
export function renderLanguagesChart(canvasEl, languagesData) {
    logAction("Render Languages Chart: Begin", () => {
        // Calculate percentages
        const totalBytes = Object.values(languagesData).reduce((a, b) => a + b, 0);
        const languageLabels = [];
        const languageValues = [];

        logAction("Calculate language percentages", () => {
            for (let [lang, bytes] of Object.entries(languagesData)) {
                const percentage = ((bytes / totalBytes) * 100).toFixed(2);
                languageLabels.push(lang);
                languageValues.push(parseFloat(percentage));
            }
        });

        // Helper: determine theme colors based on body class
        function getThemeColors() {
            return document.body.classList.contains("light")
                ? { text: "#000000", grid: "rgba(0, 0, 0, 0.1)" }
                : { text: "#ffffff", grid: "rgba(255, 255, 255, 0.2)" };
        }

        // Determine theme colors
        let themeColors = logAction("Determine theme colors", () => getThemeColors());

        // Destroy existing chart if it exists
        logAction("Destroy existing chart if it exists", () => {
            if (window.languageChart) {
                window.languageChart.destroy();
            }
        });

        const ctx = canvasEl.getContext("2d");
        // Create new chart instance
        logAction("Create new Chart instance", () => {
            window.languageChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: languageLabels,
                    datasets: [{
                        label: "Languages Usage (%)",
                        data: languageValues,
                        backgroundColor: "#00ffcc",
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
                                color: themeColors.text,
                                font: { size: 14 }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: {
                                color: themeColors.text,
                                font: { size: 12 }
                            }
                        },
                        y: {
                            grid: { color: themeColors.grid },
                            beginAtZero: true,
                            ticks: {
                                stepSize: 10,
                                color: themeColors.text,
                                font: { size: 12 },
                                callback: function (value) {
                                    return value + "%";
                                }
                            }
                        }
                    }
                }
            });
        });

        // Set up an observer to update chart colors when the theme changes
        logAction("Set up MutationObserver for theme changes", () => {
            const observer = new MutationObserver(() => {
                themeColors = getThemeColors();
                window.languageChart.options.plugins.legend.labels.color = themeColors.text;
                window.languageChart.options.scales.x.ticks.color = themeColors.text;
                window.languageChart.options.scales.y.ticks.color = themeColors.text;
                window.languageChart.options.scales.y.grid.color = themeColors.grid;
                window.languageChart.update();
            });
            observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
        });
    });
}
