import {Pressable, StyleSheet, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {PropsWithChildren} from "react";
import {NutritionSimpleItem} from "@/interfaces/nutritionInfo";

type NutritionJournalProp = PropsWithChildren<{
  item: NutritionSimpleItem
  onDeleteJournalElement: () => void;
  showDeleteButton: boolean;
}>

export default function JournalElement({
  item,
  onDeleteJournalElement,
  showDeleteButton
  }: NutritionJournalProp){

  return(
    <View style={styles.container}>
      <ThemedText style={{color:'black', marginBottom: 10, textTransform:'capitalize'}} type='subtitle' >{item.name}</ThemedText>
      <ThemedText style={{color:'grey', marginBottom: 10}} type='subtitle' >{item.serving_size_g}g</ThemedText>
      <View style={styles.itemsInRow}>
        <View style={styles.statsContainer}>
          <View style={styles.itemsInRow}>
            <View style={{width:'25%'}}>
              <ThemedText style={{color:'black'}}>
                Kcal{"\n"}{item.calories}
              </ThemedText>
            </View>
            <View style={{width:'25%'}}>
              <ThemedText style={{color:'black'}}>
                Biał.{"\n"}{item.protein_g}
              </ThemedText>
            </View>

            <View style={{width:'25%'}}>
              <ThemedText style={{color:'black'}}>
                Tł.{"\n"}{item.fat_total_g}
              </ThemedText>
            </View>

            <View style={{width:'25%'}}>
              <ThemedText style={{color:'black'}}>
                Węgl.{"\n"}{item.carbohydrates_total_g}
              </ThemedText>
            </View>
          </View>
          { showDeleteButton && (
            <View>
              <Pressable
                style={({pressed}) => [
                  {
                    backgroundColor: pressed ? 'white' : '#323f93',
                  },
                  styles.button
                ]}
                onPress={() => {
                  onDeleteJournalElement()
                }}
              >
                <ThemedText style={{textAlign: 'center', marginHorizontal: 10}}>Usuń</ThemedText>
              </Pressable>
            </View>
          )}
        </View>
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
    width:'95%',
  },
  inputContainer:{
    width:'35%',
    alignItems: 'center',
    justifyContent: 'center'
    // height:100
    // marginEnd: 18
  },
  button: {
    marginTop: 10,
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#323f93',
  },
})