import { StepType } from "./types/stepType";
import { createDeviceTests } from "./utils/testRunner";
import { IS_LOCAL_TEST } from './config';

const localTest = IS_LOCAL_TEST;
const baseUrl = !localTest ?`https://pp.eniplenitude.com/configura-offerta?dev&` : `http://localhost:4200/configura-offerta?mocks&dev&`;
const startUrl = `${baseUrl}codiceProdotto=BASE_LTCASAV-GTCASAV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=luce&salesProcess=TRANSFER`;

const stepsDesktop: StepType[] = [
  {
    step: ["must-have-step", "must-have-mobile-step"],
  },
  {
    step: ["transfer-type-step"],
  },
  {
    step: ["customer-step"],
  },
  {
    step: ["customer-identity-residential-step"],
  },
  {
    step: ["upload-document"],
  },
  {
    step: ["pdr-transfer-step"],
    data: {
      pod: "IT001E27185440",
      taxId: "CSAMTN78S63D969I",
    },
  },
  {
    step: ["activation-address-step"],
  },
  {
    step: ["pod-step"],
  },
  {
    step: ["iban-residential-step"],
  },
  {
    step: ["contract-step"],
  },
  {
    step: ["privacy-step"],
  },
  {
    step: ["recap-step"],
  },
  {
    step: ["typ-step"],
  },
];

const stepsTablet: StepType[] = [
  {
    step: ["must-have-step", "must-have-mobile-step"],
  },
  {
    step: ["must-have-step", "must-have-mobile-step"],
  },
  {
    step: ["transfer-type-step"],
  },
  {
    step: ["customer-step"],
  },
  {
    step: ["customer-identity-residential-step"],
  },
  {
    step: ["upload-document"],
  },
  {
    step: ["pdr-transfer-step"],
    data: {
      pod: "IT001E27185440",
      taxId: "CSAMTN78S63D969I",
    },
  },
  {
    step: ["activation-address-step"],
  },
  {
    step: ["pod-step"],
  },
  {
    step: ["iban-residential-step"],
  },
  {
    step: ["contract-step"],
  },
  {
    step: ["privacy-step"],
  },
  {
    step: ["recap-step"],
  },
  {
    step: ["typ-step"],
  },
];

const stepsPhone: StepType[] = [
  {
    step: ["must-have-step", "must-have-mobile-step"],
  },
  {
    step: ["must-have-step", "must-have-mobile-step"],
  },
  {
    step: ["transfer-type-step"],
  },
  {
    step: ["customer-step"],
  },
  {
    step: ["customer-identity-residential-step"],
  },
  {
    step: ["upload-document"],
  },
  {
    step: ["pdr-transfer-step"],
    data: {
      pod: "IT001E27185440",
      taxId: "CSAMTN78S63D969I",
    },
  },
  {
    step: ["activation-address-step"],
  },
  {
    step: ["pod-step"],
  },
  {
    step: ["iban-residential-step"],
  },
  {
    step: ["contract-step"],
  },
  {
    step: ["privacy-step"],
  },
  {
    step: ["recap-step"],
  },
  {
    step: ["typ-step"],
  },
];

const prefix = localTest ? "LOCAL_" : "PP_";
const subFolder = prefix +"VOLTURA_LUCE_ORDINARIO";

createDeviceTests({
  testName: 'VOLTURA LUCE ORDINARIO',
  startUrl,
  stepsDesktop,
  stepsTablet,
  stepsPhone,
  prefix,
  subFolder,
  useLoginArea: true
});
