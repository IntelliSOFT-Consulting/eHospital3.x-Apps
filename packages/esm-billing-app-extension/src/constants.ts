import { restBaseUrl } from '@openmrs/esm-framework';

export const apiBasePath = `${restBaseUrl}/billing/`;

export const omrsDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';

// Size in MegaBits
export const MAX_ALLOWED_FILE_SIZE = 2097152;

export const colorsArray = [
    'red',
    'magenta',
    'purple',
    'blue',
    'cyan',
    'teal',
    'green',
    'gray',
    'cool-gray',
    'warm-gray',
    'high-contrast',
    'outline',
  ];

export const PAYMENT_MODE_ATTRIBUTE_FORMATS = ['java.lang.String', 'java.lang.Integer', 'java.lang.Double'];
