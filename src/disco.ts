import * as vscode from "vscode";

const nColors = 15;
const width = 3;

const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const getColor = (x: number, max: number) => {
  return hslToHex(Math.floor((x / max) * 360), 80, 80);
};

const colors = [...Array(nColors).keys()].map((x) => getColor(x, nColors));

const decorations = colors.map((color) =>
  vscode.window.createTextEditorDecorationType({
    color: color,
  })
);

const nDecos = decorations.length;

const colorize = (editor: vscode.TextEditor, c: number) => {
  const len = editor.document.getText().length;
  decorations.forEach((deco, i) => {
    const ranges = [];
    for (
      let idx = ((i + c) % nDecos) * width;
      idx < len;
      idx = idx + nDecos * width
    ) {
      ranges.push(
        new vscode.Range(
          editor.document.positionAt(idx),
          editor.document.positionAt(idx + width)
        )
      );
    }
    editor.setDecorations(deco, []);
    editor.setDecorations(deco, ranges);
  });
};

export const disco = () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  let c = 0;
  setInterval(() => {
    colorize(editor, c);
    c += 1;
  }, 300);
};
