import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { FORM_CONFIGS, DEFAULT_FONT_SIZE } from "./pdf/forms.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

function sanitizeFilePart(value = "") {
  return value.toString().replace(/[^a-zA-Z0-9]/g, "");
}

function buildDownloadName(data) {
  const cleanDate = sanitizeFilePart((data.eventDate || "").replace(/\//g, ""));
  const cleanName = sanitizeFilePart(data.name || "unknown");
  return `${cleanDate || "date"}_${cleanName || "name"}.pdf`;
}

function drawWrappedText(page, text, x, y, maxWidth, font, fontSize, lineHeight) {
  const value = (text ?? "").toString().trim();
  if (!value) return;

  const words = value.split(/\s+/);
  let line = "";
  let cy = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width <= maxWidth) {
      line = testLine;
    } else {
      if (line) {
        page.drawText(line, {
          x,
          y: cy,
          size: fontSize,
          font,
          color: rgb(0, 0, 0)
        });
        cy -= lineHeight;
      }
      line = word;
    }
  }

  if (line) {
    page.drawText(line, {
      x,
      y: cy,
      size: fontSize,
      font,
      color: rgb(0, 0, 0)
    });
  }
}

function fillPdf(page, data, fieldMap, font) {
  for (const [key, cfg] of Object.entries(fieldMap)) {
    const value = data[key] ?? "";
    if (value === "") continue;

    const fontSize = cfg.fontSize ?? DEFAULT_FONT_SIZE;
    const lineHeight = cfg.lineHeight ?? Math.round(fontSize * 1.25);

    if (cfg.wrap) {
      drawWrappedText(
        page,
        value,
        cfg.x,
        cfg.y,
        cfg.maxWidth ?? 250,
        font,
        fontSize,
        lineHeight
      );
    } else {
      page.drawText(String(value), {
        x: cfg.x,
        y: cfg.y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0)
      });
    }
  }
}

app.get("/template/:formType", (req, res) => {
  const formType = req.params.formType;
  const config = FORM_CONFIGS[formType];

  if (!config) {
    return res.status(404).send("Unknown form type");
  }

  const templatePath = path.join(__dirname, "template", config.templateFile);
  res.setHeader("Content-Type", "application/pdf");
  fs.createReadStream(templatePath).pipe(res);
});

app.post("/api/generate", async (req, res) => {
  try {
    const formType = req.body.formType || "dubai";
    const config = FORM_CONFIGS[formType];

    if (!config) {
      return res.status(400).json({ error: "Invalid form type" });
    }

    const mergedData = {
      ...config.defaults,
      ...req.body
    };
	const rawEventDate = mergedData.eventDate || "";
	const rawEventTime = mergedData.eventTime || "";
	
	mergedData.eventDateDisplay = rawEventTime
	  ? `${rawEventDate} ${rawEventTime}`
	  : rawEventDate;

    if (formType === "ajman" && !mergedData.event && mergedData.eventChoice) {
      mergedData.event =
        mergedData.eventChoice === "Others"
          ? mergedData.eventOther
            ? `Others: ${mergedData.eventOther}`
            : "Others"
          : mergedData.eventChoice;
    }

    const templatePath = path.join(__dirname, "template", config.templateFile);
    const templateBytes = fs.readFileSync(templatePath);

    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPage(0);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    fillPdf(page, mergedData, config.fieldMap, font);

    const outBytes = await pdfDoc.save();
    const filename = buildDownloadName(mergedData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(Buffer.from(outBytes));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Open app: http://localhost:${port}`);
});
