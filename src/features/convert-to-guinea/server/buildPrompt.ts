import type { FaceFeatures } from "./analyzeFace";

function isAbsent(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  return (
    normalized === "" ||
    normalized === "none" ||
    normalized === "not visible" ||
    normalized === "unclear"
  );
}

function getHairTemplate(features: FaceFeatures): string {
  const hairText = [
    features.hairstyle,
    features.hairArchitecture,
    features.likenessAnchor,
  ]
    .join(" ")
    .toLowerCase();

  const hasPartedHair =
    /center|middle|part|parted|curtain|forehead|off-center/.test(hairText);

  if (hasPartedHair) {
    return (
      `Use a stable center-curtain hair template in ${features.hairColor}: ` +
      "two balanced rounded hair panels, a small visible part opening at the top center, soft side volume, and a clean forehead opening. " +
      "Keep the hair compact inside the top third of the head."
    );
  }

  return (
    `Use a stable compact side-swept hair template in ${features.hairColor}: ` +
    "one smooth rounded hair mass with a small side part, short soft tips, and controlled volume inside the top third of the head."
  );
}

function getEyeTemplate(features: FaceFeatures): string {
  const eyeText = [features.eyes, features.likenessAnchor]
    .join(" ")
    .toLowerCase();

  const hasSmallSoftEyes =
    /small|narrow|almond|monolid|soft|smil|gentle|slight/.test(eyeText);

  if (hasSmallSoftEyes) {
    return (
      "Use a stable compact oval eye template: moderately small glossy oval eyes, clean outer outline, calm soft eye-smile, and no decorative lash strokes. " +
      `Preserve this analyzed eye mood: ${features.eyes}.`
    );
  }

  return (
    "Use a stable medium oval eye template: medium glossy oval eyes, clean outer outline, calm friendly gaze, and no decorative lash strokes. " +
    `Preserve this analyzed eye mood: ${features.eyes}.`
  );
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
    ? ` Subtle animal-impression cue for the eyes and expression only: ${traitDescription}.`
    : "";

  return [
    "Create exactly one personalized cute 2D guinea pig face avatar for a square profile icon.",
    "The image must be a single front-facing guinea pig head portrait on a clean white background.",
    "Use a fixed avatar template: perfectly centered round compact guinea pig head, small rounded ears, plush cheeks, soft short fur, tiny downward Y-shaped nose, small rounded muzzle, closed curved smile.",
    "The guinea pig head fills 92 percent of the square. The lower edge is a smooth round cheek-and-chin fur boundary touching the bottom of the icon.",
    "Visible subject area: face, ears, cheek fur, chin fur, and the person's hairstyle only.",
    "Use a simple warm ivory or light cream guinea pig fur base with subtle blush and minimal markings.",
    "Preserve likeness before adding cuteness.",
    `Primary likeness anchor: ${features.likenessAnchor}.`,
    signatureFeatures
      ? `Signature features to preserve as guinea pig design cues: ${signatureFeatures}.`
      : "",
    `Eyes: ${getEyeTemplate(features)}`,
    `Brows: use the same simple thick curved brow template on both sides, adjusted only slightly from this analysis: ${features.eyebrows}.`,
    `Hair: ${getHairTemplate(features)} The hair is a separate hairstyle on top of the guinea pig head, not the fur color. Original hair analysis: ${features.hairstyle}; ${features.hairArchitecture}.`,
    `Face vibe: translate this face silhouette into guinea pig cheek and muzzle proportions: ${features.faceSilhouette}.`,
    `Mouth and expression: keep a closed curved guinea pig smile while reflecting this softness: ${features.noseMouth}; overall mood: ${features.expression}.`,
    `Pose: ${features.headPose}, centered and icon-like.`,
    `Translation note: ${features.guineaPigTranslation}.`,
    "Style: polished flat 2D cartoon, gentle ink outline, simple cel shading, soft clean shapes.",
    "Final result: a guinea pig avatar only.",
    accessoriesPart,
    traitPart,
  ]
    .filter(Boolean)
    .join("\n");
}
