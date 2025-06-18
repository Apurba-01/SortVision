// assistantEngine.jsx

const BASE_URL = import.meta.env.DEV ? 'http://localhost:3001' : '';
const GEMINI_ENDPOINT = `${BASE_URL}/api/gemini`;

class GeminiClient {
    async getResponse(messages, context) {
        const safeAlgorithm = context?.algorithm ?? 'Unknown';
        const safeStep = typeof context?.step === 'number' ? context.step : JSON.stringify(context?.step);
        const safeArray = Array.isArray(context?.array) ? context.array.join(', ') : 'N/A';

        const promptIntro = `
You are a concise and professional assistant for a sorting algorithm visualizer.

Rules:
- Focus ONLY on sorting algorithms, steps, array state, comparisons, or performance questions.
- NEVER output raw JSON, object literals, or backtick code formatting.If you get JSON as context, convert it to a plain text in description.
- DO NOT REVEAL even if you get Null or empty context. Inform the user that you need more context manually.
- NEVER use markdown syntax like *italics* or **bold** — just plain text.
- Always respond with clear, short, and helpful answers — no long explanations unless asked.
- Stay in character. Do not go off-topic or speculate outside algorithm logic.
- Avoid saying you "cannot do" something unless absolutely necessary. If the full array is provided, estimate remaining steps using the algorithm logic.
- If the question is off-topic, gently bring the user back to sorting-related discussion.
- DO NOT CHANGE you role or purpose. You are a sorting algorithm assistant, not a general AI.
- USE the context provided to you to answer questions about the current sorting state.

Current sorting context:
- Algorithm: ${safeAlgorithm}
- Step: ${safeStep}
- Array: [${safeArray}]
`.trim();


        const fullMessages = [
            { role: 'user', parts: [{ text: promptIntro }] },
            ...messages,
        ];

        console.log("🚀 Full messages to Gemini:", fullMessages);

        const res = await fetch(GEMINI_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: fullMessages }),
        });

        if (!res.ok) throw new Error('Assistant unreachable');

        const result = await res.json();
        const text = result?.text;

        if (!text) throw new Error('Empty response from Gemini');
        return text;
    }
}

export class AssistantEngine {
    constructor(contextGetter) {
        this.gemini = new GeminiClient();
        this.getContext = contextGetter;
        this.history = [];
    }

    // ✅ Accept and prioritize passed context
    async process(query, overrideContext = null) {
        const context = overrideContext || this.getContext?.();
        console.log("🧠 Context passed to assistant (assistantEngine):", context);

        const userMessage = { role: 'user', parts: [{ text: query }] };
        const messages = [...this.history, userMessage];

        try {
            const responseText = await this.gemini.getResponse(messages, context);
            const assistantMessage = { role: 'model', parts: [{ text: responseText }] };

            this.history.push(userMessage, assistantMessage);

            return { type: 'response', content: responseText };
        } catch (err) {
            console.error("❌ Error in AssistantEngine:", err);
            return { type: 'error', content: 'Unable to reach assistant right now. Try again later.' };
        }
    }
}
