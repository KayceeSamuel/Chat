import React from 'react';
import { View, Text, Button, ImageBackground, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import bgImage from "../assetToUse/BackgroundImage.png"




export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: '' };
    }

    // Check for username
    onGoToChat = (name) => {
        if(name == '') {
            return Alert.alert('Please enter your name.');
        }
        this.props.navigation.navigate('Chat', {
            name: `${name}`,
        });
    };
    render() {

        return (
            <View style={styles.container}>
                <ImageBackground
                    source={bgImage}
                    resizeMode="cover"
                    style={styles.bgImage}
                >
                    <Text style={styles.h1}> Kaycee's Chat App</Text>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text}
                        placeholder='Your Name'
                    />
                    <Button
                        title="Start Chatting"
                        style={styles.btn}
                        onPress={() => this.onGoToChat(this.state.name)}
                    />
                </ImageBackground>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    box1: {
        backgroundColor: "#ffffff",
        flexGrow: 1,
        flexShrink: 0,
        width: "88%",
        marginBottom: 30,
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: 30,
        height: 260,
        minHeight: 260,
        maxHeight: 290,
        borderRadius: 20,
    },

    bgImage: {
        flex: 1,
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
    },

    h1: {
        flexGrow: 1,
        flexShrink: 1,
        fontWeight: "800",
        color: "transparent",
        paddingTop: 60,
    },

    inputField: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderWidth: 0.5,
        borderColor: "white",
        height: 50,
        borderRadius: 5,
        marginHorizontal: 10,
        marginVertical: 0,
    },

    input: {
        flex: 1,
        fontSize: 18,
        color: "#888",
    },

    btn: {
        flex: 1,
        backgroundColor: "#6705e9",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingVertical: 0,
        paddingHorizontal: 32,
        marginTop: 10,
        width: "90%",
        borderRadius: 5,
    },

    btnText: {
        fontSize: 16,
        marginTop: 0,
        marginBottom: 0,
        textAlign: "center",
        color: "#fff",
        textTransform: "uppercase",
        fontWeight: "bold",
    },

});