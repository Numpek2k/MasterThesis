import {TouchableWithoutFeedback, View, Animated} from "react-native";
import {PropsWithChildren, useState} from "react";
import {ThemedText} from "@/components/ThemedText";
import { AntDesign } from '@expo/vector-icons';

type CollapsibleProps = PropsWithChildren <{
  title: string;
}>

export default function CollapsibleView ({ title, children }: CollapsibleProps) {

  const [collapsed, setCollapsed] = useState(true);
  const [animation] = useState(new Animated.Value(0));

  const toggleCollapse = () => {
    if (collapsed) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false
      }).start();
    }
    setCollapsed(!collapsed);
  };

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500]
  });

  return(
    <View>
      <TouchableWithoutFeedback onPress={toggleCollapse}>
        <View>
          <ThemedText style={{color:'blue'}}>{title}
            <AntDesign name="caretdown" size={16} color="blue" />
          </ThemedText>
        </View>
      </TouchableWithoutFeedback>
      <Animated.View style={{ height: heightInterpolate }}>
        {children}
      </Animated.View>
    </View>
  )

}