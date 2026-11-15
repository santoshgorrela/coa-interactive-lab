import { SIMULATIONS, UNITS } from './syllabus';

export interface ManualBullet {
  label?: string;
  text: string;
}

export interface ManualSimGuide {
  simId: string;
  title: string;
  controls: string;
  observe: string;
}

export interface ManualSection {
  id: string;
  number: string;
  title: string;
  intro: string;
  paragraphs?: string[];
  bullets?: ManualBullet[];
  simGuides?: ManualSimGuide[];
}

export interface UserManualDocument {
  docTitle: string;
  subtitle: string;
  courseCode: string;
  version: string;
  maxPageLimit: number;
  sections: ManualSection[];
}

export interface ManualMetrics {
  wordCount: number;
  paragraphCount: number;
  estimatedPages: number;
  maxPageLimit: number;
  withinPageLimit: boolean;
}

export const COA_USER_MANUAL: UserManualDocument = {
  docTitle: 'COA Interactive Lab — User Manual',
  subtitle: 'Computer Organization and Architecture (Course Code: 21CSS201T) · Understand. Experiment. Visualize. Simulate.',
  courseCode: '21CSS201T',
  version: 'Edition 1.0 · Academic Laboratory Guide',
  maxPageLimit: 10,
  sections: [
    {
      id: 'sec-overview',
      number: '1',
      title: 'Overview & Getting Started',
      intro:
        'COA Interactive Lab is a browser-based Computer Organization and Architecture engineering workbench built for course 21CSS201T. Every topic across Units 1 through 5 pairs syllabus concepts with interactive SVG hardware diagrams, step-by-step micro-operation traces, live Boolean engines, and practice assessments.',
      bullets: [
        {
          label: 'Zero Installation',
          text: 'Runs directly in any modern desktop or mobile browser (Chrome, Edge, Firefox, Safari) with no plugins required.',
        },
        {
          label: 'Local Progress Persistence',
          text: 'Completed units, explored simulators, recent history, and quiz scores are automatically saved in browser storage.',
        },
        {
          label: 'Light & Dark Lab Modes',
          text: 'Toggle the Sun/Moon button in the top navigation bar at any time to switch between Blueprint Light and Dark Logic themes.',
        },
        {
          label: 'Syllabus Fidelity',
          text: 'All 26 core simulators follow Units 1–5 terminology; optional 8086 enrichment exercises are clearly marked as Supplementary.',
        },
      ],
    },
    {
      id: 'sec-navigation',
      number: '2',
      title: 'Workspace Navigation & Controls',
      intro:
        'Use the top navigation bar to move between six primary views designed for both guided study and hands-on lab experimentation.',
      bullets: [
        {
          label: 'Landing & Dashboard',
          text: 'Review overall syllabus completion, jump directly into any of the five laboratory units, or resume your recently opened simulator.',
        },
        {
          label: 'Units Explorer',
          text: 'Browse a unit introduction, practical example, and syllabus topic cards. Clicking any topic marks it explored and launches its paired simulator.',
        },
        {
          label: 'Simulation Workspace',
          text: 'Dual-pane workbench featuring a unit/simulator selector sidebar on the left and the interactive schematic, switches, registers, and explanations on the right.',
        },
        {
          label: 'Standard Lab Controls',
          text: 'Simulators share consistent Play/Pause, Single-Step, Speed (0.5×–2×), Preset Selector, Reset, and Clear controls.',
        },
        {
          label: 'Quiz & Progress',
          text: 'Attempt 5-question unit checks (25 MCQs total) with instant rationale feedback; scoring 60% or higher auto-marks the unit complete.',
        },
      ],
    },
    {
      id: 'sec-unit1',
      number: '3',
      title: 'Unit 1 Lab — Computer Architecture & Digital Fundamentals',
      intro:
        'Unit 1 introduces stored-program organization, historical generations, abstraction layers, and binary number systems using 4 dedicated laboratories.',
      simGuides: [
        {
          simId: 'u1-von-neumann',
          title: '1.1 Von Neumann Architecture Explorer',
          controls: 'Click CPU, ALU, Control Unit, Registers, Memory, Input, or Output blocks; select Architecture Mode (Von Neumann vs Harvard) and Fetch–Decode–Execute Step/Play.',
          observe: 'Animated bus packets flow between Memory and CPU registers (PC, MAR, MDR, IR) while illustrating the shared-bus bottleneck vs split Harvard buses.',
        },
        {
          simId: 'u1-generations',
          title: '1.2 Computer Generations & Non-Von Neumann Timeline',
          controls: 'Select Generations 1 through 4 or Non-Von Neumann milestones along the interactive horizontal timeline.',
          observe: 'Inspect hardware technology shifts (Vacuum Tubes, Transistors, ICs, VLSI microprocessors), key machines (ENIAC, CDC 6600, IBM 360, Intel 4004), and speed/size tradeoffs.',
        },
        {
          simId: 'u1-hierarchy',
          title: '1.3 Computer-Level Hierarchy Explorer (Levels 0–6)',
          controls: 'Click any layer from Level 0 (Digital Logic) up to Level 6 (User Applications).',
          observe: 'Reveals how instructions translate downward across Control, Machine/ISA, System Software, Assembly, and High-Level Languages.',
        },
        {
          simId: 'u1-numbers-codes',
          title: '1.4 Number Systems, Binary Codes & Complement Lab',
          controls: 'Enter a decimal integer or binary operand; switch tabs for Radix Converter, Binary Codes (BCD, Excess-3, Gray, ASCII + Parity), and 1’s/2’s Complement or BCD Addition.',
          observe: 'Watch step-by-step division/multiplication conversions, single-bit Gray code transitions, complement sign/overflow handling, and automatic +0110 BCD correction.',
        },
      ],
    },
    {
      id: 'sec-unit2',
      number: '4',
      title: 'Unit 2 Lab — Basic Structure of a Computer',
      intro:
        'Unit 2 examines functional units, internal CPU registers, system bus directionality, byte-addressable memory, addressing modes, and 8086 organization across 5 laboratories.',
      simGuides: [
        {
          simId: 'u2-functional-units',
          title: '2.1 Functional Units & Information Flow Simulator',
          controls: 'Trigger Input Data, Fetch Instruction, ALU Compute, or Output Result presets and press Play/Step.',
          observe: 'Tracks animated packets across Input → Memory → Processing (Control Unit + ALU) → Output with role descriptions for each functional block.',
        },
        {
          simId: 'u2-cpu-architecture',
          title: '2.2 CPU & Register Architecture Simulator (T1–T4)',
          controls: 'Click PC, MAR, MDR, IR, ALU, Control Unit, or General Registers; step clock cycles T1 through T4 for Add LOCA, R0.',
          observe: 'Updates register contents live at each clock tick and highlights control paths coordinating memory reads and ALU execution.',
        },
        {
          simId: 'u2-bus-comm',
          title: '2.3 Bus Communication & Structure Simulator',
          controls: 'Select Single-Bus, Two-Bus, or Multi-Bus topology and click Address, Data, or Control Bus channels.',
          observe: 'Demonstrates unidirectional addressing (CPU → Memory/I/O) versus bidirectional data transfer and read/write timing signals.',
        },
        {
          simId: 'u2-memory-explorer',
          title: '2.4 Memory Explorer & Endianness Lab',
          controls: 'Choose an address, enter a 32-bit hex word (e.g., 0x12345678), toggle Big-Endian vs Little-Endian, and click Write or Read.',
          observe: 'Inspect exact byte placement across consecutive memory addresses (MSB at lowest address for Big-Endian; LSB first for Little-Endian).',
        },
        {
          simId: 'u2-microprocessor-8086',
          title: '2.5 Microprocessor, Addressing Modes & 8086 Explorer',
          controls: 'Switch tabs between Instruction Formats (0/1/2/3-address), Addressing Modes calculator, Intel 8086 BIU/EU block diagram, and Supplementary 8086 challenges.',
          observe: 'Computes effective addresses (EA), traces the 6-byte BIU prefetch queue and 20-bit physical address (Segment×16 + Offset), and tests optional assembly tasks.',
        },
      ],
    },
    {
      id: 'sec-unit3',
      number: '5',
      title: 'Unit 3 Lab — Digital Logic & Design of ALU',
      intro:
        'Unit 3 builds combinational circuits from logic gates and Boolean algebra up to fast adders, an N-bit ALU, signed multipliers, dividers, and IEEE 754 floating-point arithmetic.',
      simGuides: [
        {
          simId: 'u3-logic-gates',
          title: '3.1 Logic Gate Laboratory',
          controls: 'Select AND, OR, NOT, NAND, NOR, XOR, or XNOR; toggle input switches A and B (0/1).',
          observe: 'Glowing high/low wires animate signal propagation to output Y while highlighting the matching row in the live truth table.',
        },
        {
          simId: 'u3-boolean-expr',
          title: '3.2 Boolean Expression & Equivalence Simulator',
          controls: 'Type any Boolean expression using up to 6 variables (e.g., A*B + !C or (A+B)\' = A\'*B\') or pick a quick preset.',
          observe: 'Generates the complete truth table, canonical Sum-of-Products (SOP) form, minterm list, and automatic equivalence verification.',
        },
        {
          simId: 'u3-demorgan',
          title: "3.3 De Morgan's Law Side-by-Side Circuit Lab",
          controls: 'Select Law 1 (A+B)\'=A\'·B\' or Law 2 (A·B)\'=A\'+B\', toggle inputs A and B, or click Test All Input Combinations.',
          observe: 'Both dual schematics update simultaneously and confirm output equality across all four binary combinations.',
        },
        {
          simId: 'u3-adders',
          title: '3.4 Half, Full, Ripple Carry & Carry Look-Ahead Adders',
          controls: 'Switch between Half Adder, Full Adder, 4-bit Ripple Carry (RCA), and 4-bit Carry Look-Ahead (IC 74182); edit 4-bit inputs A, B, and Cin.',
          observe: 'Compare sequential carry-ripple gate delays (2n) against parallel Propagate (Pi) and Generate (Gi) look-ahead carry computation.',
        },
        {
          simId: 'u3-alu',
          title: '3.5 4-Bit / 8-Bit ALU & Adder-Subtractor Simulator',
          controls: 'Select 4-bit or 8-bit width, choose ADD, SUB (M=1 two’s complement), AND, OR, XOR, or NOT, and adjust operands A and B.',
          observe: 'Displays binary/decimal outputs and real-time Carry (C), Zero (Z), Signed Overflow (V), and Negative (N) status flags.',
        },
        {
          simId: 'u3-mul-div-float',
          title: "3.6 Booth's Multiplier, Division & IEEE 754 Lab",
          controls: 'Switch between Booth Signed Multiplication, Restoring Division, and IEEE 754 Single-Precision Converter; enter operands or decimal floats.',
          observe: 'Step through Q0Q-1 recoding and arithmetic shifts (Booth), quotient bit restoration, and live Sign (1) + Exponent (8, bias 127) + Mantissa (23) fields.',
        },
      ],
    },
    {
      id: 'sec-unit4',
      number: '6',
      title: 'Unit 4 Lab — Processor Control & Pipelining',
      intro:
        'Unit 4 opens the internal CPU datapath, compares Hardwired vs Microprogrammed Control, and simulates 5-stage instruction pipelining and hazard resolution.',
      simGuides: [
        {
          simId: 'u4-instruction-cycle',
          title: '4.1 Instruction Cycle & Single-Bus Datapath Simulator',
          controls: 'Choose ADD (R3), R1 or Branch Preset and click Step Forward / Auto Play / Reset through ticks T1–T7.',
          observe: 'Tracks active control signals (PCout, MARin, Read, WMFC, Yin, Select4/Y, Zin) and highlights live register transfers across the single bus.',
        },
        {
          simId: 'u4-register-bus',
          title: '4.2 Register Transfer & Single vs 3-Bus Datapath',
          controls: 'Toggle between Single-Bus and Three-Bus (A, B, C) views and trigger Ri_in / Ri_out gating operations.',
          observe: 'Shows why three internal buses allow simultaneous two-operand ALU read and writeback in fewer clock cycles.',
        },
        {
          simId: 'u4-control-unit',
          title: '4.3 Hardwired vs Microprogrammed Control Unit',
          controls: 'Compare the Hardwired Decoder/Encoder panel with the Microprogrammed Control Store (µPC) panel and step micro-instructions.',
          observe: 'Contrasts Boolean gate equations (fast, fixed) against stored horizontal/encoded Control Words (flexible, ROM-driven).',
        },
        {
          simId: 'u4-pipeline',
          title: '4.4 5-Stage Instruction Pipeline Simulator',
          controls: 'Load an instruction sequence and use Play, Step, Speed, and Reset controls.',
          observe: 'Watches IF, ID, EX, MEM, and WB stages fill in parallel across the Gantt cycle table toward an ideal throughput of 1 IPC.',
        },
        {
          simId: 'u4-hazards',
          title: '4.5 Pipeline Hazards, Forwarding & Branch Prediction',
          controls: 'Select RAW Data Hazard (toggle Forwarding ON/OFF), Load-Use Stall, Structural Conflict, or Control Hazard (Branch Prediction ON/OFF).',
          observe: 'Inspect red/amber bubble stalls, EX/MEM forwarding bypass paths, and pipeline flushes when branches mispredict.',
        },
        {
          simId: 'u4-perf',
          title: '4.6 Pipeline Performance & Speedup Calculator',
          controls: 'Adjust instruction count (N), pipeline stages (k), clock frequency, and stall penalty cycles.',
          observe: 'Computes non-pipelined vs pipelined cycles, Speedup S, pipeline efficiency %, and effective MIPS throughput dynamically.',
        },
      ],
    },
    {
      id: 'sec-unit5',
      number: '7',
      title: 'Unit 5 Lab — Parallel Processing & ARM Architecture',
      intro:
        'Unit 5 transitions from instruction-level parallelism and Flynn’s taxonomy to chip multiprocessors (CMP) and ARM7TDMI/Thumb embedded RISC architecture.',
      simGuides: [
        {
          simId: 'u5-parallelism',
          title: '5.1 Sequential vs Parallel Execution & Dependence Graph',
          controls: 'Compare Sequential vs k-Issue Parallel mode on workload P1..P5.',
          observe: 'Identifies RAW, WAR, and WAW dependences and demonstrates how independent instructions compress 5 sequential cycles into 3 parallel cycles.',
        },
        {
          simId: 'u5-flynn',
          title: "5.2 Flynn's Classification Explorer (SISD / SIMD / MISD / MIMD)",
          controls: 'Select SISD, SIMD, MISD, or MIMD mode and press Animate Streams.',
          observe: 'Visualizes single vs multiple Control Units, Processing Elements, Instruction Streams, and Data Streams in parallel hardware.',
        },
        {
          simId: 'u5-multicore',
          title: '5.3 Multicore (CMP) Task Scheduler Simulator',
          controls: 'Switch between 1-Core, 2-Core, and 4-Core CMP configurations and adjust thread count.',
          observe: 'Compares Gantt core utilization timelines, parallel completion time, and achieved multicore speedup.',
        },
        {
          simId: 'u5-arm-thumb',
          title: '5.4 ARM 32-bit vs Thumb 16-bit, Modes & Barrel Shifter',
          controls: 'Switch among the 7 ARM processor modes (User, FIQ, IRQ, SVC, Abort, Undef, System), toggle ARM/Thumb state, and test Barrel Shifter (LSL, LSR, ASR, ROR).',
          observe: 'Inspects banked registers across the 37-register set, CPSR/SPSR flags, single-cycle pre-ALU shifts, and Thumb ~30–40% code density savings.',
        },
        {
          simId: 'u5-arm-io',
          title: '5.5 ARM Load/Store, I/O Mapping & AMBA Case Study',
          controls: 'Test LDR/STR Offset, Pre-Indexed (!), and Post-Indexed addressing; switch between Memory-Mapped vs I/O-Mapped I/O and AMBA AHB/APB buses.',
          observe: 'Tracks effective address calculation, base register writeback, peripheral addressing spaces, and ARM7TDMI vs ARMv5TEJ comparison.',
        },
      ],
    },
    {
      id: 'sec-assessment-tips',
      number: '8',
      title: 'Assessments, Exporting & Troubleshooting',
      intro:
        'Complete your laboratory workflow with self-assessment quizzes, Google Docs manual export, and quick troubleshooting.',
      bullets: [
        {
          label: 'Unit Quizzes',
          text: 'Each unit includes 5 syllabus-aligned multiple-choice questions. Submit all 5 answers to unlock instant per-question explanations and save your best score.',
        },
        {
          label: 'Progress & Reset',
          text: 'Visit Progress to inspect completed units (≥60% quiz score or manual toggle) and recent labs. Use Reset Progress only to clear local history.',
        },
        {
          label: 'Google Docs Manual Export',
          text: 'On the User Manual page, sign in with Google (with permission) to generate an editable Google Doc (strictly ≤ 10 pages) and download PDF or Word (.docx) copies.',
        },
        {
          label: 'Troubleshooting Popups & Print',
          text: 'If Google sign-in does not open, allow popups for this site and retry. For an instant offline PDF at any time, use Print / Save PDF on the User Manual toolbar.',
        },
      ],
    },
  ],
};

// Page estimation calibrated for US Letter (612x792 pt, margins 46pt top/bottom, 52pt left/right)
// Printable box: 508 pt wide x 700 pt tall.
const PRINTABLE_HEIGHT_PT = 700;
const CHARS_PER_LINE_BODY = 94;
const CHARS_PER_LINE_H2 = 46;

function estimateWrappedLines(text: string, charsPerLine: number): number {
  const clean = text.trim();
  if (!clean) return 0;
  return Math.max(1, Math.ceil(clean.length / charsPerLine));
}

export function computeManualMetrics(doc: UserManualDocument = COA_USER_MANUAL): ManualMetrics {
  let words = 0;
  let paragraphs = 0;
  let totalHeightPt = 0;

  const addWords = (s: string) => {
    const trimmed = s.trim();
    if (!trimmed) return;
    words += trimmed.split(/\s+/).length;
  };

  // Document Title + Subtitle header block
  addWords(doc.docTitle);
  addWords(doc.subtitle);
  addWords(doc.version);
  paragraphs += 3;
  totalHeightPt += 68;

  for (const sec of doc.sections) {
    // Section Heading
    const headingText = `${sec.number}. ${sec.title}`;
    addWords(headingText);
    paragraphs += 1;
    totalHeightPt += estimateWrappedLines(headingText, CHARS_PER_LINE_H2) * 18 + 14;

    // Section Intro
    addWords(sec.intro);
    paragraphs += 1;
    totalHeightPt += estimateWrappedLines(sec.intro, CHARS_PER_LINE_BODY) * 12.2 + 5;

    if (sec.paragraphs) {
      for (const p of sec.paragraphs) {
        addWords(p);
        paragraphs += 1;
        totalHeightPt += estimateWrappedLines(p, CHARS_PER_LINE_BODY) * 12.2 + 4;
      }
    }

    if (sec.bullets) {
      for (const b of sec.bullets) {
        const line = b.label ? `${b.label}: ${b.text}` : b.text;
        addWords(line);
        paragraphs += 1;
        totalHeightPt += estimateWrappedLines(line, CHARS_PER_LINE_BODY - 6) * 12 + 3;
      }
    }

    if (sec.simGuides) {
      for (const sg of sec.simGuides) {
        addWords(sg.title);
        addWords(`Controls: ${sg.controls}`);
        addWords(`What to Observe: ${sg.observe}`);
        paragraphs += 3;
        totalHeightPt += 16 + 4;
        totalHeightPt += estimateWrappedLines(`Controls: ${sg.controls}`, CHARS_PER_LINE_BODY - 6) * 11.8 + 2;
        totalHeightPt += estimateWrappedLines(`What to Observe: ${sg.observe}`, CHARS_PER_LINE_BODY - 6) * 11.8 + 5;
      }
    }
  }

  const estimatedPages = Math.max(1, Math.ceil(totalHeightPt / PRINTABLE_HEIGHT_PT));

  return {
    wordCount: words,
    paragraphCount: paragraphs,
    estimatedPages,
    maxPageLimit: doc.maxPageLimit,
    withinPageLimit: estimatedPages <= doc.maxPageLimit,
  };
}

export interface DocsBatchBuildResult {
  fullText: string;
  requests: Record<string, unknown>[];
  metrics: ManualMetrics;
}

export function buildGoogleDocsBatchRequests(doc: UserManualDocument = COA_USER_MANUAL): DocsBatchBuildResult {
  const metrics = computeManualMetrics(doc);
  if (!metrics.withinPageLimit) {
    throw new Error(`User manual exceeds ${doc.maxPageLimit}-page limit (${metrics.estimatedPages} pages estimated).`);
  }

  const chunks: string[] = [];
  let cursor = 1; // Google Docs body content starts at UTF-16 index 1

  const styleRequests: Record<string, unknown>[] = [];

  const appendLine = (
    text: string,
    opts: {
      namedStyle?: 'TITLE' | 'SUBTITLE' | 'HEADING_1' | 'HEADING_2' | 'HEADING_3' | 'NORMAL_TEXT';
      boldPrefixLen?: number;
      fontSize?: number;
      bold?: boolean;
      italic?: boolean;
      colorRgb?: { red: number; green: number; blue: number };
      spaceAbove?: number;
      spaceBelow?: number;
      bullet?: boolean;
      keepWithNext?: boolean;
    } = {},
  ) => {
    const lineWithBreak = `${text}\n`;
    const startIndex = cursor;
    const endIndex = cursor + lineWithBreak.length;
    const textEndIndex = cursor + text.length;
    chunks.push(lineWithBreak);
    cursor = endIndex;

    const pFields: string[] = [];
    const paragraphStyle: Record<string, unknown> = {
      lineSpacing: 112,
    };
    pFields.push('lineSpacing');

    if (opts.namedStyle) {
      paragraphStyle.namedStyleType = opts.namedStyle;
      pFields.push('namedStyleType');
    }
    if (typeof opts.spaceAbove === 'number') {
      paragraphStyle.spaceAbove = { magnitude: opts.spaceAbove, unit: 'PT' };
      pFields.push('spaceAbove');
    }
    if (typeof opts.spaceBelow === 'number') {
      paragraphStyle.spaceBelow = { magnitude: opts.spaceBelow, unit: 'PT' };
      pFields.push('spaceBelow');
    }
    if (opts.keepWithNext) {
      paragraphStyle.keepWithNext = true;
      pFields.push('keepWithNext');
    }

    styleRequests.push({
      updateParagraphStyle: {
        range: { startIndex, endIndex },
        paragraphStyle,
        fields: pFields.join(','),
      },
    });

    if (opts.bullet) {
      styleRequests.push({
        createParagraphBullets: {
          range: { startIndex, endIndex },
          bulletPreset: 'BULLET_DISC_CIRCLE_SQUARE',
        },
      });
    }

    // Text style on the paragraph characters (excluding trailing newline)
    if (text.length > 0) {
      const tFields: string[] = [];
      const textStyle: Record<string, unknown> = {};
      if (opts.fontSize) {
        textStyle.fontSize = { magnitude: opts.fontSize, unit: 'PT' };
        tFields.push('fontSize');
      }
      if (typeof opts.bold === 'boolean') {
        textStyle.bold = opts.bold;
        tFields.push('bold');
      }
      if (typeof opts.italic === 'boolean') {
        textStyle.italic = opts.italic;
        tFields.push('italic');
      }
      if (opts.colorRgb) {
        textStyle.foregroundColor = { color: { rgbColor: opts.colorRgb } };
        tFields.push('foregroundColor');
      }
      if (tFields.length > 0) {
        styleRequests.push({
          updateTextStyle: {
            range: { startIndex, endIndex: textEndIndex },
            textStyle,
            fields: tFields.join(','),
          },
        });
      }

      if (opts.boldPrefixLen && opts.boldPrefixLen > 0 && opts.boldPrefixLen <= text.length) {
        styleRequests.push({
          updateTextStyle: {
            range: { startIndex, endIndex: startIndex + opts.boldPrefixLen },
            textStyle: { bold: true },
            fields: 'bold',
          },
        });
      }
    }
  };

  const NAVY = { red: 0.08, green: 0.13, blue: 0.24 };
  const BLUE = { red: 0.15, green: 0.39, blue: 0.92 };
  const SLATE = { red: 0.39, green: 0.45, blue: 0.55 };
  const BODY = { red: 0.12, green: 0.16, blue: 0.23 };

  appendLine(doc.docTitle, {
    namedStyle: 'TITLE',
    fontSize: 20,
    bold: true,
    colorRgb: NAVY,
    spaceAbove: 0,
    spaceBelow: 3,
    keepWithNext: true,
  });

  appendLine(doc.subtitle, {
    namedStyle: 'SUBTITLE',
    fontSize: 10.5,
    bold: true,
    colorRgb: BLUE,
    spaceAbove: 0,
    spaceBelow: 2,
    keepWithNext: true,
  });

  appendLine(`${doc.version} · ${UNITS.length} Syllabus Units · ${SIMULATIONS.length} Interactive Simulators · Concise Edition (≤ ${doc.maxPageLimit} Pages)`, {
    namedStyle: 'NORMAL_TEXT',
    fontSize: 9,
    italic: true,
    colorRgb: SLATE,
    spaceAbove: 0,
    spaceBelow: 8,
  });

  for (const sec of doc.sections) {
    appendLine(`${sec.number}. ${sec.title}`, {
      namedStyle: 'HEADING_1',
      fontSize: 13.5,
      bold: true,
      colorRgb: NAVY,
      spaceAbove: 9,
      spaceBelow: 3,
      keepWithNext: true,
    });

    appendLine(sec.intro, {
      namedStyle: 'NORMAL_TEXT',
      fontSize: 9.5,
      colorRgb: BODY,
      spaceAbove: 0,
      spaceBelow: 4,
    });

    if (sec.paragraphs) {
      for (const p of sec.paragraphs) {
        appendLine(p, {
          namedStyle: 'NORMAL_TEXT',
          fontSize: 9.5,
          colorRgb: BODY,
          spaceAbove: 0,
          spaceBelow: 3,
        });
      }
    }

    if (sec.bullets) {
      for (const b of sec.bullets) {
        const line = b.label ? `${b.label}: ${b.text}` : b.text;
        appendLine(line, {
          namedStyle: 'NORMAL_TEXT',
          fontSize: 9.5,
          colorRgb: BODY,
          boldPrefixLen: b.label ? b.label.length + 1 : 0,
          spaceAbove: 0,
          spaceBelow: 2,
          bullet: true,
        });
      }
    }

    if (sec.simGuides) {
      for (const sg of sec.simGuides) {
        appendLine(sg.title, {
          namedStyle: 'HEADING_2',
          fontSize: 10.5,
          bold: true,
          colorRgb: BLUE,
          spaceAbove: 5,
          spaceBelow: 1.5,
          keepWithNext: true,
        });

        const ctrlLine = `Controls: ${sg.controls}`;
        appendLine(ctrlLine, {
          namedStyle: 'NORMAL_TEXT',
          fontSize: 9.2,
          colorRgb: BODY,
          boldPrefixLen: 'Controls:'.length,
          spaceAbove: 0,
          spaceBelow: 1,
          bullet: true,
        });

        const obsLine = `Observe: ${sg.observe}`;
        appendLine(obsLine, {
          namedStyle: 'NORMAL_TEXT',
          fontSize: 9.2,
          colorRgb: BODY,
          boldPrefixLen: 'Observe:'.length,
          spaceAbove: 0,
          spaceBelow: 2.5,
          bullet: true,
        });
      }
    }
  }

  const fullText = chunks.join('');

  const requests: Record<string, unknown>[] = [
    {
      updateDocumentStyle: {
        documentStyle: {
          pageSize: {
            width: { magnitude: 612, unit: 'PT' },
            height: { magnitude: 792, unit: 'PT' },
          },
          marginTop: { magnitude: 46, unit: 'PT' },
          marginBottom: { magnitude: 46, unit: 'PT' },
          marginLeft: { magnitude: 52, unit: 'PT' },
          marginRight: { magnitude: 52, unit: 'PT' },
        },
        fields: 'pageSize,marginTop,marginBottom,marginLeft,marginRight',
      },
    },
    {
      insertText: {
        location: { index: 1 },
        text: fullText,
      },
    },
    ...styleRequests,
  ];

  return {
    fullText,
    requests,
    metrics,
  };
}
