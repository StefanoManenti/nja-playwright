import { StepType } from "./types/stepType";
import { createDeviceTests } from "./utils/testRunner";
import { IS_LOCAL_TEST } from './config';

const localTest = IS_LOCAL_TEST;
const baseUrl = !localTest ?`https://pp.eniplenitude.com/configura-offerta?dev&` : `http://localhost:4200/configura-offerta?mocks&dev&`;
const startUrl = `${baseUrl}codiceProdotto=BASE_PANNELLO&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&salesProcess=AGGIUNGI_PANNELLO&panel=`;

const stepsDesktop: StepType[] = [
  {
    step: ["selectAccount", "select-account-step"],
  },
  {
    step: ["panels"],
  },
  {
    step: ["contract-step"],
  },
  {
    step: ["activation-date-dual-step"],
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
    step: ["selectAccount", "select-account-step"],
  },
  {
    step: ["panels"],
  },
  {
    step: ["contract-step"],
  },
  {
    step: ["activation-date-dual-step"],
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
    step: ["selectAccount", "select-account-step"],
  },
  {
    step: ["panels"],
  },
  {
    step: ["contract-step"],
  },
  {
    step: ["activation-date-dual-step"],
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
const subFolder = prefix +"ADOTTA_UN_PANNELLO";

createDeviceTests({
  testName: 'PP - ADOTTA UN PANNELLO',
  startUrl,
  stepsDesktop,
  stepsTablet,
  stepsPhone,
  prefix,
  subFolder,
  useLoginArea: true
});
