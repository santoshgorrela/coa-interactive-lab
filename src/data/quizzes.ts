import { UnitId } from './syllabus';

export interface QuizQuestion {
  id: string;
  unitId: UnitId;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_BANK: QuizQuestion[] = [
  // Unit 1
  {
    id: 'q1-1',
    unitId: 1,
    question: 'Which statement best distinguishes Computer Architecture from Computer Organization?',
    options: [
      'Architecture covers attributes visible to a programmer (ISA), while Organization covers operational hardware units and interconnections.',
      'Architecture refers strictly to memory chips, while Organization refers strictly to operating systems.',
      'Architecture changes with every hardware clock upgrade, while Organization stays identical across chip families.',
      'Organization defines the instruction set opcodes, while Architecture chooses the cooling fan.',
    ],
    correctIndex: 0,
    explanation:
      'Computer Architecture defines programmer-visible attributes such as instruction set, bit widths, and addressing modes, whereas Organization describes how hardware units realize those specifications.',
  },
  {
    id: 'q1-2',
    unitId: 1,
    question: 'What causes the classic "Von Neumann Bottleneck"?',
    options: [
      'Using separate buses for instructions and data',
      'Sharing a single memory and bus path for both instructions and data',
      'Having too many general-purpose CPU registers',
      'Executing instructions in parallel across 4 cores',
    ],
    correctIndex: 1,
    explanation:
      'In a pure Von Neumann machine, instructions and data share the same memory and single bus, limiting CPU throughput to one transfer at a time.',
  },
  {
    id: 'q1-3',
    unitId: 1,
    question: 'In the 7-layer Computer-Level Hierarchy, which level sits immediately above Level 0 (Digital Logic)?',
    options: [
      'Level 1: Control (Microarchitecture)',
      'Level 1: High-Level Language',
      'Level 1: System Software (OS)',
      'Level 1: Assembly Language',
    ],
    correctIndex: 0,
    explanation:
      'Level 0 is Digital Logic (gates/flip-flops), and Level 1 is the Control level which interprets instructions via hardwired or microprogrammed signals.',
  },
  {
    id: 'q1-4',
    unitId: 1,
    question: 'Which hardware technology characterized the 4th Generation of computers (e.g., Intel 4004)?',
    options: [
      'Vacuum tubes',
      'Discrete transistors and magnetic cores',
      'Small-scale Integrated Circuits only',
      'VLSI (Very Large Scale Integration) microprocessors',
    ],
    correctIndex: 3,
    explanation:
      'Fourth-generation systems introduced VLSI microprocessors integrating thousands to millions of transistors onto a single silicon chip.',
  },
  {
    id: 'q1-5',
    unitId: 1,
    question: 'In BCD addition, when must 0110 (6) be added to a 4-bit sum?',
    options: [
      'Whenever the sum is even',
      'Whenever the 4-bit sum exceeds 9 (1001) or produces a carry out',
      'Only when subtracting two numbers',
      'Before converting binary to Gray code',
    ],
    correctIndex: 1,
    explanation:
      'Binary coded decimal digits only span 0000–1001 (0–9). Adding 0110 skips the 6 invalid states (1010–1111) and generates the proper decimal carry.',
  },

  // Unit 2
  {
    id: 'q2-1',
    unitId: 2,
    question: 'Which CPU register holds the memory address of the next instruction or data word to be read/written?',
    options: ['IR (Instruction Register)', 'MAR (Memory Address Register)', 'ALU', 'MDR (Memory Data Register)'],
    correctIndex: 1,
    explanation:
      'MAR holds the address placed onto the Address Bus for memory read/write operations, while MDR buffers the data moving to or from memory.',
  },
  {
    id: 'q2-2',
    unitId: 2,
    question: 'What is the directionality of the three main system buses?',
    options: [
      'Address Bus is unidirectional (CPU → Memory/I/O); Data and Control Buses are bidirectional.',
      'All three buses are strictly unidirectional from Memory to CPU.',
      'Data Bus is unidirectional; Address Bus is bidirectional.',
      'Control Bus carries only pixel colors to the display.',
    ],
    correctIndex: 0,
    explanation:
      'The CPU drives target addresses unidirectionally onto the Address Bus, while data bytes and control handshake signals flow bidirectionally.',
  },
  {
    id: 'q2-3',
    unitId: 2,
    question: 'In Little-Endian byte ordering, where is the Least Significant Byte (LSB) of a 32-bit word stored?',
    options: [
      'At the highest memory address (Base + 3)',
      'At the lowest memory address (Base + 0)',
      'Inside the Instruction Register only',
      'Split equally across two cache lines',
    ],
    correctIndex: 1,
    explanation:
      'Little-Endian stores the "little end" (Least Significant Byte) at the lowest byte address; Big-Endian stores the Most Significant Byte first.',
  },
  {
    id: 'q2-4',
    unitId: 2,
    question: 'How large is the physical memory address space of the Intel 8086 microprocessor with its 20 address lines?',
    options: ['64 KB', '512 KB', '1 MB (2^20 bytes)', '4 GB'],
    correctIndex: 2,
    explanation: '20 address lines address 2^20 = 1,048,576 bytes = 1 MB, accessed via 16-bit segment × 16 + 16-bit offset.',
  },
  {
    id: 'q2-5',
    unitId: 2,
    question: 'Which addressing mode uses the instruction operand field directly as the constant data value rather than an address?',
    options: ['Indirect Addressing', 'Immediate Addressing', 'Indexed Addressing', 'Register Indirect Addressing'],
    correctIndex: 1,
    explanation: 'Immediate addressing embeds the constant operand directly inside the instruction (e.g., MOV R1, #25).',
  },

  // Unit 3
  {
    id: 'q3-1',
    unitId: 3,
    question: "According to De Morgan's First Law, the NOR expression (A + B)' is logically identical to:",
    options: ["A' + B'", "A' · B'", 'A ⊕ B', '(A · B)'],
    correctIndex: 1,
    explanation: "(A + B)' = A' · B' — a NOR gate behaves identically to a Bubbled-input AND gate.",
  },
  {
    id: 'q3-2',
    unitId: 3,
    question: 'Why is a Carry Look-Ahead Adder (like IC 74182) significantly faster than a Ripple Carry Adder?',
    options: [
      'It omits the Sum output entirely.',
      'It computes all carry bits in parallel using Propagate (Pi) and Generate (Gi) signals in constant ~3–4 gate delays.',
      'It serializes bits through one D flip-flop per clock.',
      'It only works for 1-bit inputs.',
    ],
    correctIndex: 1,
    explanation:
      'Instead of waiting 2n gate delays for carry bits to ripple sequentially, CLA evaluates Ci+1 = Gi + Pi·Ci using two-level combinational logic.',
  },
  {
    id: 'q3-3',
    unitId: 3,
    question: 'In a Binary Adder-Subtractor with Mode input M = 1 feeding XOR gates on B, what operation does the circuit compute?',
    options: [
      'A + B',
      "A + B' + 1 (2's complement subtraction A - B)",
      'Bitwise A · B',
      'Shift left A by 1',
    ],
    correctIndex: 1,
    explanation:
      "When M = 1, B XOR 1 produces B' (1's complement) and Cin = M = 1 adds 1, computing A + B' + 1 = A - B.",
  },
  {
    id: 'q3-4',
    unitId: 3,
    question: "In Booth's signed multiplication algorithm, what action occurs when bit pair (Q0, Q-1) equals 10?",
    options: [
      'Add M to A (A ← A + M) and shift right',
      'Subtract M from A (A ← A - M) and arithmetic shift right',
      'Arithmetic shift right only',
      'Reset accumulator A to zero',
    ],
    correctIndex: 1,
    explanation:
      '10 marks the start of a string of 1s in the multiplier, so Booth subtracts M from A before performing the arithmetic shift right.',
  },
  {
    id: 'q3-5',
    unitId: 3,
    question: 'What is the exponent bias used in IEEE 754 Single-Precision (32-bit) floating-point representation?',
    options: ['63', '127', '128', '1023'],
    correctIndex: 1,
    explanation:
      'Single precision allocates 1 sign bit, 8 exponent bits (bias = 127), and 23 mantissa bits. Double precision uses an 11-bit exponent with bias 1023.',
  },

  // Unit 4
  {
    id: 'q4-1',
    unitId: 4,
    question: 'In a single-bus processor datapath, why are temporary registers Y and Z required around the ALU?',
    options: [
      'Because the single internal bus can carry only one value at a time, so Y holds one ALU operand and Z latches the ALU output.',
      'To store floating-point exponents permanently.',
      'To replace Main Memory completely.',
      'To serve as external USB buffers.',
    ],
    correctIndex: 0,
    explanation:
      'Since a single bus cannot simultaneously supply two operands and accept the ALU result, Y buffers input A and Z buffers the output.',
  },
  {
    id: 'q4-2',
    unitId: 4,
    question: 'How does Microprogrammed Control differ from Hardwired Control?',
    options: [
      'Microprogrammed Control uses fixed combinational gates only and cannot be altered.',
      'Microprogrammed Control stores control signals as microinstructions (Control Words) in a Control Store addressed by µPC.',
      'Hardwired Control requires an operating system to decode opcodes.',
      'Microprogrammed Control eliminates the ALU.',
    ],
    correctIndex: 1,
    explanation:
      'Hardwired control generates control signals via fast combinational logic equations, whereas microprogrammed control reads Control Words from a flexible Control Store.',
  },
  {
    id: 'q4-3',
    unitId: 4,
    question: 'Which hardware technique resolves Read-After-Write (RAW) data hazards between consecutive ALU instructions without stalling?',
    options: ['Increasing clock period by 10x', 'Operand Forwarding (Bypassing)', 'Flushing the instruction cache', 'Disabling register R0'],
    correctIndex: 1,
    explanation:
      'Forwarding routes the newly computed result directly from the EX/MEM or MEM/WB pipeline buffer back to the next instruction’s ALU input.',
  },
  {
    id: 'q4-4',
    unitId: 4,
    question: 'Why does a Load-Use hazard (LD R1, 0(R2) followed immediately by SUB R4, R1, R5) still require 1 stall cycle even with forwarding?',
    options: [
      'Memory data is only available after the MEM stage completes, which is too late for the next instruction’s EX stage without a 1-cycle bubble.',
      'Load instructions never use registers.',
      'The ALU cannot perform subtraction.',
      'Pipeline stages run backwards during Load.',
    ],
    correctIndex: 0,
    explanation:
      'In a classic 5-stage pipeline, LD produces its value at the end of MEM (Cycle 4), so the dependent instruction must stall 1 cycle before entering EX in Cycle 5.',
  },
  {
    id: 'q4-5',
    unitId: 4,
    question: 'What is the ideal speedup of a k-stage pipeline over an equivalent non-pipelined processor as instruction count N becomes large?',
    options: ['k / 2', 'k (number of stages)', 'N / k', '1'],
    correctIndex: 1,
    explanation:
      'As N grows large, (N·k) / (k + N - 1) approaches k, meaning throughput increases up to k times the non-pipelined rate.',
  },

  // Unit 5
  {
    id: 'q5-1',
    unitId: 5,
    question: "In Flynn's Classification, which architecture broadcasts a single instruction stream across multiple processing elements working on distinct data elements?",
    options: ['SISD', 'SIMD', 'MISD', 'MIMD'],
    correctIndex: 1,
    explanation:
      'SIMD (Single Instruction, Multiple Data) powers vector processors and GPUs where one Control Unit drives many ALUs in lockstep.',
  },
  {
    id: 'q5-2',
    unitId: 5,
    question: 'In the Unit 5 dependence graph example (P1..P5), why can P5 (F = G / E) run in Cycle 1 alongside P1 (C = D * E)?',
    options: [
      'Because P5 has no data dependence on P1’s output C and writes to an independent destination F.',
      'Because division always finishes faster than multiplication.',
      'Because P5 ignores memory entirely.',
      'Because Flynn’s MISD forces all instructions into Cycle 1.',
    ],
    correctIndex: 0,
    explanation:
      'P5 reads only G and E and writes F, sharing no RAW/WAR/WAW hazard with P1, enabling immediate parallel execution.',
  },
  {
    id: 'q5-3',
    unitId: 5,
    question: 'How many total registers and processor modes exist in the classic 32-bit ARM7TDMI architecture?',
    options: [
      '8 registers and 2 modes',
      '16 registers and 3 modes',
      '37 registers (31 general + 6 status) and 7 processor modes',
      '64 registers and 1 mode',
    ],
    correctIndex: 2,
    explanation:
      'ARM provides 37 total 32-bit registers (including banked SP/LR/SPSR copies) across 7 modes: User, FIQ, IRQ, Supervisor, Abort, Undefined, and System.',
  },
  {
    id: 'q5-4',
    unitId: 5,
    question: 'What is the primary advantage of the 16-bit Thumb instruction set over 32-bit ARM instructions?',
    options: [
      'Doubles register count to 64',
      'Higher code density (~30–40% smaller memory footprint) and lower cost on 16-bit memory buses',
      'Eliminates the need for a Program Counter',
      'Replaces the Barrel Shifter with floating-point dividers',
    ],
    correctIndex: 1,
    explanation:
      'Thumb compresses the most common ARM instructions into 16-bit opcodes, significantly improving code density while switching seamlessly via BX.',
  },
  {
    id: 'q5-5',
    unitId: 5,
    question: 'What does the ARM instruction "LDR R0, [R1, #4]!" perform?',
    options: [
      'Post-indexed load: reads M[R1] then adds 4 to R1',
      'Pre-indexed load with write-back (!): updates R1 ← R1 + 4 first, then loads R0 from M[R1 + 4]',
      'Offset load without modifying R1',
      'Stores R0 into memory twice',
    ],
    correctIndex: 1,
    explanation:
      'The exclamation mark (!) specifies pre-indexed write-back: the effective address R1 + 4 is computed, loaded into R0, and written back into R1.',
  },
];

export function getQuestionsByUnit(unitId: UnitId): QuizQuestion[] {
  return QUIZ_BANK.filter((q) => q.unitId === unitId);
}
