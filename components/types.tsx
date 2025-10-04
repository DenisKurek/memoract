import { Ionicons } from "@expo/vector-icons";

export const enum CompletionMethod {
    QR_CODE,
    LOCATION,
    PHOTO,
    FACE_ID
}

export interface Task {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    completionMethod: CompletionMethod;
}

export const getMethodIcon = (method:CompletionMethod) => {
  switch (method) {
    case CompletionMethod.QR_CODE:
        return <Ionicons name="qr-code-outline" size={24} color="#fff" />;
    case CompletionMethod.PHOTO:
      return <Ionicons name="camera-outline" size={24} color="#fff" />;
    case CompletionMethod.FACE_ID:
      return <Ionicons name="scan-outline" size={24} color="#fff" />;
    case CompletionMethod.LOCATION:
      return <Ionicons name="location-outline" size={24} color="#fff" />;
  }
};



export const TASKS: Task[] = [
    {
        id: '1',
        title: 'haircut',
        description: 'visit hairstylist',
        date: '2025-10-15',
        time: '17:00',
        completionMethod: CompletionMethod.PHOTO,
    },
    {
        id: '2',
        title: 'pick up Anna',
        description: 'pick up Anna from kindergarden',
        date: '2025-10-06',
        time: '13:20',
        completionMethod: CompletionMethod.FACE_ID,
    },
    {
        id: '4',
        title: 'haircut',
        description: 'visit hairstylist',
        date: '2025-10-15',
        time: '17:00',
        completionMethod: CompletionMethod.PHOTO,
    },
    {
        id: '5',
        title: 'pick up Anna',
        description: 'pick up Anna from kindergarden',
        date: '2025-10-06',
        time: '13:20',
        completionMethod: CompletionMethod.LOCATION,
    }, {
        id: '6',
        title: 'haircut',
        description: 'visit hairstylist',
        date: '2025-10-15',
        time: '17:00',
        completionMethod: CompletionMethod.QR_CODE,
    },
    {
        id: '7',
        title: 'pick up Anna',
        description: 'pick up Anna from kindergarden',
        date: '2025-10-06',
        time: '13:20',
        completionMethod: CompletionMethod.PHOTO,
    }, {
        id: '8',
        title: 'haircut',
        description: 'visit hairstylist',
        date: '2025-10-15',
        time: '17:00',
        completionMethod: CompletionMethod.QR_CODE,
    },
    {
        id: '9',
        title: 'pick up Anna',
        description: 'pick up Anna from kindergarden',
        date: '2025-10-06',
        time: '13:20',
        completionMethod: CompletionMethod.LOCATION
    }
];

