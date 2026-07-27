import type { ComponentType } from 'react';
import { PhoenixCaseStudy } from './phoenix';
import { EigerWalletCaseStudy } from './eiger-wallet';

export const caseStudies: Record<string, ComponentType> = {
  phoenix: PhoenixCaseStudy,
  'eiger-wallet': EigerWalletCaseStudy,
};
