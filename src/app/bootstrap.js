import { renderAppShell } from "@app/layout/render-app-shell.js";
import { createRevealProvider } from "@app/providers/reveal-provider.js";
import { createDocumentMetadataProvider } from "@app/providers/document-metadata-provider.js";
import { createServiceWorkerProvider } from "@app/providers/service-worker-provider.js";
import { createSpotlightProvider } from "@app/providers/spotlight-provider.js";
import { createThemeProvider } from "@app/providers/theme-provider.js";
import { createHashRouter } from "@app/routing/hash-router.js";
import { createBackgroundFeature } from "@features/background/background-feature.js";
import { createBootFeature } from "@features/boot/boot-feature.js";
import { createCommandPaletteFeature } from "@features/command-palette/command-palette-feature.js";
import { createContactFeature } from "@features/contact/contact-feature.js";
import { createEducationFeature } from "@features/education/education-feature.js";
import { createExperienceFeature } from "@features/experience/experience-feature.js";
import { createHeroFeature } from "@features/hero/hero-feature.js";
import { createImpactFeature } from "@features/impact/impact-feature.js";
import { createNavigationShortcutsFeature } from "@features/navigation/navigation-shortcuts-feature.js";
import { createProjectModalFeature } from "@features/project-modal/project-modal-feature.js";
import { createProjectsFeature } from "@features/projects/projects-feature.js";
import { createShipRadarFeature } from "@features/ship-radar/ship-radar-feature.js";
import { createSkillsFeature } from "@features/skills/skills-feature.js";
import { createStaffFeature } from "@features/staff/staff-feature.js";
import { createTerminalFeature } from "@features/terminal/terminal-feature.js";
import { createToastController } from "@shared/components/toast.js";

function buildPaletteActions({
  content,
  router,
  terminal,
  modal,
  projectsFeature,
  experienceFeature,
  theme,
  toast,
  contact,
}) {
  const actions = [];

  content.routes
    .filter((route) => route.id !== "education")
    .forEach((route) => {
      actions.push({
        label: `Go to ${route.label}`,
        meta: `#${route.id}`,
        keywords: `navigate ${route.label}`,
        run: () => router.scrollToHash(`#${route.id}`),
      });
    });

  actions.push({
    label: "Open Terminal",
    meta: "~",
    keywords: "terminal cli shell",
    run: () => terminal.open(),
  });

  actions.push({
    label: "Theme: cycle",
    meta: "T",
    keywords: "theme toggle",
    run: () => {
      const themeId = theme.cycle(1);
      toast.show(`Theme: ${themeId}`);
    },
  });

  content.themes.forEach((entry) => {
    actions.push({
      label: `Theme: ${entry.label}`,
      meta: entry.id,
      keywords: `theme ${entry.id} ${entry.label}`,
      run: () => {
        theme.setTheme(entry.id);
        toast.show(`Theme: ${entry.id}`);
      },
    });
  });

  actions.push({
    label: "Copy email",
    meta: content.profile.email,
    keywords: "copy email contact",
    run: () => {
      contact.copyByKey("email");
    },
  });

  actions.push({
    label: "Copy phone",
    meta: content.profile.phone,
    keywords: "copy phone contact",
    run: () => {
      contact.copyByKey("phone");
    },
  });

  actions.push({
    label: "Open GitHub",
    meta: "ext",
    keywords: "github repos",
    run: () => {
      window.open(content.profile.social.github, "_blank", "noopener");
    },
  });

  actions.push({
    label: "Open LinkedIn",
    meta: "ext",
    keywords: "linkedin",
    run: () => {
      window.open(content.profile.social.linkedin, "_blank", "noopener");
    },
  });

  actions.push({
    label: "Open resume.pdf",
    meta: "PDF",
    keywords: "resume pdf",
    run: () => {
      window.open("resume.pdf", "_blank", "noopener");
    },
  });

  content.projects.forEach((project) => {
    actions.push({
      label: `Project: ${project.title}`,
      meta: project.period,
      keywords: `project open ${project.title} ${(project.tags || []).join(" ")}`,
      run: () => {
        modal.open(project);
      },
    });
  });

  actions.push({
    label: "Experience: timeline",
    meta: "experience",
    keywords: "experience timeline",
    run: () => {
      experienceFeature.setView("timeline");
      router.scrollToHash("#experience");
    },
  });

  actions.push({
    label: "Experience: cards",
    meta: "experience",
    keywords: "experience cards",
    run: () => {
      experienceFeature.setView("cards");
      router.scrollToHash("#experience");
    },
  });

  actions.push({
    label: "Projects: clear filter",
    meta: "projects",
    keywords: "project all filter reset",
    run: () => {
      projectsFeature.setFilter("All");
      router.scrollToHash("#projects");
    },
  });

  return actions;
}

export async function bootstrapPortfolio(content) {
  createDocumentMetadataProvider({ metadata: content.metadata }).apply();
  renderAppShell({ content });

  const toast = createToastController();
  const theme = createThemeProvider({ themes: content.themes });
  const reveal = createRevealProvider();
  const router = createHashRouter();

  theme.init();
  createSpotlightProvider().init();
  createBackgroundFeature().init();
  createServiceWorkerProvider().register();

  const contact = createContactFeature({ profile: content.profile, toast });
  contact.init();

  const modal = createProjectModalFeature({ toast });
  let terminal;

  const hero = createHeroFeature({
    content,
    onAction(actionId) {
      if (actionId === "copy-email") {
        contact.copyByKey("email");
        return;
      }

      if (actionId === "open-terminal") {
        terminal?.open();
      }
    },
  });
  hero.render();

  createImpactFeature({ metrics: content.impact }).render();
  createStaffFeature({ staffData: content.staff }).render();

  const experience = createExperienceFeature({
    experienceContent: content.experience,
    reveal,
  });
  experience.init();

  const projects = createProjectsFeature({
    projects: content.projects,
    reveal,
    onProjectOpen(project) {
      modal.open(project);
    },
  });
  projects.init();

  createSkillsFeature({ skillCategories: content.skills }).init();
  createEducationFeature({ educationEntries: content.education }).render();

  terminal = createTerminalFeature({
    profile: content.profile,
    shell: content.shell,
    impact: content.impact,
    experience: content.experience.records,
    projects: content.projects,
    skills: content.skills,
    themes: content.themes,
    toast,
    onNavigate(route) {
      router.scrollToHash(route);
    },
    onOpenProject(project) {
      modal.open(project);
    },
    onThemeSet(themeId) {
      theme.setTheme(themeId);
    },
  });

  const palette = createCommandPaletteFeature({
    actions: buildPaletteActions({
      content,
      router,
      terminal,
      modal,
      projectsFeature: projects,
      experienceFeature: experience,
      theme,
      toast,
      contact,
    }),
  });

  createNavigationShortcutsFeature({
    onFocusProjectSearch() {
      document.getElementById("projectSearch")?.focus();
    },
    onCycleThemeBackward() {
      theme.cycle(-1);
    },
  }).init();

  router.init();
  reveal.observe(document);

  createShipRadarFeature({ radarConfig: content.radar }).init();
  createBootFeature({ shell: content.shell }).init();

  return {
    palette,
    terminal,
    modal,
    theme,
  };
}
