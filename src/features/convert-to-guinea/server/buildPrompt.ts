import type { FaceFeatures } from "./analyzeFace";

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

export function buildPrompt(
  features: FaceFeatures,
  traitDescription: string,
): string {
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
