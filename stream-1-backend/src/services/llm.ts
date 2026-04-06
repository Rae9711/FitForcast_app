type InsightNarrative = {
  title: string;
  summary: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  bullets: string[];
};

type ForecastNarrative = {
  headline: string;
  coachSummary: string;
  priorities: string[];
  nextActions: string[];
  checkInQuestions: string[];
};

type LlmProvider = 'off' | 'openai' | 'ollama' | 'jac';

type ChatMessage = {
  role: 'system' | 'user';
  content: string;
};

const provider = (process.env.INSIGHTS_LLM_PROVIDER ?? 'off') as LlmProvider;

const buildMessages = (narrative: InsightNarrative, stats: Record<string, unknown>): ChatMessage[] => [
  {
    role: 'system',
    content:
      'You rewrite personalized fitness insights into concise, plain-language user copy. Preserve the evidence-based meaning. Return valid JSON only.'
  },
  {
    role: 'user',
    content: JSON.stringify({
      task: 'Rewrite the following FitForecast insight without inventing any new evidence.',
      output_schema: {
        title: 'string',
        summary: 'string',
        priority: 'high | medium | low',
        category: 'string',
        bullets: ['string', 'string', 'string']
      },
      insight: narrative,
      supporting_stats: stats
    })
  }
];

const buildForecastMessages = (narrative: ForecastNarrative, stats: Record<string, unknown>): ChatMessage[] => [
  {
    role: 'system',
    content:
      'You turn structured fitness prediction output into concise, evidence-grounded coaching language. Preserve the evidence, do not invent claims, and return valid JSON only.'
  },
  {
    role: 'user',
    content: JSON.stringify({
      task: 'Rewrite the following FitForecast forecast summary into clearer coaching copy without changing the evidence or confidence.',
      output_schema: {
        headline: 'string',
        coachSummary: 'string',
        priorities: ['string', 'string', 'string'],
        nextActions: ['string', 'string', 'string'],
        checkInQuestions: ['string', 'string']
      },
      narrative,
      supporting_stats: stats
    })
  }
];

const extractJson = (raw: string) => {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw.slice(start, end + 1)) as Partial<InsightNarrative>;
    if (
      typeof parsed.title !== 'string' ||
      typeof parsed.summary !== 'string' ||
      typeof parsed.priority !== 'string' ||
      typeof parsed.category !== 'string' ||
      !Array.isArray(parsed.bullets)
    ) {
      return null;
    }

    return {
      title: parsed.title,
      summary: parsed.summary,
      priority: parsed.priority as InsightNarrative['priority'],
      category: parsed.category,
      bullets: parsed.bullets.filter((item): item is string => typeof item === 'string').slice(0, 3)
    } satisfies InsightNarrative;
  } catch {
    return null;
  }
};

const extractForecastJson = (raw: string) => {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw.slice(start, end + 1)) as Partial<ForecastNarrative>;
    if (
      typeof parsed.headline !== 'string' ||
      typeof parsed.coachSummary !== 'string' ||
      !Array.isArray(parsed.priorities) ||
      !Array.isArray(parsed.nextActions) ||
      !Array.isArray(parsed.checkInQuestions)
    ) {
      return null;
    }

    return {
      headline: parsed.headline,
      coachSummary: parsed.coachSummary,
      priorities: parsed.priorities.filter((item): item is string => typeof item === 'string').slice(0, 3),
      nextActions: parsed.nextActions.filter((item): item is string => typeof item === 'string').slice(0, 3),
      checkInQuestions: parsed.checkInQuestions.filter((item): item is string => typeof item === 'string').slice(0, 2)
    } satisfies ForecastNarrative;
  } catch {
    return null;
  }
};

const callOpenAiCompatible = async (messages: ChatMessage[]) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const baseUrl = process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1';
  const model = process.env.OPENAI_MODEL ?? 'gpt-4.1-mini';
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages
    })
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return payload.choices?.[0]?.message?.content ?? null;
};

const callOllama = async (messages: ChatMessage[]) => {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
  const model = process.env.OLLAMA_MODEL ?? 'llama3.1';
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      stream: false,
      format: 'json',
      messages
    })
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    message?: { content?: string };
  };
  return payload.message?.content ?? null;
};

const callJac = async (narrative: InsightNarrative, stats: Record<string, unknown>) => {
  const baseUrl = process.env.JAC_LLM_URL ?? 'http://127.0.0.1:8787';
  const apiKey = process.env.JAC_LLM_API_KEY;
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/rewrite-insight`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify({
      narrative,
      supporting_stats: stats
    })
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    result?: InsightNarrative;
  };
  return payload.result ? JSON.stringify(payload.result) : null;
};

const callJacForecast = async (narrative: ForecastNarrative, stats: Record<string, unknown>) => {
  const baseUrl = process.env.JAC_LLM_URL ?? 'http://127.0.0.1:8787';
  const apiKey = process.env.JAC_LLM_API_KEY;
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/personalize-forecast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify({
      narrative,
      supporting_stats: stats
    })
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    result?: ForecastNarrative;
  };
  return payload.result ? JSON.stringify(payload.result) : null;
};

export const maybeEnhanceInsightNarrative = async (
  narrative: InsightNarrative,
  stats: Record<string, unknown>
) => {
  if (provider === 'off') {
    return narrative;
  }

  try {
    const messages = buildMessages(narrative, stats);
    const raw =
      provider === 'openai'
        ? await callOpenAiCompatible(messages)
        : provider === 'ollama'
          ? await callOllama(messages)
          : await callJac(narrative, stats);

    if (!raw) {
      return narrative;
    }

    return extractJson(raw) ?? narrative;
  } catch {
    return narrative;
  }
};

export const maybePersonalizeForecastNarrative = async (
  narrative: ForecastNarrative,
  stats: Record<string, unknown>
) => {
  if (provider === 'off') {
    return narrative;
  }

  try {
    const messages = buildForecastMessages(narrative, stats);
    const raw =
      provider === 'openai'
        ? await callOpenAiCompatible(messages)
        : provider === 'ollama'
          ? await callOllama(messages)
          : await callJacForecast(narrative, stats);

    if (!raw) {
      return narrative;
    }

    return extractForecastJson(raw) ?? narrative;
  } catch {
    return narrative;
  }
};