export function css(rules: TemplateStringsArray) {
  const sheet = new CSSStyleSheet();

  const rulesArray = rules.reduce((acc: Array<string>, next: string) => {
    acc.push(
      ...next
        .split('}')
        .map((r) => r.trim())
        .filter(Boolean)
        .map((r) => r.concat('}'))
    );

    return acc;
  }, []);

  for (const rule of rulesArray) {
    sheet.insertRule(rule);
  }
  return sheet;
}
