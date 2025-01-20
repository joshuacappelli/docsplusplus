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
                    { role: "developer", content: "You are a helpful assistant that summarizes text and/or code for documents." },
                    { role: "user", content: "Summarize the following text and/or code: " + prompt },
                ],
            });
        } else if (normalizedAction === "tableify") {
            response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "developer", 
                      content: `You are a helpful assistant that formats text into a table.
                      The input text will be in the following format:
                      column1 column2 column3 column_n 
                      data1 data2 data3 data_n
                      The table should be in the following format:
                       | Column 1 | Column 2 | Column 3 | Column n |
                       | Data 1   | Data 2   | Data 3   | Data n   |` },
                    { role: "user", content: "Format the following text into a table and return the table only if it is already in the correct format then return the text as is: " + prompt },
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
