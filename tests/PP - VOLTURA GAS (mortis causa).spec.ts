import { StepType } from './types/stepType';
import { createDeviceTests } from './utils/testRunner';
import { IS_LOCAL_TEST } from './config';

const localTest = IS_LOCAL_TEST;
const baseUrl = !localTest ?`https://pp.eniplenitude.com/configura-offerta?dev&` : `http://localhost:4200/configura-offerta?mocks&dev&`;
const startUrl = `${baseUrl}codiceProdotto=BASE_LTCASAV-GTCASAV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=gas&salesProcess=TRANSFER&segment=res`

const stepsDesktop: StepType[] = [
  {
    "step": [
      "must-have-mobile-step",
      "must-have-step"
    ]
  },
  {
    "step": [
      "transfer-type-step"
    ],
    "data": {
      "transferType": "MORTIS_CAUSA"
    }
  },
  {
    "step": [
      "customer-step"
    ]
  },
  {
    "step": [
      "MortisCausaStep",
      "mortis-causa-step"
    ]
  },
  {
    "step": [
      "customer-identity-residential-step"
    ]
  },
  {
    "step": [
      "upload-document"
    ]
  },
  {
    "step": [
      "pdr-transfer-step"
    ]
  },
  {
    "step": [
      "activation-address-step"
    ]
  },
  {
    "step": [
      "gas-goal-step"
    ]
  },
  {
    "step": [
      "iban-residential-step"
    ]
  },
  {
    "step": [
      "contract-step"
    ]
  },
  {
    "step": [
      "privacy-step"
    ]
  },
  {
    "step": [
      "recap-step"
    ]
  },
  {
    "step": [
      "typ-step"
    ]
  }
];

const stepsTablet: StepType[] = [
  {
    "step": [
      "must-have-mobile-step",
      "must-have-step"
    ]
  },
  {
    "step": [
      "transfer-type-step"
    ],
    "data": {
      "transferType": "MORTIS_CAUSA"
    }
  },
  {
    "step": [
      "customer-step"
    ]
  },
  {
    "step": [
      "MortisCausaStep",
      "mortis-causa-step"
    ]
  },
  {
    "step": [
      "customer-identity-residential-step"
    ]
  },
  {
    "step": [
      "upload-document"
    ]
  },
  {
    "step": [
      "pdr-transfer-step"
    ]
  },
  {
    "step": [
      "activation-address-step"
    ]
  },
  {
    "step": [
      "gas-goal-step"
    ]
  },
  {
    "step": [
      "iban-residential-step"
    ]
  },
  {
    "step": [
      "contract-step"
    ]
  },
  {
    "step": [
      "privacy-step"
    ]
  },
  {
    "step": [
      "recap-step"
    ]
  },
  {
    "step": [
      "typ-step"
    ]
  }
];

const stepsPhone: StepType[] = [
  {
    "step": [
      "must-have-mobile-step",
      "must-have-step"
    ]
  },
  {
    "step": [
      "transfer-type-step"
    ],
    "data": {
      "transferType": "MORTIS_CAUSA"
    }
  },
  {
    "step": [
      "customer-step"
    ]
  },
  {
    "step": [
      "MortisCausaStep",
      "mortis-causa-step"
    ]
  },
  {
    "step": [
      "customer-identity-residential-step"
    ]
  },
  {
    "step": [
      "upload-document"
    ]
  },
  {
    "step": [
      "pdr-transfer-step"
    ]
  },
  {
    "step": [
      "activation-address-step"
    ]
  },
  {
    "step": [
      "gas-goal-step"
    ]
  },
  {
    "step": [
      "iban-residential-step"
    ]
  },
  {
    "step": [
      "contract-step"
    ]
  },
  {
    "step": [
      "privacy-step"
    ]
  },
  {
    "step": [
      "recap-step"
    ]
  },
  {
    "step": [
      "typ-step"
    ]
  }
];

const prefix = localTest ? "LOCAL_" : "PP_";
const subFolder = prefix +'VOLTURA_GAS_MORTIS_CAUSA';

createDeviceTests({
  testName: 'PP - VOLTURA GAS (mortis causa)',
  startUrl,
  stepsDesktop,
  stepsTablet,
  stepsPhone,
  prefix,
  subFolder,
  useLoginArea: false
});
