import { StyleSheet, Text, Image, View, TextInput, ScrollView, KeyboardAvoidingView, Pressable, Alert } from "react-native";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = ({navigation }) => {
	const [name, onChangeName] = useState('');
	const [email, onChangeEmail] = useState('');
	const [validName, onValidateName] = useState(false);
	const [validEmail, onValidateEmail] = useState(false);
	const [alertName, onAlertName] = useState(false);
	const [alertEmail, onAlertEmail] = useState(false);

	const validateName = (input: string) => {
		onAlertName(false);
		const matches = /^[a-zA-Z -]*$/.test(input);
		matches === true || input == '' ? onChangeName(input) : onAlertName(true);
		onValidateName(!(input.length == 0));
	}

	const validateEmail = (input: string) => {
		const matches = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(input);
		onValidateEmail(matches);
		onAlertEmail(!matches && input.length > 3);
		onChangeEmail(input);
	}

	const onSubmitForm = async () => {
		try {
			await AsyncStorage.setItem('loggedIn', 'true');
			await AsyncStorage.setItem('userFirstName', JSON.stringify(name));
			await AsyncStorage.setItem('userEmail', JSON.stringify(email));
		} catch (e:any) {
			console.log(e.message);
		} finally {
			navigation.replace('Home');
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Image 
					style={styles.logo}
					source={require('../assets/images/Logo.png')}
					resizeMode="contain"
				/>
			</View>
			<ScrollView
				contentContainerStyle={styles.form}
				keyboardDismissMode="on-drag"
			>
				<Text style={styles.headText}>Let us get to know you:</Text>
				<Text style={styles.labelText}>First Name</Text>
				<Text style={styles.alertText}> {alertName && "Name can only contain letters, spaces, or dashes"}</Text>
				<TextInput
					style={styles.textTaker}
					onChangeText={validateName}
					value={name}
				/>
				<Text style={styles.labelText}>Email</Text>
				<Text style={styles.alertText}> {alertEmail && "Must be a valid email"}</Text>
				<TextInput
					style={styles.textTaker}
					onChangeText={validateEmail}
					value={email}
				/>
			</ScrollView>
			<View style={styles.submitarea}>
				<Pressable
					style={({ pressed }) => [{ backgroundColor: pressed ? '#F4CE14' : '#ababab'}, validEmail && validName ? styles.btn : styles.disabled]}
					disabled={!(validName && validEmail)}
					onPress={onSubmitForm}
				>
					<Text style={styles.btnText}>Next</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
	},
	header: {
		height: 150,
		backgroundColor: "#E4E4E4",
		justifyContent: "center",
		paddingTop: 20,
	},
	logo: {
		alignSelf: "center",
		height: "100%",
		width: "80%"
	},
	form: {
		flex: 1,
		backgroundColor: "#495E57",
		justifyContent: "flex-end",
		paddingBottom: "10%"
	},
	submitarea: {
		flex: 0.15,
		flexShrink: 50,
		backgroundColor: "#E4E4E4",
		justifyContent: "center"
	},
	headText: {
		alignSelf: "center",
		fontSize: 28,
		marginBottom: "40%",
		fontFamily: "Karla",
		color: "#EDEFEE",
	},
	labelText: {
		alignSelf: "center",
		fontSize: 20,
		fontFamily: "Karla",
		color: "#EDEFEE",
	},
	textTaker: {
		width: "70%",
		alignSelf: "center",
		borderWidth: 2,
		borderRadius: 16,
		borderColor: "#686d75",
		paddingHorizontal: 15,
		paddingVertical: 10,
		marginBottom: "5%",
		marginTop: "3%",
		fontFamily: "Karla",
		color: "#EDEFEE",
	},
	btn: {
		borderRadius: 16,
		padding: 10,
		width: 100,
		alignSelf: "flex-end",
		marginRight: "10%",
	},
	disabled: {
		backgroundColor: "#c2c2c2",
		borderRadius: 16,
		padding: 10,
		width: 100,
		alignSelf: "flex-end",
		marginRight: "10%",
	},
	btnText: {
		fontSize: 20,
		alignSelf: "center",
		fontFamily: "Karla",
	},
	alertText: {
		color: "red",
		alignSelf: "center",
		fontFamily: "Karla"
	}
});


export default Onboarding;