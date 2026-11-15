import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePipelineMetrics,
  getInstructionCycleTrace,
  simulatePipeline,
} from './processorPipelineEngine.ts';

test('Instruction cycle traces produce complete micro-operation sequences', () => {
  const addTrace = getInstructionCycleTrace('add_indirect');
  assert.equal(addTrace.steps.length, 7);
  assert.equal(addTrace.steps[6].registers.R1, '0x0E');
  assert.ok(addTrace.steps[6].controlSignals.includes('End'));

  const branchTrace = getInstructionCycleTrace('branch_offset');
  assert.equal(branchTrace.steps.length, 5);
  assert.equal(branchTrace.steps[4].registers.PC, '0x11C');
});

test('Pipeline simulator tracks ideal execution, forwarding, stalls, and flushes', () => {
  const ideal = simulatePipeline('ideal');
  assert.equal(ideal.stallCount, 0);
  assert.equal(ideal.totalCycles, 8);

  const rawStall = simulatePipeline('data_raw_stall');
  const forwarded = simulatePipeline('data_forwarding');
  assert.equal(rawStall.stallCount, 2);
  assert.equal(forwarded.stallCount, 0);
  assert.ok(forwarded.totalCycles < rawStall.totalCycles);
  assert.equal(forwarded.forwardingLinks.length, 2);

  const loadUse = simulatePipeline('load_use_stall');
  assert.equal(loadUse.stallCount, 1);

  const branchStall = simulatePipeline('control_branch_stall');
  assert.ok(branchStall.grid[1].includes('FLUSH'));
});

test('Pipeline performance calculator computes cycles, speedup, efficiency, and MIPS', () => {
  const m = calculatePipelineMetrics(5, 100, 2, 0);
  assert.equal(m.nonPipelinedCycles, 500);
  assert.equal(m.pipelinedCycles, 104);
  assert.equal(m.speedup, 4.81);
  assert.equal(m.idealSpeedup, 5);
  assert.ok(m.efficiencyPercent > 95);
});
