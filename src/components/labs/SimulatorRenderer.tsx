import React from 'react';
import { VonNeumannLab } from './unit1/VonNeumannLab';
import { GenerationsTimelineLab } from './unit1/GenerationsTimelineLab';
import { HierarchyLevelsLab } from './unit1/HierarchyLevelsLab';
import { NumberCodesLab } from './unit1/NumberCodesLab';
import { FunctionalUnitsLab } from './unit2/FunctionalUnitsLab';
import { CpuRegisterLab } from './unit2/CpuRegisterLab';
import { BusCommLab } from './unit2/BusCommLab';
import { MemoryExplorerLab } from './unit2/MemoryExplorerLab';
import { Microprocessor8086Lab } from './unit2/Microprocessor8086Lab';
import { LogicGatesLab } from './unit3/LogicGatesLab';
import { BooleanExprLab } from './unit3/BooleanExprLab';
import { DeMorganLab } from './unit3/DeMorganLab';
import { AddersLab } from './unit3/AddersLab';
import { AluLab } from './unit3/AluLab';
import { MultiplyDivideFloatLab } from './unit3/MultiplyDivideFloatLab';
import { InstructionCycleLab } from './unit4/InstructionCycleLab';
import { RegisterTransferBusLab } from './unit4/RegisterTransferBusLab';
import { ControlUnitLab } from './unit4/ControlUnitLab';
import { PipelineLab } from './unit4/PipelineLab';
import { PipelineHazardLab } from './unit4/PipelineHazardLab';
import { PipelinePerfLab } from './unit4/PipelinePerfLab';
import { SequentialParallelLab } from './unit5/SequentialParallelLab';
import { FlynnsLab } from './unit5/FlynnsLab';
import { MulticoreLab } from './unit5/MulticoreLab';
import { ArmThumbLab } from './unit5/ArmThumbLab';
import { ArmLoadStoreIoLab } from './unit5/ArmLoadStoreIoLab';

export const SimulatorRenderer: React.FC<{ simId: string }> = ({ simId }) => {
  switch (simId) {
    // Unit 1
    case 'u1-von-neumann':
      return <VonNeumannLab />;
    case 'u1-generations':
      return <GenerationsTimelineLab />;
    case 'u1-hierarchy':
      return <HierarchyLevelsLab />;
    case 'u1-numbers-codes':
      return <NumberCodesLab />;

    // Unit 2
    case 'u2-functional-units':
      return <FunctionalUnitsLab />;
    case 'u2-cpu-architecture':
      return <CpuRegisterLab />;
    case 'u2-bus-comm':
      return <BusCommLab />;
    case 'u2-memory-explorer':
      return <MemoryExplorerLab />;
    case 'u2-microprocessor-8086':
      return <Microprocessor8086Lab />;

    // Unit 3
    case 'u3-logic-gates':
      return <LogicGatesLab />;
    case 'u3-boolean-expr':
      return <BooleanExprLab />;
    case 'u3-demorgan':
      return <DeMorganLab />;
    case 'u3-adders':
      return <AddersLab />;
    case 'u3-alu':
      return <AluLab />;
    case 'u3-mul-div-float':
      return <MultiplyDivideFloatLab />;

    // Unit 4
    case 'u4-instruction-cycle':
      return <InstructionCycleLab />;
    case 'u4-register-bus':
      return <RegisterTransferBusLab />;
    case 'u4-control-unit':
      return <ControlUnitLab />;
    case 'u4-pipeline':
      return <PipelineLab />;
    case 'u4-hazards':
      return <PipelineHazardLab />;
    case 'u4-perf':
      return <PipelinePerfLab />;

    // Unit 5
    case 'u5-parallelism':
      return <SequentialParallelLab />;
    case 'u5-flynn':
      return <FlynnsLab />;
    case 'u5-multicore':
      return <MulticoreLab />;
    case 'u5-arm-thumb':
      return <ArmThumbLab />;
    case 'u5-arm-io':
      return <ArmLoadStoreIoLab />;

    default:
      return <VonNeumannLab />;
  }
};
