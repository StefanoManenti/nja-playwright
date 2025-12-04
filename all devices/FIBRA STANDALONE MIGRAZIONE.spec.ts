import { StepType } from './types/stepType';
import { createDeviceTests } from './utils/testRunner';
import { IS_LOCAL_TEST } from './config';

const localTest = IS_LOCAL_TEST;
const baseUrl = !localTest ?`https://pp.eniplenitude.com/configura-offerta?dev&` : `http://localhost:4200/configura-offerta?mocks&dev&`;
const startUrl = `${baseUrl}codiceProdotto=BASE_BB&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&salesProcess=BROADBAND&fiber=BASE_BB&egonid=380100013650019`

const stepsDesktop: StepType[] = [
  {
    "step": [
      "must-have-step",
      "must-have-mobile-step"
    ]
  },
  {
    "step": [
      "broadband-options-step"
    ],
    "data": {
      "migrationCode": "KQG029989270011M"
    }
  },
  {
    "step": [
      "broadband-phone-step"
    ]
  },
  {
    "step": [
      "customer-step"
    ]
  },
  {
    "step": [
      "customer-identity-residential-step"
    ]
  },
  {
    "step": [
      "activation-address-step"
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
      "broadband-options-step"
    ],
    "data": {
      "migrationCode": "KQG029989270011M"
    }
  },
  {
    "step": [
      "broadband-phone-step"
    ]
  },
  {
    "step": [
      "customer-step"
    ]
  },
  {
    "step": [
      "customer-identity-residential-step"
    ]
  },
  {
    "step": [
      "activation-address-step"
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
      "broadband-options-step"
    ],
    "data": {
      "migrationCode": "KQG029989270011M"
    }
  },
  {
    "step": [
      "broadband-phone-step"
    ]
  },
  {
    "step": [
      "customer-step"
    ]
  },
  {
    "step": [
      "customer-identity-residential-step"
    ]
  },
  {
    "step": [
      "activation-address-step"
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
const subFolder = prefix +'FIBRA_STANDALONE_MIGRAZIONE';

createDeviceTests({
  testName: 'FIBRA STANDALONE MIGRAZIONE',
  startUrl,
  stepsDesktop,
  stepsTablet,
  stepsPhone,
  prefix,
  subFolder,
  useLoginArea: true
});
