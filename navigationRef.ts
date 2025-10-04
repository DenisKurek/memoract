import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
     console.log(`Navigating to ${name} with params:`, params);
    // @ts-ignore
    navigationRef.navigate(name, params);
  }
}
