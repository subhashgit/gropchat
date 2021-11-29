import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';

const admob = async() =>{
  let repeat;
  await AdMobInterstitial.setAdUnitID('ca-app-pub-3185366657620430/2304571503'); // Test ID, Replace with your-admob-unit-id
  await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});
  await AdMobInterstitial.showAdAsync();
  repeat = setTimeout(admob, 100000);    
}
  admob();

export default function App() {

  
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        
        <Navigation colorScheme={colorScheme} />
      
        <StatusBar />
      

      </SafeAreaProvider>
    );
  }
}
