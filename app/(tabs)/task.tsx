import { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useLocalSearchParams, usePathname } from 'expo-router';


export default function TaskPage() {
  const { taskId } = useLocalSearchParams();
  const [value, setValue] = useState('');

  const pathname = usePathname();
  console.log('Current route:', pathname);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#222' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#fff' }}>
        Task ID: {taskId}
      </Text>
      <Text style={{ marginBottom: 8, color: '#fff' }}>Simple Form:</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: '#aaa', borderRadius: 6, padding: 8, width: 200, marginBottom: 16, color: '#fff', backgroundColor: '#333' }}
        placeholder="Enter something..."
        placeholderTextColor="#ccc"
        value={value}
        onChangeText={setValue}
      />
      <Button title="Submit" onPress={() => alert(`Submitted: ${value}`)} />
    </View>
  );
}
