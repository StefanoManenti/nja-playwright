export type ValuesOverrides = Record<string, string | string[]>;
export type StepType = {
  step: string | string[] | false;
  data?: ValuesOverrides;
};


export const mobileDevices: string[] = [
  // iPhone
  "iPhone 6",
  "iPhone 6 landscape",
  "iPhone 7",
  "iPhone 7 landscape",
  "iPhone 8",
  "iPhone 8 landscape",
  "iPhone SE",
  "iPhone SE landscape",
  "iPhone X",
  "iPhone X landscape",
  "iPhone 11",
  "iPhone 11 landscape",
  "iPhone 12",
  "iPhone 12 landscape",
  "iPhone 13",
  "iPhone 13 landscape",
  "iPhone 14",
  "iPhone 14 landscape",

  // Android
  "Pixel 2",
  "Pixel 2 landscape",
  "Pixel 4",
  "Pixel 4 landscape",
  "Pixel 5",
  "Pixel 5 landscape",
  "Galaxy S5",
  "Nexus 4",
  "Nexus 5",
  "Nexus 5X",
  "Nexus 6",
  "Nexus 6P",

  // Tablet (opzionalmente mobili)
  "iPad Mini",
  "iPad Mini landscape",
  "iPad",
  "iPad landscape",
  "iPad Pro 11",
  "iPad Pro 11 landscape",
  "Galaxy Tab S4"
];
