import React, { useEffect, useState } from 'react';
import { ArchBlock, SignalWire, SimControlBar } from '../../diagrams/SvgPrimitives';

type ComponentId = 'CPU' | 'ALU' | 'CU' | 'REG' | 'MEM' | 'INPUT' | 'OUTPUT' | 'BUS';

const COMPONENT_INFO: Record<ComponentId, { title: string; role: string; details: string }> = {
  CPU: {
    title: 'Central Processing Unit (CPU)',
    role: 'Coordinates instruction fetch, decoding, and arithmetic/logic execution.',
    details: 'Houses the Control Unit (CU), Arithmetic Logic Unit (ALU), and high-speed internal Registers.',
  },
  ALU: {
    title: 'Arithmetic Logic Unit (ALU)',
    role: 'Performs binary arithmetic (+, −, ×) and bitwise logic (AND, OR, XOR, NOT).',
    details: 'Receives operands from CPU Registers and updates status flags alongside result output.',
  },
  CU: {
    title: 'Control Unit (CU)',
    role: 'Generates timing and control signals governing every datapath transfer.',
    details: 'Fetches instructions from Memory via PC, decodes opcodes in IR, and orchestrates ALU/Memory/I/O.',
  },
  REG: {
    title: 'CPU Registers (PC, IR, MAR, MDR, AC)',
    role: 'Fastest storage inside the CPU holding current addresses, instructions, and intermediate data.',
    details: 'Key registers: Program Counter (PC), Instruction Register (IR), MAR, MDR, and Accumulator.',
  },
  MEM: {
    title: 'Main Memory (Stored-Program RAM/ROM)',
    role: 'Stores both program instructions and operand data in addressable words.',
    details: 'In pure Von Neumann architecture, a single shared memory creates the Von Neumann Bottleneck.',
  },
  INPUT: {
    title: 'Input Unit',
    role: 'Accepts external user/sensor data and translates it into binary words for Memory/CPU.',
    details: 'Examples: Keyboard, mouse, ADC sensors, network interface.',
  },
  OUTPUT: {
    title: 'Output Unit',
    role: 'Converts processed binary results into human-readable or actuator signals.',
    details: 'Examples: Display monitor, printer, DAC actuators.',
  },
  BUS: {
    title: 'System Bus (Address, Data, Control)',
    role: 'Shared communication highway interconnecting CPU, Memory, and I/O devices.',
    details: 'Address bus selects location; Data bus transfers words; Control bus carries Read/Write/Clock signals.',
  },
};

const FETCH_EXEC_STEPS = [
  {
    phase: '1. Input Load',
    active: ['INPUT', 'BUS', 'MEM'] as ComponentId[],
    wires: ['in_bus', 'bus_mem'],
    packet: 'Program + Data loaded into Main Memory (0x100)',
    pc: '0x100',
    ir: '—',
    ac: '0x00',
  },
  {
    phase: '2. Fetch Instruction',
    active: ['CU', 'REG', 'BUS', 'MEM'] as ComponentId[],
    wires: ['cpu_bus', 'bus_mem'],
    packet: 'CU sends PC=0x100 over Address Bus -> fetches LOAD 0x200 into IR',
    pc: '0x104',
    ir: 'ADD [0x200]',
    ac: '0x05',
  },
  {
    phase: '3. Decode & Operand Fetch',
    active: ['CU', 'REG', 'BUS', 'MEM'] as ComponentId[],
    wires: ['cpu_bus', 'bus_mem'],
    packet: 'CU decodes ADD; fetches operand M[0x200] = 0x09 over Data Bus',
    pc: '0x104',
    ir: 'ADD [0x200]',
    ac: '0x05',
  },
  {
    phase: '4. Execute in ALU',
    active: ['ALU', 'REG', 'CU'] as ComponentId[],
    wires: ['alu_reg'],
    packet: 'ALU adds AC (0x05) + 0x09 = 0x0E and stores result in Accumulator',
    pc: '0x104',
    ir: 'ADD [0x200]',
    ac: '0x0E',
  },
  {
    phase: '5. Store & Output',
    active: ['REG', 'BUS', 'OUTPUT'] as ComponentId[],
    wires: ['cpu_bus', 'bus_out'],
    packet: 'Result 0x0E sent across System Bus to Output Unit display',
    pc: '0x104',
    ir: 'OUT AC',
    ac: '0x0E',
  },
];

export const VonNeumannLab: React.FC = () => {
  const [selected, setSelected] = useState<ComponentId>('CPU');
  const [archMode, setArchMode] = useState<'von_neumann' | 'harvard'>('von_neumann');
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(900);

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      setStepIdx((prev) => (prev + 1) % FETCH_EXEC_STEPS.length);
    }, speedMs);
    return () => window.clearInterval(id);
  }, [isPlaying, speedMs]);

  const currentStep = FETCH_EXEC_STEPS[stepIdx];
  const info = COMPONENT_INFO[selected];

  const isActive = (id: ComponentId) => currentStep.active.includes(id);

  return (
    <div className="space-y-4">
      <SimControlBar
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying((p) => !p)}
        onStep={() => setStepIdx((s) => (s + 1) % FETCH_EXEC_STEPS.length)}
        onReset={() => {
          setIsPlaying(false);
          setStepIdx(0);
        }}
        speedMs={speedMs}
        onSpeedChange={setSpeedMs}
        stepText={`Cycle ${stepIdx + 1}/${FETCH_EXEC_STEPS.length}: ${currentStep.phase}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left/Top Interactive Stage (7 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 lab-grid-bg">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs font-mono font-semibold text-[#14213D] dark:text-slate-200">
              CLICK ANY COMPONENT TO INSPECT · {archMode === 'von_neumann' ? 'VON NEUMANN (SHARED BUS)' : 'HARVARD (SPLIT I/D MEMORY)'}
            </span>
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setArchMode('von_neumann')}
                className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                  archMode === 'von_neumann'
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Von Neumann
              </button>
              <button
                type="button"
                onClick={() => setArchMode('harvard')}
                className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                  archMode === 'harvard'
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Harvard Split Bus
              </button>
            </div>
          </div>

          <svg viewBox="0 0 760 400" className="w-full h-auto select-none">
            {/* CPU Outer Container */}
            <rect
              x={220}
              y={22}
              width={320}
              height={220}
              rx={14}
              className="fill-slate-50/90 dark:fill-slate-950/70"
              stroke={selected === 'CPU' ? '#2563EB' : '#94A3B8'}
              strokeWidth={selected === 'CPU' ? 2.5 : 1.5}
              strokeDasharray="6 4"
              onClick={() => setSelected('CPU')}
            />
            <text
              x={380}
              y={42}
              textAnchor="middle"
              className="fill-[#14213D] dark:fill-slate-200 text-[12px] font-bold font-display cursor-pointer"
              onClick={() => setSelected('CPU')}
            >
              CENTRAL PROCESSING UNIT (CPU)
            </text>

            {/* Internal CPU blocks */}
            <ArchBlock
              x={240}
              y={58}
              width={130}
              height={74}
              title="Control Unit"
              subtitle="Decode & Timing"
              active={isActive('CU')}
              selected={selected === 'CU'}
              onClick={() => setSelected('CU')}
            />
            <ArchBlock
              x={392}
              y={58}
              width={130}
              height={74}
              title="ALU"
              subtitle="Arithmetic & Logic"
              active={isActive('ALU')}
              selected={selected === 'ALU'}
              accent="cyan"
              onClick={() => setSelected('ALU')}
            />
            <ArchBlock
              x={240}
              y={152}
              width={282}
              height={72}
              title="CPU Registers"
              subtitle={`PC: ${currentStep.pc}  |  IR: ${currentStep.ir}  |  AC: ${currentStep.ac}`}
              value="High-Speed Internal Storage"
              active={isActive('REG')}
              selected={selected === 'REG'}
              onClick={() => setSelected('REG')}
            />

            {/* Internal CPU wires */}
            <SignalWire d="M 370 95 L 392 95" active={currentStep.wires.includes('alu_reg')} />
            <SignalWire d="M 305 132 L 305 152" active={isActive('CU')} />
            <SignalWire d="M 457 132 L 457 152" active={currentStep.wires.includes('alu_reg')} high={currentStep.wires.includes('alu_reg')} />

            {/* Input & Output Units */}
            <ArchBlock
              x={24}
              y={88}
              width={145}
              height={92}
              title="Input Unit"
              subtitle="Keyboard / Sensors"
              value="Binary In"
              active={isActive('INPUT')}
              selected={selected === 'INPUT'}
              onClick={() => setSelected('INPUT')}
            />
            <ArchBlock
              x={590}
              y={88}
              width={145}
              height={92}
              title="Output Unit"
              subtitle="Display / Actuators"
              value={stepIdx === 4 ? 'OUT: 0x0E (14)' : 'Ready'}
              active={isActive('OUTPUT')}
              selected={selected === 'OUTPUT'}
              accent="emerald"
              onClick={() => setSelected('OUTPUT')}
            />

            {/* System Bus Bar */}
            <g onClick={() => setSelected('BUS')} className="cursor-pointer">
              <rect
                x={80}
                y={266}
                width={600}
                height={34}
                rx={8}
                className={isActive('BUS') ? 'fill-blue-100 dark:fill-blue-950/60' : 'fill-slate-100 dark:fill-slate-800'}
                stroke={selected === 'BUS' || isActive('BUS') ? '#2563EB' : '#94A3B8'}
                strokeWidth={2}
              />
              <text
                x={380}
                y={287}
                textAnchor="middle"
                className="fill-[#14213D] dark:fill-slate-100 text-[11px] font-mono font-bold"
              >
                SYSTEM BUS — ADDRESS BUS · DATA BUS · CONTROL BUS
              </text>
            </g>

            {/* Memory Block(s) */}
            {archMode === 'von_neumann' ? (
              <ArchBlock
                x={235}
                y={324}
                width={290}
                height={62}
                title="Main Memory (Unified RAM)"
                subtitle="Shared Instructions + Data (Bottleneck)"
                value="0x100: ADD [0x200]   |   0x200: 0x09"
                active={isActive('MEM')}
                selected={selected === 'MEM'}
                onClick={() => setSelected('MEM')}
              />
            ) : (
              <>
                <ArchBlock
                  x={170}
                  y={324}
                  width={195}
                  height={62}
                  title="Instruction Memory"
                  subtitle="Dedicated Instruction Bus"
                  value="0x100: ADD [0x200]"
                  active={isActive('MEM')}
                  selected={selected === 'MEM'}
                  onClick={() => setSelected('MEM')}
                />
                <ArchBlock
                  x={395}
                  y={324}
                  width={195}
                  height={62}
                  title="Data Memory"
                  subtitle="Dedicated Data Bus"
                  value="0x200: 0x09"
                  active={isActive('MEM')}
                  selected={selected === 'MEM'}
                  accent="cyan"
                  onClick={() => setSelected('MEM')}
                />
              </>
            )}

            {/* Connecting Bus Wires */}
            <SignalWire
              d="M 96 180 L 96 266"
              active={currentStep.wires.includes('in_bus')}
              high={currentStep.wires.includes('in_bus')}
              label="In"
              labelX={80}
              labelY={226}
            />
            <SignalWire
              d="M 380 242 L 380 266"
              active={currentStep.wires.includes('cpu_bus')}
              high={currentStep.wires.includes('cpu_bus')}
              bidirectional
            />
            <SignalWire
              d="M 662 266 L 662 180"
              active={currentStep.wires.includes('bus_out')}
              high={currentStep.wires.includes('bus_out')}
              label="Out"
              labelX={682}
              labelY={226}
            />
            {archMode === 'von_neumann' ? (
              <SignalWire
                d="M 380 300 L 380 324"
                active={currentStep.wires.includes('bus_mem')}
                high={currentStep.wires.includes('bus_mem')}
                bidirectional
              />
            ) : (
              <>
                <SignalWire d="M 268 300 L 268 324" active={currentStep.wires.includes('bus_mem')} high />
                <SignalWire d="M 492 300 L 492 324" active={currentStep.wires.includes('bus_mem')} high />
              </>
            )}
          </svg>

          <div className="mt-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-xs font-mono text-slate-700 dark:text-slate-200">
            <span className="font-bold text-[#2563EB] dark:text-[#22D3EE]">ACTIVE FLOW:</span> {currentStep.packet}
          </div>
        </div>

        {/* Right Inspection & Concept Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#2563EB] dark:text-[#22D3EE]">
              Selected Component
            </div>
            <h3 className="mt-1 text-base font-bold text-[#14213D] dark:text-white">{info.title}</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 font-medium">{info.role}</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{info.details}</p>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 mb-2">
                QUICK SELECT
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['CPU', 'CU', 'ALU', 'REG', 'MEM', 'INPUT', 'OUTPUT', 'BUS'] as ComponentId[]).map((cid) => (
                  <button
                    key={cid}
                    type="button"
                    onClick={() => setSelected(cid)}
                    className={`rounded-md px-2.5 py-1 text-xs font-mono font-semibold cursor-pointer transition-colors ${
                      selected === cid
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cid}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Von Neumann vs Harvard
            </div>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Von Neumann</strong> stores instructions and data in one unified RAM (simpler hardware, shared-bus bottleneck).{' '}
              <strong>Harvard</strong> separates Instruction Memory and Data Memory on independent buses so instruction fetch and data access occur in parallel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
