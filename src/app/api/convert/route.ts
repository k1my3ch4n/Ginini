import { NextRequest, NextResponse } from "next/server";
import Replicate, { type FileOutput } from "replicate";
import { GoogleGenAI, Type } from "@google/genai";
import { ANIMAL_TRAIT_MAP } from "@shared/lib/animal-traits";

// AI 추론이 최대 120초 걸릴 수 있어서 Next.js route 타임아웃을 연장
export const maxDuration = 120;

const MODEL = "black-forest-labs/flux-2-pro" as const;
const ANALYSIS_MODEL = "gemini-2.5-flash-lite" as const;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ANALYSIS_PROMPT =
  "Look closely at the person's face in this photo and describe the visual features needed to recreate them " +
  "as a cartoon character. Be specific and vivid rather than generic — for example, prefer \"warm hazel-brown\" " +
  "over \"brown\", or \"thin and slightly arched\" over \"normal\". Describe: " +
  "face shape (e.g. round, oval, square, heart-shaped, with notable jawline or cheek features); " +
  "eye shape and color (size, tilt, lid shape, exact color tone); " +
  "eyebrow style (thickness, shape, arch); " +
  "nose shape (size and shape, e.g. small button nose, straight bridge, wide nostrils); " +
  "mouth and lip shape (size, fullness, resting expression of the mouth); " +
  "overall facial expression or vibe (e.g. bright and cheerful, calm and gentle, sharp and confident); " +
  "hairstyle (length, texture, parting, bangs, volume); hair color (specific shade); " +
  "any visible accessories on the head or face (glasses, earrings, hairpins, etc.); " +
  "and the head pose / viewing angle of the photo (e.g. straight-on front view, slightly turned to the left, " +
  "three-quarter view from the right, looking up, looking down). " +
  "Focus only on visual appearance. Do not mention age, gender, ethnicity, or identity. " +
  'If no accessories are visible, use "none".';

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    faceShape: { type: Type.STRING },
    eyeShape: { type: Type.STRING },
    eyeColor: { type: Type.STRING },
    eyebrows: { type: Type.STRING },
    noseShape: { type: Type.STRING },
    mouthShape: { type: Type.STRING },
    expression: { type: Type.STRING },
    hairstyle: { type: Type.STRING },
    hairColor: { type: Type.STRING },
    accessories: { type: Type.STRING },
    headPose: { type: Type.STRING },
  },
  required: [
    "faceShape",
    "eyeShape",
    "eyeColor",
    "eyebrows",
    "noseShape",
    "mouthShape",
    "expression",
    "hairstyle",
    "hairColor",
    "accessories",
    "headPose",
  ],
};

export interface FaceFeatures {
  faceShape: string;
  eyeShape: string;
  eyeColor: string;
  eyebrows: string;
  noseShape: string;
  mouthShape: string;
  expression: string;
  hairstyle: string;
  hairColor: string;
  accessories: string;
  headPose: string;
}

async function analyzeFace(
  arrayBuffer: ArrayBuffer,
  mimeType: string,
): Promise<FaceFeatures> {
  const base64Data = Buffer.from(arrayBuffer).toString("base64");

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

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Gemini가 이미지 분석 결과를 반환하지 않았습니다.");
  }

  return JSON.parse(text) as FaceFeatures;
}

const PROMPT_BASE =
  "Generate a cute kawaii anthropomorphic guinea pig character, " +
  "as a close-up head/face portrait suitable for a profile picture. " +
  "GUINEA PIG FIRST: Prioritize guinea pig characteristics over human facial accuracy — small rounded ears (NOT pointy), " +
  "tiny Y-shaped nose pointing downward (NOT upturned pig snout), round compact head, chubby round cheeks, " +
  "cute cartoon eyes with a single white highlight dot, short brushstroke fur texture covering the face. " +
  "Eye size and shape should vary based on the analyzed face below — not all guinea pigs should have the same big round eyes. " +
  "The result should clearly read as a guinea pig character first, with the person's likeness as a subtle accent. " +
  "FRAMING: This is a tight head-only avatar icon. No neck, shoulders, collar, or clothing should be visible — only the head/face remains, cropped immediately below the chin/jawline. " +
  "Do NOT add a hat, hood, or any headwear that extends down over the shoulders. The guinea pig head should fill most of the frame. " +
  "Art style: 2D cartoon illustration, clean black ink outlines, cel-shading, NOT 3D rendered. Centered composition, clean white background.";

function buildPrompt(features: FaceFeatures, traitDescription: string): string {
  const accessoriesPart =
    features.accessories.toLowerCase() === "none"
      ? ""
      : ` ACCESSORIES: Add ${features.accessories}, positioned on the face or ears.`;

  const traitPart = traitDescription
    ? ` The guinea pig character should subtly reflect the impression of a ${traitDescription}: adopt characteristic eye shape, face proportions, and overall vibe of that animal type, while remaining a guinea pig.`
    : "";

  return (
    PROMPT_BASE +
    ` EYES: The eye shape and size must closely follow the analyzed feature — eye shape: ${features.eyeShape}, eye color: ${features.eyeColor}. Do not default to large round eyes if the analyzed shape is different (e.g. narrow, droopy, upturned, hooded).` +
    ` FACE: Subtly echo these features — face shape: ${features.faceShape}, eyebrows: ${features.eyebrows}, nose: ${features.noseShape}, mouth: ${features.mouthShape} — just enough to feel personal.` +
    ` EXPRESSION: Give the character a ${features.expression} expression.` +
    ` HAIR: Give the guinea pig a ${features.hairColor} ${features.hairstyle} hairstyle, adapted to sit naturally on its round head.` +
    ` POSE: The head should be oriented as if photographed from a ${features.headPose} angle, while keeping the character centered in frame.` +
    accessoriesPart +
    traitPart
  );
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX ?? "3", 10);
const RATE_LIMIT_WINDOW =
  parseInt(process.env.RATE_LIMIT_WINDOW_SEC ?? "60", 10) * 1000;

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { message: "요청 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 429, headers: { "X-RateLimit-Remaining": "0" } },
    );
  }

  try {
    const formData = await req.formData();
    const image = formData.get("image") as File | null;
    const animalTrait = (formData.get("animalTrait") as string | null) ?? "";

    if (!image) {
      return NextResponse.json(
        { message: "이미지가 없습니다." },
        { status: 400 },
      );
    }

    const traitDescription = ANIMAL_TRAIT_MAP[animalTrait] ?? animalTrait;

    const arrayBuffer = await image.arrayBuffer();

    const faceFeatures = await analyzeFace(arrayBuffer, image.type);
    console.log("[convert] Gemini face analysis:", faceFeatures);

    const prompt = buildPrompt(faceFeatures, traitDescription);

    const output = (await replicate.run(MODEL, {
      input: {
        prompt,
        aspect_ratio: "1:1",
        output_format: "jpg",
        safety_tolerance: 2,
      },
    })) as FileOutput;

    const resultUrl = output.url().href;

    return NextResponse.json(
      { resultUrl },
      { headers: { "X-RateLimit-Remaining": String(remaining) } },
    );
  } catch (err) {
    console.error("[convert] error:", err);

    const message =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";

    if (message.includes("402") || message.includes("insufficient")) {
      return NextResponse.json(
        { message: "API 크레딧이 부족합니다." },
        { status: 402 },
      );
    }

    return NextResponse.json(
      {
        message: "변환 중 오류가 발생했습니다. 다시 시도해 주세요.",
        ...(process.env.NODE_ENV === "development" && { detail: message }),
      },
      { status: 500 },
    );
  }
}
