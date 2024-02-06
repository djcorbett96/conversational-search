export const sanitizeCitations = (summary?: string) => {
  if (!summary) return summary;
  if (summary === 'NO_ANSWER_FOUND') return;

  // Match citations.
  // const regex = /\[(.*?)\]$/;
  const regex = /\[([^\[\]]*)\]$/;
  const match = regex.exec(summary);

  if (!match) {
    return;
  }

  const parts: string[] = [];
  const extractedArray = match[0];
  // console.log(extractedArray);
  const index = match.index;
  const text = summary.slice(0, index);
  // console.log(text);
  parts.push(text);
  parts.push(extractedArray);
  console.log(parts);
  return parts;
};
