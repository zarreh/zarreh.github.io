// Generates favicon / touch icons into public/. Run once after changing the mark: node scripts/generate-icons.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const font = fs.readFileSync(
  path.join(root, "node_modules/@fontsource/fraunces/files/fraunces-latin-600-normal.woff"),
);

async function mark(size, radius) {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#15171b",
          borderRadius: radius,
          color: "#f8f7f3",
          fontFamily: "Fraunces",
          fontSize: size * 0.46,
          letterSpacing: -size * 0.01,
        },
        children: [
          { type: "span", props: { children: "A" } },
          { type: "span", props: { style: { color: "#4fc4b6" }, children: "Z" } },
        ],
      },
    },
    {
      width: size,
      height: size,
      fonts: [{ name: "Fraunces", data: font, weight: 600, style: "normal" }],
    },
  );
  return svg;
}

const outputs = [
  { file: "favicon-32.png", size: 32, radius: 7 },
  { file: "apple-touch-icon.png", size: 180, radius: 0 },
  { file: "icon-192.png", size: 192, radius: 40 },
  { file: "icon-512.png", size: 512, radius: 108 },
];

for (const { file, size, radius } of outputs) {
  const svg = await mark(size, radius);
  const png = new Resvg(svg, { fitTo: { mode: "width", value: size } }).render().asPng();
  fs.writeFileSync(path.join(root, "public", file), png);
  console.log("wrote", file);
}

fs.writeFileSync(path.join(root, "public", "favicon.svg"), await mark(64, 14));
console.log("wrote favicon.svg");
