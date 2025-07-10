import React, { useMemo } from 'react';
import {
  View,
  Pressable,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import ReAnimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';
import { buttons } from '../source/styles/assets';

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0'.split('');

const dynamicPaddingHorizontal = 8;
const dynamicPaddingVertical = 8;
const dynamicFontSize = 14;

type Props = {
  onKeyPress: (letter: string) => void;
};

export const WicWacWoeKeyboard: React.FC<Props> = ({ onKeyPress }) => {
  const row1 = ALPHABETS.slice(0, 10);
  const row2 = ALPHABETS.slice(10, 19);
  const row3 = ALPHABETS.slice(19);

  const scaleMap: Record<string, SharedValue<number>> = useMemo(() => {
    const map: Record<string, SharedValue<number>> = {};
    ALPHABETS.forEach(letter => {
      map[letter] = useSharedValue(1);
    });
    return map;
  }, []);

  const renderRow = (letters: string[]) => (
    <View style={styles.row}>
      {letters.map(letter => {
        const scale = scaleMap[letter];

        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: scale.value }],
        }));

        const handlePressIn = () => {
          scale.value = withTiming(0.9, { duration: 100 });
        };

        const handlePressOut = () => {
          scale.value = withTiming(1, { duration: 100 });
        };

        const isBackspace = letter === '0';

        const content = isBackspace ? (
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => onKeyPress(letter)}
          >
            <Image
              source={buttons.backButton}
              style={styles.backButtonImage}
            />
          </Pressable>
        ) : (
          <ImageBackground
            source={buttons.whiteKey}
            imageStyle={styles.whiteKeyImage}
          >
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => onKeyPress(letter)}
              style={styles.keyPressable}
            >
              <Text style={styles.keyText}>{letter}</Text>
            </Pressable>
          </ImageBackground>
        );

        return (
          <ReAnimated.View key={letter} style={animatedStyle}>
            {content}
          </ReAnimated.View>
        );
      })}
    </View>
  );

  return (
    <View style={styles.keyboard}>
      {renderRow(row1)}
      {renderRow(row2)}
      {renderRow(row3)}
    </View>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 6,
  },
  whiteKeyImage: {
    resizeMode: 'stretch',
    borderRadius: 6,
    borderWidth: 1,
  },
  backButtonImage: {
    height: 30 + dynamicPaddingVertical,
    resizeMode: 'stretch',
    aspectRatio: 1.288,
    borderWidth: 1,
    borderRadius: 4,
  },
  keyPressable: {
    paddingHorizontal: dynamicPaddingHorizontal,
    paddingVertical: dynamicPaddingVertical,
  },
  keyText: {
    fontSize: dynamicFontSize,
  },
});
