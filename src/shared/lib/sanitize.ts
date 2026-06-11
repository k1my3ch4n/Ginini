export const CUSTOM_TRAIT_MAX_LENGTH = 50;

const UNSAFE_CUSTOM_TRAIT_CHARS = /[^0-9A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ\s,.'()-]/g;
const PROMPT_CONTROL_WORDS =
  /\b(ignore|system|prompt|instruction|instructions|developer|assistant|user|role)\b/gi;

export function sanitizeCustomTrait(input: string): string {
  return input
    .normalize("NFKC")
    .replace(UNSAFE_CUSTOM_TRAIT_CHARS, " ")
    .replace(PROMPT_CONTROL_WORDS, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, CUSTOM_TRAIT_MAX_LENGTH);
}
