import { qs, escapeHtml } from "./utils.js";

const API_BASE = "https://api.github.com/repos";

function fmtNumber(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "--";
  return Intl.NumberFormat("en-US").format(n);
}

function fmtDate(iso) {
  if (!iso) return "--";
  try {
    const d = new Date(iso);
    const opts = {
      timeZone: "America/New_York",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    return d.toLocaleString("en-US", opts);
  } catch {
    return "--";
  }
}

function fmtAge(iso) {
  if (!iso) return "--";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "--";
  const diffMs = Date.now() - t;
  if (diffMs < 0) return "just now";

  const mins = Math.floor(diffMs / (60 * 1000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function fmtCiStatus(run) {
  if (!run) return "--";
  if (run.status !== "completed") return `running (${run.status})`;
  if (!run.conclusion) return "completed";
  if (run.conclusion === "success") return "passing";
  if (run.conclusion === "failure") return "failing";
  return run.conclusion;
}

function fmtVersionFromDeployments(count) {
  const n = Number(count || 0);
  if (!Number.isFinite(n) || n <= 0) return "--";
  const major = Math.floor(n / 100);
  const minor = n % 100;
  return `v${major}.${String(minor).padStart(2, "0")}`;
}

async function fetchJson(url, { headers = {} } = {}) {
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json", ...headers },
  });

  // 403 often means rate limit for unauth GitHub API.
  if (res.status === 403) {
    const txt = await res.text().catch(() => "");
    const err = new Error("GitHub API rate limited (403)");
    err.code = 403;
    err.body = txt;
    throw err;
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    const err = new Error(`GitHub API error ${res.status}`);
    err.code = res.status;
    err.body = txt;
    throw err;
  }

  return res.json();
}

async function fetchPaginated(baseUrl, perPage = 100, maxPages = 20) {
  // maxPages safety to avoid runaway
  let page = 1;
  let all = [];
  while (page <= maxPages) {
    const url = `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${page}&per_page=${perPage}`;
    const data = await fetchJson(url);
    if (!Array.isArray(data) || data.length === 0) break;
    all = all.concat(data);
    page += 1;
    if (data.length < perPage) break;
  }
  return all;
}

async function fetchFirstPage(url) {
  // Fetch only one page (per_page=100 if not set) to keep API calls low.
  const withPer = url.includes("per_page=")
    ? url
    : `${url}${url.includes("?") ? "&" : "?"}per_page=100`;
  return fetchJson(withPer);
}

async function tryFetchJson(url) {
  try {
    return await fetchJson(url);
  } catch (e) {
    if ([404, 410, 451].includes(e?.code)) return null;
    throw e;
  }
}

function loadCached(fullName) {
  try {
    const raw = localStorage.getItem(`ajinkyaos_radar_${fullName}`);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || !obj.data) return null;
    return obj;
  } catch {
    return null;
  }
}

function saveCached(fullName, data) {
  try {
    localStorage.setItem(
      `ajinkyaos_radar_${fullName}`,
      JSON.stringify({ ts: Date.now(), data })
    );
  } catch {
    // Ignore cache failures (private mode, quota, etc.)
  }
}

function computeLangs(languagesObj) {
  if (!languagesObj || typeof languagesObj !== "object") {
    return { used: [], bar: [] };
  }

  const entries = Object.entries(languagesObj).filter(
    ([, v]) => typeof v === "number" && v > 0
  );
  if (!entries.length) return { used: [], bar: [] };

  entries.sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  const used = entries.map(([name]) => name);

  const bar = entries.slice(0, 8).map(([name, size]) => ({
    name,
    pct: total ? Number(((size / total) * 100).toFixed(2)) : 0,
  }));

  return { used, bar };
}

function renderSkeleton(container) {
  container.innerHTML = `
    <div class="radarContent">
      <div class="radarTopRow">
        <div class="radarRepo skel skel--pill"></div>
        <div class="radarLinks">
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
          </div>`
          )
          .join("")}
        <div class="radarRow radarRow--langs">
          <div class="radarK skel"></div>
          <div class="radarV skel"></div>
        </div>
      </div>
    </div>
  `;
}

function renderError(container, statusEl, msg) {
  if (statusEl) statusEl.textContent = "unavailable";
  container.innerHTML = `
    <div class="radarContent">
      <div class="radarTopRow">
        <div class="radarRepo">Website Info</div>
        <div class="radarLinks">
          <a class="radarLink" href="#" onclick="return false;">Live</a>
          <a class="radarLink" href="#" onclick="return false;">Repo</a>
          <a class="radarLink" href="#" onclick="return false;">Deployments</a>
        </div>
      </div>
      <div class="radarError">${escapeHtml(msg)}</div>
      <div class="radarHint">GitHub unauth APIs can rate-limit. Refresh later or view the repo directly.</div>
    </div>
  `;
}

function renderCard(container, statusEl, model, { stale = false } = {}) {
  if (statusEl) statusEl.textContent = "live";

  // Expose for terminal command (`radar`)
  try {
    window.__radarModel = model;
  } catch {
    // ignore
  }

  const pills = (model.languagesUsed || [])
    .slice(0, 10)
    .map((l) => `<span class="radarPill">${escapeHtml(l)}</span>`)
    .join("");

  container.innerHTML = `
    <div class="radarContent">
      <div class="radarTopRow">
        <div class="radarRepo">${escapeHtml(model.repoFullName)}${
          stale ? `<span class="radarStale">cached</span>` : ``
        }</div>
        <div class="radarLinks">
          <a class="radarLink" href="${model.siteUrl}" target="_blank" rel="noreferrer">Live</a>
          <a class="radarLink" href="${model.repoUrl}" target="_blank" rel="noreferrer">Repo</a>
          <a class="radarLink" href="${model.deploymentsUrl}" target="_blank" rel="noreferrer">Deployments</a>
        </div>
      </div>

      <div class="radarRows">
        <div class="radarGroupTitle">Delivery</div>
        <div class="radarRow"><div class="radarK">Version:</div><div class="radarV">${escapeHtml(
          model.version
        )}</div></div>
        <div class="radarRow"><div class="radarK">Last Updated:</div><div class="radarV">${escapeHtml(
          model.lastUpdated
        )}</div></div>
        <div class="radarRow"><div class="radarK">Deployed By:</div><div class="radarV">${escapeHtml(
          model.deployedBy
        )}</div></div>
        <div class="radarRow"><div class="radarK">CI Status:</div><div class="radarV">${escapeHtml(
          model.ciStatus
        )}</div></div>
        <div class="radarRow"><div class="radarK">Latest Commit:</div><div class="radarV">${escapeHtml(
          model.latestCommitAge
        )}</div></div>

        <div class="radarGroupTitle">Quality</div>
        <div class="radarRow"><div class="radarK">Open Issues:</div><div class="radarV">${fmtNumber(
          model.openIssues
        )}</div></div>
        <div class="radarRow"><div class="radarK">Open PRs:</div><div class="radarV">${fmtNumber(
          model.openPRs
        )}</div></div>
        <div class="radarGroupTitle">Repo Health</div>
        <div class="radarRow"><div class="radarK">Stars:</div><div class="radarV">${fmtNumber(
          model.stars
        )}</div></div>
        <div class="radarRow"><div class="radarK">Forks:</div><div class="radarV">${fmtNumber(
          model.forks
        )}</div></div>
        <div class="radarRow"><div class="radarK">Default Branch:</div><div class="radarV">${escapeHtml(
          model.defaultBranch
        )}</div></div>

        <div class="radarRow radarRow--langs">
          <div class="radarK">Languages Used:</div>
          <div class="radarV radarV--langs">
            <div class="radarPills">${pills || "--"}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function loadGithubRadar(radarConfig) {
  const container = qs("#githubRepos");
  const statusEl = qs("#githubStatus");
  if (!container) return;

  renderSkeleton(container);

  try {
    const fullName = radarConfig?.repo?.fullName;
    const siteUrl = radarConfig?.website?.url || window.location.origin;

    if (!fullName || !fullName.includes("/")) {
      renderError(container, statusEl, "GitHub repo not configured in data.js");
      return;
    }

    const [owner, repo] = fullName.split("/");
    const repoBase = `${API_BASE}/${owner}/${repo}`;

    // deployments (paginated) - matches original version logic (count/100)
    const deployments = await fetchPaginated(`${repoBase}/deployments`, 100, 5);
    const count = deployments?.length || 0;
    const latest = deployments?.[0];

    const version = fmtVersionFromDeployments(count);
    const lastUpdated = fmtDate(latest?.created_at);
    const deployedBy = latest?.creator?.login || "--";

    // repo details
    const repoData = await fetchJson(repoBase);
    const stars = repoData?.stargazers_count ?? null;
    const forks = repoData?.forks_count ?? null;
    const defaultBranch = repoData?.default_branch || "--";

    // open PRs
    const prs = await fetchFirstPage(`${repoBase}/pulls?state=open`);
    const openPRs = prs?.length ?? 0;

    // open issues: fetch issues endpoint and filter out PRs
    const issuesRaw = await fetchFirstPage(`${repoBase}/issues?state=open`);
    const issuesOnly = (issuesRaw || []).filter((it) => !it.pull_request);
    const openIssues = issuesOnly.length;

    // languages
    const languagesObj = await fetchJson(`${repoBase}/languages`);
    const { used, bar } = computeLangs(languagesObj);

    // Additional engineering signals (best-effort).
    const [runsResp, commitsResp] = await Promise.all([
      tryFetchJson(`${repoBase}/actions/runs?per_page=1`),
      tryFetchJson(`${repoBase}/commits?per_page=1&sha=${encodeURIComponent(defaultBranch)}`),
    ]);

    const latestRun = runsResp?.workflow_runs?.[0] || null;
    const ciStatus = fmtCiStatus(latestRun);
    const latestCommitIso = commitsResp?.[0]?.commit?.author?.date || null;
    const latestCommitAge = fmtAge(latestCommitIso);

    const model = {
      repoFullName: fullName,
      siteUrl,
      repoUrl: `https://github.com/${fullName}`,
      deploymentsUrl: `https://github.com/${fullName}/actions`,
      version,
      lastUpdated,
      deployedBy,
      stars,
      forks,
      openIssues,
      openPRs,
      defaultBranch,
      ciStatus,
      latestCommitAge,
      languagesUsed: used,
      languagesBar: bar,
    };

    renderCard(container, statusEl, model);
    saveCached(fullName, model);
  } catch (e) {
    const cached = loadCached(radarConfig?.repo?.fullName);
    if (cached?.data) {
      renderCard(container, statusEl, cached.data, { stale: true });
      return;
    }

    if (e?.code === 403) {
      renderError(container, statusEl, "GitHub API rate-limited right now. Refresh later.");
    } else {
      renderError(container, statusEl, "Could not load GitHub telemetry.");
    }
    console.warn("Ship Radar error:", e);
  }
}
