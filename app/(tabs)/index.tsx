import { useState, useEffect } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { navigationRef } from '../../navigationRef';
import { useRouter } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function sendLocalNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Task Notification',
      body: 'Tap to open the task form!',
      data: { taskId: '123' }, // Example task id
    },
    trigger: null, // Show immediately
  });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Permission not granted for notifications!');
    return false;
  }
  return true;
}

export default function App() {
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    registerForNotificationsAsync();
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const taskId = response.notification.request.content.data?.taskId;
      console.log('Notification response received with taskId:', taskId);
      if (taskId){
        // @ts-ignore
        router.push('/task');
      }
    });
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Show In-App Notification"
        onPress={async () => {
          await sendLocalNotification();
        }}
      />
      {notification && (
        <View style={{ marginTop: 32, alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold' }}>Last Notification:</Text>
          <Text>Title: {notification.request.content.title}</Text>
          <Text>Body: {notification.request.content.body}</Text>
          <Text>Data: {JSON.stringify(notification.request.content.data)}</Text>
        </View>
      )}
    </View>
  );
}
