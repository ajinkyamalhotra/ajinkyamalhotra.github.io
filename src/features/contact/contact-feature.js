import { copyText } from "@shared/services/clipboard-service.js";
import { qsa } from "@shared/utils/dom.js";

export function createContactFeature({ profile, toast }) {
  const valueByKey = () => ({
    email: profile.email,
    linkedin: profile.social.linkedin,
    github: profile.social.github,
    phone: profile.phone,
    profile: window.location.href.split("#")[0],
  });

  const successByKey = {
    email: "Email copied.",
    linkedin: "LinkedIn URL copied.",
    github: "GitHub URL copied.",
    phone: "Phone copied.",
    profile: "Profile link copied.",
  };

  async function copyByKey(key) {
    const value = valueByKey()[key];
    if (!value) {
      toast.show("Copy failed.");
      return;
    }

    const success = await copyText(value);
    toast.show(success ? successByKey[key] : "Copy failed.");
  }

  function hydrateFields() {
    const contactMeta = document.getElementById("contactMeta");
    if (contactMeta) {
      contactMeta.textContent = `${profile.email}  |  ${profile.phone}  |  ${profile.location}`;
    }

    const emailLink = document.getElementById("emailLink");
    const linkedInLink = document.getElementById("linkedinLink");
    const githubLink = document.getElementById("githubLink");
    const phoneLink = document.getElementById("phoneLink");
    const profileLink = document.getElementById("profileLink");

    if (emailLink) {
      emailLink.href = `mailto:${profile.email}`;
    }

    if (linkedInLink) {
      linkedInLink.href = profile.social.linkedin;
    }

    if (githubLink) {
      githubLink.href = profile.social.github;
    }

    if (phoneLink) {
      phoneLink.href = `tel:${profile.phone.replace(/[^\d+]/g, "")}`;
    }

    if (profileLink) {
      profileLink.href = window.location.href.split("#")[0];
    }
  }

  function bindCopyButtons() {
    qsa("[data-copy-key]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const key = button.getAttribute("data-copy-key");
        await copyByKey(key);
      });
    });
  }

  return {
    init() {
      hydrateFields();
      bindCopyButtons();
    },
    copyByKey,
  };
}
