import { View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import COLORS from "@/constants/color"

const SafeScreen = ({ children }) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={{ paddingTop: insets.top, flex:1, backgroundColor: COLORS }} >
            {children}
        </View>
    )
}

export default SafeScreen