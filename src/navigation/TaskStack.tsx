import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AcceptedTasks from '../screens/AcceptedTask';
import CompletedTasks from '../screens/CompletedTask';
import MyTasks from '../screens/MyTask';
import TaskDashboard from '../screens/Task';

export type TaskStackParamList = {
  TaskDashboard: undefined;
  MyTasks: undefined;
  AcceptedTasks: undefined;
  CompletedTasks: undefined;
};

const Stack = createNativeStackNavigator<TaskStackParamList>();

const TaskStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="TaskDashboard"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TaskDashboard" component={TaskDashboard} />
      <Stack.Screen name="MyTasks" component={MyTasks} />
      <Stack.Screen name="AcceptedTasks" component={AcceptedTasks} />
      <Stack.Screen name="CompletedTasks" component={CompletedTasks} />
    </Stack.Navigator>
  );
};

export default TaskStack;
