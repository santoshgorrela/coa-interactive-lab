import test from 'node:test';
import assert from 'node:assert/strict';
import { SIMULATIONS } from './syllabus';
import {
  COA_USER_MANUAL,
  buildGoogleDocsBatchRequests,
  computeManualMetrics,
} from './userManual';

test('user manual stays strictly within the 10-page maximum', () => {
  const metrics = computeManualMetrics(COA_USER_MANUAL);
  assert.equal(metrics.maxPageLimit, 10);
  assert.equal(metrics.withinPageLimit, true);
  assert.ok(
    metrics.estimatedPages >= 4 && metrics.estimatedPages <= 9,
    `Expected estimated pages in [4, 9] for comfortable <=10 page margin, got ${metrics.estimatedPages}`,
  );
  assert.ok(
    metrics.wordCount >= 900 && metrics.wordCount <= 2800,
    `Expected concise word count in [900, 2800], got ${metrics.wordCount}`,
  );
});

test('user manual covers all 26 syllabus simulators across Units 1-5', () => {
  const documentedSimIds = new Set(
    COA_USER_MANUAL.sections.flatMap((s) => (s.simGuides ?? []).map((g) => g.simId)),
  );
  for (const sim of SIMULATIONS) {
    assert.equal(
      documentedSimIds.has(sim.id),
      true,
      `Missing manual section for simulator ${sim.id} (${sim.title})`,
    );
  }
  assert.equal(documentedSimIds.size, SIMULATIONS.length);
});

test('Google Docs batchUpdate ranges stay strictly inside inserted UTF-16 text bounds', () => {
  const { fullText, requests } = buildGoogleDocsBatchRequests(COA_USER_MANUAL);
  assert.equal(fullText.endsWith('\n'), true);
  const maxIndex = 1 + fullText.length;

  const insertReq = requests.find((r) => 'insertText' in r) as
    | { insertText: { location: { index: number }; text: string } }
    | undefined;
  assert.ok(insertReq);
  assert.equal(insertReq.insertText.location.index, 1);

  for (const req of requests) {
    if ('updateParagraphStyle' in req) {
      const r = (req as { updateParagraphStyle: { range: { startIndex: number; endIndex: number } } })
        .updateParagraphStyle.range;
      assert.ok(r.startIndex >= 1 && r.endIndex <= maxIndex && r.startIndex < r.endIndex);
    }
    if ('updateTextStyle' in req) {
      const r = (req as { updateTextStyle: { range: { startIndex: number; endIndex: number } } })
        .updateTextStyle.range;
      assert.ok(r.startIndex >= 1 && r.endIndex < maxIndex && r.startIndex < r.endIndex);
    }
    if ('createParagraphBullets' in req) {
      const r = (req as { createParagraphBullets: { range: { startIndex: number; endIndex: number } } })
        .createParagraphBullets.range;
      assert.ok(r.startIndex >= 1 && r.endIndex <= maxIndex && r.startIndex < r.endIndex);
    }
  }
});
