import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Task from "./Task";
import { ITask } from "@/interfaces/ITask";
import { ThemedTextInput } from "./ThemeTextInput";

const TaskList = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [input, setInput] = useState("");
  const [requiredDays, setRequiredDays] = useState(0);
  const colorScheme = useColorScheme();

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

  const textColor = colorScheme === "dark" ? "#FFFFFF" : "#000000";
  const placeholderTextColor = colorScheme === "dark" ? "#888888" : "#CCCCCC";

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10, color: textColor }}>
        Task List
      </Text>
      <ThemedTextInput
        placeholder="Add a new Task description..."
        value={input}
        onChangeText={setInput}
        placeholderTextColor={placeholderTextColor}
      />
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ marginRight: 10, color: textColor }}>Required days of work:</Text>
        <ThemedTextInput
          placeholder="0"
          value={requiredDays === 0 ? "" : requiredDays.toString()}
          onChangeText={(text: string) =>
            setRequiredDays(parseInt(text.replace(/[^0-9]/g, "")) || 0)
          }
          keyboardType="numeric"
          style={{ flex: 1 }}
          placeholderTextColor={placeholderTextColor}
        />
      </View>
      <Button title="Add task" onPress={addTask} />
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
        style={{ flex: 1 , marginTop: 20}}
      />
    </View>
  );
};

export default TaskList;
