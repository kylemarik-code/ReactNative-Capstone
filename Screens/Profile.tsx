import { StyleSheet, Image, View, ScrollView, Text, TextInput, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

//to do: Fix app overlapping with status bar on all devices
//to do: move applicable items to seperate components (i.e. avatar/placeholder, checkbox)
//to do: move applicable functions to utils (i.e. validating names)
//to do: change initial setting of values to multiget, iterate over each, check if null or set
//to do: clean up repetitive stylesheet
//to do: fix phone alert being behind one change
//to do: fix children overlapping scrollview border
//to do: test sizing on other devices


const Profile = ({navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [alertFirstName, onAlertFirstName] = useState(false);
    const [lastName, setLastName] = useState('');
    const [alertLastName, onAlertLastName] = useState(false);
    const [email, setEmail] = useState('');
    const [alertEmail, onAlertEmail] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [alertPhoneNumber, onAlertPhoneNumber] = useState(false);
    const [phoneAlert, onPhoneAlert] = useState('');
    const [orderStatus, setOrderStatus] = useState(false);
    const [passwordChanges, setPasswordChanges] = useState(false);
    const [specialOffers, setSpecialOffers] = useState(false);
    const [newsletter, setNewsletter] = useState(false);
    const [avatar, setAvatar] = useState('');
    const [isAvatar, setIsAvatar] = useState(false);

    useEffect(() => {
        setFromMemory();
    },[]);

    const setFromMemory = async () => {
        try {
            const value = await AsyncStorage.multiGet(['userFirstName', 'userLastName', 'userEmail', 'userPhoneNumber', 'prefOrderStatus', 'prefPasswordChanges', 'prefSpecialOffers', 'prefNewsletter', 'userAvatar']);
            const setValues = value.map((val) => {
                if (val[1] == null) {
                    return '';
                } else {
                    return JSON.parse(val[1]);
                }
            })
            setFirstName(setValues[0]);
            setLastName(setValues[1]);
            setEmail(setValues[2]);
            setPhoneNumber(setValues[3]);
            setOrderStatus(setValues[4] == '' ? false : setValues[4]);
            setPasswordChanges(setValues[5] == '' ? false : setValues[5]);
            setSpecialOffers(setValues[6] == '' ? false : setValues[6]);
            setNewsletter(setValues[7] == '' ? false : setValues[7]);
            setAvatar(setValues[8]);
        } catch (e: any) {
            console.log(e.message);
        } 
    }

    const discardChanges = () => {
        Alert.alert('Discard changes?', 'Are you sure you want to discard your changes?', [
            {
                text: "Cancel"
            },
            {
                text: "Discard",
                onPress: () => {
                    setFromMemory();
                    Alert.alert("Changes discarded.");
                }
            }
        ], {cancelable: true})
    }

    const saveChanges = async () => {
        try {
            if (alertEmail || alertFirstName || alertLastName || alertPhoneNumber) {
                Alert.alert("Please fix all displayed errors before saving changes");
                return;
            }
            if (firstName.length == 0 || email.length == 0) {
                Alert.alert("You must have at minimum a first name and email set to save changes.");
                return;
            }
            const valuesToSet = []
            valuesToSet.push(['userFirstName', JSON.stringify(firstName)]);
            valuesToSet.push(['userLastName', JSON.stringify(lastName)]);
            valuesToSet.push(['userEmail', JSON.stringify(email)]);
            valuesToSet.push(['userPhoneNumber', JSON.stringify(phoneNumber)]);
            valuesToSet.push(['prefOrderStatus', JSON.stringify(orderStatus)]);
            valuesToSet.push(['prefPasswordChanges', JSON.stringify(passwordChanges)]);
            valuesToSet.push(['prefSpecialOffers', JSON.stringify(specialOffers)]);
            valuesToSet.push(['prefNewsletter', JSON.stringify(newsletter)]);
            valuesToSet.push(['userAvatar', JSON.stringify(avatar)]);
            valuesToSet.push(['userInits', JSON.stringify(firstName.substring(0,1) + lastName.substring(0,1))])
            await AsyncStorage.multiSet(valuesToSet);
            Alert.alert("Settings changed!");
        } catch (e: any) {
            console.log(e.message);
        }
    }

    const setNewAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync();

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
            setIsAvatar(true);
        }
    }

    const validateFirstName = (input: string) => {
        onAlertFirstName(false);
        const matches = /^[a-zA-Z -]*$/.test(input);
        matches === true || input == '' ? setFirstName(input) : onAlertFirstName(true);
    }

    const validateLastName = (input: string) => {
        onAlertLastName(false);
        const matches = /^[a-zA-Z -]*$/.test(input);
        matches === true || input == '' ? setLastName(input) : onAlertLastName(true);
    }

    const validateEmail = (input: string) => {
        const matches = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(input);
        onAlertEmail(!matches && input.length > 3);
        setEmail(input);
    }

    const validatePhoneNumber = (input: string) => {
        onPhoneAlert(input.length > 10 ? "Phone number should not be greater than 10 digits" : "");
        const matches = /^[0-9]*$/.test(input);
        matches === true || input == '' ? setPhoneNumber(input) : onPhoneAlert("Phone number should contain only numbers");
        onAlertPhoneNumber(phoneAlert == '' ? false : true);
    }

    const promptLogOut = () => {
        Alert.alert('Log out?', 'Are you sure you want to log out?', [
            {
                text: "Cancel"
            },
            {
                text: "Log out",
                onPress: logOut,
            },
        ], { cancelable: true })
    }

    const logOut = async () => {
        try {
            await AsyncStorage.multiRemove(['loggedIn', 'userFirstName', 'userLastName', 'userEmail', 'userPhoneNumber', 'prefOrderStatus', 'prefPasswordChanges', 'prefSpecialOffers', 'prefNewsletter', 'userAvatar']);
            setFromMemory();
            Alert.alert("You have been logged off.");
            navigation.replace("Onboarding");
        } catch (e: any) {
            console.log(e.message);
        }
    }

    return (
        <View>
            <View style={styles.header}>
                <Pressable style={styles.backBtn} onPress={() => navigation.goBack() }>
                    <Ionicons name="arrow-back" size={28} style={styles.backArrow} />
                </Pressable>
                <Image
                    style={styles.logo}
                    source={require('../assets/images/Logo.png')}
                    resizeMode="contain"
                />
                <Pressable onPress={() => navigation.push("Home")}>
                {avatar ? (<Image style={styles.avatarMini} source={{ uri: avatar }} />) : (<View style={styles.avatarPlaceholderMini}><Text style={styles.placeholderTextMini}>{firstName.substring(0, 1)}{lastName.substring(0, 1)}</Text></View>)}
                </Pressable>
            </View>
            <ScrollView style={styles.form} contentContainerStyle={{borderRadius: 5, overflow: "hidden"} } keyboardDismissMode="on-drag">
                <Text style={styles.topText}>Personal Information</Text>
                <Text style={styles.labelText}>Avatar</Text>
                <View style={styles.avatarArea}>
                    {avatar ? (<Image style={styles.avatar} source={{ uri: avatar }} />) : (<View style={styles.avatarPlaceholder}><Text style={styles.placeholderText}>{firstName.substring(0, 1)}{lastName.substring(0, 1)}</Text></View>)}
                    <Pressable
                        style={styles.footerBtn2}
                        onPress={setNewAvatar}
                    >
                        <Text style={styles.footerBtnText2}>Change</Text>
                    </Pressable>
                    <Pressable
                        style={styles.footerBtn1}
                        onPress={() => {
                            setAvatar('');
                            setIsAvatar(false);
                        }}
                    >
                        <Text style={styles.footerBtnText1}>Remove</Text>
                    </Pressable>
                </View>
                <Text style={styles.labelText}>First Name</Text>
                {alertFirstName && (<Text style={styles.alertText }>Invalid first name</Text>) }
                <TextInput
                    style={styles.inputter}
                    onChangeText={validateFirstName}
                    value={firstName}
                />
                <Text style={styles.labelText}>Last Name</Text>
                {alertLastName && (<Text style={styles.alertText}>Invalid last name</Text>)}
                <TextInput
                    style={styles.inputter}
                    onChangeText={validateLastName}
                    value={lastName}
                />
                <Text style={styles.labelText}>Email</Text>
                {alertEmail && (<Text style={styles.alertText}>Invalid email</Text>)}
                <TextInput
                    style={styles.inputter}
                    onChangeText={validateEmail}
                    value={email}
                />
                <Text style={styles.labelText}>Phone Number</Text>
                {alertPhoneNumber && (<Text style={styles.alertText}>{phoneAlert}</Text>)}
                <TextInput
                    style={styles.inputter}
                    onChangeText={validatePhoneNumber}
                    value={phoneNumber}
                />
                <Text style={styles.topText}>Email Notifications</Text>
                <Pressable
                    style={styles.checkBox}
                    onPress={() => {setOrderStatus(!orderStatus)}}
                >
                    <View style={orderStatus ? styles.checkerChecked : styles.checkerUnchecked}>
                        {orderStatus && (<Ionicons name="checkmark" size={32} style={styles.checkMark} />)}
                    </View>
                    <Text style={styles.checkLabel }>Order statuses</Text>
                </Pressable>
                <Pressable
                    style={styles.checkBox}
                    onPress={() => { setPasswordChanges(!passwordChanges) }}
                >
                    <View style={passwordChanges ? styles.checkerChecked : styles.checkerUnchecked}>
                        {passwordChanges && (<Ionicons name="checkmark" size={32} style={styles.checkMark} />)}
                    </View>
                    <Text style={styles.checkLabel}>Password changes</Text>
                </Pressable>
                <Pressable
                    style={styles.checkBox}
                    onPress={() => { setSpecialOffers(!specialOffers) }}
                >
                    <View style={specialOffers ? styles.checkerChecked : styles.checkerUnchecked}>
                        {specialOffers && (<Ionicons name="checkmark" size={32} style={styles.checkMark} />)}
                    </View>
                    <Text style={styles.checkLabel}>Special offers</Text>
                </Pressable>
                <Pressable
                    style={styles.checkBox}
                    onPress={() => { setNewsletter(!newsletter) }}
                >
                    <View style={newsletter ? styles.checkerChecked : styles.checkerUnchecked}>
                        {newsletter && (<Ionicons name="checkmark" size={32} style={styles.checkMark} />)}
                    </View>
                    <Text style={styles.checkLabel}>Newsletter</Text>
                </Pressable>
                <Pressable style={styles.logoutBtn} onPress={promptLogOut}><Text style={styles.logoutBtnText }>Log Out</Text></Pressable>
            </ScrollView>
            <View style={styles.footer}>
                <Pressable
                    style={styles.footerBtn1}
                    onPress={discardChanges}
                >
                    <Text style={styles.footerBtnText1}>Discard Changes</Text>
                </Pressable>
                <Pressable
                    style={styles.footerBtn2}
                    onPress={saveChanges}
                >
                    <Text style={styles.footerBtnText2}>Save Changes</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 120,
        padding: 30,
        paddingTop: 50,
        backgroundColor: "lightgray",
        flexDirection: "row",
        width: "100%",
    },
    backBtn: {
        width: 50,
        height: 50,
        backgroundColor: "#495E57",
        borderRadius: 25,
        justifyContent: "center"
    },
    backArrow: {
        color: "#FFFFFF",
        alignSelf: "center",
    },
    logo: {
        alignSelf: "center",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 10,
    },
    topText: {
        fontFamily: "Karla",
        fontSize: 24,
        marginBottom: 10,
    },
    labelText: {
        fontFamily: "Karla",
        color: "grey",
        fontSize: 18,
    },
    inputter: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 5,
    },
    checkBox: {
        flexDirection: "row",
        marginVertical: 5,
    },
    checkerUnchecked: {
        height: 40,
        width: 40,
        borderWidth: 2,
        borderColor: "#495E57",
        backgroundColor: "lightgrey",
        borderRadius: 8,
    },
    checkerChecked: {
        height: 40,
        width: 40,
        backgroundColor: "#495E57",
        borderRadius: 8,
        justifyContent: "center",
    },
    checkLabel: {
        alignSelf: "center",
        fontFamily: "Karla",
        fontSize: 18,
        marginLeft: 20,
    },
    checkMark: {
        color: "#FFFFFF",
        alignSelf: "center",
    },
    logoutBtn: {
        width: "80%",
        alignSelf: "center",
        backgroundColor: "#F4CE14",
        height: 40,
        justifyContent: "center",
        borderRadius: 16,
        marginTop: 10,
        marginBottom: 50,
        borderWidth: 2,
        borderColor: "brown",

    },
    logoutBtnText: {
        alignSelf: "center",
        fontFamily: "Karla",
        fontSize: 20,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    footerBtn1: {
        borderWidth: 1,
        borderRadius: 16,
        borderColor: "#495E57",
        padding: 10,
        marginHorizontal: 20,
        alignSelf: "center",
    },
    footerBtn2: {
        borderRadius: 16,
        backgroundColor: "#495E57",
        padding: 10,
        alignSelf: "center",
    },
    footerBtnText1: {
        fontFamily: "Karla",
        fontSize: 18,
        color: "#495E57"
    },
    footerBtnText2: {
        fontFamily: "Karla",
        fontSize: 18,
        color: "#FFFFFF"
    },
    avatar: {
        height: 100,
        width: 100,
        borderRadius: 50,
        marginRight: 20,
    },
    avatarMini: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginLeft: "auto",
    },
    avatarArea: {
        flexDirection: "row",
        marginTop: 5,
        marginBottom: 10,
    },
    avatarPlaceholder: {
        backgroundColor: "#3aa6a2",
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        marginRight: 20,
    },
    avatarPlaceholderMini: {
        backgroundColor: "#3aa6a2",
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        marginLeft: "auto",
    },
    placeholderText: {
        color: "#FFFFFF",
        fontFamily: "Karla",
        fontSize: 20,
        alignSelf: "center"
    },
    placeholderTextMini: {
        color: "#FFFFFF",
        fontFamily: "Karla",
        fontSize: 16,
        alignSelf: "center"
    },
    alertText: {
        fontFamily: "Karla",
        fontSize: 18,
        color: "red",
    },
    form: {
        width: "90%",
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#495E57",
        borderRadius: 16,
        padding: 10,
        marginTop: 10,
        height: "75%",
        overflow: "hidden",
    }
});

export default Profile;