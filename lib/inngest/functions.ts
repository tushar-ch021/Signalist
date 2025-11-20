import { inngest } from "./client";
import {
    NEWS_SUMMARY_EMAIL_PROMPT,
    PERSONALIZED_WELCOME_EMAIL_PROMPT,
} from "./prompt";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { getNews } from "../actions/finnhub.action";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { getFormattedTodayDate } from "../utils";

// Local types to satisfy the compiler when sharing user/news shapes in this file.
// Adjust fields as needed to match real types elsewhere.
type UserData = {
    email: string;
    name?: string;
    [key: string]: unknown;
};

type MarketNewsArticle = {
    title?: string;
    description?: string;
    url?: string;
    source?: string;
    [key: string]: unknown;
};

// Send a personalized welcome email when a user is created
export const sendSignUpEmail = inngest.createFunction(
    { id: "send-signup-email" },
    [{ event: "app/user.created" }],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async ({ event, step }: { event: { data: UserData }; step: any }) => {
        try {
            const user = event.data || {};
            const userProfile = `- Country: ${user.country || ""}\n- Investment Goals: ${user.investmentGoals || ""}\n- Risk Tolerance: ${user.riskTolerance || ""}\n- Preferred Industry: ${user.preferredIndustry || ""}`;

            const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace("{{userProfile}}", userProfile);

            const response = await step.ai.infer("generate-welcome-intro", {
                model: step.ai.models.gemini({ model: "gemini-1.5-flash" }),
                body: {
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: prompt }],
                        },
                    ],
                },
            });

            const part = response?.candidates?.[0]?.content?.parts?.[0];
            const intro: string = (part && typeof part === "object" && "text" in part ? part.text : "") || "";

            await step.run("send-welcome-email", async () => {
                try {
                    await sendWelcomeEmail({
                        email: user.email,
                        name: user.name || "",
                        intro,
                    });
                } catch (e) {
                    console.error("sendSignUpEmail: sendWelcomeEmail failed", e);
                }
            });

            // Fetch and send initial stock recommendations (news summary)
            const articles = await step.run("fetch-initial-news", async () => {
                const news = await getNews();
                return (news || []).slice(0, 6);
            });

            const newsPrompt = NEWS_SUMMARY_EMAIL_PROMPT.replace("{{newsData}}", JSON.stringify(articles || [], null, 2));

            const newsResponse = await step.ai.infer("generate-initial-news-summary", {
                model: step.ai.models.gemini({ model: "gemini-1.5-flash" }),
                body: {
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: newsPrompt }],
                        },
                    ],
                },
            });

            const newsPart = newsResponse?.candidates?.[0]?.content?.parts?.[0];
            const newsContent = (newsPart && typeof newsPart === "object" && "text" in newsPart ? newsPart.text : "") || "No market news available.";

            await step.run("send-initial-news-email", async () => {
                try {
                    await sendNewsSummaryEmail({
                        email: user.email,
                        date: getFormattedTodayDate(),
                        newsContent,
                    });
                } catch (e) {
                    console.error("sendSignUpEmail: sendNewsSummaryEmail failed", e);
                }
            });

            return { success: true };
        } catch (e) {
            console.error("sendSignUpEmail: failed", e);
            return { success: false, error: String(e) };
        }
    }
);

// Daily news summary: either triggered by event or cron
export const sendDailyNewsSummary = inngest.createFunction(
    { id: "daily-news-summary" },
    [{ event: "app/send.daily.news" }, { cron: "0 12 * * *" }],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async ({ step }: { step: any }) => {
        try {
            const users = await step.run("get-all-users", getAllUsersForNewsEmail);
            if (!users || users.length === 0) return { success: false, message: "No user found for news email" };

            const perUser = await step.run("fetch-user-news", async () => {
                const results: Array<{ user: UserData; articles: MarketNewsArticle[] }> = [];
                for (const user of users as UserData[]) {
                    try {
                        const symbols = await getWatchlistSymbolsByEmail(user.email);
                        let articles = await getNews(symbols);
                        articles = (articles || []).slice(0, 6);
                        if (!articles || articles.length === 0) {
                            articles = await getNews();
                            articles = (articles || []).slice(0, 6);
                        }
                        results.push({ user, articles });
                    } catch (e) {
                        console.error("daily-news: error preparing user news", user.email, e);
                        results.push({ user, articles: [] });
                    }
                }
                return results;
            });

            // Summarize news per user via AI
            const userNewsSummaries: { user: UserData; newsContent: string | null }[] = [];

            for (const { user, articles } of perUser) {
                try {
                    const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace("{{newsData}}", JSON.stringify(articles || [], null, 2));
                    const response = await step.ai.infer(`summarize-news-${user.email}`, {
                        model: step.ai.models.gemini({ model: "gemini-1.5-flash" }),
                        body: { contents: [{ role: "user", parts: [{ text: prompt }] }] },
                    });

                    const part = response?.candidates?.[0]?.content?.parts?.[0];
                    const newsContent = (part && typeof part === "object" && "text" in part ? part.text : null) || "No market news.";
                    userNewsSummaries.push({ user, newsContent });
                } catch (e) {
                    console.error("Failed to summarize news for:", user.email, e);
                    userNewsSummaries.push({ user, newsContent: null });
                }
            }

            // Send emails
            await step.run("send-news-emails", async () => {
                await Promise.all(
                    userNewsSummaries.map(async ({ user, newsContent }) => {
                        if (!newsContent) return false;
                        try {
                            return await sendNewsSummaryEmail({ email: user.email, date: getFormattedTodayDate(), newsContent });
                        } catch (e) {
                            console.error("Failed to send news email to:", user.email, e);
                            return false;
                        }
                    })
                );
            });

            return { success: true, message: "Daily news summary emails sent successfully" };
        } catch (e) {
            console.error("sendDailyNewsSummary: failed", e);
            return { success: false, error: String(e) };
        }
    }
);