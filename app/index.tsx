import Onboarding from "../Screens/Onboarding"
import Profile from "../Screens/Profile";
import Home from "../Screens/Home";
import Splasher from "../Screens/Splasher";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function Index() {
    const [isLoggedIn, onSetLogIn] = useState(false);
    const [isLoaded, onLoaded] = useState(false);
    const [initialRoute, setInitialRoute] = useState('Onboarding');

    //To do: Learn how to use expo router; migrate all navigation to Expo Router
    //To do: Learn how to use expo splashscreen; migrate all splash screen usage to Expo SplashScreen

    useEffect(() => {
        (async () => {
            try {
                const value = await AsyncStorage.getItem('loggedIn');
                if (value !== null) {
                    onSetLogIn(JSON.parse(value));
                    if (value) {
                        setInitialRoute('Home');
                    }
                }
            } catch (e: any) {
                console.log(e.message);
            } finally {
                onLoaded(true);
            }
        })();
    }, []);

    if (!isLoaded) {
        return (
            <Splasher />
        )
    }

  return (
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Home" component={Home} />
       </Stack.Navigator>
  );
}
