import { isAbsent, type FaceFeatures } from "./analyzeFace";

function getHairTemplate(features: FaceFeatures): string {
  return (
    `Use a compact hairstyle in ${features.hairColor}, kept inside the top third of the head with a clean rounded silhouette and smooth soft tips. ` +
    `This hairstyle color (${features.hairColor}) is fixed and independent from the guinea pig's fur color — never lighten, whiten, or blend the hair toward the cream fur tone. ` +
    `Translate this analyzed hair structure directly into the part, bangs, hairline, and volume distribution: ${features.hairArchitecture}; overall style: ${features.hairstyle}.`
  );
}

function getEyeTemplate(features: FaceFeatures): string {
  return (
    "Use a glossy oval eye shape with a clean outer outline and no decorative lash strokes. " +
    `Translate this analyzed eye size, shape, tilt, and mood directly into the eyes: ${features.eyes}.`
  );
}

const GENDER_STYLING_MAP: Record<string, string> = {
  masculine:
    "Style the guinea pig with a masculine-leaning presentation: no eyelashes, no lipstick or lip tint, no blush, and a simple unisex hairstyle silhouette.",
  feminine:
    "Style the guinea pig with a feminine-leaning presentation: subtle eyelashes and soft natural blush are okay, kept cute rather than heavily made up.",
  neutral:
    "Keep the guinea pig's styling gender-neutral: no eyelashes, no lipstick or lip tint, no gendered makeup cues.",
};

function getGenderStyling(features: FaceFeatures): string {
  const key = features.genderPresentation.trim().toLowerCase();

  return GENDER_STYLING_MAP[key] ?? GENDER_STYLING_MAP.neutral;
}

export function buildPrompt(
  features: FaceFeatures,
  traitDescription: string,
): string {
  const signatureFeatures = features.signatureFeatures
    .filter((feature) => !isAbsent(feature))
    .join(", ");

  const accessoriesPart = isAbsent(features.accessories)
    ? ""
    : ` Add this visible accessory naturally on the guinea pig face or rounded ears: ${features.accessories}.`;

  const traitPart = traitDescription
    ? ` Subtle animal-impression cue for the eyes, expression, and cheek/jaw shape — apply gently without overriding the primary likeness anchor: ${traitDescription}.`
    : "";

  return [
    "Create exactly one personalized cute 2D guinea pig face avatar for a square profile icon.",
    "The image must be a single front-facing guinea pig head portrait on a clean white background.",
    "Use a fixed avatar template: perfectly centered round compact guinea pig head, small rounded ears, plush cheeks, soft short fur, tiny downward Y-shaped nose, small rounded muzzle, closed curved smile.",
    "The guinea pig head fills 92 percent of the square. The lower edge is a smooth round cheek-and-chin fur boundary touching the bottom of the icon.",
    "Visible subject area: face, ears, cheek fur, chin fur, and the person's hairstyle only. Do not depict hands, paws, arms, feet, legs, or any body parts below the neck — no limbs should appear anywhere in the frame.",
    "Use a single uniform warm ivory or light cream fur color across the entire head, including the ears, cheeks, muzzle, and chin fur, with only subtle blush and minimal markings. The fur color is always light cream or ivory regardless of the person's skin tone in the source photo — do not darken or tint the fur to match skin tone, and do not add tan, orange, brown, or two-tone patches anywhere on the fur or ears.",
    "Preserve likeness before adding cuteness.",
    getGenderStyling(features),
    `Primary likeness anchor: ${features.likenessAnchor}.`,
    signatureFeatures
      ? `Signature features to preserve as guinea pig design cues: ${signatureFeatures}.`
      : "",
    `Eyes: ${getEyeTemplate(features)}`,
    `Brows: use the same simple thick curved brow template on both sides, adjusted only slightly from this analysis: ${features.eyebrows}.`,
    `Hair: ${getHairTemplate(features)} The hair is a separate hairstyle on top of the guinea pig head, not the fur color.`,
    `Face vibe: translate this face silhouette into guinea pig cheek and muzzle proportions: ${features.faceSilhouette}.`,
    `Mouth and expression: keep the mouth fully closed in a curved guinea pig smile — no open mouth, no visible tongue, no wide laughing mouth — while reflecting this softness: ${features.noseMouth}; overall mood: ${features.expression}.`,
    `Pose: ${features.headPose}, centered and icon-like.`,
    `Translation note: ${features.guineaPigTranslation}.`,
    "Style: polished flat 2D cartoon, gentle ink outline, simple cel shading, soft clean shapes.",
    `Reminder: the entire fur — including both ears — must stay one uniform light cream or ivory color, with no tan, orange, or brown patches. The hairstyle stays in its own ${features.hairColor} color, separate from the fur. The mouth stays fully closed, with no tongue visible.`,
    "Final result: a guinea pig avatar only.",
    accessoriesPart,
    traitPart,
  ]
    .filter(Boolean)
    .join("\n");
}
