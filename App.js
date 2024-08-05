import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Center, NativeBaseProvider, Text } from "native-base";
import Ionicons from "@expo/vector-icons/Ionicons";
//custscreen
import Home from "./screens/home";
import Barang from "./screens/barang";
import Profile from "./screens/profile";
import Splash from "./screens/splash";
import CreateBarang from "./screens/createbarang";






// Navigator Declaration
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const noHead = { headerShown: false };

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: "center",
      alignItems: "center",
      ...styles.shadow
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#24a8e0"
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Profile":
              iconName = "person";
              break;
            case "Barang":
              iconName = "box";
              iconStyle = focused
                ? { color: "red", fontSize: 40 }
                : { color: "black", fontSize: 40 }; // Change styles here
              break;
          }
          return (
            <Ionicons
              name={iconName}
              size={28}
              color={focused ? "#24a8e0" : color}
            />
          );
        },
        tabBarIconStyle: { marginTop: 5 },
        tabBarStyle: {
          alignSelf: "center",
          height: 70,
          width: "95%",
          borderRadius: 10,
          marginBottom: 10,
          borderTopWidth: 0,
          backgroundColor: '#fff',
        },
        tabBarLabel: ({ children, color, focused }) => {
          return (
            <Text color={focused ? "black" : color} mb={2}>
              {children}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={noHead} />
      <Tab.Screen
        name="Barang"
        component={Barang}
        options={{
          headerShown: false,
          tabBarButton: (props) => (
            <CustomTabBarButton {...props}>
              <Ionicons name="cube" size={40} color="white" alignSelf="center" style={styles.bikeIcon} />
              <Text alignSelf={"center"} style={styles.textIcon}>Barang</Text>
            </CustomTabBarButton>
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile} options={noHead} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Tabs"
            component={Tabs} options={noHead} />
          {/* <Stack.Screen
            name="Login"
            component={Login}
            options={noHead}
          /> */}
          {/* <Stack.Screen
            name="Splash"
            component={Splash}
            options={noHead}
          /> */}
          <Stack.Screen
            name="CreateBarang"
            component={CreateBarang}
            options={noHead}
          />


        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#24a8e0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  bikeIcon: {
    marginTop: 15, // Adjust this value to change the vertical position of the icon
  },
  textIcon: {
    marginTop: 12,
    // Adjust this value to change the vertical position of the icon
  },
});
