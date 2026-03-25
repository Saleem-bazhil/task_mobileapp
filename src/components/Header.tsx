import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { useBottomTabs } from '../navigation/BottomTabs';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showBack, onBack }) => {
    const navigation = useNavigation();
    const { setActiveTab } = useBottomTabs();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            setActiveTab('Home');
        }
    };

    return (
        <View className="flex-row items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <View className="flex-1">
                {showBack && (
                    <Pressable
                        onPress={handleBack}
                        className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 active:scale-95"
                    >
                        <ArrowLeft size={20} color="#0F172A" />
                    </Pressable>
                )}
            </View>
            <View className="flex-[2] items-center">
                <Text className="text-center text-lg font-extrabold tracking-wide text-slate-900" numberOfLines={1}>
                    {title}
                </Text>
            </View>
            <View className="flex-1" />
        </View>
    );
};

export default Header;
