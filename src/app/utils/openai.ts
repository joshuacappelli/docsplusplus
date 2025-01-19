import OpenAI from "openai";
import {config} from "dotenv";

config({path: ".env"});

const key = process.env.OPENAI_API_KEY;
console.log("key is: ", key);
const openai = new OpenAI(
    {
        apiKey: process.env.OPENAI_API_KEY,
    }
);

export default async function generateText(action: string, prompt: string) {
    let response; // Declare response variable once

    switch (action) {   
        case "summarize":
            response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{role: "developer", content: "You are a helpful assistant that summarizes text for documents."},
                    {
                        role: "user", 
                        content: "Summarize the following text: " + prompt,
                    },
                ],
                response_format: {type: "json_object"},
            });
            break; // Add break to prevent fall-through

        case "tableify":
            response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{role: "developer", content: "You are a helpful assistant that input text into a table for markdown. Given any input the data is formatted into a table. like this"},
                    {
                        role: "user", 
                        content: "Format the following text into a table: " + prompt,
                    },
                ],
                response_format: {type: "json_object"},
            });
            break; // Add break to prevent fall-through

        default:
            throw new Error("Invalid action"); // Handle invalid action
    }

    return response.choices[0].message; // Return the response
}

