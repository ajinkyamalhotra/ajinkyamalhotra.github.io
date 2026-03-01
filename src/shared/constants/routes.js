export const ROUTE_BY_SECTION = {
  overview: "#overview",
  impact: "#impact",
  staff: "#staff",
  experience: "#experience",
  projects: "#projects",
  skills: "#skills",
  education: "#education",
  resume: "#resume",
  contact: "#contact",
};

export const SECTION_BY_ROUTE = Object.fromEntries(
  Object.entries(ROUTE_BY_SECTION).map(([section, route]) => [route, section]),
);
