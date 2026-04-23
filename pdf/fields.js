export const DEFAULT_FONT_SIZE = 11;

/**
 * Updated field mapping for all form fields.
 * These are improved placeholder coordinates - calibrate for perfect alignment.
 * 
 * PDF coordinate system: origin (0,0) is BOTTOM-LEFT
 * - Increase x = move right
 * - Increase y = move up
 */
export const FIELD_MAP = {
  // Personal Information (top section)
  its:         { x: 60, y: 520, fontSize: 11, wrap: false },
  name:        { x: 175, y: 520, fontSize: 11, wrap: false },
  mobile:      { x: 60, y: 500, fontSize: 11, wrap: false },
  mohallah:    { x: 250, y: 500, fontSize: 11, wrap: false },

  // Event Details
  event:       { x: 60, y: 480, fontSize: 11, wrap: false },
  eventDateDisplay:   { x: 183, y: 480, fontSize: 8, wrap: false },
  eventVenue:  { x: 310, y: 480, fontSize: 8, wrap: false },

  // Counts and Caterer
  thalCount:   { x: 110, y: 460, fontSize: 11, wrap: false },
  catererName: { x: 250, y: 460, fontSize: 11, wrap: false },

  // Menu Items (main section)
  fruit:       { x: 175, y: 405, fontSize: 11, wrap: false },
  salad:       { x: 175, y: 383, fontSize: 11, wrap: false },
  
  kharas:      { x: 175, y: 360, fontSize: 11, wrap: false },
  tarkari:     { x: 175, y: 338, fontSize: 11, wrap: false },
  roti:        { x: 175, y: 315, fontSize: 11, wrap: false },
  chawal:      { x: 175, y: 292, fontSize: 11, wrap: false },
  
  gravySoup:   { x: 175, y: 268, fontSize: 11, wrap: false },
  mithaas:     { x: 175, y: 242, fontSize: 11, wrap: false },
  dryFruit:    { x: 175, y: 220, fontSize: 11, wrap: false },
  drink:       { x: 175, y: 195, fontSize: 11, wrap: false },

};
