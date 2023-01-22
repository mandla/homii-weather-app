import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import * as Location from 'expo-location';
import Weather from './src/components/Weather'
import { colors } from './src/utils/utility'

const WEATHER_API_KEY = "b49c7e3e06eaa12a063660a08bbcb8c2";
const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";

export default function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [currentWeatherDetails, setCurrentWeatherDetails] = useState(null);
  const [unitsSystem, setUnitsSystem] = useState('metric')

  useEffect(() => {
    load();
  }, [unitsSystem]);

  async function load() {
    setCurrentWeatherDetails(null)
    setCurrentWeather(null)
    setErrorMessage(null)

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      // console.log(Location);
      if (status != "granted") {
        setErrorMessage("Please Grant Access To Use The App!");
        return;
      }
      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;
      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`;
      const response = await fetch(weatherUrl)
      const result = await response.json()


      if (response.ok) {
        setCurrentWeather(result.main.temp)
        setCurrentWeatherDetails(result)
      }
      else {
        setErrorMessage(result.message)
      }

    } catch (error) {
      setErrorMessage(error.message)
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
