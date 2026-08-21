// Recommendation scoring will live here once skills and preferences are populated.
exports.scoreJob = (userSkills = [], jobSkills = []) => {
  if (!jobSkills.length) return 0;
  const normalized = new Set(userSkills.map((skill) => skill.toLowerCase()));
  const matches = jobSkills.filter((skill) => normalized.has(skill.toLowerCase())).length;
  return Math.round((matches / jobSkills.length) * 100);
};
