import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";
import { RouteForm } from "./RouteForm";

const StackNavigator = stackNavigatorFactory();

export const MainStack = () => (
    <BaseNavigationContainer>
        <StackNavigator.Navigator
            initialRouteName="Route Optimizer"
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#2e6ddf",
                },
                headerTintColor: "white",
                headerShown: true,
            }}
        >
            <StackNavigator.Screen
                name="Route Optimizer"
                component={RouteForm}
            />
        </StackNavigator.Navigator>
    </BaseNavigationContainer>
);