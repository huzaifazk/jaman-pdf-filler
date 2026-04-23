import { FIELD_MAP as DUBAI_FIELD_MAP, DEFAULT_FONT_SIZE } from "./fields.js";

export { DEFAULT_FONT_SIZE };

export const FORM_CONFIGS = {
  dubai: {
    templateFile: "JamanMenuForm.pdf",
    defaults: {
      catererName: "Royal Cuisine"
    },
    fieldMap: DUBAI_FIELD_MAP
  },

  ajman: {
    templateFile: "AjmanMenuForm.pdf",
    defaults: {
      caterer: "Royal Cuisine",
      catererName: "Murtaza Kapadia",
      catererIts: "50408859",
      catererMobile: "0556089907",
      catererMoze: "Dubai"
    },
    fieldMap: {
      // Top details
      name:          { x: 280, y: 715, fontSize: 11 },
      its:           { x: 120, y: 715, fontSize: 11 },
      mobile:        { x: 355, y: 695, fontSize: 11 },
      moze:          { x: 120, y: 695, fontSize: 11 },

      // Event block
      event:         { x: 10, y: 630, fontSize: 12, wrap: true, maxWidth: 290 },
      thaals:        { x: 90, y: 630, fontSize: 12 },
      place:         { x: 250, y: 598, fontSize: 11, wrap: true, maxWidth: 180 },
      eventDateDisplay:     { x: 10, y: 598, fontSize: 11 },

      // Caterer block
      caterer:       { x: 120, y: 545, fontSize: 11 },
      catererIts:    { x: 120, y: 520, fontSize: 11 },
      catererName:   { x: 355, y: 520, fontSize: 11 },
      catererMobile: { x: 355, y: 495, fontSize: 11 },
      catererMoze:   { x: 120, y: 495, fontSize: 11 },

      // Menu rows
      namak:         { x: 320, y: 415, fontSize: 10, wrap: true, maxWidth: 260 },
      sodannu:       { x: 320, y: 390, fontSize: 10, wrap: true, maxWidth: 260 },
      mithaas:       { x: 320, y: 369, fontSize: 10, wrap: true, maxWidth: 260 },
      kharas:        { x: 320, y: 344, fontSize: 10, wrap: true, maxWidth: 260 },
      tarkari:       { x: 320, y: 322, fontSize: 10, wrap: true, maxWidth: 260 },
      roti:          { x: 320, y: 300, fontSize: 10, wrap: true, maxWidth: 260 },
      chawal:        { x: 320, y: 279, fontSize: 10, wrap: true, maxWidth: 260 },
      gravySoup:     { x: 320, y: 256, fontSize: 10, wrap: true, maxWidth: 260 },
      salad:         { x: 320, y: 233, fontSize: 10, wrap: true, maxWidth: 260 },
      fruit:         { x: 320, y: 209, fontSize: 10, wrap: true, maxWidth: 260 },
      dryFruit:      { x: 320, y: 185, fontSize: 10, wrap: true, maxWidth: 260 },
      drinks:        { x: 320, y: 162, fontSize: 10, wrap: true, maxWidth: 260 }
    }
  }
};
