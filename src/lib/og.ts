import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const fontDir = (pkg: string) =>
  path.join(process.cwd(), "node_modules", "@fontsource", pkg, "files");

let fonts: { name: string; data: Buffer; weight: 400 | 500 | 600; style: "normal" }[] | undefined;

function loadFonts() {
  fonts ??= [
    {
      name: "Fraunces",
      data: fs.readFileSync(path.join(fontDir("fraunces"), "fraunces-latin-500-normal.woff")),
      weight: 500,
      style: "normal",
    },
    {
      name: "Inter",
      data: fs.readFileSync(path.join(fontDir("inter"), "inter-latin-400-normal.woff")),
      weight: 400,
      style: "normal",
    },
    {
      name: "Inter",
      data: fs.readFileSync(path.join(fontDir("inter"), "inter-latin-600-normal.woff")),
      weight: 600,
      style: "normal",
    },
  ];
  return fonts;
}

const colors = {
  bg: "#f8f7f3",
  ink: "#15171b",
  soft: "#3a3f47",
  muted: "#5f6672",
  line: "#e2dfd6",
  accent: "#0b6b67",
  accentSoft: "#dcefeb",
};

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

export interface OgInput {
  eyebrow: string;
  title: string;
  subtitle?: string;
  chips?: string[];
}

/** Renders a 1200×630 Open Graph card as PNG. */
export async function renderOgImage({ eyebrow, title, subtitle, chips = [] }: OgInput) {
  const titleSize = title.length > 70 ? 54 : title.length > 40 ? 64 : 76;
  const tree = h(
    "div",
    {
      width: 1200,
      height: 630,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "64px 72px",
      backgroundColor: colors.bg,
      backgroundImage: `linear-gradient(${colors.line} 1px, transparent 1px), linear-gradient(90deg, ${colors.line} 1px, transparent 1px)`,
      backgroundSize: "48px 48px",
      fontFamily: "Inter",
      color: colors.ink,
    },
    [
      h("div", { display: "flex", alignItems: "center", justifyContent: "space-between" }, [
        h("div", { display: "flex", alignItems: "center", gap: 16 }, [
          h(
            "div",
            {
              width: 52,
              height: 52,
              borderRadius: 12,
              backgroundColor: colors.ink,
              color: colors.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Fraunces",
              fontSize: 24,
            },
            "AZ",
          ),
          h("div", { fontFamily: "Fraunces", fontSize: 30 }, "Ali Zarreh, Ph.D."),
        ]),
        h("div", { fontSize: 22, color: colors.muted }, "zarreh.ai"),
      ]),
      h("div", { display: "flex", flexDirection: "column", gap: 20 }, [
        h(
          "div",
          {
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 3,
            color: colors.accent,
            textTransform: "uppercase",
          },
          eyebrow,
        ),
        h(
          "div",
          {
            fontFamily: "Fraunces",
            fontSize: titleSize,
            lineHeight: 1.08,
            letterSpacing: -1,
            maxWidth: 1000,
          },
          title,
        ),
        ...(subtitle
          ? [
              h(
                "div",
                { fontSize: 28, lineHeight: 1.4, color: colors.soft, maxWidth: 980 },
                subtitle,
              ),
            ]
          : []),
      ]),
      h(
        "div",
        { display: "flex", gap: 12 },
        chips.slice(0, 4).map((c) =>
          h(
            "div",
            {
              display: "flex",
              fontSize: 20,
              padding: "8px 18px",
              borderRadius: 999,
              backgroundColor: colors.accentSoft,
              color: colors.accent,
              fontWeight: 600,
            },
            c,
          ),
        ),
      ),
    ],
  );

  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: loadFonts(),
  });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}
