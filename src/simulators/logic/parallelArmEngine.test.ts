import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getEndianLayout,
  getFlynnArchitecture,
  runBarrelShifter,
  scheduleMulticoreTasks,
  simulateArmLoadStore,
  simulateDependencyGraph,
} from './parallelArmEngine.ts';

test('Dependency graph reduces P1..P5 from 5 sequential cycles to 3 parallel cycles', () => {
  const res = simulateDependencyGraph();
  assert.equal(res.sequentialCycles, 5);
  assert.equal(res.parallelCycles, 3);
  assert.equal(res.tasks.find((t) => t.id === 'P5')?.parallelCycle, 1);
});

test('Flynn architectures expose matching CU/PE counts and traces', () => {
  assert.equal(getFlynnArchitecture('SISD').processingElements, 1);
  assert.equal(getFlynnArchitecture('SIMD').controlUnits, 1);
  assert.equal(getFlynnArchitecture('SIMD').processingElements, 4);
  assert.equal(getFlynnArchitecture('MIMD').controlUnits, 4);
});

test('Multicore scheduler scales completion cycles with core count', () => {
  const tasks = [
    { id: 'T1', name: 'Sort', duration: 4 },
    { id: 'T2', name: 'FFT', duration: 4 },
    { id: 'T3', name: 'Filter', duration: 4 },
    { id: 'T4', name: 'Hash', duration: 4 },
  ];
  const single = scheduleMulticoreTasks(1, tasks);
  const quad = scheduleMulticoreTasks(4, tasks);
  assert.equal(single.totalCycles, 16);
  assert.equal(quad.totalCycles, 4);
  assert.equal(quad.speedup, 4);
});

test('ARM Barrel Shifter, Load/Store modes, and Endianness compute accurately', () => {
  assert.equal(runBarrelShifter(0x0003, 'LSL', 2).outputUnsigned, 12);
  assert.equal(runBarrelShifter(0x8000, 'ASR', 1).outputHex, '0xC000');

  const mem = { 100: 42, 104: 99 };
  const pre = simulateArmLoadStore('pre_indexed', 100, 4, mem);
  assert.equal(pre.loadedValue, 99);
  assert.equal(pre.newBaseAddr, 104);

  const post = simulateArmLoadStore('post_indexed', 100, 4, mem);
  assert.equal(post.loadedValue, 42);
  assert.equal(post.newBaseAddr, 104);

  const big = getEndianLayout('12345678', 'big');
  const little = getEndianLayout('12345678', 'little');
  assert.equal(big.bytes[0].byteHex, '12');
  assert.equal(little.bytes[0].byteHex, '78');
});
