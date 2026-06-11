import { GoogleGenAI, Type } from "@google/genai";

const ANALYSIS_MODEL = "gemini-2.5-flash-lite" as const;

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ANALYSIS_PROMPT =
  "Analyze only the visible facial appearance in this cropped photo. " +
  "Return concise English JSON written as image-generation design notes for a cute guinea pig avatar. " +
  "Do not identify the person. Do not mention age, gender, ethnicity, race, nationality, or identity. " +
  'If a detail is unclear, use "unclear"; if it is not visible, use "not visible"; if there are no accessories, use "none". ' +
  "Prefer specific visual language over generic words. " +
  'For example, prefer "warm hazel-brown eyes" over "brown eyes", or "thin slightly arched brows" over "normal brows". ' +
  "Extract traits that can be translated into a guinea pig character, not copied as a human face. " +
  "Describe: faceSilhouette (outline, cheeks, jaw softness); eyes (size, shape, tilt, lid style, spacing, eye-smile quality, and color tone); " +
  "eyebrows (thickness, arch, angle, softness or sharpness); hairstyle (length, texture, and overall style name); " +
  "hairArchitecture (precise hair structure: center or off-center part location, left and right hair flow, hairline shape, visible forehead area, bangs or no bangs, side volume, top volume, and outer silhouette); " +
  "hairColor (specific shade); noseMouth (visible nose and mouth impression, translated as expression rather than anatomy); " +
  "expression (overall mood); accessories (glasses, earrings, hairpins, piercings, head accessories, or none); " +
  "headPose (camera angle and head direction); signatureFeatures (exactly 3 recognizable visual traits to preserve, prioritizing hair silhouette, eye size and shape, brows, and expression over generic traits); " +
  "likenessAnchor (one compact sentence combining the strongest resemblance cues: hair part and silhouette, eye size and shape, eyebrow placement, and smile mood); " +
  "and guineaPigTranslation (how to adapt the person into a cute guinea pig face while keeping the character clearly non-human).";

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    faceSilhouette: { type: Type.STRING },
    eyes: { type: Type.STRING },
    eyebrows: { type: Type.STRING },
    hairstyle: { type: Type.STRING },
    hairArchitecture: { type: Type.STRING },
    hairColor: { type: Type.STRING },
    noseMouth: { type: Type.STRING },
    expression: { type: Type.STRING },
    accessories: { type: Type.STRING },
    headPose: { type: Type.STRING },
    signatureFeatures: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    likenessAnchor: { type: Type.STRING },
    guineaPigTranslation: { type: Type.STRING },
  },
  required: [
    "faceSilhouette",
    "eyes",
    "eyebrows",
    "hairstyle",
    "hairArchitecture",
    "hairColor",
    "noseMouth",
    "expression",
    "accessories",
    "headPose",
    "signatureFeatures",
    "likenessAnchor",
    "guineaPigTranslation",
  ],
};

export interface FaceFeatures {
  faceSilhouette: string;
  eyes: string;
  eyebrows: string;
  hairstyle: string;
  hairArchitecture: string;
  hairColor: string;
  noseMouth: string;
  expression: string;
  accessories: string;
  headPose: string;
  signatureFeatures: string[];
  likenessAnchor: string;
  guineaPigTranslation: string;
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
      temperature: 0.1,
      topP: 0.1,
      candidateCount: 1,
      seed: 20250407,
    },
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Gemini가 이미지 분석 결과를 반환하지 않았습니다.");
  }

  const features = JSON.parse(text) as FaceFeatures;

  return {
    ...features,
    signatureFeatures: Array.isArray(features.signatureFeatures)
      ? features.signatureFeatures.slice(0, 3)
      : [],
  };
}
