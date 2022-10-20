export function css(rules: string) {
  const sheet = new CSSStyleSheet();

  const rulesArray = rules
    .split('}')
    .map((r) => r.trim())
    .filter(Boolean)
    .map((r) => r.concat('}'));

  for (const rule of rulesArray) {
    sheet.insertRule(rule);
  }
  return sheet;
}
