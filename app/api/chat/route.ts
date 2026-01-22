import { GoogleGenerativeAI } from "@google/generative-ai";

// Hardcoded credentials
const API_KEY = "AIzaSyDws-0Sw7k2y6vlywzvK6PAOIpsVuVfNpM";
const MODEL_NAME = "gemini-pro";

// ROOT Persona System Instruction
const SYSTEM_INSTRUCTION = `You are ROOT - the Elite Cyber Security Commander of the Hackify platform.

PERSONALITY:
- Tone: Dark, Professional, Hinglish (Hindi + English mix)
- Style: Hacker-style, Direct, No fluff
- Opener: "Terminal Ready. Command me." or "Access Granted."

RULES:
1. NEVER say generic things like "How can I help you?" - You are a commander, not a customer service bot.
2. If asked about ILLEGAL hacking (Instagram passwords, WiFi cracking, etc.), REFUSE immediately with: "⚠️ ACCESS DENIED. Illegal activities are prohibited. I only teach ethical hacking."
3. For code errors, provide the EXACT command in a code block.
4. Keep responses short, sharp, and use hacker slang when appropriate.
5. You can use Hinglish naturally (e.g., "Bhai, yeh command try kar", "Dekh, pehle basics samajh").

EXPERTISE:
- Ethical Hacking & Penetration Testing
- CTF (Capture The Flag) challenges
- Network Security & OSINT
- Web Application Security (XSS, SQLi, CSRF)
- Linux, Kali Linux, and security tools
- Programming for security (Python, Bash, etc.)`;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { role: "assistant", content: "Error: No messages provided." },
        { status: 400 }
      );
    }

    // Get the model
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Build chat history for Gemini
    const history: { role: "user" | "model"; parts: { text: string }[] }[] = [];

    // Add system instruction as first exchange
    history.push({
      role: "user",
      parts: [{ text: SYSTEM_INSTRUCTION + "\n\nAcknowledge this persona and respond as ROOT." }],
    });
    history.push({
      role: "model",
      parts: [{ text: "Terminal Ready. ROOT online. Command me, hacker." }],
    });

    // Add conversation history (skip the current message)
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      history.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content || "" }],
      });
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const userInput = lastMessage?.content || "";

    // Start chat with history
    const chat = model.startChat({ history });

    // Send message and get response (NO STREAMING)
    const result = await chat.sendMessage(userInput);
    const response = result.response;
    const text = response.text();

    // Return clean JSON response
    return Response.json({
      role: "assistant",
      content: text || "Terminal Error: Empty response received.",
    });
  } catch (error) {
    console.error("Gemini API Error:", error);

    // Return error as valid response so UI doesn't crash
    return Response.json({
      role: "assistant",
      content: "⚠️ SYSTEM ERROR: Connection to ROOT failed. Check your network and try again.",
    });
  }
}
