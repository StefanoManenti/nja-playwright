import { StepType } from './types/stepType';
import { createDeviceTests } from './utils/testRunner';
import { IS_LOCAL_TEST } from './config';

const localTest = IS_LOCAL_TEST;
const baseUrl = !localTest ?`https://pp.eniplenitude.com/configura-offerta?dev&` : `http://localhost:4200/configura-offerta?mocks&dev&`;
const startUrl = `${baseUrl}codiceProdotto=BASE_LFIXATIV-GFIXATIV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=luce&salesProcess=SWITCH_IN&segment=res`

const stepsDesktop: StepType[] = [
  {
    "step": [
      "must-have-step",
      "must-have-mobile-step"
    ]
  },
  {
    "step": [
      "ocr-step"
    ],
    "data": {
      "mode": "MANUAL"
    }
  },
  {
    "step": [
      "customer-step"
    ]
  },
  {
    "step": [
      "activation-address-step"
    ]
  },
  {
    "step": [
      "pod-step"
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
      "activation-date-dual-step"
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
      "must-have-step",
      "must-have-mobile-step"
    ]
  },
  {
    "step": [
      "must-have-step",
      "must-have-mobile-step"
    ]
  },
  {
    "step": [
      "ocr-step"
    ],
    "data": {
      "mode": "MANUAL"
    }
  },
  {
    "step": [
      "customer-step"
    ]
  },
  {
    "step": [
      "activation-address-step"
    ]
  },
  {
    "step": [
      "pod-step"
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
      "activation-date-dual-step"
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
      "must-have-step",
      "must-have-mobile-step"
    ]
  },
  {
    "step": [
      "must-have-step",
      "must-have-mobile-step"
    ]
  },
  {
    "step": [
      "ocr-step"
    ],
    "data": {
      "mode": "MANUAL"
    }
  },
  {
    "step": [
      "customer-step"
    ]
  },
  {
    "step": [
      "activation-address-step"
    ]
  },
  {
    "step": [
      "pod-step"
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
      "activation-date-dual-step"
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
const subFolder = prefix +'SWITCH_FIXA_LUCE_BOLLETTINO';

createDeviceTests({
  testName: 'SWITCH FIXA LUCE BOLLETTINO',
  startUrl,
  stepsDesktop,
  stepsTablet,
  stepsPhone,
  prefix,
  subFolder,
  useLoginArea: true
});
