import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
const Home = () => {
  const [weather, setWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const getUserPosition = async () => {
    Geolocation.getCurrentPosition(
      async position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const apiKey = '946b5843ec566e7cc686f471ae3f8331';
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`,
          );
          const data = await response.json();
          setWeather(data);
          console.log('Weather data:', data);
        } catch (error) {
          setErrorMsg('Error fetching weather data');
          console.log('Error fetching weather data', error);
        }
      },
      error => {
        setErrorMsg('Error fetching location');
        console.log('Error fetching location', error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{
            color: 'black',
            textAlign: 'center',
            marginTop: '20%',
            justifyContent: 'center',
            padding: 6,
            fontSize: 25,
            borderRadius: 5,
          }}>
          Chect the Weather
        </Text>
        <TouchableOpacity onPress={getUserPosition}>
          <Text
            style={{
              color: 'black',
              backgroundColor: 'yellow',
              width: '20%',
              textAlign: 'center',
              marginTop: '5%',
              marginBottom: '5%',
              justifyContent: 'center',
              padding: '2%',
              fontSize: 18,
              borderRadius: 5,
            }}>
            click me
          </Text>
        </TouchableOpacity>

        {weather && (
          <View
            style={{
              backgroundColor: '#ABE900',
              padding: '15%',
              borderRadius: 25,
            }}>
            <Text style={{color: 'black', fontSize: 18}}>
              Weather in {weather.name}
            </Text>
            <Text style={{color: 'black', fontSize: 18}}>
              Temperature: {(weather.main.temp - 273.15).toFixed(2)} °C
            </Text>
            <Text style={{color: 'black', fontSize: 18}}>
              Weather: {weather.weather[0].description}
            </Text>
            <Text style={{color: 'black', fontSize: 18}}>
              Humidity: {weather.main.humidity}%
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,

    alignContent: 'center',
    justifyContent: 'flex-start',
  },
});
export default Home;
