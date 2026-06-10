// 임시 테스트 스크립트: Gemini 이미지 분석(analyzeFace) 단계만 단독 실행
// 사용법: node --env-file=.env.local scripts/test-analyze.mjs <이미지경로>
import { readFile } from "node:fs/promises";
import { GoogleGenAI, Type } from "@google/genai";

const ANALYSIS_MODEL = "gemini-2.5-flash-lite";

const ANALYSIS_PROMPT =
  "Look at the person's face in this photo and describe the visual features needed to recreate them " +
  "as a cartoon character: face shape, eye shape and color, eyebrow style, hairstyle (length, texture, bangs), " +
  "hair color, and any visible accessories on the head or face (glasses, earrings, hairpins, etc.). " +
  "Focus only on visual appearance. Do not mention age, gender, ethnicity, or identity. " +
  "If no accessories are visible, use \"none\".";

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    faceShape: { type: Type.STRING },
    eyeShape: { type: Type.STRING },
    eyeColor: { type: Type.STRING },
    eyebrows: { type: Type.STRING },
    hairstyle: { type: Type.STRING },
    hairColor: { type: Type.STRING },
    accessories: { type: Type.STRING },
  },
  required: [
    "faceShape",
    "eyeShape",
    "eyeColor",
    "eyebrows",
    "hairstyle",
    "hairColor",
    "accessories",
  ],
};

const imagePath = process.argv[2] ?? "tasks/1.png";
const mimeType = imagePath.endsWith(".jpg") || imagePath.endsWith(".jpeg")
  ? "image/jpeg"
  : "image/png";

const buffer = await readFile(imagePath);
const base64Data = buffer.toString("base64");

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await genAI.models.generateContent({
  model: ANALYSIS_MODEL,
  contents: [
    {
      role: "user",
      parts: [
        { text: ANALYSIS_PROMPT },
        { inlineData: { mimeType, data: base64Data } },
      ],
    },
  ],
  config: {
    responseMimeType: "application/json",
    responseSchema: ANALYSIS_SCHEMA,
  },
});

console.log(`[${imagePath}]`);
console.log(JSON.parse(response.text?.trim() ?? "{}"));
