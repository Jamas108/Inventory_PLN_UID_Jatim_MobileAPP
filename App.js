import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider, Text } from "native-base";
import Ionicons from "@expo/vector-icons/Ionicons";
// Import custom screens
import Home from "./screens/home";
import Barang from "./screens/barang";
import Profile from "./screens/profile";
import Splash from "./screens/splash";
import CreateBarang from "./screens/createbarang";
import Login from "./screens/login";
import Register from "./screens/register";
import Retur from "./screens/retur";
import CreateRetur from "./screens/createRetur";

// Navigator Declaration
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const noHead = { headerShown: false };

// Custom button for the middle tab
const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -25,
      justifyContent: "center",
      alignItems: "center",
      ...styles.shadow,
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#24a8e0",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

// Bottom Tabs Navigator
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
              iconName = "cube";
              break;
          }
          return (
            <Ionicons
              name={iconName}
              size={route.name === "Barang" ? 30 : 25}
              color={focused ? "#24a8e0" : color}
            />
          );
        },
        tabBarIconStyle: { marginTop: 0 }, // Kurangi margin agar teks lebih dekat ke ikon
        tabBarStyle: {
          alignSelf: "center",
          height: 90,
          width: "100%",
          borderRadius: 10,
          marginBottom: -5,
          borderTopWidth: 0,
          backgroundColor: '#fff',
        },
        tabBarLabel: ({ focused, color }) => {
          return (
            <Text
              color={focused ? "black" : color}
              alignSelf="center"
              mb={5}
            >
              {route.name}
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
              <Ionicons name="cube" size={30} color="white" />
              <Text alignSelf={"center"} style={styles.textIcon}>Barang</Text>
            </CustomTabBarButton>
          )
        }}
      />
      <Tab.Screen name="Profile" component={Profile} options={noHead} />
    </Tab.Navigator>
  );
};


// Main App component with Stack Navigator
const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={noHead}
          />
          <Stack.Screen
            name="Tabs"
            component={Tabs} 
            options={noHead} 
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={noHead}
          />
          <Stack.Screen
            name="CreateBarang"
            component={CreateBarang}
            options={noHead}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={noHead}
          />
           <Stack.Screen
            name="Retur"
            component={Retur}
            options={noHead}
          />
          <Stack.Screen
            name="CreateRetur"
            component={CreateRetur}
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
      height: 100,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  textIcon: {
    marginTop: 5,
    color: 'white',
  },
});
