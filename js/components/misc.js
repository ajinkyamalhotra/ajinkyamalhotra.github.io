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

    // If siteData.taglines exists and is an array, start the typewriter effect
    if (Array.isArray(siteData.taglines) && siteData.taglines.length > 1) {
      typewriterEffect(taglineEl, siteData.taglines);
    } else {
      // Fallback: use a static tagline
      taglineEl.textContent = siteData.taglines[0];
    }

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

function typewriterEffect(
  element, taglines, typeSpeed = 100, eraseSpeed = 50, delayBetweenWords = 2000) {
  let taglineIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < taglines[taglineIndex].length) {
      element.textContent += taglines[taglineIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typeSpeed);
    } else {
      // Pause after typing the full tagline before erasing
      setTimeout(erase, delayBetweenWords);
    }
  }

  function erase() {
    if (charIndex > 0) {
      element.textContent = taglines[taglineIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, eraseSpeed);
    } else {
      // Move to the next tagline; loop back to the first one if at the end
      taglineIndex = (taglineIndex + 1) % taglines.length;
      setTimeout(type, typeSpeed);
    }
  }

  type();
}