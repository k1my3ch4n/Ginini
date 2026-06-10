import { GoogleGenAI, Type } from "@google/genai";

const ANALYSIS_MODEL = "gemini-2.5-flash-lite" as const;

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ANALYSIS_PROMPT =
  "Look closely at the person's face in this photo and describe the visual features needed to recreate them " +
  'as a cartoon character. Be specific and vivid rather than generic — for example, prefer "warm hazel-brown" ' +
  'over "brown", or "thin and slightly arched" over "normal". Describe: ' +
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

export async function analyzeFace(
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
