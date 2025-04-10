import { GoogleGenerativeAI } from "@google/generative-ai";

const rankDescriptions = {
  Bronze:
    "Plays simple, focuses on immediate moves. May miss deeper threats or setups.",
  Silver:
    "Plays better than random. Starts blocking opponents and making basic patterns.",
  Gold: "Frequently blocks threats and builds towards 5-in-a-row. May miss complex traps.",
  Platinum:
    "Strong play. Looks 2-3 moves ahead, sets up traps and blocks efficiently.",
  Emerald: "Very strategic. Balances attack and defense with good awareness.",
  Diamond:
    "Plays with high precision. Reads multiple threats and sets up multi-way wins.",
  Master:
    "Extremely advanced. Prioritizes optimal plays, deeply evaluates the board.",
};

const modeDescriptions = {
  0: "Traditional Caro/Gomoku mode: exactly 5 in a row wins, and the line must not be blocked on both ends.",
  1: "Open Caro mode: 5 or more in a row wins, even if blocked on both sides.",
};

class GeminiService {
  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async ask(text) {
    try {
      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text }] }],
      });
      return result.response.text().trim();
    } catch (error) {
      return "Error generating response";
    }
  }

  async getComputerMove({ board, turn, rank, mode, turnDuration }) {
    const isValidMove = (x, y) => {
      return (
        Number.isInteger(x) &&
        Number.isInteger(y) &&
        x >= 0 &&
        x < 15 &&
        y >= 0 &&
        y < 15 &&
        board[x][y] === null
      );
    };

    const triedMoves = new Set();
    const maxTries = 5;

    // Total duration is in seconds, convert to ms
    const totalTimeMs = turnDuration * 1000;
    const delayMs = totalTimeMs / maxTries;

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    for (let i = 0; i < maxTries; i++) {
      const triedMovesArray = Array.from(triedMoves).map((key) =>
        key.split("-").map(Number)
      );

      const triedMovesText =
        triedMovesArray.length > 0
          ? `\nAvoid these previously attempted or invalid moves: ${triedMovesArray
              .map((m) => `[${m[0]}, ${m[1]}]`)
              .join(", ")}`
          : "";

      const prompt = `
  You're a Caro (Gomoku) AI player. The board is a 15x15 grid. Each cell is either null (empty), "X", or "O".
  
  You're playing as: "${turn}"  
  Rank: ${rank}  
  Playstyle: ${rankDescriptions[rank]}
  
  Game mode: ${modeDescriptions[mode]}
  
  Board state:
  ${board.map((row) => row.map((cell) => cell ?? ".").join(" ")).join("\n")}
  
  Make your next move based on your rank and the current state of the board.${triedMovesText}
  
  Return your move as a JSON array: [x, y]  
  Only return the array. No explanation or extra text.
      `;

      const response = await this.ask(prompt);
      console.log("Gemini raw response:", response);

      try {
        const clean = response
          .replace(/```json/i, "")
          .replace(/```/, "")
          .trim();

        const move = JSON.parse(clean);
        const moveKey = `${move[0]}-${move[1]}`;
        triedMoves.add(moveKey);

        if (
          Array.isArray(move) &&
          move.length === 2 &&
          isValidMove(move[0], move[1])
        ) {
          console.log(`✅ AI Move [${move[0]}, ${move[1]}]`);
          return move;
        } else {
          console.warn("⛔ Invalid or occupied move from AI:", move);
        }
      } catch (err) {
        console.error("❌ Failed to parse AI move:", err);
      }

      if (i < maxTries - 1) {
        await delay(delayMs);
      }
    }

    console.error("⚠️ Max retries reached. AI couldn't find a valid move.");
    return null;
  }
}

const geminiService = new GeminiService();
export default geminiService;
