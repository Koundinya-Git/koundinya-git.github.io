import fs from 'fs/promises';
import path from 'path';

const ORCID = '0009-0001-3510-1878';
const OUT_FILE = path.join(process.cwd(), 'src', 'data', 'orcid.json');

async function fetchOrcidData() {
  console.log(`Fetching ORCID data for ${ORCID}...`);
  try {
    const res = await fetch(`https://pub.orcid.org/v3.0/${ORCID}/works`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!res.ok) {
      throw new Error(`ORCID API error: ${res.status} ${res.statusText}`);
    }
    
    const json = await res.json();
    const works = json.group || [];
    
    const mapped = works.map(group => {
      const summary = group['work-summary']?.[0] || {};
      const title = summary.title?.title?.value || 'Untitled';
      const year = summary['publication-date']?.year?.value || 'Unknown';
      const type = summary.type || 'Unknown';
      const journal = summary['journal-title']?.value || '';
      
      const externalIds = summary['external-ids']?.['external-id'] || [];
      const doiObj = externalIds.find(id => id['external-id-type'] === 'doi');
      const doi = doiObj ? doiObj['external-id-value'] : null;
      const url = doi ? `https://doi.org/${doi}` : summary.url?.value || null;

      return {
        title,
        year,
        type,
        journal,
        doi,
        url
      };
    });

    const data = {
      last_synced: new Date().toISOString(),
      works: mapped
    };

    await fs.writeFile(OUT_FILE, JSON.stringify(data, null, 2));
    console.log(`Successfully saved ${mapped.length} works to ${OUT_FILE}`);
  } catch (error) {
    console.error('Failed to fetch ORCID data:', error);
    process.exit(1); 
  }
}

fetchOrcidData();
