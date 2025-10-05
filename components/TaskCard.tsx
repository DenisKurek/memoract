import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Task, CompletionMethodType } from "@/types/task-types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { format, parseISO } from "date-fns";

type TaskCardProps = {
  task: Task;
  onDelete: (task: Task) => void;
};
export default function TaskCard(props: TaskCardProps) {
  const { task, onDelete } = props;
  const router = useRouter();

  const handleCardPress = () => {
    router.push(`/${task.id}`);
  };

  return (
    <TouchableOpacity onPress={handleCardPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[
          "rgba(59,130,246,0.10)",
          "rgba(168,85,247,0.10)",
          "rgba(20,184,166,0.10)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{task.title}</Text>
            <Text style={styles.cardDesc}>{task.description}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDelete(task)}
          >
            <Ionicons name="trash-outline" size={16} color="rgb(252,165,165)" />
          </TouchableOpacity>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaBoxDate}>
            <Ionicons
              name="calendar-outline"
              size={16}
              style={styles.dateText}
            />
            <Text style={styles.dateText}>
              {task.datetime
                ? format(parseISO(task.datetime), "MMM dd, yyyy")
                : "No date"}
            </Text>
          </View>
          <View style={styles.metaBoxTime}>
            <Ionicons name="time-outline" size={16} style={styles.timeText} />
            <Text style={styles.timeText}>
              {task.datetime
                ? format(parseISO(task.datetime), "HH:mm")
                : "No time"}
            </Text>
          </View>
          <View style={styles.metaBoxCategory}>
            <Ionicons
              name={getMethodIcon(task.completionMethod)}
              size={16}
              style={styles.categoryText}
            ></Ionicons>
            <Text style={styles.categoryText}>{task.completionMethod}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export const getMethodIcon = (method: CompletionMethodType) => {
  switch (method) {
    case CompletionMethodType.QR_CODE:
      return "qr-code-outline";
    case CompletionMethodType.PHOTO:
      return "camera-outline";
    case CompletionMethodType.FACE_ID:
      return "scan-outline";
    case CompletionMethodType.GEOLOCATION:
      return "location-outline";
  }
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  card: {
    width: width - 64,
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "rgb(96,165,250,0.2)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 15,
    color: "#b6bfff",
    marginBottom: 2,
  },
  deleteBtn: {
    backgroundColor: "rgba(255, 0, 0, 0.08)",
    borderRadius: 16,
    padding: 12,
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 20,
    color: "#ff6b81",
  },
  metaRow: {
    flexDirection: "column",
    marginTop: 8,
    gap: 8,
  },
  metaBoxDate: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "rgb(20,184,166,0.1)",
    color: "rgb(94,234,212)",
    alignSelf: "flex-start",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  dateText: {
    color: "rgb(94,234,212)",
    marginRight: 8,
  },
  metaBoxTime: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "flex-start",
    backgroundColor: "background-color: rgb(59,130,246,0.1);",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  timeText: {
    color: "rgb(147,197,253)",
    marginRight: 8,
  },
  metaBoxCategory: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "flex-start",
    backgroundColor: "rgb(168,85,247,0.1);;",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  categoryText: {
    color: "rgb(233,213,255)",
    marginRight: 8,
  },
  metaIcon: {
    fontSize: 16,
    marginRight: 6,
    color: "#7bb7e6",
  },
  metaText: {
    fontSize: 15,
    color: "#7bb7e6",
  },
});
