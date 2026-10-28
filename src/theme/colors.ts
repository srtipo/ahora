export type Palette = {
  /** Screen background */
  bg: string;
  /**
   * The background with no alpha.
   *
   * It is the end of the fade that dissolves the list: the same color as the
   * background, but transparent, so the two mix without a dark edge.
   */
  bgFade: string;
  /** Cards and text fields */
  surface: string;
  /** Inbox rows: a soft gray card, between the background and the card */
  surfaceMuted: string;
  /** Card and field borders */
  border: string;
  /** Screen titles and task text */
  text: string;
  /** Check mark, tray icon and back link */
  textSoft: string;
  /** Terracotta: button and marked border */
  accent: string;
  /** Pressed terracotta: the primary button while pressed */
  accentPressed: string;
  /** Background of the marked card */
  accentSoft: string;
  /** Text on top of terracotta */
  onAccent: string;
  /** Muted background: disabled button and pressed pill */
  mutedBg: string;
  /** Disabled text and completed task text */
  mutedText: string;
};

export const light: Palette = {
  bg: "#FAFAF8",
  bgFade: "rgba(250, 250, 248, 0)",
  surface: "#FFFFFF",
  surfaceMuted: "#F2F2EF",
  border: "#E7E7E2",
  text: "#1A1A1A",
  textSoft: "#8E8E88",
  accent: "#B4653A",
  accentPressed: "#A25A33",
  accentSoft: "#F6EAE3",
  onAccent: "#FFFFFF",
  mutedBg: "#EFEFEB",
  mutedText: "#B5B5AD",
};

export const dark: Palette = {
  bg: "#141413",
  bgFade: "rgba(20, 20, 19, 0)",
  surface: "#1E1E1C",
  surfaceMuted: "#232320",
  border: "#33322E",
  text: "#F2F1EC",
  textSoft: "#8E8E88",
  accent: "#D3854F",
  accentPressed: "#BC7646",
  accentSoft: "#33211A",
  onAccent: "#1A1A1A",
  mutedBg: "#2A2A28",
  mutedText: "#5A5A54",
};
