import { useEffect, useState } from "react";
import { Animated, Easing } from "react-native";
import Svg, { Path } from "react-native-svg";

/** Spinner path copied from the Penpot SVG, normalized to a 24 viewBox. */
const PATH = "M12 1.2C17.965 1.2 22.8 6.035 22.8 12C22.8 17.965 17.965 22.8 12 22.8C6.035 22.8 1.2 17.965 1.2 12";

/** On screen thickness: the design keeps it at 2 px on 14, 16 and 20. */
const STROKE_WIDTH = 2;

const TURN_DURATION = 1000;

export type SpinnerProps = {
  /** Spinner side in pixels. Default 20. */
  size?: number;
  /** Stroke color. */
  color?: string;
};

/**
 * The spinner of the "loading" state.
 *
 * It is the only icon that lives in this folder: the rest arrive through a prop.
 */
export function Spinner({ size = 20, color = "#FFFFFF" }: SpinnerProps) {
  const [spin] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: TURN_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [spin]);

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        transform: [
          {
            rotate: spin.interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", "360deg"],
            }),
          },
        ],
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d={PATH}
          stroke={color}
          strokeWidth={(STROKE_WIDTH * 24) / size}
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
}
