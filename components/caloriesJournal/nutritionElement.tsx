import {StyleSheet, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {TextInput} from "react-native-paper";
import {PropsWithChildren, useEffect, useRef, useState} from "react";

type NutritionProps = PropsWithChildren<{
  name: string
  calories: number
  serving_size_g: number
  fat_total_g: number
  protein_g: number
  carbohydrates_total_g: number
  onServingSizeChange: (name: string, newSize: number) => void;
}>;

export default function NutritionElement({
  name,
  calories,
  serving_size_g,
  carbohydrates_total_g,
  fat_total_g,
  protein_g,
  onServingSizeChange
}: NutritionProps){

  const [inputValue, setInputValue] = useState(serving_size_g.toString());
  const typingNutritionElementTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (text: string) => {
    setInputValue(text);
  };

  const handleInputOnEnd = (text: string) => {
    const value = parseInt(text, 10);

    const minValue = 1;

    if (!isNaN(value) && value >= minValue) {
      onServingSizeChange(name, value);
    } else if (text === '') {
      onServingSizeChange(name, 1);
      setInputValue('1')
    } else {
      onServingSizeChange(name, minValue);
    }
  };

  useEffect(() => {
    if (typingNutritionElementTimeout.current) {
      clearTimeout(typingNutritionElementTimeout.current);
    }

    typingNutritionElementTimeout.current = setTimeout(() => {
      handleInputOnEnd(inputValue)
    }, 300);

    return () => {
      if (typingNutritionElementTimeout.current) {
        clearTimeout(typingNutritionElementTimeout.current);
      }
    };
  }, [inputValue]);

  return(
    <View style={styles.container}>
      <ThemedText style={{color:'black', marginBottom: 10, textTransform:'capitalize'}} type='subtitle' >{name}</ThemedText>
      <View style={styles.itemsInRow}>
        <View style={styles.statsContainer}>
          <View style={styles.itemsInRow}>
            <View style={{width:'50%'}}>
              <ThemedText style={{color:'black', borderColor:'gray', borderRightWidth:1, marginRight:10}}>
                Kcal{"\n"}{calories}
              </ThemedText>

            </View>
            <View style={{width:'50%'}}>
              <ThemedText style={{color:'black',paddingLeft: 10}}>
                Białka{"\n"}{protein_g}
              </ThemedText>
            </View>
          </View>

          <View style={styles.itemsInRow}>
            <View style={{width:'50%'}}>
              <ThemedText style={{
                color:'black',
                borderColor:'gray',
                borderTopWidth: 1,
                marginRight:10

              }}>
                Tł.{"\n"}{fat_total_g}
              </ThemedText>
            </View>
            <View style={{width:'50%'}}>
              <ThemedText style={{
                color:'black',
                borderColor:'gray',
                borderTopWidth: 1,
                borderLeftWidth:1,
                paddingLeft: 10
              }}>
                Węgl.{"\n"}{carbohydrates_total_g}
              </ThemedText>
            </View>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            contentStyle={{
              fontFamily: 'MinecraftRegular',
          }}
            mode = 'outlined'
            label={"Waga(g)"}
            onChangeText={handleInputChange}
            value={inputValue}
            inputMode={"numeric"}
            keyboardType={"numeric"}
            activeOutlineColor={'#002c8a'}

          />
        </View>
      </View>
      <View>

      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container:{
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#002c8a',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor:'#eef1ff',
    padding: 10,
  },
  itemsInRow: {
    flexDirection: 'row',
  },
  statsContainer: {
    width:'65%',
  },
  inputContainer:{
    width:'35%',
    alignItems: 'center',
    justifyContent: 'center'
    // height:100
    // marginEnd: 18
  }
})