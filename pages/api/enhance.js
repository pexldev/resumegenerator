import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, field } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set');
    return res.status(500).json({ error: 'API configuration error' });
  }

  const prompts = {
    profileSummary: `
You are enhancing a professional summary for a resume.

Rewrite the following professional summary so that:
- You keep all real facts and experiences mentioned.
- You do NOT invent new achievements or skills.
- You improve clarity, grammar, and professionalism.
- You make it compelling and impactful for hiring managers.
- You keep it concise (2-3 sentences, 50-75 words max).
- You return ONLY the improved summary text, no explanations.

Original summary:
"${text}"
`,
  education: `
You are enhancing an education entry for a professional resume.

Rewrite the following education description so that:
- You keep ALL factual details (degree, institution, dates, location, grades, majors/minors, awards).
- You do NOT invent new universities, degrees, years, or achievements.
- You improve clarity, grammar, and professionalism.
- You highlight relevant achievements (e.g., honors, projects, leadership) ONLY if the user mentioned them.
- You keep the length similar (do NOT turn it into a long paragraph).
- You return ONLY the improved education text (no bullets, no labels, no explanations unless the original had them).

Original education text:
"${text}"
`,

  workExperience: `
You are enhancing a work experience section for a professional resume.

Rewrite the following responsibilities/experience so that:
- You keep all real facts (company names, job titles, dates, tools, technologies, domains, industries, metrics).
- You do NOT invent new achievements, numbers, or responsibilities that are not implied by the text.
- You rewrite in strong, action-oriented bullet style (each line starting with a strong verb).
- You highlight impact and outcomes where the user text suggests them (e.g., improved, reduced, increased).
- You improve clarity, conciseness, and ATS-friendliness (include relevant keywords naturally).
- You keep roughly the same number of bullet points and similar length.
- You return ONLY the enhanced bullets/lines, one per line, no extra commentary.

Original work experience text:
"${text}"
`,

  languages: `
You are enhancing a language proficiency section for a professional resume.

Rewrite the following language details so that:
- You keep all mentioned languages and proficiency levels (do NOT add or remove languages).
- You map vague levels (good, basic, fluent) into standard terms where appropriate (e.g., Native, Professional, Conversational, Basic).
- You keep the format clean and compact (e.g., "English â€“ Native, Hindi â€“ Professional Working Proficiency").
- You improve clarity and professionalism, but do NOT invent new languages or proficiency.
- You return ONLY the enhanced language line(s), no explanations.

Original language text:
"${text}"
`,

  skills: `
You are enhancing a skills section for a professional resume.

Rewrite the following skills so that:
- You keep ONLY the skills explicitly mentioned or clearly implied (do NOT add new tools or technologies).
- You group related skills logically where useful (e.g., "Salesforce (Sales Cloud, Service Cloud, Flow)", "Frontend: React, Next.js").
- You remove duplicates, filler words, and overly generic terms where possible.
- You make it ATS-friendly by using common industry skill names and commas or pipes for separation.
- You keep it concise and scannable (1â€“3 lines max).
- You return ONLY the enhanced skills text, no bullet labels like "Skills:" unless present in the original.

Original skills text:
"${text}"
`,

  certifications: `
You are enhancing a certifications section for a professional resume.

Rewrite the following certifications so that:
- You keep all real details (certification name, issuing body, dates, credential IDs, links) exactly as given.
- You do NOT invent new certifications, dates, or issuing bodies.
- You normalize the format (e.g., "Salesforce Certified Administrator â€“ Salesforce, 2023").
- You keep each certification on its own line if there are multiple.
- You improve readability and professionalism while preserving facts.
- You return ONLY the enhanced certification line(s), no extra commentary.

Original certification text:
"${text}"
`
};

  const prompt = prompts[field];

if (!prompt) {
  return res.status(400).json({ error: `Unknown field: ${field}` });
}

try {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
  }

  res.write('data: [DONE]\n\n');
  res.end();
} catch (error) {
  console.error('OpenAI Error:', error);
  res.write(`data: ${JSON.stringify({ error: 'Failed to enhance content', details: error.message })}\n\n`);
  res.end();
}
}