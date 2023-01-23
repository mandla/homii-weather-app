import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, Accuracy } from 'expo-location';
import Weather from './src/components/Weather';
import { colors } from './src/utils/colors';
import { errorMessages } from './src/utils/errorMessages';
import { sentryLog } from './src/utils/sentryWrapper';

const REACT_APP_WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const REACT_APP_BASE_WEATHER_URL = process.env.REACT_APP_BASE_WEATHER_URL;

export default function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [currentWeatherDetails, setCurrentWeatherDetails] = useState(null);
  const [unitsSystem, setUnitsSystem] = useState('metric');

  useEffect(() => {
    load();
  }, [unitsSystem]);

  async function load() {
    setCurrentWeatherDetails(null);
    setCurrentWeather(null);
    setErrorMessage(null);

    try {
      let { status } = await requestForegroundPermissionsAsync();
      if (status != "granted") {
        setErrorMessage("Please Grant Access To Use The App!");
        return;
      }

      const location = await getCurrentPositionAsync({
        accuracy: Accuracy.Highest,
        maximumAge: 10000
      });

      const { latitude, longitude } = location.coords;
      const weatherJsonData = await fetch(`${REACT_APP_BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${REACT_APP_WEATHER_API_KEY}`)
        .then((response) => {
          if (!response.ok) {
            switch (response.status) {
              case 400: setErrorMessage(errorMessages.BAD_REQUEST); break;
              case 401: setErrorMessage(errorMessages.UNAUTHORISED); break;
              case 404: setErrorMessage(errorMessages.PAGE_NOT_FOUND); break;
              case 500: setErrorMessage(errorMessages.INTERNAL_SERVER_ERROR); break;
              default: return null;
            }
            return null;
          }
          return response.json()
        })
        .catch(error => {
          setErrorMessage(errorMessages.INTERNAL_SERVER_ERROR);
        })
        .then((data) => {
          console.log(data);
          return data;
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });


      if (weatherJsonData) {
        setCurrentWeather(weatherJsonData.main.temp);
        setCurrentWeatherDetails(weatherJsonData);
      }
      else {
        sentryLog.error(errorMessage);
      }

    } catch (error) {
      sentryLog.error(errorMessage);
    }
  }

  if (currentWeatherDetails) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <Weather currentWeather={currentWeather} currentWeatherDetails={currentWeatherDetails}></Weather>
        </View>
      </View>
    );
  }
  else if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
  else {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  main: {
    flex: 1,
    justifyContent: "center",
  }
});
