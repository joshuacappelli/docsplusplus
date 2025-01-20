import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
    try {
        const body = await req.json(); // Parse JSON body
        const { action, prompt } = body;

        console.log("Request body:", body);

        // Validate the request payload
        if (!action || !prompt) {
            return NextResponse.json(
                { success: false, error: "Missing 'action' or 'prompt' in request body" },
                { status: 400 }
            );
        }

        // Normalize the action value
        const normalizedAction = action.trim().toLowerCase();
        if (normalizedAction !== "summarize" && normalizedAction !== "tableify") {
            return NextResponse.json(
                { success: false, error: `Invalid action: ${action}` },
                { status: 400 }
            );
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your environment
        });

        // Call OpenAI based on the action
        let response;
        if (normalizedAction === "summarize") {
            response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "developer", content: "You are a helpful assistant that summarizes text for documents." },
                    { role: "user", content: "Summarize the following text: " + prompt },
                ],
            });
        } else if (normalizedAction === "tableify") {
            response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "developer", content: "You are a helpful assistant that formats text into a markdown table." },
                    { role: "user", content: "Format the following text into a table: " + prompt },
                ],
            });
        }

        return NextResponse.json({ success: true, data: response?.choices[0].message });
    } catch (error) {
        console.error("Error with OpenAI API request:", error);

        return NextResponse.json(
            {
                success: false,
            },
            { status: 500 }
        );
    }
}
