import { describe, expect, it } from 'vitest';
import { BENEFITS, FAQ, IMPACT_ROWS, PLANS } from './constants';

describe('PLANS', () => {
  it('has at least one plan', () => {
    expect(PLANS.length).toBeGreaterThan(0);
  });

  it('every plan has non-empty required fields', () => {
    for (const plan of PLANS) {
      expect(plan.name).toBeTruthy();
      expect(plan.desc).toBeTruthy();
      expect(plan.priceMain).toBeTruthy();
      expect(plan.priceSub).toBeTruthy();
      expect(plan.cta).toBeTruthy();
      expect(plan.ctaHref).toBeTruthy();
      expect(plan.features.length).toBeGreaterThan(0);
    }
  });

  it('has unique plan names', () => {
    const names = PLANS.map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('prices are quoted in COP (no USD)', () => {
    for (const plan of PLANS) {
      if (!plan.priceIsLabel) {
        expect(plan.priceMain).toContain('COP');
      }
      expect(plan.priceMain).not.toMatch(/USD|US\$/);
    }
  });

  it('has exactly one featured plan', () => {
    expect(PLANS.filter((p) => p.featured).length).toBe(1);
  });
});

describe('IMPACT_ROWS', () => {
  it('every row has a before and an after', () => {
    expect(IMPACT_ROWS.length).toBeGreaterThan(0);
    for (const row of IMPACT_ROWS) {
      expect(row.before).toBeTruthy();
      expect(row.after).toBeTruthy();
    }
  });
});

describe('BENEFITS', () => {
  it('every entry has an icon, title and description', () => {
    expect(BENEFITS.length).toBeGreaterThan(0);
    for (const benefit of BENEFITS) {
      expect(benefit.icon).toBeTruthy();
      expect(benefit.title).toBeTruthy();
      expect(benefit.desc).toBeTruthy();
    }
  });
});

describe('FAQ', () => {
  it('every entry has a question and an answer', () => {
    expect(FAQ.length).toBeGreaterThan(0);
    for (const item of FAQ) {
      expect(item.q).toBeTruthy();
      expect(item.a).toBeTruthy();
    }
  });

  it('has no duplicate questions', () => {
    const questions = FAQ.map((f) => f.q);
    expect(new Set(questions).size).toBe(questions.length);
  });
});
