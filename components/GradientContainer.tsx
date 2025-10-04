import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

export default function GradientContainer({ children, }: { children: React.ReactNode }) {
    return (
        <LinearGradient
              colors={['#0f0c29', '#302b63', '#24243e']}
              style={styles.container}
            >
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 12,
    },});