// 임시 테스트 스크립트: analyzeFace -> buildPrompt -> flux-2-pro text2img 전체 파이프라인 단독 실행
// 사용법: node --env-file=.env.local scripts/test-convert.mjs <이미지경로> [animalTrait]
import { readFile } from "node:fs/promises";
import { GoogleGenAI, Type } from "@google/genai";
import Replicate from "replicate";

const ANALYSIS_MODEL = "gemini-2.5-flash-lite";
const MODEL = "black-forest-labs/flux-2-pro";

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

const PROMPT_BASE =
  "Generate a cute kawaii anthropomorphic guinea pig character, " +
  "as a close-up head/face portrait suitable for a profile picture. " +
  "GUINEA PIG FIRST: Prioritize guinea pig characteristics over human facial accuracy — small rounded ears (NOT pointy), " +
  "tiny Y-shaped nose pointing downward (NOT upturned pig snout), round compact head, chubby round cheeks, " +
  "large round cute eyes with a single white highlight dot, short brushstroke fur texture covering the face. " +
  "The result should clearly read as a guinea pig character first, with the person's likeness as a subtle accent. " +
  "FRAMING: This is a tight head-only avatar icon. No neck, shoulders, collar, or clothing should be visible — only the head/face remains, cropped immediately below the chin/jawline. " +
  "Do NOT add a hat, hood, or any headwear that extends down over the shoulders. The guinea pig head should fill most of the frame. " +
  "Art style: 2D cartoon illustration, clean black ink outlines, cel-shading, NOT 3D rendered. Centered composition, clean white background.";

function buildPrompt(features, traitDescription) {
  const accessoriesPart =
    features.accessories.toLowerCase() === "none"
      ? ""
      : ` ACCESSORIES: Add ${features.accessories}, positioned on the face or ears.`;

  const traitPart = traitDescription
    ? ` The guinea pig character should subtly reflect the impression of a ${traitDescription}: adopt characteristic eye shape, face proportions, and overall vibe of that animal type, while remaining a guinea pig.`
    : "";

  return (
    PROMPT_BASE +
    ` FACE: Subtly echo these features — face shape: ${features.faceShape}, eye shape: ${features.eyeShape}, eye color: ${features.eyeColor}, eyebrows: ${features.eyebrows} — just enough to feel personal.` +
    ` HAIR: Give the guinea pig a ${features.hairColor} ${features.hairstyle} hairstyle, adapted to sit naturally on its round head.` +
    accessoriesPart +
    traitPart
  );
}

const TRAIT_MAP = {
  고양이상: "cat-like almond eyes and sharp graceful features",
  강아지상: "friendly round puppy eyes and warm cheerful expression",
  토끼상: "large gentle eyes and soft innocent expression",
  여우상: "sharp pointed eyes and clever sly expression",
  곰상: "wide round eyes and big friendly chubby face",
  사슴상: "large doe eyes and delicate gentle expression",
  햄찌상: "very round chubby cheeks and tiny bright eyes",
  판다상: "wide dark-rimmed eyes and calm gentle expression",
};

const imagePath = process.argv[2] ?? "tasks/1.png";
const animalTrait = process.argv[3] ?? "";
const mimeType = imagePath.endsWith(".jpg") || imagePath.endsWith(".jpeg")
  ? "image/jpeg"
  : "image/png";

const buffer = await readFile(imagePath);
const base64Data = buffer.toString("base64");

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

const analysisResponse = await genAI.models.generateContent({
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

const faceFeatures = JSON.parse(analysisResponse.text.trim());
console.log("[1단계] face features:", faceFeatures);

const traitDescription = TRAIT_MAP[animalTrait] ?? animalTrait;
const prompt = buildPrompt(faceFeatures, traitDescription);
console.log("\n[2단계] prompt:", prompt);

const output = await replicate.run(MODEL, {
  input: {
    prompt,
    aspect_ratio: "1:1",
    output_format: "jpg",
    safety_tolerance: 2,
  },
});

console.log("\n[결과] image url:", output.url().href);
