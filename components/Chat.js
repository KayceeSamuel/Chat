import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { StackRouter } from 'react-navigation';

import { AsyncStorage } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
require('firebase/firestore');


const firebase = initializeApp({
    apiKey: "AIzaSyDxmVC_Dvoi410sw-d2FB7CZwND0bXBJiM",
    authDomain: "chat-a86d0.firebaseapp.com",
    projectId: "chat-a86d0",
    storageBucket: "chat-a86d0.appspot.com",
    messagingSenderId: "791375142865",
    appId: "1:791375142865:web:e8ff11e6503cd9ade0caf0",
    measurementId: "G-R7D7CKT1BV"
});

const auth = getAuth(firebase);
onAuthStateChanged(auth, user => {

})


export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            uid: "",
            user: {
                _id: "",
                name: "",
                avatar: "",
            }

        };

       
    }

    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    componentDidMount() {
        //get user name
        const { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name ? name: "Anonymous" });

        //Check online status
        NetInfo.fetch().then(connectioin => {
            if (connectioin.isConnected) {
                console.log('online');
            } else {
                console.log('offline');
            }
        });

        // Add authentication
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
            this.setState({
                uid: user.uid,
                message: [],
            });
            this.unsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });
        

         //register for updates
         this.referenceMessages = firebase.firestore().collection("messages").where("uid", "==", this.state.uid);
         this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate)

        onCollectionUpdate = (querySnapshot) => {
            const messages = [];
            //go through each document
            querySnapshot.forEach((doc) => {
                // get the QueryDocumentSnapshot's data
                let data = doc.data();
                messages.push({
                   _id: data._id,
                   text: data.text,
                   createdAt: data.createdAt.toDate(),
                   user: data.user,
                   
                });
            });
            this.setState({
                messages,
            });
        };


        this.setState({
            messages: [
                {
                    _id: 1,
                    text: "Hello developer",
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: "React Native",
                        avatar: "https://placeimg.com/140/140/any",
                    },
                },
                {
                    _id: 2,
                    text: 'This is a system message',
                    createdAt: new Date(),
                    system: true,
                },
            ],
        });
    }

    // Adding messages to cloud storage
    addMessage() {
        const message = this.state.messages[0];
        this.referenceChatMessages.add({
            _id: message._id,
            uid: this.state.uid,
            createdAt: message.createdAt,
            text: message.text || '',
            user: message.user,
            image: message.image || '',
            location: message.location || null,
        })
    }

    onSend(messages = []) {
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.saveMessages();
        });
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#2d63d3'
                    },
                    left: {
                        backgroundColor: '#7e7e7e'
                    }
                }}
                textProps ={{
                    style: { color: 'white' }
                }}
                timeTextStyle={{
                    right: { color: '#f0f0f0' },
                    left: { color: '#f0f0f0' }
                }}
            />
        )
    }

    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
    } else {
        return(
            <InputToolbar
            {...props}
            />
        );
    }
}

    render() {
        return (
            <View style={{
                flex: 1
            }}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    onSend={(messages) => this.onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                />
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>

        );
    }

}

const styles = StyleSheet.create({

    giftedChat: {
        flex: 1,
        width: '8%',
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

