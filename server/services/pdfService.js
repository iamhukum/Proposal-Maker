const puppeteer = require('puppeteer-core');

function buildProposalHTML(proposal) {
  const { client_name, project_title, proposal_data, pricing_data, timeline_data } = proposal;
  const pd = proposal_data || {};
  const pricing = pricing_data || {};
  const timeline = timeline_data || {};

  const deliverablesList = (pd.deliverables || [])
    .map((d) => `<li>${d}</li>`)
    .join('');

  const pricingCards = ['basic', 'standard', 'premium']
    .map((tier) => {
      const t = pricing[tier];
      if (!t) return '';
      const features = (t.features || [])
        .map((f) => `<li>${f}</li>`)
        .join('');
      const isStandard = tier === 'standard';
      return `
        <div class="pricing-card ${isStandard ? 'featured' : ''}">
          ${isStandard ? '<div class="featured-badge">Recommended</div>' : ''}
          <h3>${t.name || tier}</h3>
          <div class="price">${t.price || ''}</div>
          <p class="tier-desc">${t.description || ''}</p>
          <ul>${features}</ul>
        </div>`;
    })
    .join('');

  const phases = (timeline.phases || [])
    .map(
      (phase, i) => `
      <div class="timeline-phase">
        <div class="phase-number">${String(i + 1).padStart(2, '0')}</div>
        <div class="phase-content">
          <h4>${phase.name}</h4>
          <span class="phase-duration">${phase.duration}</span>
          <p>${phase.description || ''}</p>
          ${
            phase.milestones
              ? `<div class="milestones">${phase.milestones.map((m) => `<span class="milestone">${m}</span>`).join('')}</div>`
              : ''
          }
        </div>
      </div>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #1a1a1a;
    line-height: 1.7;
    font-size: 14px;
    background: #ffffff;
  }

  .cover {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
    color: #ffffff;
    page-break-after: always;
  }

  .cover-label {
    text-transform: uppercase;
    letter-spacing: 6px;
    font-size: 11px;
    font-weight: 500;
    color: #888;
    margin-bottom: 40px;
  }

  .cover h1 {
    font-size: 52px;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 20px;
    letter-spacing: -1px;
  }

  .cover .client {
    font-size: 20px;
    font-weight: 300;
    color: #aaa;
    margin-bottom: 60px;
  }

  .cover-meta {
    display: flex;
    gap: 40px;
    font-size: 12px;
    color: #666;
  }

  .cover-meta span { text-transform: uppercase; letter-spacing: 2px; }

  .page {
    padding: 60px 80px;
    min-height: 100vh;
    page-break-after: always;
  }

  .section { margin-bottom: 60px; }

  .section-label {
    text-transform: uppercase;
    letter-spacing: 4px;
    font-size: 11px;
    font-weight: 600;
    color: #999;
    margin-bottom: 16px;
  }

  .section h2 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 24px;
    letter-spacing: -0.5px;
    color: #0a0a0a;
  }

  .section p {
    font-size: 15px;
    line-height: 1.8;
    color: #444;
    max-width: 640px;
  }

  .divider {
    width: 60px;
    height: 2px;
    background: #0a0a0a;
    margin: 40px 0;
  }

  .deliverables-list {
    list-style: none;
    padding: 0;
  }

  .deliverables-list li {
    padding: 16px 0;
    border-bottom: 1px solid #eee;
    font-size: 15px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .deliverables-list li::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #0a0a0a;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .pricing-section {
    display: flex;
    gap: 24px;
    margin-top: 32px;
  }

  .pricing-card {
    flex: 1;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 36px 28px;
    position: relative;
  }

  .pricing-card.featured {
    border-color: #0a0a0a;
    background: #fafafa;
  }

  .featured-badge {
    position: absolute;
    top: -12px;
    left: 28px;
    background: #0a0a0a;
    color: #fff;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    padding: 4px 16px;
    border-radius: 20px;
  }

  .pricing-card h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .price {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -1px;
  }

  .tier-desc {
    font-size: 13px;
    color: #666;
    margin-bottom: 20px;
  }

  .pricing-card ul {
    list-style: none;
    padding: 0;
  }

  .pricing-card ul li {
    padding: 8px 0;
    font-size: 13px;
    color: #444;
    border-bottom: 1px solid #f0f0f0;
  }

  .pricing-card ul li::before {
    content: '\\2713  ';
    color: #0a0a0a;
    font-weight: 600;
  }

  .timeline-phase {
    display: flex;
    gap: 28px;
    margin-bottom: 36px;
    padding-bottom: 36px;
    border-bottom: 1px solid #eee;
  }

  .phase-number {
    font-size: 42px;
    font-weight: 700;
    color: #e5e5e5;
    line-height: 1;
    min-width: 60px;
  }

  .phase-content h4 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .phase-duration {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #999;
    font-weight: 500;
  }

  .phase-content p {
    margin-top: 12px;
    font-size: 14px;
    color: #555;
    line-height: 1.7;
  }

  .milestones {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }

  .milestone {
    background: #f5f5f5;
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 11px;
    color: #555;
    font-weight: 500;
  }

  .footer {
    text-align: center;
    padding: 40px;
    color: #999;
    font-size: 12px;
  }
</style>
</head>
<body>

<div class="cover">
  <div class="cover-label">Project Proposal</div>
  <h1>${project_title || 'Project Proposal'}</h1>
  <div class="client">Prepared for ${client_name || 'Client'}</div>
  <div class="cover-meta">
    <span>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
    <span>Confidential</span>
  </div>
</div>

<div class="page">
  <div class="section">
    <div class="section-label">01 &mdash; Overview</div>
    <h2>Executive Summary</h2>
    <div class="divider"></div>
    <p>${pd.executive_summary || ''}</p>
  </div>

  <div class="section">
    <div class="section-label">02 &mdash; Understanding</div>
    <h2>Problem Understanding</h2>
    <div class="divider"></div>
    <p>${pd.problem_understanding || ''}</p>
  </div>
</div>

<div class="page">
  <div class="section">
    <div class="section-label">03 &mdash; Approach</div>
    <h2>Proposed Solution</h2>
    <div class="divider"></div>
    <p>${pd.proposed_solution || ''}</p>
  </div>

  <div class="section">
    <div class="section-label">04 &mdash; Scope</div>
    <h2>Scope of Work</h2>
    <div class="divider"></div>
    <p>${pd.scope_of_work || ''}</p>
  </div>
</div>

<div class="page">
  <div class="section">
    <div class="section-label">05 &mdash; Deliverables</div>
    <h2>What You'll Receive</h2>
    <div class="divider"></div>
    <ul class="deliverables-list">${deliverablesList}</ul>
  </div>
</div>

${
  pricingCards
    ? `<div class="page">
  <div class="section">
    <div class="section-label">06 &mdash; Investment</div>
    <h2>Pricing</h2>
    <div class="divider"></div>
    <div class="pricing-section">${pricingCards}</div>
  </div>
</div>`
    : ''
}

${
  phases
    ? `<div class="page">
  <div class="section">
    <div class="section-label">07 &mdash; Timeline</div>
    <h2>Project Timeline</h2>
    <div class="divider"></div>
    ${phases}
  </div>
</div>`
    : ''
}

<div class="footer">
  <p>${project_title || 'Proposal'} &mdash; Prepared for ${client_name || 'Client'} &mdash; ${new Date().getFullYear()}</p>
</div>

</body>
</html>`;
}

async function generatePDF(proposal) {
  const html = buildProposalHTML(proposal);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.CHROME_PATH || '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return pdf;
  } finally {
    await browser.close();
  }
}

module.exports = { generatePDF, buildProposalHTML };
