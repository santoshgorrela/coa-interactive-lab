export type UnitId = 1 | 2 | 3 | 4 | 5;

export interface SyllabusTopic {
  id: string;
  title: string;
  summary: string;
  keyTerms: string[];
  linkedSimId?: string;
  isSupplementary?: boolean;
}

export interface SimDefinition {
  id: string;
  unitId: UnitId;
  title: string;
  shortTitle: string;
  subtitle: string;
  syllabusTag: string;
  isPopular?: boolean;
}

export interface UnitDefinition {
  id: UnitId;
  code: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  introduction: string;
  practicalExample: string;
  topics: SyllabusTopic[];
}

export const SIMULATIONS: SimDefinition[] = [
  // Unit 1
  {
    id: 'u1-von-neumann',
    unitId: 1,
    title: 'Von Neumann Architecture Explorer',
    shortTitle: 'Von Neumann Explorer',
    subtitle: 'Interactive CPU, ALU, Control Unit, Registers, Memory, I/O, System Bus & Fetch-Execute Cycle',
    syllabusTag: 'Core Syllabus · Unit 1',
    isPopular: true,
  },
  {
    id: 'u1-generations',
    unitId: 1,
    title: 'Computer Generations & Non-Von Neumann Timeline',
    shortTitle: 'Generations Timeline',
    subtitle: 'Evolution from 1st Gen Vacuum Tubes (ENIAC) to 4th Gen VLSI Microprocessors & Multiprocessors',
    syllabusTag: 'Core Syllabus · Unit 1',
  },
  {
    id: 'u1-hierarchy',
    unitId: 1,
    title: 'Computer-Level Hierarchy Explorer',
    shortTitle: 'Level Hierarchy (0–6)',
    subtitle: 'Seven-layer virtual machine stack from Digital Logic (Level 0) to User Applications (Level 6)',
    syllabusTag: 'Core Syllabus · Unit 1',
  },
  {
    id: 'u1-numbers-codes',
    unitId: 1,
    title: 'Number Systems, Binary Codes & Complement Lab',
    shortTitle: 'Number Systems & Codes',
    subtitle: 'Radix conversion, BCD, Excess-3, Gray Code, ASCII Parity, 1’s/2’s Complement & BCD Addition',
    syllabusTag: 'Core Syllabus · Unit 1',
  },

  // Unit 2
  {
    id: 'u2-functional-units',
    unitId: 2,
    title: 'Functional Units & Information Flow Simulator',
    shortTitle: 'Functional Units',
    subtitle: 'Animate Input → Processing (ALU + CU) → Memory → Output data and instruction pathways',
    syllabusTag: 'Core Syllabus · Unit 2',
  },
  {
    id: 'u2-cpu-architecture',
    unitId: 2,
    title: 'CPU & Register Architecture Simulator',
    shortTitle: 'CPU & Registers (T1–T4)',
    subtitle: 'Inspect PC, MAR, MDR, IR, ALU, Control Unit, Operational Registers & clock micro-steps',
    syllabusTag: 'Core Syllabus · Unit 2',
    isPopular: true,
  },
  {
    id: 'u2-bus-comm',
    unitId: 2,
    title: 'Bus Communication & Structure Simulator',
    shortTitle: 'Bus Communication',
    subtitle: 'Unidirectional Address Bus, Bidirectional Data & Control Buses, Single vs Two vs Multi-Bus',
    syllabusTag: 'Core Syllabus · Unit 2',
  },
  {
    id: 'u2-memory-explorer',
    unitId: 2,
    title: 'Memory Explorer & Endianness Lab',
    shortTitle: 'Memory & Endianness',
    subtitle: 'Interactive addressable RAM cells (Read/Write), word length, Big-Endian vs Little-Endian',
    syllabusTag: 'Core Syllabus · Unit 2',
  },
  {
    id: 'u2-microprocessor-8086',
    unitId: 2,
    title: 'Microprocessor, Addressing Modes & 8086 Explorer',
    shortTitle: 'Microprocessor & 8086',
    subtitle: 'Microprocessor blocks, 0/1/2/3-address formats, Addressing Modes, 8086 BIU/EU & practical tasks',
    syllabusTag: 'Core Syllabus + 8086 Reference',
  },

  // Unit 3
  {
    id: 'u3-logic-gates',
    unitId: 3,
    title: 'Logic Gate Laboratory',
    shortTitle: 'Logic Gates Lab',
    subtitle: 'Interactive AND, OR, NOT, NAND, NOR, XOR, XNOR with live switches, signal flow & truth tables',
    syllabusTag: 'Core Syllabus · Unit 3',
    isPopular: true,
  },
  {
    id: 'u3-boolean-expr',
    unitId: 3,
    title: 'Boolean Expression & Equivalence Simulator',
    shortTitle: 'Boolean Expression Lab',
    subtitle: 'Parse expressions (up to 6 vars), generate truth tables, canonical SOP & verify equivalences (=)',
    syllabusTag: 'Core Syllabus · Unit 3',
  },
  {
    id: 'u3-demorgan',
    unitId: 3,
    title: "De Morgan's Law Side-by-Side Circuit Lab",
    shortTitle: "De Morgan's Laws",
    subtitle: "Dual synchronized circuits proving (A + B)' = A'·B' and (A · B)' = A' + B' across all cases",
    syllabusTag: 'Core Syllabus · Unit 3',
    isPopular: true,
  },
  {
    id: 'u3-adders',
    unitId: 3,
    title: 'Half, Full, Ripple Carry & Carry Look-Ahead Adders',
    shortTitle: 'Adders & CLA (74182)',
    subtitle: 'Animate carry propagation wave in 4-bit RCA vs parallel Pi/Gi look-ahead carry speed',
    syllabusTag: 'Core Syllabus · Unit 3',
    isPopular: true,
  },
  {
    id: 'u3-alu',
    unitId: 3,
    title: '4-Bit / 8-Bit ALU & Adder-Subtractor Simulator',
    shortTitle: 'N-Bit ALU Simulator',
    subtitle: 'Execute ADD, SUB (M=1 2’s Comp), AND, OR, XOR, NOT with live C, Z, V, N status flags',
    syllabusTag: 'Core Syllabus · Unit 3',
    isPopular: true,
  },
  {
    id: 'u3-mul-div-float',
    unitId: 3,
    title: "Booth's Multiplier, Division & IEEE 754 Lab",
    shortTitle: 'Booth, Division & Float',
    subtitle: 'Step through Booth’s signed multiplication, Restoring division, and IEEE 754 Single Precision bits',
    syllabusTag: 'Core Syllabus · Unit 3',
  },

  // Unit 4
  {
    id: 'u4-instruction-cycle',
    unitId: 4,
    title: 'Instruction Cycle & Single-Bus Datapath Simulator',
    shortTitle: 'Instruction Cycle',
    subtitle: 'Step through T1–T7 micro-operations on PC, MAR, MDR, IR, Y, Z, R1, R3 & ALU',
    syllabusTag: 'Core Syllabus · Unit 4',
    isPopular: true,
  },
  {
    id: 'u4-register-bus',
    unitId: 4,
    title: 'Register Transfer & Single vs 3-Bus Datapath',
    shortTitle: 'Register Transfer & Buses',
    subtitle: 'Visualize Ri_in / Ri_out gating, MUX Constant 4/Y selection, and 3-Bus A/B/C speedup',
    syllabusTag: 'Core Syllabus · Unit 4',
  },
  {
    id: 'u4-control-unit',
    unitId: 4,
    title: 'Hardwired vs Microprogrammed Control Unit',
    shortTitle: 'Control Unit Lab',
    subtitle: 'Compare Step Decoder + Encoder Boolean equations against Control Store µPC & Control Words',
    syllabusTag: 'Core Syllabus · Unit 4',
  },
  {
    id: 'u4-pipeline',
    unitId: 4,
    title: '5-Stage Instruction Pipeline Simulator',
    shortTitle: '5-Stage Pipeline',
    subtitle: 'Live IF, ID, EX, MEM, WB datapath stages, Gantt cycle table, Play/Step/Speed controls',
    syllabusTag: 'Core Syllabus · Unit 4',
    isPopular: true,
  },
  {
    id: 'u4-hazards',
    unitId: 4,
    title: 'Pipeline Hazards, Forwarding & Branch Prediction',
    shortTitle: 'Pipeline Hazards Lab',
    subtitle: 'Experiment with Structural conflicts, RAW forwarding bypass, Load-Use stalls & Branch flushes',
    syllabusTag: 'Core Syllabus · Unit 4',
    isPopular: true,
  },
  {
    id: 'u4-perf',
    unitId: 4,
    title: 'Pipeline Performance & Speedup Calculator',
    shortTitle: 'Pipeline Speedup Calc',
    subtitle: 'Analyze total cycles, speedup, efficiency %, and throughput (MIPS) under stall penalties',
    syllabusTag: 'Core Syllabus · Unit 4',
  },

  // Unit 5
  {
    id: 'u5-parallelism',
    unitId: 5,
    title: 'Sequential vs Parallel Execution & Dependence Graph',
    shortTitle: 'Parallel Dependence Graph',
    subtitle: 'Animate P1..P5 data dependences (RAW/WAR/WAW) showing 5-cycle sequential vs 3-cycle parallel',
    syllabusTag: 'Core Syllabus · Unit 5',
  },
  {
    id: 'u5-flynn',
    unitId: 5,
    title: "Flynn's Classification Explorer (SISD / SIMD / MISD / MIMD)",
    shortTitle: "Flynn's Taxonomy",
    subtitle: 'Animate Instruction Streams and Data Streams across Control Units and Processing Elements',
    syllabusTag: 'Core Syllabus · Unit 5',
    isPopular: true,
  },
  {
    id: 'u5-multicore',
    unitId: 5,
    title: 'Multicore (CMP) Task Scheduler Simulator',
    shortTitle: 'Multicore CMP Lab',
    subtitle: 'Compare 1-core, 2-core, and 4-core Chip Multiprocessor execution timelines and speedup',
    syllabusTag: 'Core Syllabus · Unit 5',
  },
  {
    id: 'u5-arm-thumb',
    unitId: 5,
    title: 'ARM 32-bit vs Thumb 16-bit, Modes & Barrel Shifter',
    shortTitle: 'ARM & Thumb Lab',
    subtitle: 'Inspect 37 registers / 7 modes, CPSR flags, Barrel Shifter (LSL/LSR/ASR/ROR) & Thumb density',
    syllabusTag: 'Core Syllabus · Unit 5',
    isPopular: true,
  },
  {
    id: 'u5-arm-io',
    unitId: 5,
    title: 'ARM Load/Store, I/O Mapping & AMBA Case Study',
    shortTitle: 'Load/Store & I/O',
    subtitle: 'Simulate LDR/STR offset/pre/post-indexing, Memory vs I/O-mapped I/O, AMBA bus & ARM5 vs ARM7',
    syllabusTag: 'Core Syllabus · Unit 5',
  },
];

export const UNITS: UnitDefinition[] = [
  {
    id: 1,
    code: 'UNIT 01',
    title: 'Computer Architecture & Digital Fundamentals',
    shortTitle: 'Computer Architecture',
    subtitle: 'Von Neumann Model, Computer Generations, Level Hierarchy, Number Systems & Codes',
    introduction:
      'Explore the foundational distinction between Computer Architecture and Organization, trace hardware evolution across generations, inspect the 7-level virtual machine hierarchy, and experiment with Von Neumann stored-program execution and digital number representations.',
    practicalExample:
      'Step through a Fetch–Decode–Execute cycle on the Von Neumann diagram or convert decimal values into BCD, Excess-3, Gray Code, and 2’s complement.',
    topics: [
      {
        id: 'u1-t1',
        title: 'Computer Architecture vs Organization & Components',
        summary: 'ISA attributes visible to the programmer vs operational units (CPU, Memory, I/O) and system interconnections.',
        keyTerms: ['Architecture', 'Organization', 'ISA', 'CPU', 'Cache', 'RAM/ROM', 'System Bus'],
        linkedSimId: 'u1-von-neumann',
      },
      {
        id: 'u1-t2',
        title: 'Von Neumann Architecture & Harvard Variation',
        summary: 'Stored-program model sharing memory for instructions and data, Von Neumann bottleneck, and split instruction/data buses.',
        keyTerms: ['Control Unit', 'ALU', 'Registers', 'Fetch-Execute', 'Von Neumann Bottleneck', 'Harvard Architecture'],
        linkedSimId: 'u1-von-neumann',
      },
      {
        id: 'u1-t3',
        title: 'Evolution & Generations of Computers',
        summary: '1st Gen Vacuum Tubes (ENIAC), 2nd Gen Transistors (CDC 6600), 3rd Gen ICs (IBM 360), 4th Gen VLSI (Intel 4004), Non-Von Neumann.',
        keyTerms: ['Vacuum Tubes', 'Transistors', 'ICs', 'VLSI', 'Microprocessor', 'Blue Gene'],
        linkedSimId: 'u1-generations',
      },
      {
        id: 'u1-t4',
        title: 'Computer-Level Hierarchy (Levels 0–6)',
        summary: 'Seven abstraction layers from Digital Logic (Level 0) and Control (Level 1) up through ISA, OS, Assembly, HLL, and User.',
        keyTerms: ['Digital Logic', 'Control', 'Machine/ISA', 'System Software', 'Assembly', 'High-Level Language'],
        linkedSimId: 'u1-hierarchy',
      },
      {
        id: 'u1-t5',
        title: 'Digital Systems, Number Systems & Conversions',
        summary: 'Combinational vs Sequential systems; Binary, Octal, Decimal, Hexadecimal conversions including fractions and powers of 2.',
        keyTerms: ['Radix', 'Binary', 'Octal', 'Hexadecimal', 'Combinational', 'Sequential'],
        linkedSimId: 'u1-numbers-codes',
      },
      {
        id: 'u1-t6',
        title: 'Binary Codes, Parity, Signed Arithmetic & BCD',
        summary: 'BCD (8421), Excess-3, Gray Code, ASCII 7-bit, Even/Odd Parity, 1’s & 2’s complement subtraction, and BCD +0110 correction.',
        keyTerms: ['BCD', 'Excess-3', 'Gray Code', 'ASCII', 'Parity Bit', "2's Complement"],
        linkedSimId: 'u1-numbers-codes',
      },
    ],
  },
  {
    id: 2,
    code: 'UNIT 02',
    title: 'Basic Structure of a Computer',
    shortTitle: 'Computer Structure',
    subtitle: 'Functional Units, CPU Registers, Bus Structures, Memory & 8086 Microprocessor',
    introduction:
      'Examine how Input, Processing, Memory, and Output units coordinate via Address, Data, and Control buses. Inspect internal CPU registers (PC, MAR, MDR, IR), read/write byte-addressable memory in Big/Little-Endian formats, and compare instruction formats and addressing modes.',
    practicalExample:
      'Trace Add R1, R2 across clock steps T1–T4, write 32-bit hex words into memory to compare Big vs Little Endianness, and explore 8086 BIU/EU segments.',
    topics: [
      {
        id: 'u2-t1',
        title: 'Computer Types & Functional Units',
        summary: 'Desktop, Workstation, Supercomputer, Mainframe, Multi-core; Input, ALU, Control Unit, Memory, and Output units.',
        keyTerms: ['Input Unit', 'ALU', 'Control Unit', 'Memory Unit', 'Output Unit'],
        linkedSimId: 'u2-functional-units',
      },
      {
        id: 'u2-t2',
        title: 'Basic Operational Concepts & CPU-Memory Connection',
        summary: 'Instruction step execution (T1–T4) using PC, MAR, MDR, IR, General-Purpose Registers R0..Rn-1, and Interrupts/ISR.',
        keyTerms: ['MAR', 'MDR', 'PC', 'IR', 'Operational Registers', 'Interrupt'],
        linkedSimId: 'u2-cpu-architecture',
      },
      {
        id: 'u2-t3',
        title: 'Bus Structures & Signal Directionality',
        summary: 'Single-Bus, Two-Bus, and Multi-Bus architectures; Address Bus (unidirectional), Data Bus (bidirectional), Control Bus.',
        keyTerms: ['Address Bus', 'Data Bus', 'Control Bus', 'Single-Bus', 'Multi-Bus'],
        linkedSimId: 'u2-bus-comm',
      },
      {
        id: 'u2-t4',
        title: 'Memory Locations, Addresses & Endianness',
        summary: '2^x address space, word length, byte-addressable memory, aligned/unaligned access, Big-Endian vs Little-Endian storage.',
        keyTerms: ['Word Length', 'Byte Addressability', 'Big-Endian', 'Little-Endian', 'Memory Hierarchy'],
        linkedSimId: 'u2-memory-explorer',
      },
      {
        id: 'u2-t5',
        title: 'Instructions, Formats, Sequencing & Addressing Modes',
        summary: '0/1/2/3-address instruction formats, RTN, Condition Codes (N, Z, V, C), and Immediate/Direct/Indirect/Indexed/Relative/Auto modes.',
        keyTerms: ['Three-Address', 'RTN', 'Condition Codes', 'Addressing Modes', 'Auto-Increment'],
        linkedSimId: 'u2-microprocessor-8086',
      },
      {
        id: 'u2-t6',
        title: 'Microprocessor vs Microcontroller & Intel 8086 Structure',
        summary: '8086 16-bit CPU with 20-bit address bus (1 MB), BIU 6-byte instruction queue, EU, segment registers (CS, DS, SS, ES), and 9 flags.',
        keyTerms: ['8086', 'BIU & EU', 'Segment Registers', 'Instruction Queue', 'AVR Microcontroller'],
        linkedSimId: 'u2-microprocessor-8086',
      },
      {
        id: 'u2-t7',
        title: 'Supplementary Lab Challenges: 8086 Practical Programs',
        summary: 'Optional enrichment tasks inspired by the 8086 reference guide (array sum, factorial, BCD arithmetic, string search).',
        keyTerms: ['Supplementary', '8086 Assembly', 'Array Operations', 'BCD'],
        linkedSimId: 'u2-microprocessor-8086',
        isSupplementary: true,
      },
    ],
  },
  {
    id: 3,
    code: 'UNIT 03',
    title: 'Design of ALU & De Morgan’s Law',
    shortTitle: 'Digital Logic & ALU',
    subtitle: 'Logic Gates, Boolean Algebra, De Morgan’s Theorems, Adders, ALU, Booth & IEEE 754',
    introduction:
      'Build and test combinational digital circuits from basic logic gates and De Morgan equivalents up to Half Adders, Full Adders, Ripple Carry Adders, Carry Look-Ahead (IC 74182), an N-bit Arithmetic Logic Unit, Booth’s Multiplication, Restoring Division, and IEEE 754 Floating Point.',
    practicalExample:
      'Toggle inputs A and B to verify (A+B)\' = A\'·B\' side-by-side, watch carries ripple across a 4-bit RCA vs CLA, and test signed overflow (V) in the ALU.',
    topics: [
      {
        id: 'u3-t1',
        title: 'Logic Gates & Boolean Expression Evaluation',
        summary: 'AND, OR, NOT, NAND, NOR, XOR, XNOR circuits, truth tables, canonical Sum-of-Products, and algebraic equivalence checking.',
        keyTerms: ['Truth Table', 'Universal Gates', 'Canonical SOP', 'Equivalence'],
        linkedSimId: 'u3-logic-gates',
      },
      {
        id: 'u3-t2',
        title: "De Morgan's First & Second Theorems",
        summary: "Proving (A + B)' = A' · B' (NOR ≡ Bubbled AND) and (A · B)' = A' + B' (NAND ≡ Bubbled OR) via dual live circuits.",
        keyTerms: ['De Morgan Law 1', 'De Morgan Law 2', 'Bubbled AND', 'Bubbled OR'],
        linkedSimId: 'u3-demorgan',
      },
      {
        id: 'u3-t3',
        title: 'Half Adder, Full Adder & Ripple Carry Adder',
        summary: 'S = A ⊕ B, C = AB; Full Adder with Cin; 4-bit Ripple Carry propagation delay (2n gate delays).',
        keyTerms: ['Half Adder', 'Full Adder', 'Ripple Carry', 'Propagation Delay'],
        linkedSimId: 'u3-adders',
      },
      {
        id: 'u3-t4',
        title: 'Carry Look-Ahead Adder (IC 74182)',
        summary: 'Fast parallel carry generation using Propagate Pi = Ai ⊕ Bi and Generate Gi = Ai·Bi in constant 3–4 gate delays.',
        keyTerms: ['Propagate Pi', 'Generate Gi', 'Carry Look-Ahead', 'IC 74182'],
        linkedSimId: 'u3-adders',
      },
      {
        id: 'u3-t5',
        title: 'ALU Design & Binary Adder-Subtractor',
        summary: '4-bit/8-bit ALU slices with 4:1 MUX, Mode M XOR control for 2’s complement subtraction, and C, Z, V, N flags.',
        keyTerms: ['ALU', 'Mode Control M', 'MUX Select', 'Zero Flag', 'Overflow Flag'],
        linkedSimId: 'u3-alu',
      },
      {
        id: 'u3-t6',
        title: "Multiplication (Booth's / Bit-Pair / CSA), Division & IEEE 754",
        summary: "Shift-and-add, Booth's signed recoding, Bit-Pair & Carry-Save Addition, Restoring/Non-Restoring Division, and IEEE 754 Single/Double precision.",
        keyTerms: ["Booth's Algorithm", 'CSA Tree', 'Restoring Division', 'IEEE 754 Bias 127'],
        linkedSimId: 'u3-mul-div-float',
      },
    ],
  },
  {
    id: 4,
    code: 'UNIT 04',
    title: 'Processor Control & Pipelining',
    shortTitle: 'Processor & Pipeline',
    subtitle: 'Single/Multi-Bus Datapath, Hardwired vs Microprogrammed Control, 5-Stage Pipeline & Hazards',
    introduction:
      'Step inside the CPU datapath to watch micro-operations execute across single-bus and three-bus hardware. Compare Hardwired and Microprogrammed Control Units, then explore 5-stage instruction pipelining, Structural/Data/Control hazards, forwarding bypasses, and speedup math.',
    practicalExample:
      'Step through ADD (R3), R1 on the single-bus datapath (T1–T7), then compare a stalled RAW data hazard against EX/MEM forwarding in the 5-stage pipeline.',
    topics: [
      {
        id: 'u4-t1',
        title: 'Execution of Complete Instruction & Single-Bus Datapath',
        summary: 'Control sequences for Fetch, Decode, and Execute using PC, MAR, MDR, IR, Y, MUX(4/Y), ALU, Z, and MFC/WMFC.',
        keyTerms: ['MAR/MDR', 'WMFC', 'Select4/Y', 'Add (R3), R1', 'Branch Offset'],
        linkedSimId: 'u4-instruction-cycle',
      },
      {
        id: 'u4-t2',
        title: 'Register Transfers & Multiple-Bus (3-Bus) Organization',
        summary: 'D flip-flop MUX gating (Ri_in, Ri_out), tri-state bus sharing, and 3-bus (A, B, C) datapath with Incrementer.',
        keyTerms: ['Ri_in / Ri_out', 'Tri-State', 'Three-Bus Organization', 'Incrementer'],
        linkedSimId: 'u4-register-bus',
      },
      {
        id: 'u4-t3',
        title: 'Hardwired vs Microprogrammed Control Unit',
        summary: 'Step Counter + Step/Instruction Decoders + Boolean Encoder equations vs Control Store, µPC, and horizontal/encoded Control Words.',
        keyTerms: ['Hardwired Control', 'Step Decoder', 'Control Store', 'µPC', 'Control Word'],
        linkedSimId: 'u4-control-unit',
      },
      {
        id: 'u4-t4',
        title: 'Pipelining Fundamentals (IF, ID, EX, MEM, WB)',
        summary: 'Overlapping instruction execution using interstage buffers, on-chip cache, and cycle-by-cycle stage occupancy.',
        keyTerms: ['5-Stage Pipeline', 'Interstage Buffers', 'Throughput', 'Ideal 1 IPC'],
        linkedSimId: 'u4-pipeline',
      },
      {
        id: 'u4-t5',
        title: 'Pipeline Hazards, Forwarding & Branch Prediction',
        summary: 'Structural conflicts, RAW Data hazards (Forwarding vs Load-Use stall), Control hazards, Delayed Branch, and 2-state/4-state predictors.',
        keyTerms: ['Structural Hazard', 'Data Forwarding', 'Load-Use Stall', 'Branch Prediction', 'Flush'],
        linkedSimId: 'u4-hazards',
      },
      {
        id: 'u4-t6',
        title: 'Pipeline Performance & Instruction Set Influence',
        summary: 'Computing non-pipelined vs pipelined cycles, Speedup S, Efficiency, MIPS throughput, and RISC addressing tradeoffs.',
        keyTerms: ['Speedup', 'Efficiency', 'Stall Penalty', 'MIPS'],
        linkedSimId: 'u4-perf',
      },
    ],
  },
  {
    id: 5,
    code: 'UNIT 05',
    title: 'Parallel Processing & ARM Architecture',
    shortTitle: 'Parallel & ARM',
    subtitle: "ILP/DLP, Flynn's Classification, Multicore CMP, ARM7TDMI, Thumb, Load/Store & AMBA I/O",
    introduction:
      'Bridge from uniprocessor pipelines to parallel computing and embedded RISC architectures. Contrast sequential and parallel dependence graphs, animate Flynn’s SISD/SIMD/MISD/MIMD streams, schedule multicore CMP workloads, and explore ARM 32-bit vs Thumb 16-bit architecture.',
    practicalExample:
      'Execute P1..P5 in 3 parallel cycles instead of 5, switch between SIMD and MIMD streams, test ARM Barrel Shifter LSL/ASR, and simulate LDR pre/post-indexing.',
    topics: [
      {
        id: 'u5-t1',
        title: 'Hardware & Software Parallelism (ILP, DLP, Dependence Graphs)',
        summary: 'k-issue hardware parallelism, ILP/DLP/Task parallelism, and RAW/WAR/WAW dependence graphs (P1..P5).',
        keyTerms: ['k-issue', 'ILP & DLP', 'Dependence Graph', 'RAW / WAR / WAW'],
        linkedSimId: 'u5-parallelism',
      },
      {
        id: 'u5-t2',
        title: "Flynn's Classification (SISD, SIMD, MISD, MIMD)",
        summary: 'Taxonomy by Instruction Stream and Data Stream multiplicity with processor and vector array visualizations.',
        keyTerms: ['SISD', 'SIMD', 'MISD', 'MIMD', 'Instruction/Data Stream'],
        linkedSimId: 'u5-flynn',
      },
      {
        id: 'u5-t3',
        title: 'Multicore Architectures (CMP) & Scheduling',
        summary: 'Single-core time-slicing vs Chip Multiprocessor (CMP) multi-core parallel execution and speedup scaling.',
        keyTerms: ['CMP', 'Multicore', 'Thread Parallelism', 'Speedup'],
        linkedSimId: 'u5-multicore',
      },
      {
        id: 'u5-t4',
        title: 'ARM Architecture: Features, 37 Registers, Modes & Barrel Shifter',
        summary: 'Load/Store RISC, 7 modes (User, FIQ, IRQ, SVC, Abort, Undef, System), CPSR/SPSR flags, conditional suffixes, and 1-cycle Barrel Shifter.',
        keyTerms: ['ARM7TDMI', '37 Registers', 'CPSR / SPSR', 'Barrel Shifter', 'Conditional Execution'],
        linkedSimId: 'u5-arm-thumb',
      },
      {
        id: 'u5-t5',
        title: 'ARM (32-bit) vs Thumb (16-bit) & Branch Exchange (BX)',
        summary: '16-bit compressed instruction encoding for ~30–40% higher code density vs 32-bit full power, switching via BX and T-bit.',
        keyTerms: ['Thumb 16-bit', 'Code Density', 'BX Instruction', 'T-Bit'],
        linkedSimId: 'u5-arm-thumb',
      },
      {
        id: 'u5-t6',
        title: 'Load/Store Addressing, I/O Operations, AMBA & ARM5 vs ARM7',
        summary: 'LDR/STR offset, pre/post-indexed (!), LDM/STM; Memory-mapped vs I/O-mapped I/O; AMBA AHB/APB; ARMv5TEJ Jazelle vs ARM7TDMI.',
        keyTerms: ['Pre/Post-Indexed', 'LDM / STM', 'Memory-Mapped I/O', 'AMBA AHB/APB', 'Jazelle'],
        linkedSimId: 'u5-arm-io',
      },
    ],
  },
];

export function getUnitById(id: UnitId): UnitDefinition {
  return UNITS.find((u) => u.id === id) ?? UNITS[0];
}

export function getSimById(simId: string): SimDefinition {
  return SIMULATIONS.find((s) => s.id === simId) ?? SIMULATIONS[0];
}
