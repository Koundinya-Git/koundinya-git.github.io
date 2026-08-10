import fs from 'fs/promises';
import path from 'path';

const USERNAME = 'Koundinya-Git';
const OUT_FILE = path.join(process.cwd(), 'src', 'data', 'github.json');

async function fetchGitHubData() {
  console.log(`Fetching GitHub data for ${USERNAME}...`);
  try {
    const res = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`);
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }
    const repos = await res.json();
    
    // Filter out forks if desired, or keep them. Let's keep them but map only needed data
    const mapped = repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      updated_at: repo.updated_at,
      topics: repo.topics || [],
      homepage: repo.homepage,
      fork: repo.fork
    }));

    const data = {
      last_synced: new Date().toISOString(),
      repos: mapped
    };

    await fs.writeFile(OUT_FILE, JSON.stringify(data, null, 2));
    console.log(`Successfully saved ${mapped.length} repos to ${OUT_FILE}`);
  } catch (error) {
    console.error('Failed to fetch GitHub data:', error);
    // If it fails, we do NOT overwrite the existing file (keeps previous successful data)
    process.exit(1); 
  }
}

fetchGitHubData();
