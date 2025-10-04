import { useDB } from "@/hooks/local-db";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PawelTest() {
  const { getAllTasks } = useDB();
  const [randomTaskId, setRandomTaskId] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await getAllTasks();
      setRandomTaskId(tasks[0]?.id);
    };

    fetchTasks();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Link href={`/${randomTaskId}`}>Go to Task</Link>
    </SafeAreaView>
  );
}
