/**
 * Rule-based repository analysis engine.
 * Accepts structured repo metadata and returns a quality score,
 * a list of observed strengths, and actionable improvement suggestions.
 */

function scoreStars(stars) {
  if (stars >= 10000) return 2.5;
  if (stars >= 1000) return 2.0;
  if (stars >= 100) return 1.5;
  if (stars >= 10) return 1.0;
  if (stars >= 1) return 0.5;
  return 0;
}

function scoreForks(forks) {
  if (forks >= 500) return 1.0;
  if (forks >= 100) return 0.75;
  if (forks >= 10) return 0.5;
  if (forks >= 1) return 0.25;
  return 0;
}

function scoreDescription(description) {
  if (!description) return 0;
  if (description.length >= 60) return 0.5;
  if (description.length >= 20) return 0.3;
  return 0.15;
}

function scoreTopics(topics) {
  if (topics.length >= 5) return 0.5;
  if (topics.length >= 3) return 0.4;
  if (topics.length >= 1) return 0.2;
  return 0;
}

function scoreIssueHealth(openIssues, stars) {
  if (stars === 0) return 0;
  const ratio = openIssues / stars;
  if (ratio > 1.5) return -1.0;
  if (ratio > 0.8) return -0.5;
  if (ratio > 0.4) return -0.25;
  if (openIssues === 0) return 0.3;
  return 0.1;
}

function scoreForkEngagement(forks, stars) {
  if (stars < 5) return 0;
  const ratio = forks / stars;
  if (ratio >= 0.4) return 0.5;
  if (ratio >= 0.2) return 0.3;
  if (ratio >= 0.1) return 0.15;
  return 0;
}

function collectStrengths({ name, description, stars, forks, openIssues, language, topics }) {
  const found = [];

  if (stars >= 10000) {
    found.push(`Exceptional community traction with ${stars.toLocaleString()} stars — a well-established project.`);
  } else if (stars >= 1000) {
    found.push(`Strong community adoption with ${stars.toLocaleString()} stars, signalling real-world utility.`);
  } else if (stars >= 100) {
    found.push(`Solid community interest backed by ${stars.toLocaleString()} stars.`);
  } else if (stars >= 10) {
    found.push(`Growing community visibility with ${stars} stars.`);
  }

  if (forks >= 500) {
    found.push(`Widely forked (${forks.toLocaleString()} forks), indicating heavy reuse and active contributions.`);
  } else if (forks >= 100) {
    found.push(`High fork count (${forks.toLocaleString()}) demonstrates strong developer interest in building on top of it.`);
  } else if (forks >= 10) {
    found.push(`Active forking activity (${forks} forks) shows the project inspires derivative work.`);
  }

  if (description && description.length >= 60) {
    found.push('Well-written description provides clear context for new contributors and users.');
  } else if (description && description.length >= 20) {
    found.push('Project has a description, aiding discoverability and first impressions.');
  }

  if (topics.length >= 5) {
    found.push(`Rich topic tagging (${topics.length} topics) maximises GitHub search discoverability.`);
  } else if (topics.length >= 3) {
    found.push(`Good topic coverage (${topics.join(', ')}) helps surface the project in relevant searches.`);
  } else if (topics.length >= 1) {
    found.push(`Topic tags are present, improving GitHub categorisation.`);
  }

  if (language) {
    found.push(`Built with ${language} — a well-supported ecosystem with broad tooling and contributor familiarity.`);
  }

  if (openIssues === 0 && stars >= 20) {
    found.push('Zero open issues reflects attentive maintenance and a polished release state.');
  } else if (stars > 0 && openIssues / stars < 0.1 && openIssues > 0) {
    found.push('Low open-issue-to-star ratio suggests an actively maintained project.');
  }

  if (stars >= 5 && forks / stars >= 0.3) {
    found.push('High fork-to-star ratio points to strong practical utility — developers are building with it, not just bookmarking it.');
  }

  return found.slice(0, 4);
}

function collectImprovements({ name, description, stars, forks, openIssues, language, topics }) {
  const found = [];

  if (!description) {
    found.push('Add a project description so visitors immediately understand the purpose and scope.');
  } else if (description.length < 20) {
    found.push('Expand the description with details on usage, goals, or the problem it solves.');
  }

  if (topics.length === 0) {
    found.push('Add relevant topic tags to improve discoverability in GitHub search and Explore.');
  } else if (topics.length < 3) {
    found.push('Add more topic tags — aim for at least three to maximise search coverage.');
  }

  if (stars > 0 && openIssues / stars > 0.8) {
    found.push(`High open issue count (${openIssues}) relative to stars may signal a maintenance backlog — consider a triage sprint.`);
  } else if (openIssues > 50 && stars < 200) {
    found.push(`${openIssues} open issues is significant for a project at this star count; address or label them to show responsiveness.`);
  }

  if (forks === 0 && stars >= 20) {
    found.push('No forks despite community interest — consider adding contribution guidelines to invite external work.');
  }

  if (stars < 10) {
    found.push('Share the project in relevant communities, newsletters, or blog posts to build initial momentum.');
  }

  if (!language) {
    found.push('The primary language is undetected — ensure source files are present and the repository is not purely docs or configs.');
  }

  if (openIssues === 0 && stars < 5) {
    found.push('With very few stars, prioritise exposure: a README with screenshots, badges, and a live demo can significantly boost interest.');
  }

  return found.slice(0, 4);
}

/**
 * @param {{ name: string, description: string|null, stars: number, forks: number,
 *           openIssues: number, language: string|null, topics: string[] }} repoMeta
 * @returns {{ score: number, strengths: string[], improvements: string[] }}
 */
function analyzeRepo(repoMeta) {
  const { description = null, stars = 0, forks = 0, openIssues = 0, language = null, topics = [] } = repoMeta;

  const raw =
    4.0 +
    scoreStars(stars) +
    scoreForks(forks) +
    scoreDescription(description) +
    scoreTopics(topics) +
    scoreIssueHealth(openIssues, stars) +
    scoreForkEngagement(forks, stars) +
    (language ? 0.25 : 0);

  const score = Math.min(10, Math.max(1, Math.round(raw)));

  return {
    score,
    strengths: collectStrengths({ description, stars, forks, openIssues, language, topics }),
    improvements: collectImprovements({ description, stars, forks, openIssues, language, topics }),
  };
}

module.exports = { analyzeRepo };
