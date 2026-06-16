'use strict';

/**
 * CarbonMirror unit tests
 * Run with: node --test tests/unit.test.js
 * Requires Node.js 18+ for node:test and built-in assert.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const utils = require('../js/utils.js');

const {
  CONFIG,
  sanitizeText,
  getAvatarState,
  getSimulatorData,
  formatCO2,
  lookupWhatIf,
  validateWhatIfInput,
  getCommunityTotal,
  getChallengeTotalSaved,
} = utils;

// ─────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────
describe('CONFIG', () => {
  test('CONFIG.AVATAR_THRESHOLDS has correct thriving value', () => {
    assert.equal(CONFIG.AVATAR_THRESHOLDS.thriving, 30);
  });

  test('CONFIG.AVATAR_THRESHOLDS has correct grassland value', () => {
    assert.equal(CONFIG.AVATAR_THRESHOLDS.grassland, 70);
  });

  test('CONFIG.WHATIF_MAX_LENGTH is 200', () => {
    assert.equal(CONFIG.WHATIF_MAX_LENGTH, 200);
  });

  test('CONFIG.SIMULATOR_DATA has 3 entries', () => {
    assert.equal(CONFIG.SIMULATOR_DATA.length, 3);
  });

  test('CONFIG.SIMULATOR_DATA[0].label is "1 year"', () => {
    assert.equal(CONFIG.SIMULATOR_DATA[0].label, '1 year');
  });

  test('CONFIG.SIMULATOR_RAW has 3 rows', () => {
    assert.equal(CONFIG.SIMULATOR_RAW.length, 3);
  });

  test('CONFIG.WHATIF_DB contains scooter, meat, solar, home, ac keys', () => {
    const keys = Object.keys(CONFIG.WHATIF_DB);
    assert.ok(keys.includes('scooter'));
    assert.ok(keys.includes('meat'));
    assert.ok(keys.includes('solar'));
    assert.ok(keys.includes('home'));
    assert.ok(keys.includes('ac'));
  });
});

// ─────────────────────────────────────────────────────────────────
// sanitizeText
// ─────────────────────────────────────────────────────────────────
describe('sanitizeText', () => {
  test('returns empty string for null', () => {
    assert.equal(sanitizeText(null), '');
  });

  test('returns empty string for undefined', () => {
    assert.equal(sanitizeText(undefined), '');
  });

  test('strips HTML tags (tags removed, text content preserved)', () => {
    // The sanitizer removes tags but keeps text content between them.
    // This matches the regex-based approach: <script> and </script> are stripped,
    // leaving the inner text "alert(\"xss\")" + "hello".
    const result = sanitizeText('<script>alert("xss")</script>hello');
    assert.ok(!result.includes('<script>'), 'Should not contain <script> tag');
    assert.ok(!result.includes('</script>'), 'Should not contain </script> tag');
    assert.ok(result.includes('hello'), 'Should keep text content after tag');
  });

  test('strips nested HTML tags', () => {
    assert.equal(sanitizeText('<b><i>bold italic</i></b>'), 'bold italic');
  });

  test('trims leading/trailing whitespace', () => {
    assert.equal(sanitizeText('  hello world  '), 'hello world');
  });

  test('collapses multiple spaces', () => {
    assert.equal(sanitizeText('hello   world'), 'hello world');
  });

  test('returns plain text unchanged (mostly)', () => {
    assert.equal(sanitizeText('Switch to public transport'), 'Switch to public transport');
  });

  test('converts non-string to string', () => {
    assert.equal(sanitizeText(42), '42');
  });

  test('truncates to 500 characters', () => {
    const long = 'a'.repeat(600);
    assert.equal(sanitizeText(long).length, 500);
  });

  test('returns empty string for empty string input', () => {
    assert.equal(sanitizeText(''), '');
  });
});

// ─────────────────────────────────────────────────────────────────
// getAvatarState
// ─────────────────────────────────────────────────────────────────
describe('getAvatarState', () => {
  test('score 0 → Thriving Forest', () => {
    assert.equal(getAvatarState(0), 'Thriving Forest');
  });

  test('score 29 → Thriving Forest', () => {
    assert.equal(getAvatarState(29), 'Thriving Forest');
  });

  test('score 30 → Grassland (boundary inclusive)', () => {
    assert.equal(getAvatarState(30), 'Grassland');
  });

  test('score 50 → Grassland', () => {
    assert.equal(getAvatarState(50), 'Grassland');
  });

  test('score 70 → Grassland (boundary inclusive)', () => {
    assert.equal(getAvatarState(70), 'Grassland');
  });

  test('score 71 → Polluted Forest', () => {
    assert.equal(getAvatarState(71), 'Polluted Forest');
  });

  test('score 100 → Polluted Forest', () => {
    assert.equal(getAvatarState(100), 'Polluted Forest');
  });

  test('score as string "18" → Thriving Forest', () => {
    assert.equal(getAvatarState('18'), 'Thriving Forest');
  });

  test('NaN score → Polluted Forest', () => {
    assert.equal(getAvatarState(NaN), 'Polluted Forest');
  });

  test('non-numeric string → Polluted Forest', () => {
    assert.equal(getAvatarState('abc'), 'Polluted Forest');
  });
});

// ─────────────────────────────────────────────────────────────────
// getSimulatorData
// ─────────────────────────────────────────────────────────────────
describe('getSimulatorData', () => {
  test('index 0 returns 1-year data', () => {
    const data = getSimulatorData(0);
    assert.equal(data.label, '1 year');
    assert.equal(data.cur.co2, '768.0 kg');
  });

  test('index 1 returns 5-year data', () => {
    const data = getSimulatorData(1);
    assert.equal(data.label, '5 years');
    assert.equal(data.cur.co2, '3,840.0 kg');
  });

  test('index 2 returns 10-year data', () => {
    const data = getSimulatorData(2);
    assert.equal(data.label, '10 years');
    assert.equal(data.cur.co2, '7,680.0 kg');
  });

  test('index "1" (string) works via parseInt', () => {
    const data = getSimulatorData('1');
    assert.equal(data.label, '5 years');
  });

  test('better path is ~30% lower than current for 5-year window', () => {
    // cur: 3840 better: 2688 — 30% reduction
    const data = getSimulatorData(1);
    assert.equal(data.better.co2, '2,688.0 kg');
  });

  test('green path is ~70% lower than current for 5-year window', () => {
    // cur: 3840 green: 1152 — 70% reduction
    const data = getSimulatorData(1);
    assert.equal(data.green.co2, '1,152.0 kg');
  });

  test('throws RangeError for index -1', () => {
    assert.throws(() => getSimulatorData(-1), RangeError);
  });

  test('throws RangeError for index 3', () => {
    assert.throws(() => getSimulatorData(3), RangeError);
  });

  test('throws RangeError for NaN', () => {
    assert.throws(() => getSimulatorData(NaN), RangeError);
  });
});

// ─────────────────────────────────────────────────────────────────
// formatCO2
// ─────────────────────────────────────────────────────────────────
describe('formatCO2', () => {
  test('formats 3840 → "3,840.0 kg"', () => {
    assert.equal(formatCO2(3840), '3,840.0 kg');
  });

  test('formats 768 → "768.0 kg"', () => {
    assert.equal(formatCO2(768), '768.0 kg');
  });

  test('formats 0 → "0.0 kg"', () => {
    assert.equal(formatCO2(0), '0.0 kg');
  });

  test('formats 1152.5 → "1,152.5 kg"', () => {
    assert.equal(formatCO2(1152.5), '1,152.5 kg');
  });

  test('NaN → "0.0 kg"', () => {
    assert.equal(formatCO2(NaN), '0.0 kg');
  });

  test('formats negative value correctly', () => {
    const result = formatCO2(-100);
    assert.ok(result.includes('100'), 'Should include the number 100');
    assert.ok(result.includes('kg'), 'Should include kg unit');
  });
});

// ─────────────────────────────────────────────────────────────────
// lookupWhatIf
// ─────────────────────────────────────────────────────────────────
describe('lookupWhatIf', () => {
  test('"scooter" query → Transport category', () => {
    const result = lookupWhatIf('What if I buy an electric scooter?');
    assert.equal(result.cat, 'Transport');
    assert.equal(result.co2, '18.4 kg');
  });

  test('"ev" keyword → scooter scenario', () => {
    const result = lookupWhatIf('What if I get an EV?');
    assert.equal(result.cat, 'Transport');
  });

  test('"bike" keyword → scooter scenario', () => {
    const result = lookupWhatIf('What if I buy a bike?');
    assert.equal(result.cat, 'Transport');
  });

  test('"meat" query → Diet category', () => {
    const result = lookupWhatIf('What if I stop eating meat?');
    assert.equal(result.cat, 'Diet');
  });

  test('"veg" keyword → meat scenario', () => {
    const result = lookupWhatIf('What if I go veg?');
    assert.equal(result.cat, 'Diet');
  });

  test('"solar" query → Energy category', () => {
    const result = lookupWhatIf('What if I install solar panels?');
    assert.equal(result.cat, 'Energy');
    assert.equal(result.be, '36 mo');
  });

  test('"home" / WFH → Transport category', () => {
    const result = lookupWhatIf('What if I work from home?');
    assert.equal(result.cat, 'Transport');
    assert.equal(result.co2, '22.0 kg');
  });

  test('"wfh" keyword → home scenario', () => {
    const result = lookupWhatIf('I want to try wfh more often');
    assert.equal(result.cat, 'Transport');
  });

  test('unknown query → default AC scenario', () => {
    const result = lookupWhatIf('What if I meditate?');
    assert.equal(result.cat, 'Energy');
    assert.equal(result.co2, '8.5 kg');
  });

  test('null query → default AC scenario', () => {
    const result = lookupWhatIf(null);
    assert.equal(result.cat, 'Energy');
  });

  test('empty string → default AC scenario', () => {
    const result = lookupWhatIf('');
    assert.equal(result.cat, 'Energy');
  });
});

// ─────────────────────────────────────────────────────────────────
// validateWhatIfInput
// ─────────────────────────────────────────────────────────────────
describe('validateWhatIfInput', () => {
  test('valid query → { valid: true, error: null }', () => {
    const result = validateWhatIfInput('What if I go solar?');
    assert.equal(result.valid, true);
    assert.equal(result.error, null);
  });

  test('empty string → invalid', () => {
    const result = validateWhatIfInput('');
    assert.equal(result.valid, false);
    assert.ok(result.error);
  });

  test('whitespace-only → invalid', () => {
    const result = validateWhatIfInput('   ');
    assert.equal(result.valid, false);
    assert.ok(result.error);
  });

  test('null → invalid', () => {
    const result = validateWhatIfInput(null);
    assert.equal(result.valid, false);
    assert.ok(result.error);
  });

  test('undefined → invalid', () => {
    const result = validateWhatIfInput(undefined);
    assert.equal(result.valid, false);
    assert.ok(result.error);
  });

  test('exactly 200 chars → valid', () => {
    const query = 'a'.repeat(200);
    const result = validateWhatIfInput(query);
    assert.equal(result.valid, true);
  });

  test('201 chars → invalid', () => {
    const query = 'a'.repeat(201);
    const result = validateWhatIfInput(query);
    assert.equal(result.valid, false);
    assert.ok(result.error);
  });

  test('error message mentions max length for too-long query', () => {
    const query = 'a'.repeat(201);
    const result = validateWhatIfInput(query);
    assert.ok(result.error.includes('200'));
  });
});

// ─────────────────────────────────────────────────────────────────
// getCommunityTotal
// ─────────────────────────────────────────────────────────────────
describe('getCommunityTotal', () => {
  test('returns 0 for empty array', () => {
    assert.equal(getCommunityTotal([]), 0);
  });

  test('returns 0 for non-array input', () => {
    assert.equal(getCommunityTotal(null), 0);
    assert.equal(getCommunityTotal(undefined), 0);
    assert.equal(getCommunityTotal('not an array'), 0);
  });

  test('sums only adopted posts', () => {
    const posts = [
      { adopted: true,  saves: 4.2 },
      { adopted: false, saves: 1.8 },
      { adopted: true,  saves: 7.6 },
    ];
    assert.equal(getCommunityTotal(posts), 4.2 + 7.6);
  });

  test('returns 0 when no posts are adopted', () => {
    const posts = [
      { adopted: false, saves: 10 },
      { adopted: false, saves: 5  },
    ];
    assert.equal(getCommunityTotal(posts), 0);
  });

  test('handles NaN saves gracefully', () => {
    const posts = [
      { adopted: true, saves: NaN },
      { adopted: true, saves: 5   },
    ];
    assert.equal(getCommunityTotal(posts), 5);
  });

  test('single adopted post', () => {
    const posts = [{ adopted: true, saves: 12.5 }];
    assert.equal(getCommunityTotal(posts), 12.5);
  });
});

// ─────────────────────────────────────────────────────────────────
// getChallengeTotalSaved
// ─────────────────────────────────────────────────────────────────
describe('getChallengeTotalSaved', () => {
  test('returns 0 for empty array', () => {
    assert.equal(getChallengeTotalSaved([]), 0);
  });

  test('returns 0 for non-array input', () => {
    assert.equal(getChallengeTotalSaved(null), 0);
  });

  test('sums only done challenges', () => {
    const challenges = [
      { done: true,  saves: '2.3 kg CO₂' },
      { done: false, saves: '5.1 kg CO₂' },
      { done: true,  saves: '12.0 kg CO₂' },
    ];
    assert.equal(getChallengeTotalSaved(challenges), 14.3);
  });

  test('returns 0 when no challenges done', () => {
    const challenges = [
      { done: false, saves: '5.1 kg CO₂' },
    ];
    assert.equal(getChallengeTotalSaved(challenges), 0);
  });

  test('parses "1.8 kg CO₂" correctly', () => {
    const challenges = [{ done: true, saves: '1.8 kg CO₂' }];
    assert.equal(getChallengeTotalSaved(challenges), 1.8);
  });

  test('result is rounded to 1 decimal', () => {
    const challenges = [
      { done: true, saves: '1.1 kg CO₂' },
      { done: true, saves: '1.1 kg CO₂' },
      { done: true, saves: '1.1 kg CO₂' },
    ];
    const result = getChallengeTotalSaved(challenges);
    assert.equal(result, 3.3);
  });

  test('all done challenges are summed', () => {
    const challenges = [
      { done: true, saves: '2.3 kg CO₂'  },
      { done: true, saves: '5.1 kg CO₂'  },
      { done: true, saves: '12.0 kg CO₂' },
    ];
    assert.equal(getChallengeTotalSaved(challenges), 19.4);
  });
});
