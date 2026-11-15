export interface DependencyTask {
  id: string;
  expr: string;
  reads: string[];
  writes: string;
  sequentialCycle: number;
  parallelCycle: number;
  hazardNote: string;
}

export function simulateDependencyGraph(): {
  tasks: DependencyTask[];
  sequentialCycles: number;
  parallelCycles: number;
  speedup: number;
} {
  // Exact example from Unit 5 PDF: P1..P5
  const tasks: DependencyTask[] = [
    {
      id: 'P1',
      expr: 'C = D * E',
      reads: ['D', 'E'],
      writes: 'C',
      sequentialCycle: 1,
      parallelCycle: 1,
      hazardNote: 'Independent start; produces C for P2 and P3.',
    },
    {
      id: 'P2',
      expr: 'M = G + C',
      reads: ['G', 'C'],
      writes: 'M',
      sequentialCycle: 2,
      parallelCycle: 2,
      hazardNote: 'Flow (RAW) dependence on P1 (C); feeds P4 (M).',
    },
    {
      id: 'P3',
      expr: 'A = B + C',
      reads: ['B', 'C'],
      writes: 'A',
      sequentialCycle: 3,
      parallelCycle: 2,
      hazardNote: 'Flow (RAW) dependence on P1 (C); executes in parallel with P2!',
    },
    {
      id: 'P4',
      expr: 'C = L + M',
      reads: ['L', 'M'],
      writes: 'C',
      sequentialCycle: 4,
      parallelCycle: 3,
      hazardNote: 'Flow dependence on P2 (M); anti-dependence (WAR) with P2/P3 on C, output (WAW) with P1 on C.',
    },
    {
      id: 'P5',
      expr: 'F = G / E',
      reads: ['G', 'E'],
      writes: 'F',
      sequentialCycle: 5,
      parallelCycle: 1,
      hazardNote: 'Completely independent of P1..P4; can execute in Cycle 1!',
    },
  ];
  return {
    tasks,
    sequentialCycles: 5,
    parallelCycles: 3,
    speedup: Number((5 / 3).toFixed(2)),
  };
}

export type FlynnMode = 'SISD' | 'SIMD' | 'MISD' | 'MIMD';

export interface FlynnTraceStep {
  cycle: number;
  instructionStream: string[];
  dataStreams: string[];
  outputs: string[];
  note: string;
}

export function getFlynnArchitecture(mode: FlynnMode): {
  mode: FlynnMode;
  fullName: string;
  controlUnits: number;
  processingElements: number;
  summary: string;
  examples: string;
  steps: FlynnTraceStep[];
} {
  switch (mode) {
    case 'SISD':
      return {
        mode,
        fullName: 'Single Instruction, Single Data',
        controlUnits: 1,
        processingElements: 1,
        summary: 'Conventional uniprocessor: 1 Control Unit fetches 1 instruction at a time operating on 1 data stream.',
        examples: 'Classic Von Neumann CPU, early Intel 8086 / single-core microcontrollers',
        steps: [
          { cycle: 1, instructionStream: ['ADD R1, A[0]'], dataStreams: ['A[0] = 4'], outputs: ['R1 = 14'], note: '1 CU decodes ADD -> 1 ALU processes A[0].' },
          { cycle: 2, instructionStream: ['ADD R2, A[1]'], dataStreams: ['A[1] = 7'], outputs: ['R2 = 17'], note: 'Sequential instruction and data fetch.' },
          { cycle: 3, instructionStream: ['ADD R3, A[2]'], dataStreams: ['A[2] = 9'], outputs: ['R3 = 19'], note: '1 result per cycle without vector hardware.' },
        ],
      };
    case 'SIMD':
      return {
        mode,
        fullName: 'Single Instruction, Multiple Data',
        controlUnits: 1,
        processingElements: 4,
        summary: '1 Control Unit broadcasts the exact same instruction synchronously to multiple ALUs operating on different data elements.',
        examples: 'GPU streaming multiprocessors, ARM NEON, Intel AVX vector units',
        steps: [
          {
            cycle: 1,
            instructionStream: ['VADD V3, V1, V2'],
            dataStreams: ['A0+B0 (2+5)', 'A1+B1 (4+1)', 'A2+B2 (6+3)', 'A3+B3 (8+2)'],
            outputs: ['C0=7', 'C1=5', 'C2=9', 'C3=10'],
            note: 'Lockstep vector addition across 4 lanes from 1 instruction.',
          },
          {
            cycle: 2,
            instructionStream: ['VMUL V4, V3, #2'],
            dataStreams: ['7×2', '5×2', '9×2', '10×2'],
            outputs: ['D0=14', 'D1=10', 'D2=18', 'D3=20'],
            note: '4 parallel multiplications completed in a single cycle.',
          },
        ],
      };
    case 'MISD':
      return {
        mode,
        fullName: 'Multiple Instruction, Single Data',
        controlUnits: 4,
        processingElements: 4,
        summary: 'Multiple independent instructions operate simultaneously on the same shared input data stream (rare; used in fault-tolerant / systolic arrays).',
        examples: 'Space shuttle flight-control triple-redundant computers, cryptographic filter pipelines',
        steps: [
          {
            cycle: 1,
            instructionStream: ['PE1: X * 2', 'PE2: X + 5', 'PE3: X ^ 0xF', 'PE4: Parity(X)'],
            dataStreams: ['Shared Input X = 10'],
            outputs: ['20', '15', '5', 'Even(0)'],
            note: 'Same input X=10 fed to 4 distinct instruction streams simultaneously.',
          },
          {
            cycle: 2,
            instructionStream: ['PE1: Vote()', 'PE2: Vote()', 'PE3: Vote()', 'PE4: Verify()'],
            dataStreams: ['Shared Sensor X = 12'],
            outputs: ['24', '17', '3', 'Valid'],
            note: 'Redundant checks verify sensor integrity on one stream.',
          },
        ],
      };
    case 'MIMD':
      return {
        mode,
        fullName: 'Multiple Instruction, Multiple Data',
        controlUnits: 4,
        processingElements: 4,
        summary: 'Independent processor cores execute different instruction streams asynchronously on independent data sets.',
        examples: 'Modern multicore CPUs (ARM Cortex-A, Intel Core), compute clusters',
        steps: [
          {
            cycle: 1,
            instructionStream: ['Core0: LDR R1,[A]', 'Core1: MUL R2,R3', 'Core2: CMP R4,#0', 'Core3: STR R5,[B]'],
            dataStreams: ['Thread 0 Data', 'Thread 1 Data', 'Thread 2 Data', 'Thread 3 Data'],
            outputs: ['R1=0x40', 'R2=36', 'Z=0', 'Mem[B]=9'],
            note: '4 autonomous cores run distinct threads concurrently.',
          },
          {
            cycle: 2,
            instructionStream: ['Core0: ADD R1,R1,#4', 'Core1: SUB R2,R2,#1', 'Core2: BNE Loop', 'Core3: ADD R6,R6,#1'],
            dataStreams: ['Thread 0 Data', 'Thread 1 Data', 'Thread 2 Data', 'Thread 3 Data'],
            outputs: ['R1=0x44', 'R2=35', 'PC->Loop', 'R6=1'],
            note: 'Full thread-level parallelism across all cores.',
          },
        ],
      };
  }
}

// ---------- Multicore Scheduler ----------

export interface MulticoreTask {
  id: string;
  name: string;
  duration: number;
}

export interface CoreScheduleItem {
  taskId: string;
  name: string;
  start: number;
  end: number;
}

export function scheduleMulticoreTasks(
  coreCount: 1 | 2 | 4,
  tasks: MulticoreTask[],
): {
  coreCount: 1 | 2 | 4;
  cores: CoreScheduleItem[][];
  totalCycles: number;
  sequentialCycles: number;
  speedup: number;
} {
  const cores: CoreScheduleItem[][] = Array.from({ length: coreCount }, () => []);
  const coreEndTimes = new Array(coreCount).fill(0);

  for (const task of tasks) {
    // Greedy least-loaded core assignment
    let minCore = 0;
    for (let c = 1; c < coreCount; c++) {
      if (coreEndTimes[c] < coreEndTimes[minCore]) {
        minCore = c;
      }
    }
    const start = coreEndTimes[minCore];
    const end = start + Math.max(1, task.duration);
    cores[minCore].push({ taskId: task.id, name: task.name, start, end });
    coreEndTimes[minCore] = end;
  }

  const totalCycles = Math.max(1, ...coreEndTimes);
  const sequentialCycles = Math.max(
    1,
    tasks.reduce((acc, t) => acc + Math.max(1, t.duration), 0),
  );
  return {
    coreCount,
    cores,
    totalCycles,
    sequentialCycles,
    speedup: Number((sequentialCycles / totalCycles).toFixed(2)),
  };
}

// ---------- ARM Barrel Shifter, Thumb & Load/Store ----------

export type ShiftType = 'LSL' | 'LSR' | 'ASR' | 'ROR';

export function runBarrelShifter(
  value: number,
  shiftType: ShiftType,
  amount: number,
): {
  inputHex: string;
  inputBin16: string;
  outputUnsigned: number;
  outputHex: string;
  outputBin16: string;
  carryOut: 0 | 1;
  description: string;
} {
  // Use 16-bit display width for clear visual inspection in browser while preserving exact 16/32-bit semantics
  const v = value & 0xffff;
  const sh = Math.max(0, Math.min(15, Math.floor(amount)));
  let out = v;
  let carryOut: 0 | 1 = 0;

  if (sh > 0) {
    switch (shiftType) {
      case 'LSL':
        carryOut = ((v >> (16 - sh)) & 1) === 1 ? 1 : 0;
        out = (v << sh) & 0xffff;
        break;
      case 'LSR':
        carryOut = ((v >> (sh - 1)) & 1) === 1 ? 1 : 0;
        out = v >>> sh;
        break;
      case 'ASR': {
        carryOut = ((v >> (sh - 1)) & 1) === 1 ? 1 : 0;
        const sign = (v & 0x8000) !== 0 ? -1 : 0;
        const signed16 = sign === -1 ? v - 0x10000 : v;
        out = (signed16 >> sh) & 0xffff;
        break;
      }
      case 'ROR':
        out = ((v >>> sh) | (v << (16 - sh))) & 0xffff;
        carryOut = ((out >> 15) & 1) === 1 ? 1 : 0;
        break;
    }
  }

  const descriptions: Record<ShiftType, string> = {
    LSL: `Logical Shift Left by ${sh}: multiplies unsigned value by 2^${sh}; LSBs filled with 0.`,
    LSR: `Logical Shift Right by ${sh}: divides unsigned value by 2^${sh}; MSBs filled with 0.`,
    ASR: `Arithmetic Shift Right by ${sh}: preserves sign bit (MSB) for signed division by 2^${sh}.`,
    ROR: `Rotate Right by ${sh}: bits shifted out of LSB wrap around into MSB.`,
  };

  return {
    inputHex: `0x${v.toString(16).toUpperCase().padStart(4, '0')}`,
    inputBin16: v.toString(2).padStart(16, '0'),
    outputUnsigned: out,
    outputHex: `0x${out.toString(16).toUpperCase().padStart(4, '0')}`,
    outputBin16: out.toString(2).padStart(16, '0'),
    carryOut,
    description: descriptions[shiftType],
  };
}

export type ArmLoadStoreMode = 'offset' | 'pre_indexed' | 'post_indexed';

export function simulateArmLoadStore(
  mode: ArmLoadStoreMode,
  baseAddr: number,
  offset: number,
  memory: Record<number, number>,
): {
  syntax: string;
  effectiveAddress: number;
  loadedValue: number;
  newBaseAddr: number;
  explanation: string;
} {
  if (mode === 'offset') {
    const ea = baseAddr + offset;
    return {
      syntax: `LDR R0, [R1, #${offset}]`,
      effectiveAddress: ea,
      loadedValue: memory[ea] ?? 0,
      newBaseAddr: baseAddr,
      explanation: `Offset addressing: Effective Address = R1 (${baseAddr}) + ${offset} = ${ea}. Base register R1 remains ${baseAddr}.`,
    };
  }
  if (mode === 'pre_indexed') {
    const ea = baseAddr + offset;
    return {
      syntax: `LDR R0, [R1, #${offset}]!`,
      effectiveAddress: ea,
      loadedValue: memory[ea] ?? 0,
      newBaseAddr: ea,
      explanation: `Pre-indexed (!): Updates R1 first (${baseAddr} + ${offset} = ${ea}), then loads R0 from M[${ea}].`,
    };
  }
  return {
    syntax: `LDR R0, [R1], #${offset}`,
    effectiveAddress: baseAddr,
    loadedValue: memory[baseAddr] ?? 0,
    newBaseAddr: baseAddr + offset,
    explanation: `Post-indexed: Loads R0 from M[${baseAddr}] first, then increments base register R1 to ${baseAddr + offset}.`,
  };
}

export function getEndianLayout(hex32: string, endian: 'big' | 'little'): {
  bytes: { offset: number; byteHex: string }[];
  description: string;
} {
  const clean = hex32.replace(/^0x/i, '').replace(/[^0-9a-fA-F]/g, '').padStart(8, '0').slice(-8).toUpperCase();
  const msbToLsb = [clean.slice(0, 2), clean.slice(2, 4), clean.slice(4, 6), clean.slice(6, 8)];
  const ordered = endian === 'big' ? msbToLsb : [...msbToLsb].reverse();
  return {
    bytes: ordered.map((byteHex, offset) => ({ offset, byteHex })),
    description:
      endian === 'big'
        ? `Big-Endian: Most Significant Byte (0x${msbToLsb[0]}) sits at lowest memory address (+0).`
        : `Little-Endian: Least Significant Byte (0x${msbToLsb[3]}) sits at lowest memory address (+0).`,
  };
}
