import fs from 'fs';
import https from 'https';

const supabaseUrl = 'https://flikehslxiymalpzduos.supabase.co';
const supabaseKey = 'sb_publishable_4HhpHpEkjtteBS4CstWphA_U_kDzjks';

const fetchArticles = () => {
  return new Promise((resolve, reject) => {
    const url = new URL(`${supabaseUrl}/rest/v1/articles?select=id,updated_at`);
    const options = {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`API Error: ${res.statusCode} ${data}`));
        }
      });
    }).on('error', reject);
  });
};

(async () => {
  try {
    const articles = await fetchArticles();
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // Main Pages
    sitemap += `  <url>\n    <loc>https://www.panafricansciencehub.com/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    sitemap += `  <url>\n    <loc>https://www.panafricansciencehub.com/articles</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;

    for (const article of articles) {
      // Format date
      const date = article.updated_at ? new Date(article.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      sitemap += `  <url>\n    <loc>https://www.panafricansciencehub.com/articles/${article.id}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    }

    sitemap += `</urlset>`;

    fs.writeFileSync('public/sitemap.xml', sitemap);
    console.log(`Successfully generated sitemap with ${articles.length} articles.`);
  } catch (err) {
    console.error(err);
  }
})();
