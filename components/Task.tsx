import { ITask } from "@/interfaces/ITask";
import React from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";

interface TaskProps {
  task: ITask;
  toggleCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

const Task = ({ task, toggleCompletion, deleteTask }: TaskProps) => {
  const formattedDate = new Date(task.date).toLocaleDateString("it-IT");

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
      }}
    >
      <TouchableOpacity onPress={() => toggleCompletion(task.id)}>
        <Text style={{ textDecorationLine: task.completed ? "line-through" : "none" }}>
          {task.text} - Scadenza: {formattedDate}
        </Text>
      </TouchableOpacity>
      <Button title="❌" onPress={() => deleteTask(task.id)} />
    </View>
  );
};

export default Task;
