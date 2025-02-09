import { ITask } from "@/interfaces/ITask";
import React from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import Card from "./Card";

interface TaskProps {
  task: ITask;
  toggleCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

const Task = ({ task, toggleCompletion, deleteTask }: TaskProps) => {
  const formattedDate = new Date(task.date).toLocaleDateString("it-IT");

  return (
    <Card>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => toggleCompletion(task.id)}>
          <Text
            style={{
              textDecorationLine: task.isCompleted ? "line-through" : "none",
            }}
          >
            {task.text} - Deadline: {formattedDate}
          </Text>
        </TouchableOpacity>
        <Button title="❌" onPress={() => deleteTask(task.id)} />
      </View>
    </Card>
  );
};

export default Task;
