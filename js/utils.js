/**
 * @fileoverview CarbonMirror — Pure utility functions
 * Works as CommonJS (Node.js tests) AND as browser global (via <script> tag).
 * Usage in Node: const utils = require('./js/utils.js');
 * Usage in browser: window.CarbonMirrorUtils.*
 */
(function (exports) {
  'use strict';

  // ─────────────────────────────────────────────────────────────────
  // CONFIG — single source of truth for all hardcoded values
  // ─────────────────────────────────────────────────────────────────
  const CONFIG = {
    /** Carbon score percentile thresholds for avatar states */
    AVATAR_THRESHOLDS: { thriving: 30, grassland: 70 },

    /** Maximum allowed length for What-If input */
    WHATIF_MAX_LENGTH: 200,

    /** Simulator data per timeline index (0=1yr, 1=5yr, 2=10yr) */
    SIMULATOR_DATA: [
      {
        label: '1 year',
        cur:    { co2: '768.0 kg',     cost: '₹19,200',    trees: '38'  },
        better: { co2: '537.6 kg',     cost: '₹13,440',    trees: '27'  },
        green:  { co2: '230.4 kg',     cost: '₹5,760',     trees: '12'  },
      },
      {
        label: '5 years',
        cur:    { co2: '3,840.0 kg',   cost: '₹96,000',    trees: '192' },
        better: { co2: '2,688.0 kg',   cost: '₹67,200',    trees: '134' },
        green:  { co2: '1,152.0 kg',   cost: '₹28,800',    trees: '58'  },
      },
      {
        label: '10 years',
        cur:    { co2: '7,680.0 kg',   cost: '₹1,92,000',  trees: '384' },
        better: { co2: '5,376.0 kg',   cost: '₹1,34,400',  trees: '269' },
        green:  { co2: '2,304.0 kg',   cost: '₹57,600',    trees: '115' },
      },
    ],

    /** Raw kg values for chart rendering */
    SIMULATOR_RAW: [
      [768,    537.6,  230.4  ],  // 1 year:  [cur, better, green]
      [3840,   2688,   1152   ],  // 5 years
      [7680,   5376,   2304   ],  // 10 years
    ],

    /** What-If scenario lookup database */
    WHATIF_DB: {
      scooter: { cat: 'Transport', co2: '18.4 kg', cost: '₹1,200', be: '18 mo' },
      meat:    { cat: 'Diet',      co2: '12.0 kg', cost: '₹800',   be: 'N/A'   },
      solar:   { cat: 'Energy',    co2: '35.0 kg', cost: '₹2,400', be: '36 mo' },
      home:    { cat: 'Transport', co2: '22.0 kg', cost: '₹1,600', be: 'N/A'   },
      ac:      { cat: 'Energy',    co2: '8.5 kg',  cost: '₹560',   be: 'N/A'   },
    },

    /** Community ticker baseline */
    COMMUNITY_BASELINE: 42180.5,

    /** Carbon conversion factors */
    FACTORS: {
      CAR_KM_PER_KG:     4.0,    // 0.25 kg CO₂ / km → km per kg = 4
      SMARTPHONE_PER_KG: 120.5,  // 0.0083 kg CO₂ / charge → charges per kg ≈ 120
      FAN_DAYS_PER_KG:   2.67,   // 0.375 kg CO₂ / day → days per kg ≈ 2.67
    },

    /** Colors */
    COLORS: {
      current: 'rgba(239,68,68,.25)',
      better:  'rgba(234,179,8,.25)',
      green:   'rgba(34,197,94,.25)',
      currentBorder: 'rgba(239,68,68,.8)',
      betterBorder:  'rgba(234,179,8,.8)',
      greenBorder:   'rgba(34,197,94,.8)',
    },
  };

  // ─────────────────────────────────────────────────────────────────
  // sanitizeText(input)
  // ─────────────────────────────────────────────────────────────────
  /**
   * Sanitizes user-supplied text by stripping HTML tags and trimming whitespace.
   * Provides a forward-compatible safety layer for content displayed in the UI.
   *
   * @param {string} input - Raw user input or data string.
   * @returns {string} Sanitized plain-text string, max 500 chars.
   */
  function sanitizeText(input) {
    if (input === null || input === undefined) return '';
    const str = String(input);
    // Strip HTML tags
    const stripped = str.replace(/<[^>]*>/g, '');
    // Collapse multiple spaces/newlines
    const collapsed = stripped.replace(/\s+/g, ' ').trim();
    return collapsed.slice(0, 500);
  }

  // ─────────────────────────────────────────────────────────────────
  // getAvatarState(score)
  // ─────────────────────────────────────────────────────────────────
  /**
   * Returns the avatar ecosystem state label for a given carbon score percentile.
   * Scores below 30th percentile → Thriving Forest.
   * Scores 30–70th percentile   → Grassland.
   * Scores above 70th percentile → Polluted Forest.
   *
   * @param {number} score - Carbon score as a percentile (0–100 inclusive).
   * @returns {'Thriving Forest'|'Grassland'|'Polluted Forest'} Ecosystem state label.
   */
  function getAvatarState(score) {
    const s = Number(score);
    if (isNaN(s)) return 'Polluted Forest';
    if (s < CONFIG.AVATAR_THRESHOLDS.thriving) return 'Thriving Forest';
    if (s <= CONFIG.AVATAR_THRESHOLDS.grassland) return 'Grassland';
    return 'Polluted Forest';
  }

  // ─────────────────────────────────────────────────────────────────
  // getSimulatorData(timelineIndex)
  // ─────────────────────────────────────────────────────────────────
  /**
   * Returns the simulator scenario data for a given timeline index.
   *
   * @param {number} timelineIndex - 0 = 1 year, 1 = 5 years, 2 = 10 years.
   * @returns {{ cur: object, better: object, green: object }} Scenario data.
   * @throws {RangeError} If timelineIndex is not 0, 1, or 2.
   */
  function getSimulatorData(timelineIndex) {
    const index = parseInt(timelineIndex, 10);
    if (index < 0 || index > 2 || isNaN(index)) {
      throw new RangeError('timelineIndex must be 0, 1, or 2');
    }
    return CONFIG.SIMULATOR_DATA[index];
  }

  // ─────────────────────────────────────────────────────────────────
  // formatCO2(kg)
  // ─────────────────────────────────────────────────────────────────
  /**
   * Formats a CO₂ value in kilograms to a display string with one decimal place
   * and thousands separators. Matches IPCC/EPA presentation standard.
   *
   * @param {number} kg - CO₂ value in kilograms.
   * @returns {string} Formatted string, e.g. "3,840.0 kg".
   */
  function formatCO2(kg) {
    const value = Number(kg);
    if (isNaN(value)) return '0.0 kg';
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + ' kg';
  }

  // ─────────────────────────────────────────────────────────────────
  // lookupWhatIf(query)
  // ─────────────────────────────────────────────────────────────────
  /**
   * Looks up a What-If scenario result based on keyword matching in the query.
   * Falls back to the AC (energy) scenario if no keywords match.
   *
   * @param {string} query - User's natural-language what-if question.
   * @returns {{ cat: string, co2: string, cost: string, be: string }} Result object.
   */
  function lookupWhatIf(query) {
    if (!query || typeof query !== 'string') return CONFIG.WHATIF_DB.ac;
    const q = query.toLowerCase();
    if (q.includes('scooter') || q.includes('bike') || q.includes('ev')) return CONFIG.WHATIF_DB.scooter;
    if (q.includes('meat') || q.includes('veg'))                          return CONFIG.WHATIF_DB.meat;
    if (q.includes('solar'))                                               return CONFIG.WHATIF_DB.solar;
    if (q.includes('home') || q.includes('remote') || q.includes('wfh')) return CONFIG.WHATIF_DB.home;
    return CONFIG.WHATIF_DB.ac;
  }

  // ─────────────────────────────────────────────────────────────────
  // validateWhatIfInput(query)
  // ─────────────────────────────────────────────────────────────────
  /**
   * Validates a What-If Scanner query string.
   * Checks for empty input, whitespace-only input, and maximum length.
   *
   * @param {string} query - User input from the What-If Scanner.
   * @returns {{ valid: boolean, error: string|null }} Validation result.
   */
  function validateWhatIfInput(query) {
    if (query === null || query === undefined || String(query).trim() === '') {
      return { valid: false, error: 'Please enter a what-if question.' };
    }
    if (String(query).length > CONFIG.WHATIF_MAX_LENGTH) {
      return { valid: false, error: `Query must be ${CONFIG.WHATIF_MAX_LENGTH} characters or fewer.` };
    }
    return { valid: true, error: null };
  }

  // ─────────────────────────────────────────────────────────────────
  // getCommunityTotal(posts)
  // ─────────────────────────────────────────────────────────────────
  /**
   * Computes the total community CO₂ savings from adopted eco-hack posts.
   * Only counts posts where adopted === true.
   *
   * @param {Array<{adopted: boolean, saves: number}>} posts - Array of social posts.
   * @returns {number} Total kg CO₂ saved by adopted hacks.
   */
  function getCommunityTotal(posts) {
    if (!Array.isArray(posts)) return 0;
    return posts.reduce(function (total, post) {
      if (post && post.adopted === true) {
        const amount = Number(post.saves);
        return total + (isNaN(amount) ? 0 : amount);
      }
      return total;
    }, 0);
  }

  // ─────────────────────────────────────────────────────────────────
  // getChallengeTotalSaved(challenges)
  // ─────────────────────────────────────────────────────────────────
  /**
   * Calculates the total CO₂ saved from completed challenges.
   * Parses the `saves` field (e.g. "2.3 kg CO₂") to extract a float.
   *
   * @param {Array<{done: boolean, saves: string}>} challenges - Array of challenge objects.
   * @returns {number} Total kg CO₂ saved, rounded to one decimal place.
   */
  function getChallengeTotalSaved(challenges) {
    if (!Array.isArray(challenges)) return 0;
    const total = challenges.reduce(function (sum, challenge) {
      if (challenge && challenge.done === true) {
        const match = String(challenge.saves).match(/[\d.]+/);
        const amount = match ? parseFloat(match[0]) : 0;
        return sum + (isNaN(amount) ? 0 : amount);
      }
      return sum;
    }, 0);
    return parseFloat(total.toFixed(1));
  }

  // ─────────────────────────────────────────────────────────────────
  // Exports
  // ─────────────────────────────────────────────────────────────────
  exports.CONFIG                  = CONFIG;
  exports.sanitizeText            = sanitizeText;
  exports.getAvatarState          = getAvatarState;
  exports.getSimulatorData        = getSimulatorData;
  exports.formatCO2               = formatCO2;
  exports.lookupWhatIf            = lookupWhatIf;
  exports.validateWhatIfInput     = validateWhatIfInput;
  exports.getCommunityTotal       = getCommunityTotal;
  exports.getChallengeTotalSaved  = getChallengeTotalSaved;

})(typeof module !== 'undefined' ? module.exports : (window.CarbonMirrorUtils = {}));
