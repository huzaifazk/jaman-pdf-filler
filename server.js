import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { FIELD_MAP, DEFAULT_FONT_SIZE } from "./pdf/fields.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

const TEMPLATE_PATH = path.join(__dirname, "template", "JamanMenuForm.pdf");

function drawWrappedText(page, text, x, y, maxWidth, font, fontSize, lineHeight) {
  const value = (text ?? "").toString().trim();
  if (!value) return;

  const words = value.split(/\s+/);
  let line = "";
  let cy = y;

  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    const width = font.widthOfTextAtSize(test, fontSize);
    if (width <= maxWidth) {
      line = test;
    } else {
      page.drawText(line, { x, y: cy, size: fontSize, font, color: rgb(0, 0, 0) });
      cy -= lineHeight;
      line = w;
    }
  }
  if (line) page.drawText(line, { x, y: cy, size: fontSize, font, color: rgb(0, 0, 0) });
}

function fillPdf(page, data, font) {
  for (const [key, cfg] of Object.entries(FIELD_MAP)) {
    const val = data[key] ?? "";
    const fontSize = cfg.fontSize ?? DEFAULT_FONT_SIZE;
    const lineHeight = cfg.lineHeight ?? Math.round(fontSize * 1.25);

    if (cfg.wrap) {
      drawWrappedText(page, val, cfg.x, cfg.y, cfg.maxWidth ?? 250, font, fontSize, lineHeight);
    } else {
      page.drawText((val ?? "").toString(), {
        x: cfg.x,
        y: cfg.y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0)
      });
    }
  }
}

app.get("/template.pdf", (req, res) => {
  res.setHeader("Content-Type", "application/pdf");
  fs.createReadStream(TEMPLATE_PATH).pipe(res);
});

app.post("/api/generate", async (req, res) => {
  try {
    const data = req.body || {};

    const templateBytes = fs.readFileSync(TEMPLATE_PATH);
    const pdfDoc = await PDFDocument.load(templateBytes);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.getPage(0);

    fillPdf(page, data, font);

    const outBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="JamanMenuForm_${(data.its || "filled").replace(/\W+/g, "_")}.pdf"`
    );

    res.send(Buffer.from(outBytes));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log("Open Form:      http://localhost:3000/");
});
