import { StepType } from "./types/stepType";
import { createDeviceTests } from "./utils/testRunner";
import { IS_LOCAL_TEST } from './config';

const localTest = IS_LOCAL_TEST;
const baseUrl = !localTest ?`https://pp.eniplenitude.com/configura-offerta?dev&` : `http://localhost:4200/configura-offerta?mocks&dev&`;
const startUrl = `${baseUrl}codiceProdotto=BASE_LFIXATIV-GFIXATIV&codiceCanale=CWEB3EGP&codiceTpCanale=WB&direct-debit=true&bill-type=digitale&commodity=gas&salesProcess=NEW_ACTIVATION`;

const stepsDesktop: StepType[] = [
  {
    step: ["activation-gas-step"],
    data: {
      aperto: "no",
    },
  },
  {
    step: ["must-have-step", "must-have-mobile-step"],
  },
  {
    step: ["customer-step"],
  },
  {
    step: ["customer-identity-residential-step"],
  },
  {
    step: ["activation-address-step"],
  },
  {
    step: ["UnitaAbitative", "unita-abitative-step"],
  },
  {
    step: ["gas-goal-step"],
  },
  {
    step: ["iban-residential-step"],
  },
  {
    step: ["contract-step"],
  },
  {
    step: ["forniture-dates-step"],
  },
  {
    step: ["GasAppointment", "gas-appointment-step"],
  },
  {
    step: ["LocationMeter", "location-meter-step"],
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
    step: ["activation-gas-step"],
    data: {
      aperto: "no",
    },
  },
  {
    step: ["must-have-step", "must-have-mobile-step"],
  },
  {
    step: ["must-have-step", "must-have-mobile-step"],
  },
  {
    step: ["customer-step"],
  },
  {
    step: ["customer-identity-residential-step"],
  },
  {
    step: ["activation-address-step"],
  },
  {
    step: ["UnitaAbitative", "unita-abitative-step"],
  },
  {
    step: ["gas-goal-step"],
  },
  {
    step: ["iban-residential-step"],
  },
  {
    step: ["contract-step"],
  },
  {
    step: ["forniture-dates-step"],
  },
  {
    step: ["GasAppointment", "gas-appointment-step"],
  },
  {
    step: ["LocationMeter", "location-meter-step"],
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
    step: ["activation-gas-step"],
    data: {
      aperto: "no",
    },
  },
  {
    step: ["must-have-step", "must-have-mobile-step"],
  },
  {
    step: ["must-have-step", "must-have-mobile-step"],
  },
  {
    step: ["customer-step"],
  },
  {
    step: ["customer-identity-residential-step"],
  },
  {
    step: ["activation-address-step"],
  },
  {
    step: ["UnitaAbitative", "unita-abitative-step"],
  },
  {
    step: ["gas-goal-step"],
  },
  {
    step: ["iban-residential-step"],
  },
  {
    step: ["contract-step"],
  },
  {
    step: ["forniture-dates-step"],
  },
  {
    step: ["GasAppointment", "gas-appointment-step"],
  },
  {
    step: ["LocationMeter", "location-meter-step"],
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
const subFolder = prefix + "NUOVA_ATTIVAZIONE_GAS_FIXA_SUBENTRO";

createDeviceTests({
  testName: 'NUOVA ATTIVAZIONE GAS FIXA (subentro)',
  startUrl,
  stepsDesktop,
  stepsTablet,
  stepsPhone,
  prefix,
  subFolder,
  useLoginArea: true
});
