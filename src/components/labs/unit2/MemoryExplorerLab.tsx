import React, { useState } from 'react';
import { getEndianLayout } from '../../../simulators/logic/parallelArmEngine';

const INITIAL_MEM: Record<string, string> = {
  '0x1000': '4A',
  '0x1001': '1F',
  '0x1002': '9C',
  '0x1003': '05',
  '0x1004': '7E',
  '0x1005': '22',
  '0x1006': 'B0',
  '0x1007': 'FF',
};

export const MemoryExplorerLab: React.FC = () => {
  const [memory, setMemory] = useState<Record<string, string>>(INITIAL_MEM);
  const [selectedAddr, setSelectedAddr] = useState<string>('0x1000');
  const [writeVal, setWriteVal] = useState<string>('3C');
  const [lastRead, setLastRead] = useState<string>('0x4A (Dec: 74, Bin: 01001010)');

  const [wordHex, setWordHex] = useState('12345678');
  const [endian, setEndian] = useState<'big' | 'little'>('big');

  const endianLayout = getEndianLayout(wordHex, endian);

  const handleWrite = () => {
    const clean = writeVal.replace(/[^0-9a-fA-F]/g, '').toUpperCase().padStart(2, '0').slice(-2);
    setMemory((m) => ({ ...m, [selectedAddr]: clean }));
    const num = parseInt(clean, 16);
    setLastRead(`Wrote 0x${clean} (Dec: ${num}) to ${selectedAddr}`);
  };

  const handleRead = (addr: string) => {
    setSelectedAddr(addr);
    const hex = memory[addr] ?? '00';
    const num = parseInt(hex, 16);
    setLastRead(`Read ${addr} → 0x${hex} (Dec: ${num}, Bin: ${num.toString(2).padStart(8, '0')})`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Byte-Addressable Memory Cell Matrix */}
      <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[#14213D] dark:text-white">Interactive RAM Read / Write Explorer</h3>
          <span className="text-xs font-mono text-[#2563EB] dark:text-[#22D3EE]">Byte-Addressable · 8-bit Cells</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {Object.entries(memory).map(([addr, val]) => {
            const active = addr === selectedAddr;
            return (
              <button
                key={addr}
                type="button"
                onClick={() => handleRead(addr)}
                className={`rounded-xl border p-3 text-left font-mono transition-all cursor-pointer ${
                  active
                    ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/40 dark:border-[#22D3EE]'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-slate-300'
                }`}
              >
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{addr}</div>
                <div className="mt-1 text-lg font-bold text-[#14213D] dark:text-white">0x{val}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {parseInt(val, 16).toString(2).padStart(8, '0')}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
            MAR = {selectedAddr}
          </span>
          <input
            type="text"
            value={writeVal}
            maxLength={2}
            onChange={(e) => setWriteVal(e.target.value)}
            aria-label="Hex byte value to write"
            className="w-20 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 font-mono text-sm uppercase"
          />
          <button
            type="button"
            onClick={handleWrite}
            className="rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer"
          >
            Write Byte (WR)
          </button>
          <button
            type="button"
            onClick={() => handleRead(selectedAddr)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            Read Byte (RD)
          </button>
        </div>

        <div className="rounded-lg bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-[#14213D] dark:text-[#22D3EE]">
          MDR Status: {lastRead}
        </div>
      </div>

      {/* Big-Endian vs Little-Endian Visualizer */}
      <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#14213D] dark:text-white">Big-Endian vs Little-Endian</h3>
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setEndian('big')}
              className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                endian === 'big' ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Big-Endian
            </button>
            <button
              type="button"
              onClick={() => setEndian('little')}
              className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                endian === 'little' ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Little-Endian
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
            32-bit Word (Hex):
          </label>
          <input
            type="text"
            value={wordHex}
            maxLength={8}
            onChange={(e) => setWordHex(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 font-mono text-sm uppercase"
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {endianLayout.bytes.map((b) => (
            <div
              key={b.offset}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-center font-mono"
            >
              <div className="text-[10px] text-slate-500">Addr +{b.offset}</div>
              <div className="mt-1 text-base font-bold text-[#2563EB] dark:text-[#22D3EE]">0x{b.byteHex}</div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{endianLayout.description}</p>
      </div>
    </div>
  );
};
