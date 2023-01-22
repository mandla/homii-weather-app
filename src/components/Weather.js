import React from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';
import { colors } from '../utils/utility';

const { PRIMARY_COLOR } = colors;

export default function Weather({ currentWeatherDetails }) {
    const {
        main: { temp },
        name } = currentWeatherDetails;

    return (
        <View style={styles.textContainer}>
            <View style={styles.topText}> 
                <Text style={styles.textColor}>{name}</Text>
            </View>
            <View style={styles.bottomText}> 
                <Text style={styles.textColor} >{temp}°</Text>
            </View>
            <Image style={styles.bottomImage} source={require('../../assets/sun-image.png')} />
        </View>
    );
}

const styles = StyleSheet.create({
    weatherInfo: {
        alignItems: 'center'
    },
    textColor: {
        fontSize: 40,
        color: PRIMARY_COLOR
    },
    textContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    topText: {
        position: 'absolute',
        top: '33%'
    },
    bottomText: {
        position: 'absolute',
        bottom: '33%'
    },
    bottomImage: {
        position: 'absolute',
        bottom: '13%',
        resizeMode: 'contain',
        height: 100,
        width: 100
    }
});
