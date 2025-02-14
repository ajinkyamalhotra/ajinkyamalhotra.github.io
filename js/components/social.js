export function populateSocialLinks(socialContainer, socialLinks) {
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
      <a href="resume.pdf" target="_blank" aria-label="Resume" title="View Resume">
        <i class="fas fa-file-alt"></i>
      </a>
    `;
}
