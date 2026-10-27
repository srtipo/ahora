import Svg, { Path } from "react-native-svg";

export type IconProps = {
  /** Icon side in pixels. Default 24. */
  size?: number;
  /** Stroke color. */
  color?: string;
};

/**
 * Tray.
 *
 * The path comes from the Penpot SVG, normalized to a 24 viewBox.
 */
const TRAY = "M7 4.5L3.5 4.5C2.395 4.5 1.5 5.395 1.5 6.5L1.5 18.5C1.5 19.605 2.395 20.5 3.5 20.5L20.5 20.5C21.605 20.5 22.5 19.605 22.5 18.5L22.5 6.5C22.5 5.395 21.605 4.5 20.5 4.5L17 4.5";
const TRAY_STEM = "M12 7L12 14";
const TRAY_ARROW = "M9 11L12 14L15 11";

/** Check mark. */
const CHECK = "M4.5 12.5L9.5 17.5L19.5 6.5";

/** Left chevron. */
const CHEVRON = "M14.5 5.5L8 12L14.5 18.5";

/**
 * On screen thickness, in pixels.
 *
 * The design keeps it fixed per icon no matter the size, so the stroke width
 * inside the viewBox is scaled with the icon.
 */
const TRAY_STROKE = 1.5;
const CHECK_STROKE = 1.8;
const CHEVRON_STROKE = 1.8;

/** The tray, with the arrow going in: "take it out of today". */
export function Tray({ size = 24, color = "#8E8E88" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={TRAY}
        stroke={color}
        strokeWidth={(TRAY_STROKE * 24) / size}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d={TRAY_STEM}
        stroke={color}
        strokeWidth={(TRAY_STROKE * 24) / size}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d={TRAY_ARROW}
        stroke={color}
        strokeWidth={(TRAY_STROKE * 24) / size}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** The check mark: the task is done. */
export function Check({ size = 24, color = "#8E8E88" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={CHECK}
        stroke={color}
        strokeWidth={(CHECK_STROKE * 24) / size}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** The chevron that goes back. */
export function Chevron({ size = 16, color = "#8E8E88" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={CHEVRON}
        stroke={color}
        strokeWidth={(CHEVRON_STROKE * 24) / size}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
