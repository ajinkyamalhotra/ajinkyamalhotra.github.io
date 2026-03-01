import { STORAGE_KEYS } from "@shared/constants/storage-keys.js";
import { escapeHtml, formatNumber } from "@shared/utils/text.js";
import { formatDateInEastern, formatRelativeAge } from "@shared/utils/time.js";

const GITHUB_API = "https://api.github.com/repos";

function resolveUrl(baseUrl, targetPath) {
  if (!targetPath) {
    return "";
  }

  try {
    return new URL(targetPath, baseUrl || window.location.origin).toString();
  } catch {
    return "";
  }
}

function externalLinks(model) {
  return [
    { label: model.siteLabel || "Live", url: model.siteUrl },
    { label: model.repoLabel || "Repo", url: model.repoUrl },
    { label: model.deploymentsLabel || "Deployments", url: model.deploymentsUrl },
    model.coverageUrl ? { label: model.coverageLabel || "Coverage", url: model.coverageUrl } : null,
  ].filter((entry) => entry && entry.url);
}

function languageBreakdown(payload) {
  if (!payload || typeof payload !== "object") {
    return { names: [], bars: [] };
  }

  const entries = Object.entries(payload)
    .filter(([, bytes]) => typeof bytes === "number" && bytes > 0)
    .sort((left, right) => right[1] - left[1]);

  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);

  return {
    names: entries.map(([name]) => name),
    bars: entries.slice(0, 8).map(([name, bytes]) => ({
      name,
      pct: total ? Number(((bytes / total) * 100).toFixed(2)) : 0,
    })),
  };
}

function deploymentVersion(count) {
  const total = Number(count || 0);
  if (!Number.isFinite(total) || total <= 0) {
    return "--";
  }

  const major = Math.floor(total / 100);
  const minor = total % 100;
  return `v${major}.${String(minor).padStart(2, "0")}`;
}

function ciStatus(run) {
  if (!run) return "--";
  if (run.status !== "completed") return `running (${run.status})`;
  if (!run.conclusion) return "completed";
  if (run.conclusion === "success") return "passing";
  if (run.conclusion === "failure") return "failing";
  return run.conclusion;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { Accept: "application/vnd.github+json", ...(options.headers || {}) },
  });

  if (response.status === 403) {
    const error = new Error("GitHub API rate limited (403)");
    error.code = 403;
    error.body = await response.text().catch(() => "");
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`GitHub API error ${response.status}`);
    error.code = response.status;
    error.body = await response.text().catch(() => "");
    throw error;
  }

  return response.json();
}

async function tryFetchJson(url) {
  try {
    return await fetchJson(url);
  } catch (error) {
    if ([404, 410, 451].includes(error?.code)) {
      return null;
    }
    throw error;
  }
}

async function firstPage(url) {
  const withPageSize = url.includes("per_page=")
    ? url
    : `${url}${url.includes("?") ? "&" : "?"}per_page=100`;
  return fetchJson(withPageSize);
}

async function paginated(baseUrl, perPage = 100, maxPages = 20) {
  let page = 1;
  let aggregate = [];

  while (page <= maxPages) {
    const url = `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${page}&per_page=${perPage}`;
    const payload = await fetchJson(url);

    if (!Array.isArray(payload) || payload.length === 0) {
      break;
    }

    aggregate = aggregate.concat(payload);
    if (payload.length < perPage) {
      break;
    }

    page += 1;
  }

  return aggregate;
}

function cacheKey(repositoryFullName) {
  return `${STORAGE_KEYS.shipRadarCachePrefix}${repositoryFullName}`;
}

function readCache(repositoryFullName) {
  try {
    const payload = localStorage.getItem(cacheKey(repositoryFullName));
    return payload ? JSON.parse(payload) : null;
  } catch {
    return null;
  }
}

function writeCache(repositoryFullName, model) {
  try {
    localStorage.setItem(
      cacheKey(repositoryFullName),
      JSON.stringify({ ts: Date.now(), data: model }),
    );
  } catch {
    // Ignore storage persistence errors.
  }
}

function renderSkeleton(host) {
  host.innerHTML = `
    <div class="radarContent">
      <div class="radarTopRow">
        <div class="radarRepo skel skel--pill"></div>
        <div class="radarLinks">
          <span class="radarLink skel skel--pill"></span>
          <span class="radarLink skel skel--pill"></span>
          <span class="radarLink skel skel--pill"></span>
          <span class="radarLink skel skel--pill"></span>
        </div>
      </div>
      <div class="radarRows">
        ${Array.from({ length: 11 })
          .map(
            () => `
              <div class="radarRow">
                <div class="radarK skel"></div>
                <div class="radarV skel"></div>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderFailure(host, statusHost, message) {
  if (statusHost) {
    statusHost.textContent = "unavailable";
  }

  host.innerHTML = `
    <div class="radarContent">
      <div class="radarTopRow">
        <div class="radarRepo">Website Info</div>
      </div>
      <div class="radarError">${escapeHtml(message)}</div>
      <div class="radarHint">GitHub unauthenticated APIs can rate-limit. Refresh later or inspect the repository directly.</div>
    </div>
  `;
}

function renderCard(host, statusHost, model, options = {}) {
  if (statusHost) {
    statusHost.textContent = "live";
  }

  const staleBadge = options.stale ? '<span class="radarStale">cached</span>' : "";
  const linksMarkup = externalLinks(model)
    .map(
      (link) =>
        `<a class="radarLink" href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(
          link.label,
        )}</a>`,
    )
    .join("");
  const languagePills = (model.languagesUsed || [])
    .slice(0, 10)
    .map((language) => `<span class="radarPill">${escapeHtml(language)}</span>`)
    .join("");

  host.innerHTML = `
    <div class="radarContent">
      <div class="radarTopRow">
        <div class="radarRepo">${escapeHtml(model.repoFullName)}${staleBadge}</div>
        <div class="radarLinks">${linksMarkup}</div>
      </div>
      <div class="radarRows">
        <div class="radarGroupTitle">Delivery</div>
        <div class="radarRow"><div class="radarK">Version:</div><div class="radarV">${escapeHtml(model.version)}</div></div>
        <div class="radarRow"><div class="radarK">Last Updated:</div><div class="radarV">${escapeHtml(model.lastUpdated)}</div></div>
        <div class="radarRow"><div class="radarK">Deployed By:</div><div class="radarV">${escapeHtml(model.deployedBy)}</div></div>
        <div class="radarRow"><div class="radarK">CI Status:</div><div class="radarV">${escapeHtml(model.ciStatus)}</div></div>
        <div class="radarRow"><div class="radarK">Latest Commit:</div><div class="radarV">${escapeHtml(model.latestCommitAge)}</div></div>

        <div class="radarGroupTitle">Quality</div>
        <div class="radarRow"><div class="radarK">Open Issues:</div><div class="radarV">${formatNumber(model.openIssues)}</div></div>
        <div class="radarRow"><div class="radarK">Open PRs:</div><div class="radarV">${formatNumber(model.openPRs)}</div></div>

        <div class="radarGroupTitle">Repo Health</div>
        <div class="radarRow"><div class="radarK">Stars:</div><div class="radarV">${formatNumber(model.stars)}</div></div>
        <div class="radarRow"><div class="radarK">Forks:</div><div class="radarV">${formatNumber(model.forks)}</div></div>
        <div class="radarRow"><div class="radarK">Default Branch:</div><div class="radarV">${escapeHtml(model.defaultBranch)}</div></div>
        <div class="radarRow radarRow--langs">
          <div class="radarK">Languages Used:</div>
          <div class="radarV radarV--langs">
            <div class="radarPills">${languagePills || "--"}</div>
          </div>
        </div>
      </div>
    </div>
  `;

  window.__radarModel = model;
}

function createCollapseController() {
  const panel = document.querySelector(".panel--github");
  const toggle = document.getElementById("githubToggle");

  if (!panel || !toggle) {
    return;
  }

  const apply = (collapsed) => {
    panel.classList.toggle("is-collapsed", collapsed);
    toggle.setAttribute("aria-expanded", String(!collapsed));
    toggle.setAttribute("aria-label", collapsed ? "Expand Ship Radar" : "Collapse Ship Radar");

    try {
      localStorage.setItem(STORAGE_KEYS.shipRadarCollapse, collapsed ? "1" : "0");
    } catch {
      // Ignore persistence failure.
    }
  };

  let collapsed = true;
  try {
    const persisted = localStorage.getItem(STORAGE_KEYS.shipRadarCollapse);
    if (persisted === "0" || persisted === "1") {
      collapsed = persisted === "1";
    }
  } catch {
    // Ignore persistence failure.
  }

  apply(collapsed);

  toggle.addEventListener("click", () => {
    apply(!panel.classList.contains("is-collapsed"));
  });
}

export function createShipRadarFeature({ radarConfig }) {
  async function fetchModel() {
    const repositoryFullName = radarConfig?.repo?.fullName;
    if (!repositoryFullName || !repositoryFullName.includes("/")) {
      throw new Error("GitHub repo not configured in content-registry.");
    }

    const [owner, repo] = repositoryFullName.split("/");
    const repositoryApi = `${GITHUB_API}/${owner}/${repo}`;

    const deployments = await paginated(`${repositoryApi}/deployments`, 100, 5);
    const latestDeployment = deployments[0];

    const repository = await fetchJson(repositoryApi);
    const pullRequests = await firstPage(`${repositoryApi}/pulls?state=open`);
    const issues = await firstPage(`${repositoryApi}/issues?state=open`);
    const languages = await fetchJson(`${repositoryApi}/languages`);

    const defaultBranch = repository?.default_branch || "--";
    const siteUrl = radarConfig?.website?.url || window.location.origin;
    const coverageUrl = resolveUrl(siteUrl, radarConfig?.coverage?.path || "");

    const [runsPayload, commitsPayload] = await Promise.all([
      tryFetchJson(`${repositoryApi}/actions/runs?per_page=1`),
      tryFetchJson(`${repositoryApi}/commits?per_page=1&sha=${encodeURIComponent(defaultBranch)}`),
    ]);

    const openIssues = (issues || []).filter((item) => !item.pull_request).length;
    const languageData = languageBreakdown(languages);
    const latestRun = runsPayload?.workflow_runs?.[0] || null;
    const latestCommitDate = commitsPayload?.[0]?.commit?.author?.date || null;

    return {
      repoFullName: repositoryFullName,
      siteUrl,
      siteLabel: radarConfig?.website?.label || "Live",
      repoUrl: `https://github.com/${repositoryFullName}`,
      repoLabel: "Repo",
      deploymentsUrl: `https://github.com/${repositoryFullName}/actions`,
      deploymentsLabel: "Deployments",
      coverageUrl,
      coverageLabel: radarConfig?.coverage?.label || "Coverage",
      version: deploymentVersion(deployments.length),
      lastUpdated: formatDateInEastern(latestDeployment?.created_at),
      deployedBy: latestDeployment?.creator?.login || "--",
      stars: repository?.stargazers_count ?? null,
      forks: repository?.forks_count ?? null,
      openIssues,
      openPRs: pullRequests?.length ?? 0,
      defaultBranch,
      ciStatus: ciStatus(latestRun),
      latestCommitAge: formatRelativeAge(latestCommitDate),
      languagesUsed: languageData.names,
      languagesBar: languageData.bars,
    };
  }

  async function init() {
    const host = document.getElementById("githubRepos");
    const status = document.getElementById("githubStatus");
    if (!host) {
      return;
    }

    createCollapseController();
    renderSkeleton(host);

    try {
      const model = await fetchModel();
      renderCard(host, status, model);
      writeCache(radarConfig.repo.fullName, model);
    } catch (error) {
      const cached = readCache(radarConfig?.repo?.fullName);
      if (cached?.data) {
        const siteUrl = cached.data.siteUrl || radarConfig?.website?.url || window.location.origin;
        const hydratedCachedModel = {
          ...cached.data,
          siteUrl,
          siteLabel: cached.data.siteLabel || radarConfig?.website?.label || "Live",
          repoLabel: cached.data.repoLabel || "Repo",
          deploymentsLabel: cached.data.deploymentsLabel || "Deployments",
          coverageUrl:
            cached.data.coverageUrl || resolveUrl(siteUrl, radarConfig?.coverage?.path || ""),
          coverageLabel: cached.data.coverageLabel || radarConfig?.coverage?.label || "Coverage",
        };
        renderCard(host, status, hydratedCachedModel, { stale: true });
        return;
      }

      if (error?.code === 403) {
        renderFailure(host, status, "GitHub API is currently rate-limited. Refresh later.");
      } else {
        renderFailure(host, status, "Could not load GitHub telemetry.");
      }

      console.warn("Ship Radar unavailable", error);
    }
  }

  return { init };
}
