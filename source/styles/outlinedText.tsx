
import Svg, {Text} from 'react-native-svg';

type OutlinedTextProps={
    text: string
}

type SelfDesignedOutlinedTextProps={
    text: string,
    width: number,
    height: number,
    dy: number,
    fill?: string,
    stroke?: string,
    strokeWidth?: number,
    fontSize?: number,
}

export const OutlinedText=(props: OutlinedTextProps)=>{
    return(
        <Svg height="30" width="30">
                <Text
                  x="15"
                  y="15"
                  textAnchor="middle"
                  dy="3"
                  fill="white"
                  stroke="#3a3a3a"
                  strokeWidth="0.8"
                  fontSize="16"
                  fontFamily="Wordlet-Regular"
                >{props.text}
        </Text>
        </Svg>
    )
}

export const ScoreOutlinedText=(props: OutlinedTextProps)=>{
    return(
        <Svg height="20" width="20">
                <Text
                  x="10"
                  y="10"
                  textAnchor="middle"
                  dy="3"
                  fill="white"
                  stroke="#3a3a3a"
                  strokeWidth="0.8"
                  fontSize="15"
                  fontFamily="Wordlet-Regular"
                >{props.text}
        </Text>
        </Svg>
    )    
}
export const SelfDesignedOutlinedText = ({
  text,
  width,
  height,
  dy,
  fill = "white",
  stroke = "#3a3a3a",
  strokeWidth = 0.8,
  fontSize = 16,
}: SelfDesignedOutlinedTextProps) => {
  return (
    <Svg height={height} width={width}>
      <Text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dy={dy}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fontSize={fontSize}
        fontFamily="Wordlet-Regular"
      >
        {text}
      </Text>
    </Svg>
  );
};
