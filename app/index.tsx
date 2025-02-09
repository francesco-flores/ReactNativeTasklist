import { View } from "react-native";
import TaskList from "@/components/TaskList";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <TaskList />
    </View>
  );
}
