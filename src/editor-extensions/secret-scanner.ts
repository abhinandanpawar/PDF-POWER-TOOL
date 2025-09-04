import {
  ViewPlugin,
  Decoration,
  MatchDecorator
} from "@codemirror/view";
import {
  SECRET_RULES
} from "../utils/secrets";

const secretDecoration = (ruleId: string) => Decoration.mark({
  class: "cm-secret",
  attributes: {
    'data-secret-id': ruleId,
    title: "Potential secret detected!"
  },
});

const secretScanner = new MatchDecorator({
  regexp: new RegExp(SECRET_RULES.map(r => `(${r.regex.source})`).join('|'), 'g'),
  decoration: (match, view, pos) => {
    // Figure out which rule matched
    let ruleId = 'unknown';
    // The match array will have the full match at index 0, then capturing groups.
    // We need to find which capturing group is not undefined.
    for (let i = 1; i < match.length; i++) {
      if (match[i]) {
        // The index (i-1) corresponds to the rule in SECRET_RULES
        ruleId = SECRET_RULES[i - 1]?.id || 'unknown';
        break;
      }
    }
    return secretDecoration(ruleId);
  },
});


export const secretScannerPlugin = ViewPlugin.fromClass(
  class {
    decorations;

    constructor(view) {
      this.decorations = secretScanner.createDeco(view);
    }

    update(update) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = secretScanner.createDeco(update.view);
      }
    }
  }, {
    decorations: v => v.decorations,
  }
);
