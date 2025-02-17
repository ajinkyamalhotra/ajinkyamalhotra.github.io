import {
  logAction
} from "../logger.js";

export function populateSocialLinks(socialContainer, socialLinks) {
  logAction(`${populateSocialLinks.name}()`, () => {
    socialContainer.innerHTML = `
      <a href="${socialLinks.github}" target="_blank" aria-label="GitHub">
        <i class="fab fa-github"></i>
      </a>
      <a href="${socialLinks.linkedin}" target="_blank" aria-label="LinkedIn">
        <i class="fab fa-linkedin"></i>
      </a>
      <a href="${socialLinks.email}" aria-label="Email">
        <i class="fas fa-envelope"></i>
      </a>
    `;

  });
}

export function populateInfo(siteNameEl, jobTitleEl, taglineEl, siteData,
  aboutEl
) {
  logAction(`${populateInfo.name}()`, () => {
    siteNameEl.textContent = siteData.name;
    jobTitleEl.textContent = siteData.jobTitle;
    taglineEl.textContent = siteData.tagline;
    const frag = document.createDocumentFragment();
    siteData.about.forEach(paragraph => {
      const p = document.createElement("p");
      p.className = "mb-4 text-lg";
      p.textContent = paragraph;
      frag.appendChild(p);
    });
    aboutEl.appendChild(frag);
  });
}