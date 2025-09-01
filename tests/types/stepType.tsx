export type ValuesOverrides = Record<string, string | string[]>;
export type StepType = {
  step: string | string[] | false;
  data?: ValuesOverrides;
};
