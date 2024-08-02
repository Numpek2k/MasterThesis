import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect, useState} from 'react';
import 'react-native-reanimated';
import {useColorScheme} from '@/hooks/useColorScheme';
import AnimatedMainView from "@/components/AnimatedMainView";
import FirstTimeUseSettings from "@/components/FirstTimeUseSettings";
import {StyleSheet} from "react-native";
import {getItemFor, storeData} from "@/helpers/storageHepler";
import * as LocalStorageKeys from "@/constants/localStorageConst";
import {store} from "expo-router/build/global-state/router-store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [hasLaunched, setHasLaunched] = useState(false);
  const [loaded] = useFonts({
    MinecraftRegular: require('../assets/fonts/F77MinecraftRegular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      const getData = async () => {
        const hasLaunched = await getItemFor(LocalStorageKeys.HAS_LAUNCHED);
        if(hasLaunched){
          setHasLaunched(true);
        }
        else {
          await storeData(LocalStorageKeys.HAS_LAUNCHED, "true");
          await storeData(LocalStorageKeys.USER_HEALTH, '100')
          await storeData(LocalStorageKeys.FIRST_LAUNCHED_DATE, new Date().toISOString().split('T')[0])
        }
      };

      getData().catch((error) => {console.log(error)})
    }

  }, [loaded]);

  if (!loaded) {
    return null;
  }


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedMainView
          headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>
      </AnimatedMainView>

      {hasLaunched ? null : <FirstTimeUseSettings/>}

      <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
  animated: {
    flex: 1,
  },
});
