export type InstructionCycleProgramId = 'add_indirect' | 'load_loc' | 'branch_offset';

export interface MicroStep {
  step: number;
  label: string;
  phase: 'Fetch' | 'Decode' | 'Execute';
  rtl: string;
  controlSignals: string[];
  activeComponents: string[];
  activeBus: boolean;
  registers: {
    PC: string;
    MAR: string;
    MDR: string;
    IR: string;
    Y: string;
    Z: string;
    R1: string;
    R3: string;
  };
  explanation: string;
}

export function getInstructionCycleTrace(programId: InstructionCycleProgramId): {
  title: string;
  instruction: string;
  steps: MicroStep[];
} {
  if (programId === 'add_indirect') {
    return {
      title: 'Add (R3), R1 — Single-Bus Control Sequence',
      instruction: 'ADD (R3), R1   [R1 ← R1 + M[R3]]',
      steps: [
        {
          step: 1,
          label: 'T1',
          phase: 'Fetch',
          rtl: 'MAR ← [PC], PC ← [PC] + 4',
          controlSignals: ['PC_out', 'MAR_in', 'Read', 'Select4', 'Add', 'Z_in'],
          activeComponents: ['PC', 'MAR', 'MUX', 'ALU', 'Z'],
          activeBus: true,
          registers: { PC: '0x100', MAR: '0x100', MDR: '0x00', IR: '—', Y: '0x00', Z: '0x104', R1: '0x05', R3: '0x200' },
          explanation: 'Place PC onto the internal processor bus into MAR, assert memory Read, and simultaneously compute PC + 4 in the ALU into Z.',
        },
        {
          step: 2,
          label: 'T2',
          phase: 'Fetch',
          rtl: 'PC ← [Z], Wait for MFC',
          controlSignals: ['Z_out', 'PC_in', 'Y_in', 'WMFC'],
          activeComponents: ['Z', 'PC', 'Y', 'MDR'],
          activeBus: true,
          registers: { PC: '0x104', MAR: '0x100', MDR: 'ADD (R3),R1', IR: '—', Y: '0x104', Z: '0x104', R1: '0x05', R3: '0x200' },
          explanation: 'Move incremented address from Z to PC while waiting for Memory Function Completed (MFC) to latch the fetched instruction into MDR.',
        },
        {
          step: 3,
          label: 'T3',
          phase: 'Decode',
          rtl: 'IR ← [MDR]',
          controlSignals: ['MDR_out', 'IR_in'],
          activeComponents: ['MDR', 'IR', 'CU'],
          activeBus: true,
          registers: { PC: '0x104', MAR: '0x100', MDR: 'ADD (R3),R1', IR: 'ADD (R3),R1', Y: '0x104', Z: '0x104', R1: '0x05', R3: '0x200' },
          explanation: 'Transfer the fetched instruction word from MDR into Instruction Register (IR) so the Control Unit decodes opcode and addressing mode.',
        },
        {
          step: 4,
          label: 'T4',
          phase: 'Execute',
          rtl: 'MAR ← [R3], Read M[R3]',
          controlSignals: ['R3_out', 'MAR_in', 'Read'],
          activeComponents: ['R3', 'MAR', 'MEM'],
          activeBus: true,
          registers: { PC: '0x104', MAR: '0x200', MDR: 'ADD (R3),R1', IR: 'ADD (R3),R1', Y: '0x104', Z: '0x104', R1: '0x05', R3: '0x200' },
          explanation: 'Register indirect addressing: send pointer R3 (0x200) to MAR and issue Read to fetch operand from memory.',
        },
        {
          step: 5,
          label: 'T5',
          phase: 'Execute',
          rtl: 'Y ← [R1], Wait for MFC',
          controlSignals: ['R1_out', 'Y_in', 'WMFC'],
          activeComponents: ['R1', 'Y', 'MDR'],
          activeBus: true,
          registers: { PC: '0x104', MAR: '0x200', MDR: '0x09', IR: 'ADD (R3),R1', Y: '0x05', Z: '0x104', R1: '0x05', R3: '0x200' },
          explanation: 'While memory returns operand 0x09 into MDR, gate R1 (0x05) into temporary register Y at ALU input A.',
        },
        {
          step: 6,
          label: 'T6',
          phase: 'Execute',
          rtl: 'Z ← [Y] + [MDR]',
          controlSignals: ['MDR_out', 'SelectY', 'Add', 'Z_in'],
          activeComponents: ['MDR', 'Y', 'MUX', 'ALU', 'Z'],
          activeBus: true,
          registers: { PC: '0x104', MAR: '0x200', MDR: '0x09', IR: 'ADD (R3),R1', Y: '0x05', Z: '0x0E', R1: '0x05', R3: '0x200' },
          explanation: 'Gate MDR (0x09) onto the bus into ALU input B, select Y (0x05) on the MUX, add them, and store 0x0E (14) in Z.',
        },
        {
          step: 7,
          label: 'T7',
          phase: 'Execute',
          rtl: 'R1 ← [Z], End',
          controlSignals: ['Z_out', 'R1_in', 'End'],
          activeComponents: ['Z', 'R1', 'CU'],
          activeBus: true,
          registers: { PC: '0x104', MAR: '0x200', MDR: '0x09', IR: 'ADD (R3),R1', Y: '0x05', Z: '0x0E', R1: '0x0E', R3: '0x200' },
          explanation: 'Write the ALU result from Z into destination register R1 and assert End to reset the Control Step Counter for the next instruction.',
        },
      ],
    };
  }

  if (programId === 'branch_offset') {
    return {
      title: 'Unconditional Branch — Offset PC Update',
      instruction: 'BR +0x18   [PC ← [PC] + Offset]',
      steps: [
        {
          step: 1,
          label: 'T1',
          phase: 'Fetch',
          rtl: 'MAR ← [PC], PC ← [PC] + 4',
          controlSignals: ['PC_out', 'MAR_in', 'Read', 'Select4', 'Add', 'Z_in'],
          activeComponents: ['PC', 'MAR', 'MUX', 'ALU', 'Z'],
          activeBus: true,
          registers: { PC: '0x100', MAR: '0x100', MDR: '0x00', IR: '—', Y: '0x00', Z: '0x104', R1: '0x05', R3: '0x200' },
          explanation: 'Fetch branch instruction at 0x100 while computing next sequential PC = 0x104 in Z.',
        },
        {
          step: 2,
          label: 'T2',
          phase: 'Fetch',
          rtl: 'PC ← [Z], Wait for MFC',
          controlSignals: ['Z_out', 'PC_in', 'Y_in', 'WMFC'],
          activeComponents: ['Z', 'PC', 'Y', 'MDR'],
          activeBus: true,
          registers: { PC: '0x104', MAR: '0x100', MDR: 'BR +0x18', IR: '—', Y: '0x104', Z: '0x104', R1: '0x05', R3: '0x200' },
          explanation: 'Latch updated PC (0x104) into both PC and Y, and receive BR +0x18 in MDR.',
        },
        {
          step: 3,
          label: 'T3',
          phase: 'Decode',
          rtl: 'IR ← [MDR]',
          controlSignals: ['MDR_out', 'IR_in'],
          activeComponents: ['MDR', 'IR', 'CU'],
          activeBus: true,
          registers: { PC: '0x104', MAR: '0x100', MDR: 'BR +0x18', IR: 'BR +0x18', Y: '0x104', Z: '0x104', R1: '0x05', R3: '0x200' },
          explanation: 'Decode BR instruction; offset field (+0x18) is now available inside IR.',
        },
        {
          step: 4,
          label: 'T4',
          phase: 'Execute',
          rtl: 'Z ← [Y] + Offset(IR)',
          controlSignals: ['Offset-field-of-IR_out', 'SelectY', 'Add', 'Z_in'],
          activeComponents: ['IR', 'Y', 'MUX', 'ALU', 'Z'],
          activeBus: true,
          registers: { PC: '0x104', MAR: '0x100', MDR: 'BR +0x18', IR: 'BR +0x18', Y: '0x104', Z: '0x11C', R1: '0x05', R3: '0x200' },
          explanation: 'Add branch offset (+0x18) from IR to the updated PC stored in Y (0x104) -> target 0x11C in Z.',
        },
        {
          step: 5,
          label: 'T5',
          phase: 'Execute',
          rtl: 'PC ← [Z], End',
          controlSignals: ['Z_out', 'PC_in', 'End'],
          activeComponents: ['Z', 'PC', 'CU'],
          activeBus: true,
          registers: { PC: '0x11C', MAR: '0x100', MDR: 'BR +0x18', IR: 'BR +0x18', Y: '0x104', Z: '0x11C', R1: '0x05', R3: '0x200' },
          explanation: 'Load computed branch target 0x11C into PC and signal End to start fetching from target address.',
        },
      ],
    };
  }

  // load_loc
  return {
    title: 'Load R1, 0x300 — Direct Memory Read',
    instruction: 'LOAD R1, [0x300]   [R1 ← M[0x300]]',
    steps: [
      {
        step: 1,
        label: 'T1',
        phase: 'Fetch',
        rtl: 'MAR ← [PC], PC ← [PC] + 4',
        controlSignals: ['PC_out', 'MAR_in', 'Read', 'Select4', 'Add', 'Z_in'],
        activeComponents: ['PC', 'MAR', 'MUX', 'ALU', 'Z'],
        activeBus: true,
        registers: { PC: '0x100', MAR: '0x100', MDR: '0x00', IR: '—', Y: '0x00', Z: '0x104', R1: '0x00', R3: '0x200' },
        explanation: 'Send PC to MAR, read instruction, and increment PC by 4 via ALU.',
      },
      {
        step: 2,
        label: 'T2',
        phase: 'Fetch',
        rtl: 'PC ← [Z], Wait for MFC',
        controlSignals: ['Z_out', 'PC_in', 'WMFC'],
        activeComponents: ['Z', 'PC', 'MDR'],
        activeBus: true,
        registers: { PC: '0x104', MAR: '0x100', MDR: 'LOAD R1, 0x300', IR: '—', Y: '0x00', Z: '0x104', R1: '0x00', R3: '0x200' },
        explanation: 'Update PC to 0x104 and receive instruction in MDR upon MFC.',
      },
      {
        step: 3,
        label: 'T3',
        phase: 'Decode',
        rtl: 'IR ← [MDR]',
        controlSignals: ['MDR_out', 'IR_in'],
        activeComponents: ['MDR', 'IR', 'CU'],
        activeBus: true,
        registers: { PC: '0x104', MAR: '0x100', MDR: 'LOAD R1, 0x300', IR: 'LOAD R1, 0x300', Y: '0x00', Z: '0x104', R1: '0x00', R3: '0x200' },
        explanation: 'Move instruction to IR for decoding address field 0x300.',
      },
      {
        step: 4,
        label: 'T4',
        phase: 'Execute',
        rtl: 'MAR ← Address(IR), Read',
        controlSignals: ['Address-of-IR_out', 'MAR_in', 'Read'],
        activeComponents: ['IR', 'MAR', 'MEM'],
        activeBus: true,
        registers: { PC: '0x104', MAR: '0x300', MDR: 'LOAD R1, 0x300', IR: 'LOAD R1, 0x300', Y: '0x00', Z: '0x104', R1: '0x00', R3: '0x200' },
        explanation: 'Put operand address 0x300 into MAR and start memory Read.',
      },
      {
        step: 5,
        label: 'T5',
        phase: 'Execute',
        rtl: 'MDR ← M[0x300], R1 ← [MDR], End',
        controlSignals: ['WMFC', 'MDR_out', 'R1_in', 'End'],
        activeComponents: ['MDR', 'R1', 'CU'],
        activeBus: true,
        registers: { PC: '0x104', MAR: '0x300', MDR: '0x2A', IR: 'LOAD R1, 0x300', Y: '0x00', Z: '0x104', R1: '0x2A', R3: '0x200' },
        explanation: 'Wait for MFC to load 0x2A (42) into MDR, transfer into R1, and signal End.',
      },
    ],
  };
}

// ---------- 5-Stage Pipeline & Hazard Simulator ----------

export type PipelineScenarioId =
  | 'ideal'
  | 'structural'
  | 'data_raw_stall'
  | 'data_forwarding'
  | 'load_use_stall'
  | 'control_branch_stall'
  | 'control_branch_predict';

export type PipelineStageCell = 'IF' | 'ID' | 'EX' | 'MEM' | 'WB' | 'STALL' | 'FLUSH' | null;

export interface PipelineSimulationResult {
  scenario: PipelineScenarioId;
  title: string;
  instructions: string[];
  totalCycles: number;
  grid: PipelineStageCell[][]; // [instrIdx][cycleIdx (0-based)]
  stallCount: number;
  forwardingLinks: { cycle: number; fromInstr: number; toInstr: number; label: string }[];
  hazardSummary: string;
}

export function simulatePipeline(scenario: PipelineScenarioId): PipelineSimulationResult {
  switch (scenario) {
    case 'ideal': {
      const instructions = ['I1: ADD R1, R2, R3', 'I2: SUB R4, R5, R6', 'I3: AND R7, R8, R9', 'I4: OR R10, R11, R12'];
      const stages: PipelineStageCell[] = ['IF', 'ID', 'EX', 'MEM', 'WB'];
      const totalCycles = 8;
      const grid = instructions.map((_, row) =>
        Array.from({ length: totalCycles }, (__, c) => {
          const offset = c - row;
          return offset >= 0 && offset < stages.length ? stages[offset] : null;
        }),
      );
      return {
        scenario,
        title: 'Ideal 5-Stage Pipeline (1 IPC Steady State)',
        instructions,
        totalCycles,
        grid,
        stallCount: 0,
        forwardingLinks: [],
        hazardSummary: 'No hazards detected. A new instruction completes every clock cycle after the 4-cycle fill latency.',
      };
    }

    case 'structural': {
      const instructions = ['I1: LOAD R1, 0(R2)', 'I2: ADD R3, R4, R5', 'I3: SUB R6, R7, R8', 'I4: OR R9, R10, R11'];
      // Shared single memory port: I1 MEM at cycle 4 conflicts with I4 IF at cycle 4 -> I4 stalls 1 cycle
      const grid: PipelineStageCell[][] = [
        ['IF', 'ID', 'EX', 'MEM', 'WB', null, null, null, null],
        [null, 'IF', 'ID', 'EX', 'MEM', 'WB', null, null, null],
        [null, null, 'IF', 'ID', 'EX', 'MEM', 'WB', null, null],
        [null, null, null, 'STALL', 'IF', 'ID', 'EX', 'MEM', 'WB'],
      ];
      return {
        scenario,
        title: 'Structural Hazard (Unified Memory Port Conflict)',
        instructions,
        totalCycles: 9,
        grid,
        stallCount: 1,
        forwardingLinks: [],
        hazardSummary: 'In Cycle 4, I1 accesses memory in MEM while I4 needs IF from the same unified memory. I4 stalls 1 cycle (bubble). Separate I-Cache and D-Cache eliminate this hazard.',
      };
    }

    case 'data_raw_stall': {
      const instructions = ['I1: ADD R1, R2, R3', 'I2: SUB R4, R1, R5', 'I3: AND R6, R1, R7'];
      // Without forwarding, I2 ID stalls waiting for I1 WB in cycle 5
      const grid: PipelineStageCell[][] = [
        ['IF', 'ID', 'EX', 'MEM', 'WB', null, null, null, null],
        [null, 'IF', 'ID', 'STALL', 'STALL', 'EX', 'MEM', 'WB', null],
        [null, null, 'IF', 'STALL', 'STALL', 'ID', 'EX', 'MEM', 'WB'],
      ];
      return {
        scenario,
        title: 'RAW Data Hazard (Stalled Without Forwarding)',
        instructions,
        totalCycles: 9,
        grid,
        stallCount: 2,
        forwardingLinks: [],
        hazardSummary: 'I2 reads R1 before I1 writes R1 back in WB (Cycle 5). Without forwarding hardware, the pipeline inserts 2 stall bubbles.',
      };
    }

    case 'data_forwarding': {
      const instructions = ['I1: ADD R1, R2, R3', 'I2: SUB R4, R1, R5', 'I3: AND R6, R1, R7'];
      // With EX/MEM -> EX & MEM/WB -> EX forwarding: 0 stalls!
      const grid: PipelineStageCell[][] = [
        ['IF', 'ID', 'EX', 'MEM', 'WB', null, null],
        [null, 'IF', 'ID', 'EX', 'MEM', 'WB', null],
        [null, null, 'IF', 'ID', 'EX', 'MEM', 'WB'],
      ];
      return {
        scenario,
        title: 'RAW Data Hazard Resolved via Forwarding (Bypassing)',
        instructions,
        totalCycles: 7,
        grid,
        stallCount: 0,
        forwardingLinks: [
          { cycle: 4, fromInstr: 0, toInstr: 1, label: 'EX/MEM -> EX (R1)' },
          { cycle: 5, fromInstr: 0, toInstr: 2, label: 'MEM/WB -> EX (R1)' },
        ],
        hazardSummary: 'Bypass paths forward R1 directly from I1’s EX/MEM and MEM/WB pipeline registers to I2 and I3 ALU inputs, eliminating both stall cycles.',
      };
    }

    case 'load_use_stall': {
      const instructions = ['I1: LD R1, 0(R2)', 'I2: SUB R4, R1, R5', 'I3: AND R6, R1, R7'];
      // Data from LD isn't ready until end of MEM (Cycle 4), so 1 mandatory stall cycle even with forwarding
      const grid: PipelineStageCell[][] = [
        ['IF', 'ID', 'EX', 'MEM', 'WB', null, null, null],
        [null, 'IF', 'ID', 'STALL', 'EX', 'MEM', 'WB', null],
        [null, null, 'IF', 'STALL', 'ID', 'EX', 'MEM', 'WB'],
      ];
      return {
        scenario,
        title: 'Load-Use Data Hazard (1 Mandatory Stall + Forwarding)',
        instructions,
        totalCycles: 8,
        grid,
        stallCount: 1,
        forwardingLinks: [{ cycle: 5, fromInstr: 0, toInstr: 1, label: 'MEM/WB -> EX (LD R1)' }],
        hazardSummary: 'Memory data for LD R1 is only ready after Cycle 4 (MEM). Forwarding still requires 1 unavoidable stall bubble before I2 enters EX in Cycle 5.',
      };
    }

    case 'control_branch_stall': {
      const instructions = ['I1: BEQ R1, R2, Target', 'I2: ADD R3, R4, R5 (Flushed)', 'I3: Target: SUB R6, R7, R8'];
      const grid: PipelineStageCell[][] = [
        ['IF', 'ID', 'EX', 'MEM', 'WB', null, null, null],
        [null, 'IF', 'FLUSH', null, null, null, null, null],
        [null, null, 'IF', 'ID', 'EX', 'MEM', 'WB', null],
      ];
      return {
        scenario,
        title: 'Control (Branch) Hazard — Mispredicted / Stalled Fetch',
        instructions,
        totalCycles: 7,
        grid,
        stallCount: 1,
        forwardingLinks: [],
        hazardSummary: 'Branch outcome is resolved in ID/EX. Speculatively fetched I2 is flushed (squashed) and replaced by Target I3, costing a branch penalty cycle.',
      };
    }

    case 'control_branch_predict': {
      const instructions = ['I1: BEQ R1, R2, Target', 'I2: Target: SUB R6, R7, R8', 'I3: ADD R3, R4, R5'];
      const grid: PipelineStageCell[][] = [
        ['IF', 'ID', 'EX', 'MEM', 'WB', null, null],
        [null, 'IF', 'ID', 'EX', 'MEM', 'WB', null],
        [null, null, 'IF', 'ID', 'EX', 'MEM', 'WB'],
      ];
      return {
        scenario,
        title: 'Control Hazard Mitigated (Correct Dynamic Branch Prediction)',
        instructions,
        totalCycles: 7,
        grid,
        stallCount: 0,
        forwardingLinks: [],
        hazardSummary: 'Dynamic 2-bit Branch Target Buffer (BTB) predicts Taken accurately in IF, fetching Target I2 immediately in Cycle 2 with zero penalty.',
      };
    }
  }
}

export interface PipelineMetrics {
  nonPipelinedCycles: number;
  pipelinedCycles: number;
  speedup: number;
  idealSpeedup: number;
  efficiencyPercent: number;
  nonPipelinedTimeNs: number;
  pipelinedTimeNs: number;
  throughputMIPS: number;
}

export function calculatePipelineMetrics(
  stages: number,
  instructions: number,
  clockPeriodNs: number,
  stallCycles: number,
): PipelineMetrics {
  const k = Math.max(1, Math.floor(stages));
  const n = Math.max(1, Math.floor(instructions));
  const clk = Math.max(0.1, clockPeriodNs);
  const stalls = Math.max(0, Math.floor(stallCycles));

  const nonPipelinedCycles = n * k;
  const pipelinedCycles = k + (n - 1) + stalls;
  const speedup = Number((nonPipelinedCycles / pipelinedCycles).toFixed(2));
  const efficiencyPercent = Number(((speedup / k) * 100).toFixed(1));
  const nonPipelinedTimeNs = Number((nonPipelinedCycles * clk).toFixed(2));
  const pipelinedTimeNs = Number((pipelinedCycles * clk).toFixed(2));
  // MIPS = (instructions / totalTimeInSeconds) / 1e6 = (n * 1000) / pipelinedTimeNs
  const throughputMIPS = Number(((n * 1000) / pipelinedTimeNs).toFixed(2));

  return {
    nonPipelinedCycles,
    pipelinedCycles,
    speedup,
    idealSpeedup: k,
    efficiencyPercent,
    nonPipelinedTimeNs,
    pipelinedTimeNs,
    throughputMIPS,
  };
}
