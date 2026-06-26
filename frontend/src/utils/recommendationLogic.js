const normalize = (value) => value.toString().trim().toLowerCase();

export function getMatchScore(job, userSkills = []) {
  if (!userSkills.length || !job.skills?.length) {
    return 0;
  }

  const normalizedSkills = userSkills.map(normalize);
  const matchedSkills = job.skills.filter((skill) =>
    normalizedSkills.includes(normalize(skill)),
  );

  return Math.round((matchedSkills.length / job.skills.length) * 100);
}

export function getRecommendedJobs(jobs, skills, limit = 3) {
  return jobs
    .map((job) => ({ ...job, matchScore: getMatchScore(job, skills) }))
    .filter((job) => job.matchScore > 50)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

export default getRecommendedJobs;
