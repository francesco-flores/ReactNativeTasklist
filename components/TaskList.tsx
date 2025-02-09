import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Task from "./Task";
import { ITask } from "@/interfaces/ITask";
import { ThemedTextInput } from "./ThemeTextInput";

const TaskList = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [input, setInput] = useState("");
  const [requiredDays, setRequiredDays] = useState(0);

  useEffect(() => {
    loadTasks();
  }, []);

  const saveTasks = async (tasksToSave: ITask[]) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasksToSave));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const addTask = () => {
    if (input.trim() === "") return;
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + requiredDays);
    const newTask: ITask = {
      id: Date.now().toString(),
      text: input,
      isCompleted: false,
      date: deadlineDate.toISOString().split("T")[0],
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setInput("");
  };

  const toggleTaskCompletion = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.isCompleted } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        Task List
      </Text>
      <ThemedTextInput
        placeholder="Add a new Task..."
        value={input}
        onChangeText={setInput}
      />
      <ThemedTextInput
        placeholder="Required days..."
        value={requiredDays.toString()}
        onChangeText={(text: string) =>
          setRequiredDays(parseInt(text.replace(/[^0-9]/g, "")) || 0)
        }
        keyboardType="numeric"
      />
      <Button title="Add" onPress={addTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Task
            task={item}
            toggleCompletion={toggleTaskCompletion}
            deleteTask={deleteTask}
          />
        )}
      />
    </View>
  );
};

export default TaskList;
