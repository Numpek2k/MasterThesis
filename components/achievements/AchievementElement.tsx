import {Image, StyleSheet, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {Achievement} from "@/interfaces/achievement";
import Ionicons from "@expo/vector-icons/Ionicons";

interface AchievementElementProps {
  item: Achievement;
}


export default function AchievementElement({item} : AchievementElementProps){

  if(!item.completed)
    return (
      <View style={[styles.container,{backgroundColor: 'grey'}]}>
        <Ionicons
          name={'lock-closed'}
          size={32}
          color={'white'}
        />
      </View>
    )

  return(
    <View style={styles.container}>
      <View style={styles.itemsInRow}>
        <View style={styles.logo}>
          <Image
            style={{width: "100%", height: "100%", resizeMode: "contain"}}
            source={require('@/assets/images/cup.png')}
            resizeMethod={"auto"}
          />
        </View>
        <View style={styles.statsContainer}>
          <ThemedText style={{color:'black'}}>{item.name}</ThemedText>
          <ThemedText style={{color:'black'}}>{item.description}</ThemedText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#002c8a',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#eef1ff',
    padding: 10,
  },
  itemsInRow: {
    flexDirection: 'row',
  },
  statsContainer: {
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputContainer: {
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
    textAlign: 'center',
  },
  logo: {
    width: '30%',
    height: 100
  }
})