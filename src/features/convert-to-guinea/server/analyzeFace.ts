import { GoogleGenAI, Type } from "@google/genai";
import { getRequiredEnv } from "@shared/lib/env";
import { AnalysisFailedError, FaceNotDetectedError } from "./errors";

const ANALYSIS_MODEL = "gemini-2.5-flash-lite" as const;

let _genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!_genAI) {
    _genAI = new GoogleGenAI({ apiKey: getRequiredEnv("GEMINI_API_KEY") });
  }
  return _genAI;
}

const ANALYSIS_PROMPT =
  "Analyze only the visible facial appearance in this cropped photo. " +
  "Return concise English JSON written as image-generation design notes for a cute guinea pig avatar. " +
  "Do not identify the person. Do not mention age, ethnicity, race, or nationality. " +
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
  "genderPresentation (for styling cues only, not identity: classify the overall visual presentation as exactly one of \"masculine\", \"feminine\", or \"neutral\" based on hairstyle, styling, and visible cues; use \"unclear\" if not determinable); " +
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
    genderPresentation: {
      type: Type.STRING,
      enum: ["masculine", "feminine", "neutral", "unclear"],
    },
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
    "genderPresentation",
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
  genderPresentation: string;
  guineaPigTranslation: string;
}

export function isAbsent(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  return (
    normalized === "" ||
    normalized === "none" ||
    normalized === "not visible" ||
    normalized === "unclear"
  );
}

const CORE_FEATURE_KEYS = [
  "faceSilhouette",
  "eyes",
  "eyebrows",
  "hairstyle",
  "noseMouth",
  "expression",
] as const satisfies readonly (keyof FaceFeatures)[];

function hasDetectedFace(features: FaceFeatures): boolean {
  const absentCount = CORE_FEATURE_KEYS.filter((key) =>
    isAbsent(features[key]),
  ).length;

  return absentCount < 4;
}

function isRetryableError(error: unknown): boolean {
  const status = (error as { status?: number } | null)?.status;

  return status === 503 || status === 429;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

export async function analyzeFace(
  arrayBuffer: ArrayBuffer,
  mimeType: string,
): Promise<FaceFeatures> {
  const base64Data = Buffer.from(arrayBuffer).toString("base64");

  let response;

  for (let attempt = 0; ; attempt++) {
    try {
      response = await getGenAI().models.generateContent({
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
      break;
    } catch (error) {
      if (attempt >= MAX_RETRIES || !isRetryableError(error)) {
        if (isRetryableError(error)) {
          throw new AnalysisFailedError(
            "AI 분석 서비스가 혼잡합니다. 잠시 후 다시 시도해 주세요.",
          );
        }

        throw error;
      }

      console.warn(
        `[convert] analyzeFace retry ${attempt + 1}/${MAX_RETRIES} after error:`,
        error instanceof Error ? error.message : error,
      );

      await sleep(RETRY_DELAY_MS * (attempt + 1));
    }
  }

  if (response.promptFeedback?.blockReason) {
    throw new FaceNotDetectedError();
  }

  const text = response.text?.trim();

  if (!text) {
    throw new AnalysisFailedError();
  }

  let features: FaceFeatures;

  try {
    features = JSON.parse(text) as FaceFeatures;
  } catch {
    throw new AnalysisFailedError();
  }

  if (!hasDetectedFace(features)) {
    throw new FaceNotDetectedError();
  }

  return {
    ...features,
    signatureFeatures: Array.isArray(features.signatureFeatures)
      ? features.signatureFeatures.slice(0, 3)
      : [],
  };
}
