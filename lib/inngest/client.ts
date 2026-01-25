import { Inngest } from "inngest";
export const inngest = new Inngest({
    id: 'signalist',
    eventKey: process.env.INNGEST_EVENT_KEY,
    ai: {
        openai: {
            apiKey: process.env.PERPLEXITY_API_KEY,
            baseURL: "https://api.perplexity.ai"
        }
    }
})