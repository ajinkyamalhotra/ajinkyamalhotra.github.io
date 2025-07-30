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
      p.style.textAlign = 'justify';
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

// Preloader
export function renderPreloader() {
  return logAction(`${renderPreloader.name}()`, () => {
    const preloader = document.createElement("div");
    preloader.id = "preloader";
    const loader = document.createElement("div");
    loader.className = "loader";
    preloader.appendChild(loader);
    return preloader;
  });
}

// Theme Toggle (Light/Dark)
export function renderThemeToggle() {
  return logAction(`${renderThemeToggle.name}()`, () => {
    const container = document.createElement("div");
    container.id = "themeToggleContainer";

    const label = document.createElement("label");
    label.className = "theme-switch";
    label.setAttribute("for", "themeToggle");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = "themeToggle";
    label.appendChild(input);

    const slider = document.createElement("div");
    slider.className = "slider";
    const sunIcon = document.createElement("span");
    sunIcon.className = "sun-icon";
    sunIcon.innerHTML = "&#9728;";
    const moonIcon = document.createElement("span");
    moonIcon.className = "moon-icon";
    moonIcon.innerHTML = "&#9790;";
    slider.appendChild(sunIcon);
    slider.appendChild(moonIcon);
    label.appendChild(slider);

    container.appendChild(label);
    return container;
  });
}

// Extra UI Elements (Back-to-Top, Global Search, Info Popup)
export function renderExtraUI() {
  return logAction(`${renderExtraUI.name}()`, () => {
    const container = document.createElement("div");

    // Back to Top Button
    const backToTopContainer = document.createElement("div");
    backToTopContainer.id = "backToTopContainer";
    const backToTop = document.createElement("button");
    backToTop.id = "backToTop";
    backToTop.innerHTML = `<i class="fas fa-arrow-up"></i>`;
    backToTopContainer.appendChild(backToTop);

    // Floating Search Button and Input
    const searchContainer = document.createElement("div");
    searchContainer.id = "searchContainer";

    const searchButton = document.createElement("button");
    searchButton.id = "searchIcon";
    searchButton.innerHTML = '<i class="fas fa-search"></i>';
    searchContainer.appendChild(searchButton);

    const infoButtonContainer = document.createElement("div");
    infoButtonContainer.id = "infoButtonContainer";

    // Website Info Button
    const infoButton = document.createElement("button");
    infoButton.id = "infoButton";
    infoButton.setAttribute("onclick", "toggleInfoPopup(event)");
    infoButton.innerHTML = `<i class="fas fa-info-circle"></i>`;
    infoButtonContainer.appendChild(infoButton);

    const searchWrapper = document.createElement("div");
    searchWrapper.className = "search-input-wrapper";
    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.id = "searchBox";
    searchBox.className = "fancy-search";
    searchBox.placeholder = "Global Search...";
    searchWrapper.appendChild(searchBox);
    const matchCounter = document.createElement("span");
    matchCounter.id = "matchCounter";
    matchCounter.className = "match-counter";
    searchWrapper.appendChild(matchCounter);
    searchContainer.appendChild(searchWrapper);
    container.appendChild(searchContainer);
    container.appendChild(infoButtonContainer);
    container.appendChild(backToTopContainer);

    // Hidden Deployment Details (Info Popup)
    // Removed commit_SHA from pop-up due to UI reasons:
    //<p><i class="fas fa-terminal"></i> Commit SHA: <span
    //id="versionSHA">Fetching...</span></p>
    const infoPopup = document.createElement("div");
    infoPopup.id = "infoPopup";
    infoPopup.innerHTML = `
    <p><i class="fas fa-code-branch"></i> Version: <span
    id="versionCount">Loading...</span></p>
    <p><i class="far fa-clock"></i> Last Updated: <span
    id="versionDate">Fetching...</span></p>
    <p><i class="fas fa-user"></i> Deployed By: <span
    id="versionDeployer">Fetching...</span></p>
    <p><i class="fas fa-star"></i> Stars: <span
    id="repoStars">Loading...</span></p>
    <p><i class="fas fa-code-branch"></i> Forks: <span
    id="repoForks">Loading...</span></p>
    <p><i class="fas fa-exclamation-circle"></i> Open Issues: <span
    id="repoIssues">Loading...</span></p>
    <p><i class="fas fa-code-pull-request"></i> Open PRs: <span
    id="repoPRs">Loading...</span></p>
    <p><i class="fas fa-code"></i> Languages Used:</p>
    <canvas id="languagesChart"></canvas>
  `;
    container.appendChild(infoPopup);

    return container;
  });
}
