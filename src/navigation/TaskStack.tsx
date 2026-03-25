import React, { useEffect, useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AcceptedTasks from '../screens/AcceptedTask';
import CompletedTasks from '../screens/CompletedTask';
import MyTasks from '../screens/MyTask';
import { useBottomTabs } from '../navigation/BottomTabs';
import TaskDashboard from '../screens/Task';

export type TaskStackParamList = {
  TaskDashboard: undefined;
  MyTasks: undefined;
  AcceptedTasks: undefined;
  CompletedTasks: undefined;
};

const Stack = createNativeStackNavigator<TaskStackParamList>();

const TaskStack: React.FC = () => {
  const { pendingTaskRoute, setPendingTaskRoute } = useBottomTabs();

  const initialRouteName = useMemo<TaskStackParamList extends any ? keyof TaskStackParamList : never>(() => {
    if (pendingTaskRoute && pendingTaskRoute !== 'TaskDashboard') {
      return pendingTaskRoute;
    }
    return 'TaskDashboard';
  }, [pendingTaskRoute]);

  useEffect(() => {
    if (pendingTaskRoute) {
      setPendingTaskRoute(null);
    }
  }, [pendingTaskRoute, setPendingTaskRoute]);

  return (
    <Stack.Navigator
      key={initialRouteName}
      initialRouteName={initialRouteName}
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
