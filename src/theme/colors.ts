export type Palette = {
  /** Fondo de la pantalla */
  bg: string;
  /** Tarjeta y campo de anotar */
  surface: string;
  /** Borde de tarjeta y de campo */
  border: string;
  /** Título y texto de la tarea */
  text: string;
  /** Tilde, puntito de la marca y tarea completada */
  textSoft: string;
  /** Terracota: botón, marca y borde marcado */
  accent: string;
  /** Fondo de la tarjeta marcada */
  accentSoft: string;
  /** Texto encima del terracota */
  onAccent: string;
};

export const light: Palette = {
  bg: "#FAFAF8",
  surface: "#FFFFFF",
  border: "#E7E7E2",
  text: "#1A1A1A",
  textSoft: "#8E8E88",
  accent: "#B4653A",
  accentSoft: "#F6EAE3",
  onAccent: "#FFFFFF",
};

export const dark: Palette = {
  bg: "#141413",
  surface: "#1E1E1C",
  border: "#33322E",
  text: "#F2F1EC",
  textSoft: "#8E8E88",
  accent: "#D3854F",
  accentSoft: "#33211A",
  onAccent: "#1A1A1A",
};
