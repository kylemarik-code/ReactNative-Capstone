import { StyleSheet, View, ScrollView, Text, TextInput, Image, FlatList, Pressable, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createTable, saveMenuItems, removeTable, getMenuItems, filterData
} from '../database';

//to do: add debounce of 500ms to search query
//to do: Avatar doesn't update if user goes back vs. pressing home
//to do : avoid having to get avatar and name for placeholder from memory
//to do: abstract things to components
//to do: figure out how to beter use _layout, expo etc.

const API_URL =
    'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const sections = ['starters','mains','desserts','drinks','specials'];

const Item = ({title, price, description, imageURI}) => {
    return (
        <View style={styles.item}>
            <Image style={styles.menuImage} source={{uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${imageURI}?raw=true`}} />
            <Text style={styles.title}>{title}</Text>
            <Text numberOfLines={2} style={styles.description}>{description}</Text>
            <Text style={styles.price}>${price}</Text>
        </View>
    );
}

const listSeperator = () => {
    return(
        <View style={styles.seperator}> <Text> Why </Text> </View>
    );
}


const Home = ({navigation}) => {
    const firstRender = useRef(true);
    const [avatar, setAvatar] = useState('');
    const [userInits, setUserInits] = useState('')
    const [menuItems, setMenuItems] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [filters, setFilters] = useState([]);
    const [searchText, setSearchText] = useState('');

     const fetchData = async() => {
          try {
              const response = await fetch(API_URL);
              const json = await response.json();
              return json;
          } catch (e) {
              console.log(e);
          } finally {
              setLoading(false);
          }
        return [];
      }
      
  useEffect(() => {
      if (!firstRender.current) {
          (async() => {
              const newFilters = filters.length > 0 ? filters : sections;
              const newMenuItems = await filterData(searchText, newFilters);
              setMenuItems(newMenuItems);
          })();
      }
  }, [searchText, filters])

  useEffect(() => {
      firstRender.current = false;
    (async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();
        if (menuItems == undefined) {
          menuItems = await fetchData();
          saveMenuItems(menuItems);
          menuItems = await getMenuItems();
        }
        setMenuItems(menuItems);
      } catch (e) {
        console.log(e.message);
      }
    })();
    setFromMemory();
  }, []);
    
    const setFromMemory = async () => {
        try {
            const result1 = await AsyncStorage.getItem('userAvatar');
            const result2 = await AsyncStorage.getItem('userInits');
            if (result1 !== null) {
                setAvatar(JSON.parse(result1));
            }
            if (result2 !== null) {
                setUserInits(JSON.parse(result2));
            }
        } catch (e: any) {
            console.log(e.message);
        }
    }

    const onFilterChange = (item) => {
        const index = filters.indexOf(item);
        const newFilters = [...filters];
        if (index !== -1) {
            newFilters.splice(index, 1);
        } else {
            newFilters.push(item);
        }
        setFilters(newFilters);
    }

    return (
        <View style={styles.parent}>
        <View style={styles.subParent1}>
        <View style={styles.header}>
            <Pressable style={styles.backBtn}>
            </Pressable>
            <Image
                style={styles.logo}
                source={require('../assets/images/Logo.png')}
                resizeMode="contain"
            />
            <Pressable onPress={() => navigation.push("Profile")}>
                {avatar ? (<Image style={styles.avatarMini} source={{ uri: avatar }} />) : (<View style={styles.avatarPlaceholderMini}><Text style={styles.placeholderTextMini}>{userInits}</Text></View>)}
            </Pressable>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.hero}>
            <Image style={styles.heroImage} source={require('../assets/images/heroimage.png')} />
            <Text style={styles.heroHeader}>Little Lemon</Text>
            <Text style={styles.heroSubHeader}>Chicago</Text>
            <Text style={styles.heroText}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
            <View style={styles.searchBarContainer}>
                <Ionicons name="search" size={32} color="grey" />
                <TextInput
                    style={styles.searchBar}
                    onChangeText={setSearchText}
                    value={searchText}
                />
            </View>
        </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.filterBox}>
            <Text style={styles.filterHeader}>ORDER FOR DELIVERY!</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Pressable style={filters.indexOf("starters") == -1 ? styles.filterBtn : styles.filterBtnOn} onPress={() => onFilterChange("starters")}><Text style={styles.filterBtnText}>Starters</Text></Pressable>
            <Pressable style={filters.indexOf("mains") == -1 ? styles.filterBtn : styles.filterBtnOn} onPress={() => onFilterChange("mains")}><Text style={styles.filterBtnText}>Mains</Text></Pressable>
            <Pressable style={filters.indexOf("desserts") == -1 ? styles.filterBtn : styles.filterBtnOn} onPress={() => onFilterChange("desserts")}><Text style={styles.filterBtnText}>Desserts</Text></Pressable>
            <Pressable style={filters.indexOf("drinks") == -1 ? styles.filterBtn : styles.filterBtnOn} onPress={() => onFilterChange("drinks")}><Text style={styles.filterBtnText}>Drinks</Text></Pressable>
            <Pressable style={filters.indexOf("specials") == -1 ? styles.filterBtn : styles.filterBtnOn} onPress={() => onFilterChange("specials")}><Text style={styles.filterBtnText}>Specials</Text></Pressable>
            </ScrollView>
        </View>
        </TouchableWithoutFeedback>
        <View style={styles.seperator} />
        </View>
        <View style={styles.menuContainer}>
        <FlatList
            style={styles.menuList}
            data={menuItems}
            renderItem={({item}) => <Item title={item.title} price={item.price} description={item.description} imageURI={item.uri} />}
            keyExtractor={item => item.id}
        />
        </View>
        </View>
    );
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
    avatarMini: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginLeft: "auto",
    },
    avatarPlaceholderMini: {
        backgroundColor: "#3aa6a2",
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        marginLeft: "auto",
    },
    placeholderTextMini: {
        color: "#FFFFFF",
        fontFamily: "Karla",
        fontSize: 16,
        alignSelf: "center"
    },
    item: {
        height: 150,
        marginLeft: 20,
    },
    title: {
        fontFamily: "Karla",
        fontSize: 28,
        fontWeight: "bold"
    },
    price: {
        fontFmaily: "Karla",
        fontSize: 22,
        color: "grey",
    },
    description: {
        fontFamily: "Karla",
        fontSize: 16,
        color: "grey",
        width: "65%",
    },
    menuImage: {
        width: 100,
        height: 100,
        borderRadius: 16,
        position: "absolute",
        right: 20,
        top: "10%"
    },
    seperator: {
        height: 1,
        width: "85%",
        backgroundColor: "lightgrey",
        alignSelf: "center",
    },
    filterBox: {
        paddingLeft: 20,
        paddingBottom: 20,
    },
    filterHeader: {
        fontFamily: "Karla",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    filterBtn: {
        backgroundColor: "#cfcfcf",
        borderRadius: 16,
        padding: 10,
        marginRight: 10,
    },
    filterBtnOn: {
        backgroundColor: "#495E57",
        borderRadius: 16,
        padding: 10,
        marginRight: 10,
    },
    filterBtnText: {
        fontFamily: "Karla",
        fontSize: 18,
        color: "white",
    },
    hero: {
        backgroundColor: "#495E57",
        padding: 20,
    },
    heroHeader: {
        fontFamily: "Markazi",
        fontSize: 48,
        color: "#F4CE14",
    },
    heroSubHeader: {
        fontFamily: "Karla",
        fontSize: 32,
        color: "white",
    },
    heroText: {
        fontFamily: "Karla",
        fontSize: 18,
        color: "white",
        marginVertical: 10,
        width: "50%",
    },
    heroImage: {
        width: 150,
        height: 150,
        borderRadius: 16,
        position: "absolute",
        right: 20,
        top: 80,
    },
    searchBarContainer: {
        backgroundColor: "white",
        flexDirection: "row",
        width: "100%",
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 16,
        padding: 10,
    },
    searchBar: {
        width: "100%",
        marginLeft: 10,
    },
    menuContainer: {
        flexDirection: "column",
        flex: 1,
    },
    menuList: {
        height: 400,
    },
    parent: {
        flex: 1,
    }
});

export default Home;