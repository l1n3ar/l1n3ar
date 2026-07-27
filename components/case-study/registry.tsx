import type { ComponentType } from 'react';
import { PhoenixCaseStudy } from './phoenix';
import { EigerWalletCaseStudy } from './eiger-wallet';
import { AculeadCaseStudy } from './aculead';
import { GrocernestCaseStudy } from './grocernest';
import { ContromoistPACaseStudy } from './contromoist-pa';
import { RegistrumCaseStudy } from './registrum';

export const caseStudies: Record<string, ComponentType> = {
  phoenix: PhoenixCaseStudy,
  'eiger-wallet': EigerWalletCaseStudy,
  aculead: AculeadCaseStudy,
  grocernest: GrocernestCaseStudy,
  'contromoist-pa': ContromoistPACaseStudy,
  registrum: RegistrumCaseStudy,
};
