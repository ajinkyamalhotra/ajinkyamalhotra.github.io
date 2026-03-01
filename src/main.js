import { bootstrapPortfolio } from "@app/bootstrap.js";
import { siteContent } from "@shared/config/content-registry.js";

document.addEventListener("DOMContentLoaded", () => {
  bootstrapPortfolio(siteContent);
});
