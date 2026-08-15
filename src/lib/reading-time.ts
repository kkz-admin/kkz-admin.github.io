const CHINESE_CHARACTERS_PER_MINUTE = 300;
const LATIN_WORDS_PER_MINUTE = 200;

export function estimateReadingMinutes(text: string): number {
  const chineseCharacters = text.match(/\p{Script=Han}/gu)?.length ?? 0;
  const latinWords =
    text.match(
      /[\p{Script=Latin}\p{Number}]+(?:['’-][\p{Script=Latin}\p{Number}]+)*/gu,
    )?.length ?? 0;
  const minutes =
    chineseCharacters / CHINESE_CHARACTERS_PER_MINUTE +
    latinWords / LATIN_WORDS_PER_MINUTE;

  return Math.max(1, Math.ceil(minutes));
}
