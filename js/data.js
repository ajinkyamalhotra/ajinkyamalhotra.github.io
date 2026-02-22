// AjinkyaOS — data layer
// -------------------------------------------------------------
// Keep this file human-editable. No build tools, no CMS.
//
// Sources:
// - Previous portfolio data.js
// - resume.pdf (latest)

export const profile = {
  name: "Ajinkya Malhotra",
  navRole: "Senior Software Engineer @ Arm",
  role: "Senior Software Engineer @ Arm | Backend, Platform, Release, DevOps",
  location: "Boston, MA",
  email: "ajinkyamalhotra73@gmail.com",
  phone: "+1 (916) 696-4455",
  social: {
    github: "https://github.com/ajinkyamalhotra",
    linkedin: "https://www.linkedin.com/in/ajinkyamalhotra",
  },
  // Typewriter lines shown in the hero. Keep them short.
  taglines: [
    "design --backend-services --for scale",
    "build --platform --for developer velocity",
    "ship --release-pipelines --with reliability",
    "optimize --build-time -58% --and cloud-spend -20%",
    "debug --distributed-systems --under pressure",
  ],
  summary:
    "I build production software across backend systems, platform engineering, CI/CD and release automation, and cloud infrastructure. I focus on measurable outcomes in latency, reliability, developer velocity, and cost.",
  leadershipThesis:
    "I lead delivery and reliability across backend, platform, and release systems, balancing product velocity, operational safety, and cost-performance.",
  focusChips: [
    "Backend engineering",
    "Platform engineering",
    "Release engineering",
    "DevOps and CI/CD",
    "Cloud architecture",
    "Distributed systems",
    "Performance and reliability",
  ],
  scopeChips: [
    "Partner-facing releases",
    "Backend and platform ownership",
    "Cross-team CI ownership",
    "Cost governance",
    "Incident response",
  ],
};

// Ops/Ship radar configuration (shown in the hero right column).
// Set `gitlab.projectPath` if you want live pipeline status from GitLab.
// Example: "my-group/my-project" (URL path on gitlab.com).
export const radar = {
  website: {
    label: "Portfolio",
    // If you use a custom domain, change this.
    url: "https://ajinkyamalhotra.github.io/",
  },
  repo: {
    provider: "GitHub",
    // owner/repo
    fullName: "ajinkyamalhotra/ajinkyamalhotra.github.io",
  },
  gitlab: {
    provider: "GitLab",
    // URL path on gitlab.com (or your self-managed instance). Leave blank to disable live fetch.
    projectPath: "",
    // Optional: direct link to your pipeline or project page.
    projectUrl: "",
  },
};

export const impact = [
  {
    value: "58%",
    label: "Faster builds",
    desc: "Redesigned Jenkins Groovy pipelines + test orchestration to cut nightly/release build times.",
    tags: ["Jenkins", "Groovy", "CI/CD"],
  },
  {
    value: "30%",
    label: "Faster release cycles",
    desc: "Designed GitLab CI/CD pipelines that reduced release cycle time and improved build reliability.",
    tags: ["GitLab CI/CD", "Automation"],
  },
  {
    value: "20%",
    label: "Lower AWS spend",
    desc: "Optimized AWS infrastructure to reduce cost while delivering partner-facing releases.",
    tags: ["AWS", "Cost"],
  },
  {
    value: "70%",
    label: "Less manual provisioning",
    desc: "Automated AWS resource lifecycle (EC2/AMIs/EBS/EFS), eliminating repetitive manual operations.",
    tags: ["Python", "Terraform", "Packer"],
  },
  {
    value: "80%",
    label: "Lower API latency",
    desc: "Built a cache layer for a high-traffic API to serve responses from cache instead of MongoDB.",
    tags: ["Java", "MongoDB", "REST"],
  },
  {
    value: "15%",
    label: "Faster case resolution",
    desc: "Created internal automation/diagnostic tooling used across AWS support workflows.",
    tags: ["AWS", "Troubleshooting"],
  },
  {
    value: "30%",
    label: "Faster incident resolution",
    desc: "Integrated Splunk-based logging/monitoring to reduce mean time to resolve incidents.",
    tags: ["Splunk", "Observability"],
  },
  {
    value: "+25%",
    label: "Test coverage",
    desc: "Automated QA workflows with Selenium/JUnit across multiple customer-facing web portals.",
    tags: ["Selenium", "JUnit"],
  },
  {
    value: "+25%",
    label: "Recommendation accuracy",
    desc: "Shipped a game recommender (CBF + VBPR) and improved accuracy while reducing processing time by 60%.",
    tags: ["Python", "AWS Lambda", "ML"],
  },
];

export const overviewProofs = [
  {
    value: "58%",
    label: "Build Time Reduction",
    baseline: "Nightly/release pipelines with high orchestration overhead",
    current: "Deterministic staged pipelines with targeted retries",
    window: "2024-2025",
    method: "Jenkins + GitLab CI stage decomposition and failure taxonomy",
  },
  {
    value: "30%",
    label: "Release Cycle Acceleration",
    baseline: "Long validation handoffs and fragile release gates",
    current: "Contracted stage ownership and release quality gates",
    window: "2024-2025",
    method: "Pipeline governance + automated gate criteria",
  },
  {
    value: "20%",
    label: "AWS Spend Reduction",
    baseline: "Over-provisioned, manual-heavy infrastructure workflows",
    current: "Automated lifecycle and right-sizing controls",
    window: "2023-2025",
    method: "Terraform/Packer templates and cloud cost telemetry loop",
  },
];

export const experience = [
  {
    company: "Arm",
    link: "https://www.arm.com",
    location: "Boston, MA",
    period: "May 2023 — Present",
    roles: [
      {
        title: "Senior Software Engineer",
        period: "Apr 2025 — Present",
        bullets: [
          "Developing telemetry, orchestration, and driver-interaction software for next‑gen Arm chips (performance monitoring, load balancing, ML system integration).",
          "Leading Performance Models productization work for external releases to global partners.",
          "Designed GitLab CI/CD pipelines that reduced release cycle times by ~30% and improved build reliability.",
        ],
      },
      {
        title: "Software Engineer",
        period: "Jan 2024 — Apr 2025",
        bullets: [
          "Optimized nightly/release build times by ~58% by redesigning Jenkins Groovy pipelines and test orchestration.",
          "Lowered AWS infrastructure spend by ~20% and delivered multiple performance model releases to partners.",
        ],
      },
      {
        title: "Software Engineer Intern",
        period: "May 2023 — Aug 2023",
        bullets: [
          "Automated AWS resource lifecycle with Python + IaC (Terraform/Packer/Boto3), eliminating ~70% manual provisioning effort.",
        ],
      },
    ],
    tags: [
      "AWS",
      "Python",
      "Bash",
      "C++",
      "Platform Engineering",
      "Release Engineering",
      "DevOps",
      "GitLab CI/CD",
      "Jenkins",
      "Groovy",
      "Terraform",
      "Packer",
      "Performance",
    ],
  },
  {
    company: "Amazon Web Services (AWS)",
    link: "https://aws.amazon.com/",
    location: "Seattle, WA",
    period: "May 2020 — Jun 2022",
    roles: [
      {
        title: "Cloud Support Engineer",
        period: "May 2020 — Jun 2022",
        bullets: [
          "Applied advanced troubleshooting to solve complex customer problems across multiple AWS services.",
          "Created internal automation/diagnostic tools used globally, reducing average case resolution time by ~15%.",
          "Resolved high‑severity escalations for enterprise customers and partnered with engineering to prioritize fixes/enhancements.",
        ],
      },
    ],
    tags: [
      "DevOps",
      "Platform Engineering",
      "AWS Lambda",
      "API Gateway",
      "SNS/SQS",
      "EC2",
      "S3",
      "VPC",
      "Python",
      "JavaScript",
    ],
  },
  {
    company: "Esurance",
    link: "https://www.esurance.com/",
    location: "Rocklin, CA",
    period: "Aug 2019 — May 2020",
    roles: [
      {
        title: "Software Engineer",
        period: "Aug 2019 — May 2020",
        bullets: [
          "Built a caching layer for a high‑traffic API reducing query latency by ~80% (served from cache instead of MongoDB).",
          "Maintained and enhanced 5 payment-related APIs, ensuring scalability and compliance under high transaction load.",
          "Integrated Splunk logging/monitoring and cut average incident resolution time by ~30%.",
        ],
      },
    ],
    tags: [
      "Backend Engineering",
      "Java",
      "JUnit",
      "MongoDB",
      "REST APIs",
      "Splunk",
      "CI/CD",
    ],
  },
  {
    company: "Vision Service Plan (VSP)",
    link: "https://www.vsp.com/",
    location: "Rancho Cordova, CA",
    period: "Jun 2018 — May 2019",
    roles: [
      {
        title: "Software Engineer Intern",
        period: "Jun 2018 — May 2019",
        bullets: [
          "Automated QA workflows with Selenium/JUnit, boosting test coverage by ~25% across 4 web portals.",
          "Executed selenium, smoke, and regression tests on staging; performed functional tests on multiple applications.",
        ],
      },
    ],
    tags: ["Java", "Selenium", "JUnit", "Scrum", "QA"],
  },
  {
    company: "California State University, Sacramento",
    link: "https://www.csus.edu/",
    location: "Sacramento, CA",
    period: "Aug 2017 — May 2019",
    roles: [
      {
        title: "Teaching Assistant",
        period: "Aug 2017 — May 2019",
        bullets: [
          "Guided students through assignments, graded submissions, and answered questions during online discussions.",
          "Supported coursework including Advanced Computer 3D Graphics.",
        ],
      },
    ],
    tags: ["Teaching", "3D Graphics"],
  },
];

export const projects = [
  {
    title: "Steam Game Recommendation Engine",
    period: "Mar 2023 — May 2023",
    link: "https://github.com/ajinkyamalhotra/Steam-Game-Recommendation/",
    desc:
      "Recommendation system using Content‑Based Filtering and VBPR. Deployed on AWS Lambda + Heroku; improved recommendation accuracy ~25% and reduced processing time ~60%.",
    tags: ["Python", "AWS Lambda", "Heroku", "ML", "HTML/CSS"],
    highlights: [
      "Content-Based Filtering + VBPR",
      "Serverless deployment",
      "Latency-focused pipeline",
    ],
  },
  {
    title: "Chess Master AI",
    period: "Feb 2023 — Apr 2023",
    link: "https://github.com/ajinkyamalhotra/Chess-Master",
    desc:
      "Human vs CPU chess-like game with a Minimax AI optimized via Alpha‑Beta pruning, Depth‑Limited Search, and Iterative Deepening.",
    tags: ["Java", "Minimax", "Alpha-Beta", "Algorithms"],
    highlights: ["Game AI", "Search optimization"],
  },
  {
    title: "Network Optimization Algorithms",
    period: "Nov 2022",
    link:
      "https://github.com/ajinkyamalhotra/Network-Optimization-using-Shortest-Path",
    desc:
      "Large graph generator (sparse + dense) and benchmarking for Dijkstra (with/without heap) and Kruskal on graphs up to ~5M edges.",
    tags: ["Java", "Dijkstra", "Kruskal", "Performance"],
    highlights: ["Benchmarking", "Large-scale graphs"],
  },
  {
    title: "Firearm Classification CNN",
    period: "Oct 2019 — Dec 2019",
    link: "https://github.com/ajinkyamalhotra/Firearm-Classification",
    desc:
      "Neural network classification project (AlexNet via TensorFlow/TFLearn) with ~85% accuracy on the dataset.",
    tags: ["Python", "TensorFlow", "CNN", "TFLearn"],
    highlights: ["AlexNet", "Model training"],
  },
  {
    title: "2D Tiled Image Convolution (CUDA)",
    period: "May 2018",
    link:
      "https://github.com/ajinkyamalhotra/GpuProgrammingCuda/blob/master/TiledMatrixMultiplicationKernel.cu",
    desc:
      "CUDA kernel using shared + constant memory to reduce global memory reads for tiled convolution.",
    tags: ["CUDA", "C", "GPU"],
    highlights: ["Shared memory", "Constant memory"],
  },
  {
    title: "Histogram (CUDA)",
    period: "Apr 2018",
    link:
      "https://github.com/ajinkyamalhotra/GpuProgrammingCuda/blob/master/HistogramKernel.cu",
    desc:
      "Efficient histogram kernel using privatization for 4096 bins with saturated 32-bit counters.",
    tags: ["CUDA", "C", "GPU"],
    highlights: ["Privatization", "Parallel reduction"],
  },
  {
    title: "Attendance Tracker",
    period: "Mar 2017 — Jul 2017",
    link: "https://github.com/ajinkyamalhotra",
    desc:
      "Google Sheets API app to record attendance: portal for students and tracking tools for professors.",
    tags: ["Java", "Google Sheets API", "JavaScript", "HTML/CSS"],
    highlights: ["API integration"],
  },
];

export const skills = [
  {
    name: "AWS",
    level: 8.5,
    subSkills: [
      { name: "Lambda", level: 9 },
      { name: "API Gateway", level: 9 },
      { name: "SNS", level: 9 },
      { name: "SQS", level: 9 },
      { name: "IAM", level: 9 },
      { name: "EC2", level: 9 },
      { name: "S3", level: 9 },
      { name: "VPC", level: 9 },
      { name: "CloudFormation", level: 8 },
      { name: "DynamoDB", level: 8 },
      { name: "EBS", level: 8 },
      { name: "EFS", level: 8 },
      { name: "RDS", level: 7 },
      { name: "Terraform", level: 7 },
      { name: "Packer", level: 7 },
      { name: "Pinpoint", level: 6 },
      { name: "Connect", level: 6 },
    ],
  },
  {
    name: "Software Engineering",
    level: 8,
    subSkills: [
      { name: "Algorithms & Data Structures", level: 8 },
      { name: "APIs", level: 8 },
      { name: "OOP", level: 8 },
      { name: "CI/CD", level: 8 },
      { name: "Security", level: 7 },
      { name: "Test Automation", level: 7 },
      { name: "SDLC", level: 7 },
      { name: "Scrum", level: 8 },
    ],
  },
  {
    name: "Languages",
    level: 7.8,
    subSkills: [
      { name: "Python", level: 8 },
      { name: "Java", level: 9 },
      { name: "JavaScript", level: 8 },
      { name: "Groovy", level: 9 },
      { name: "Bash", level: 8 },
      { name: "SQL", level: 8 },
      { name: "C/C++", level: 4.5 },
    ],
  },
  {
    name: "CI/CD & Tools",
    level: 7.8,
    subSkills: [
      { name: "Git", level: 8 },
      { name: "GitLab CI/CD", level: 8 },
      { name: "Jenkins", level: 8 },
      { name: "Bitbucket", level: 7 },
      { name: "Jira", level: 8 },
      { name: "Confluence", level: 8 },
      { name: "Splunk", level: 7 },
      { name: "Terraform", level: 7 },
      { name: "Packer", level: 7 },
    ],
  },
  {
    name: "Data & Web",
    level: 7,
    subSkills: [
      { name: "MongoDB", level: 7 },
      { name: "MySQL", level: 7 },
      { name: "NoSQL", level: 7 },
      { name: "HTML/CSS", level: 7 },
      { name: "Django", level: 6 },
      { name: "Flask", level: 6 },
      { name: "Aurora", level: 6 },
    ],
  },
  {
    name: "Machine Learning",
    level: 5,
    subSkills: [
      { name: "TensorFlow", level: 5 },
      { name: "TFLearn", level: 5 },
      { name: "CNNs", level: 5 },
    ],
  },
];

export const education = [
  {
    school: "Texas A&M University — College Station",
    degree: "M.S. in Computer Science",
    period: "Aug 2022 — Dec 2023",
    meta: "GPA: 3.50/4.00",
    coursework: [
      "Advanced Algorithm Design",
      "Software Engineering",
      "Advanced Computer Graphics",
      "Business & Computer Ethics",
    ],
    link: "https://www.tamu.edu",
  },
  {
    school: "California State University, Sacramento",
    degree: "B.S. in Computer Science",
    period: "Jan 2015 — May 2019",
    meta: "GPA: 3.70/4.00",
    coursework: [
      "Parallel Programming with GPUs",
      "Intelligent Systems",
      "Object-Oriented Graphics",
      "Data Structures & Algorithm Analysis",
    ],
    link: "https://www.csus.edu",
  },
];

// Staff-level portfolio sections
export const caseStudies = [
  {
    id: "cicd-reliability",
    title: "CI/CD Throughput and Reliability Program",
    scope: "Arm Performance Models",
    period: "2024 - 2025",
    role: "Senior Software Engineer",
    problem:
      "Release trains were slowed by long nightly pipelines, flaky orchestration, and unclear ownership boundaries between build and validation stages.",
    constraints: [
      "Multi-stage Jenkins + GitLab CI coexistence",
      "Partner release windows could not shift",
      "No drop in validation coverage allowed",
    ],
    architecture: [
      "Pipeline decomposition into deterministic build, test, package, and publish stages",
      "Artifact promotion model with immutable build outputs",
      "Failure classification with targeted retry lanes and quarantine buckets",
      "Release gate model tied to quality signals and rollback hooks",
    ],
    tradeoffs: [
      "Accepted slightly higher pipeline configuration complexity to improve observability and blast-radius isolation",
      "Prioritized reliability over short-term feature throughput during migration window",
    ],
    outcomes: [
      "58% reduction in nightly/release build time",
      "30% faster release cycle for partner drops",
      "Improved release predictability with clearer failure ownership",
    ],
    stack: ["Jenkins", "GitLab CI/CD", "Groovy", "Python", "AWS"],
  },
  {
    id: "aws-cost-performance",
    title: "Cost-Aware Performance Infrastructure",
    scope: "Cloud execution and model delivery",
    period: "2023 - 2025",
    role: "Software Engineer -> Senior Software Engineer",
    problem:
      "Performance model workloads had inconsistent runtime efficiency and spend growth due to under-instrumented provisioning and uneven resource utilization.",
    constraints: [
      "Global partner-facing release SLAs",
      "Mixed workload patterns across build and benchmarking jobs",
      "Need for reproducible environments across teams",
    ],
    architecture: [
      "Provisioning automation for EC2/AMI/EBS/EFS lifecycle",
      "Cost telemetry loop for usage and waste attribution",
      "Template-driven environments using Terraform and Packer",
      "Right-sizing and scheduling controls tied to workload profiles",
    ],
    tradeoffs: [
      "Introduced stricter infra standards which raised onboarding cost initially",
      "Reserved flexibility for high-priority release paths at controlled spend",
    ],
    outcomes: [
      "20% AWS cost reduction while sustaining release cadence",
      "70% less manual provisioning effort",
      "Higher repeatability across partner release workflows",
    ],
    stack: ["AWS", "Terraform", "Packer", "Python", "Bash"],
  },
];

export const decisionArtifacts = [
  {
    type: "RFC",
    title: "Pipeline Ownership and Stage Contracts",
    context:
      "Defined explicit contracts between build, validation, and packaging teams to remove cross-stage ambiguity.",
    decision:
      "Adopted immutable artifact promotion and stage-level ownership with mandatory failure taxonomy tagging.",
    alternatives: [
      "Single monolithic pipeline with centralized triage",
      "Separate pipelines per team without contract enforcement",
    ],
    result:
      "Reduced coordination overhead and improved MTTR for pipeline failures.",
  },
  {
    type: "Postmortem",
    title: "Partner Release Delay from Environment Drift",
    context:
      "Release candidate failed late due to inconsistent infrastructure state across environments.",
    decision:
      "Moved to template-first environment provisioning and pre-release drift checks.",
    alternatives: [
      "Manual approval checklist only",
      "Runtime hotfixes during release windows",
    ],
    result:
      "Prevented repeated release-day drift incidents.",
  },
  {
    type: "Runbook",
    title: "High-Severity Pipeline Incident Response",
    context:
      "Created a response path to stabilize partner-impacting build failures within defined windows.",
    decision:
      "Standardized triage ownership, rollback criteria, communication templates, and verification steps.",
    alternatives: [
      "Ad hoc incident handling by on-call engineer",
      "Escalation-only model without written procedure",
    ],
    result:
      "Improved consistency and reduced time-to-containment during incidents.",
  },
];

export const systemsTimeline = [
  {
    phase: "v1 Baseline",
    period: "2023",
    theme: "Stabilize and measure",
    details: [
      "Mapped critical release paths and failure modes",
      "Instrumented build and infra metrics for baseline visibility",
    ],
  },
  {
    phase: "v2 Scale",
    period: "2024",
    theme: "Automate and isolate",
    details: [
      "Refactored pipelines into composable stages with explicit contracts",
      "Automated infrastructure lifecycle and environment parity checks",
    ],
  },
  {
    phase: "v3 Productize",
    period: "2025 - Present",
    theme: "Govern and accelerate",
    details: [
      "Added release governance, quality gates, and rollback guardrails",
      "Focused on partner-ready delivery and sustainable engineering velocity",
    ],
  },
];

export const testStrategy = {
  principles: [
    "Push defects left with deterministic unit and contract testing",
    "Protect release confidence with integration and end-to-end gates",
    "Treat flaky tests as incidents, not noise",
    "Use progressive delivery and rollback as first-class safety mechanisms",
  ],
  pyramid: [
    { layer: "Unit", focus: "Fast feedback for business logic and edge cases" },
    { layer: "Integration", focus: "Service and infra contract validation" },
    { layer: "End-to-End", focus: "Release-critical workflows and partner paths" },
  ],
  releaseGates: [
    "All critical pipeline stages green",
    "No unresolved Sev-1/Sev-2 regressions",
    "Performance and cost thresholds within guardrails",
    "Rollback plan validated and documented",
  ],
  qualityOps: [
    "Track flaky tests weekly and enforce ownership",
    "Quarantine unstable tests with follow-up SLA",
    "Publish release readiness summary before cutover",
  ],
};

export const writing = [
  {
    title: "How I Cut Build Times by 58% Without Cutting Test Confidence",
    type: "Engineering Note",
    status: "Planned",
  },
  {
    title: "Practical AWS Cost Controls for Performance Workloads",
    type: "Engineering Note",
    status: "Planned",
  },
  {
    title: "Designing CI Pipelines for External Partner Releases",
    type: "Engineering Note",
    status: "Planned",
  },
];

export const themePresets = [
  { id: "midnight", label: "Midnight" },
  { id: "neon", label: "Neon" },
  { id: "terminal", label: "Terminal" },
  { id: "paper", label: "Paper" },
];


