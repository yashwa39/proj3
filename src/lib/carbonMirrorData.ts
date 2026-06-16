export const SIMULATOR = {
  timelines: [
    {
      label: "1 year",
      cur: { co2: "768.0 kg", cost: "₹19,200", trees: "38" },
      better: { co2: "537.6 kg", cost: "₹13,440", trees: "27" },
      green: { co2: "230.4 kg", cost: "₹5,760", trees: "12" },
      raw: [768, 537.6, 230.4] as const,
    },
    {
      label: "5 years",
      cur: { co2: "3,840.0 kg", cost: "₹96,000", trees: "192" },
      better: { co2: "2,688.0 kg", cost: "₹67,200", trees: "134" },
      green: { co2: "1,152.0 kg", cost: "₹28,800", trees: "58" },
      raw: [3840, 2688, 1152] as const,
    },
    {
      label: "10 years",
      cur: { co2: "7,680.0 kg", cost: "₹1,92,000", trees: "384" },
      better: { co2: "5,376.0 kg", cost: "₹1,34,400", trees: "269" },
      green: { co2: "2,304.0 kg", cost: "₹57,600", trees: "115" },
      raw: [7680, 5376, 2304] as const,
    },
  ],
} as const;
