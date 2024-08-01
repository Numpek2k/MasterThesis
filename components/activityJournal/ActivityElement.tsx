import {PropsWithChildren} from "react";
import {ActivityItem} from "@/interfaces/activityJournal";
import {Pressable, StyleSheet, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {ActivityLabels, PhysicalActivities} from "@/constants/physicalActivities";

type ActivityJournalProp = PropsWithChildren<{
  item: ActivityItem
  onDeleteJournalElement: () => void;
  showDeleteButton: boolean;
}>

export default function ActivityElement({
  item,
  onDeleteJournalElement,
  showDeleteButton
  }: ActivityJournalProp){

  return(
    <View style={styles.container}>
      <ThemedText style={{color:'black', marginBottom: 10, textTransform:'capitalize'}} type='subtitle' >{PhysicalActivities[item.type].label}</ThemedText>
      <View style={styles.itemsInRow}>
        <View style={styles.statsContainer}>
          <View style={styles.itemsInRow}>
            <View style={styles.activityDetail}>
              <ThemedText style={styles.activityText}>
                {ActivityLabels[item.type]}{"\n"}{item.amount}
              </ThemedText>
            </View>
            <View style={styles.activityDetail}>
              <ThemedText style={styles.activityText}>
                Punkty{"\n"}{item.points}
              </ThemedText>
            </View>
          </View>
          { showDeleteButton && (
            <View>
              <Pressable
                style={({pressed}) => [
                  {
                    backgroundColor: pressed ? 'white' : '#4656cd',
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
    // backgroundColor: '#4656cd',
  },
  activityDetail: {
    width: "50%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityText: {
    color: 'black',
    textAlign: 'center', // Ensure text is centered horizontally
  },
})