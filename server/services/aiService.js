const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateProposal(briefData) {
  const { client_name, project_title, services, budget, timeline } = briefData;

  const prompt = `You are a senior business consultant. Generate a professional proposal for the following brief.

Client: ${client_name}
Project: ${project_title}
Services Required: ${services}
${budget ? `Budget: ${budget}` : ''}
${timeline ? `Timeline: ${timeline}` : ''}

Return ONLY valid JSON with this exact structure:
{
  "executive_summary": "A compelling 2-3 paragraph executive summary",
  "problem_understanding": "2-3 paragraphs showing deep understanding of the client's needs",
  "proposed_solution": "2-3 paragraphs detailing the proposed approach",
  "scope_of_work": "Detailed scope broken into clear phases",
  "deliverables": ["deliverable 1", "deliverable 2", "deliverable 3", "deliverable 4", "deliverable 5"]
}

Make it professional, specific, and persuasive. Avoid generic filler.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  const parsed = JSON.parse(content);

  validateProposalData(parsed);
  return parsed;
}

async function generatePricing(briefData, proposalData) {
  const prompt = `Based on the following project details, generate three pricing tiers.

Project: ${briefData.project_title}
Services: ${briefData.services}
${briefData.budget ? `Client Budget Reference: ${briefData.budget}` : ''}

Proposal Summary: ${proposalData.executive_summary}

Return ONLY valid JSON with this exact structure:
{
  "basic": {
    "name": "Basic",
    "price": "$X,XXX",
    "description": "Brief description",
    "features": ["feature 1", "feature 2", "feature 3", "feature 4"]
  },
  "standard": {
    "name": "Standard",
    "price": "$X,XXX",
    "description": "Brief description",
    "features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5", "feature 6"]
  },
  "premium": {
    "name": "Premium",
    "price": "$X,XXX",
    "description": "Brief description",
    "features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5", "feature 6", "feature 7", "feature 8"]
  }
}

Make pricing realistic and professional. Each tier should be clearly differentiated.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  const parsed = JSON.parse(content);

  validatePricingData(parsed);
  return parsed;
}

async function generateTimeline(briefData, proposalData) {
  const prompt = `Based on the following project, generate a project timeline with phases and milestones.

Project: ${briefData.project_title}
Services: ${briefData.services}
${briefData.timeline ? `Desired Timeline: ${briefData.timeline}` : ''}

Scope: ${proposalData.scope_of_work}

Return ONLY valid JSON with this exact structure:
{
  "phases": [
    {
      "name": "Phase Name",
      "duration": "X weeks",
      "description": "What happens in this phase",
      "milestones": ["milestone 1", "milestone 2"]
    }
  ]
}

Include 3-6 phases. Be specific and realistic.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  const parsed = JSON.parse(content);

  validateTimelineData(parsed);
  return parsed;
}

async function regenerateSection(sectionName, briefData, currentContent) {
  const prompt = `Rewrite the following proposal section to be more compelling and professional.

Section: ${sectionName}
Project: ${briefData.project_title}
Client: ${briefData.client_name}
Services: ${briefData.services}

Current content:
${currentContent}

Return ONLY valid JSON with this structure:
{
  "content": "The rewritten section content"
}

Make it more persuasive, specific, and professional.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 800,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
}

function validateProposalData(data) {
  const required = ['executive_summary', 'problem_understanding', 'proposed_solution', 'scope_of_work', 'deliverables'];
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`AI response missing required field: ${field}`);
    }
  }
  if (!Array.isArray(data.deliverables)) {
    throw new Error('Deliverables must be an array');
  }
}

function validatePricingData(data) {
  const tiers = ['basic', 'standard', 'premium'];
  for (const tier of tiers) {
    if (!data[tier] || !data[tier].price || !Array.isArray(data[tier].features)) {
      throw new Error(`AI response missing or invalid pricing tier: ${tier}`);
    }
  }
}

function validateTimelineData(data) {
  if (!data.phases || !Array.isArray(data.phases) || data.phases.length === 0) {
    throw new Error('AI response missing valid phases array');
  }
  for (const phase of data.phases) {
    if (!phase.name || !phase.duration) {
      throw new Error('Each phase must have a name and duration');
    }
  }
}

module.exports = { generateProposal, generatePricing, generateTimeline, regenerateSection };
