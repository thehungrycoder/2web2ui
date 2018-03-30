import config from '.';
import { SPC_TENANT, SPC_EU_TENANT } from 'src/constants';

export const inSPC = () => config.tenant === SPC_TENANT;
export const inSPCEU = () => config.tenant === SPC_EU_TENANT;
