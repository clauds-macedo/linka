import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { TAppAbility } from './abilities';

export const AbilityContext = createContext<TAppAbility | undefined>(undefined);
export const Can = createContextualCan(AbilityContext.Consumer);
