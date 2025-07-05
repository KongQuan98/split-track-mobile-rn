import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useUser } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'
import { COLORS } from '../../constants/color'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TabsLayout = () => {
    const { user, isLoaded, isSignedIn } = useUser();

    if (!isLoaded) return null;
    if (!isSignedIn) {
        return <Redirect href="/sign-in" />
    }

    const insets = useSafeAreaInsets()

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.border,
                tabBarStyle: {
                    backgroundColor: COLORS.white,
                    height: 50 + insets.bottom,
                    paddingTop: 8,
                },
                headerShown: false
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: "",
                    tabBarIcon: ({color, size}) => <Feather name='home' size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name='inbox'
                options={{
                    title: "",
                    tabBarIcon: ({color, size}) => <Feather name='mail' size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name='camera'
                options={{
                    title: "",
                    tabBarIcon: ({color, size}) => <Feather name='camera' size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name='notification'
                options={{
                    title: "",
                    tabBarIcon: ({color, size}) => <Feather name='bell' size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: "",
                    tabBarIcon: ({color, size}) => <Feather name='user' size={size} color={color} />
                }}
            />
        </Tabs>
    )
}

export default TabsLayout