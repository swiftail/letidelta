export interface ConstantSet {
  'U': number
  'V': number
  't': number
  'B': number
}

export const constants: Record<number, ConstantSet> = {
    4: {'U': 0.76, 'V': 1.46, 't': 3.2, 'B': 0.72},
    5: {'U': 0.64, 'V': 1.67, 't': 2.8, 'B': 0.51},
    7: {'U': 0.51, 'V': 1.94, 't': 2.4, 'B': 0.33}
}
