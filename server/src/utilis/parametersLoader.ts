import DataLoader from 'dataloader'
import { Parameter } from '../entities/Parameter';
import { ParameterTemplate } from '../entities/ParameterTemplate'

export const createParametersLoader = () => 
new DataLoader<{ templateId: number }, Parameter | null>(
    async (keys) => {
        const parameters = await Parameter.findByIds(keys as any);
        const parameterIdsToParameter: Record<string, Parameter> = {};
    }
  );