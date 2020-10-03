import React, { useState } from "react";
import {
  ScrollView,
  View,
  Image,
  TouchableHighlight,
  TextInput,
  FlatList,
  StyleSheet
} from "react-native";

const h = `data:image/svg+xml;utf8,`;
const uri = {
  up: `${h}<svg fill="none" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" d="M11.2929 7.29289C11.6834 6.90237 12.3166 6.90237 12.7071 7.29289L18.7071 13.2929C19.0976 13.6834 19.0976 14.3166 18.7071 14.7071C18.3166 15.0976 17.6834 15.0976 17.2929 14.7071L12 9.41421L6.70711 14.7071C6.31658 15.0976 5.68342 15.0976 5.29289 14.7071C4.90237 14.3166 4.90237 13.6834 5.29289 13.2929L11.2929 7.29289Z" fill="#282828"></path></svg>`,
  down: `${h}<svg fill="none" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z" fill="#282828"></path></svg>`,
  close: `${h}<svg fill="none" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#282828"></path></svg>`
};

const Ico = ({ name, uri, color }) => (
  <Image
    accessibilityLabel={`${name} icon`}
    style={[styles.ico, { tintColor: color }]}
    source={{ uri: uri }}
    resizeMode="contain"
  />
);

const IcoBtn = ({ onPress, color, ...props }) => {
  const [active, setActive] = useState(false);

  const handlePress = (event) => {
    setActive(true);
    onPress(event);
  };

  return (
    <TouchableHighlight
      underlayColor={color}
      onShowUnderlay={() => setActive(true)}
      onHideUnderlay={() => setActive(false)}
      onPress={onPress}
    >
      <Ico color={active ? "white" : color} {...props} />
    </TouchableHighlight>
  );
};

const EditableTask = ({ task, moveTask, updateTask, deleteTask }) => {
  const [value, setValue] = useState(task.text);

  return (
    <View style={[styles.g, styles.hbox]}>
      <View style={[styles.g, styles.hbox]}>
        <IcoBtn
          name="up arrow"
          uri={uri.up}
          color="blue"
          onPress={(event) => moveTask(task, -1)}
        />
        <IcoBtn
          name="down arrow"
          uri={uri.down}
          color="green"
          onPress={(event) => moveTask(task, 1)}
        />
      </View>
      <View style={[{ flex: 8, marginHorizontal: 10 }]}>
        <TextInput
          style={styles.g}
          onChangeText={setValue}
          onBlur={(event) => updateTask(task)}
          value={value}
        />
      </View>
      <View style={[styles.g, styles.hbox]}>
        <IcoBtn
          name="close"
          uri={uri.close}
          color="red"
          onPress={(event) => deleteTask(task)}
        />
      </View>
    </View>
  );
};

const TaskList = ({ tasks, moveTask, updateTask, deleteTask }) => {
  const renderTask = (task) => {
    return (
      <EditableTask
        key={task.id}
        task={task}
        moveTask={moveTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
    );
  };
  return (
    <FlatList
      style={styles.g}
      data={tasks}
      renderItem={({ item }) => renderTask(item)}
    />
  );
};

const TaskInput = ({ createTask }) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    createTask({ id: Date.now().toString(), text: value });
    setValue("");
  };

  return (
    <View style={styles.g}>
      <TextInput
        style={styles.g}
        placeholder="Add a task..."
        blurOnSubmit={false}
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
        value={value}
      />
    </View>
  );
};

const App = () => {
  const [tasks, setTasks] = useState([]);

  const createTask = (task) => {
    if (task.text) setTasks([...tasks, task]);
  };

  const updateTask = (task) => {
    const newTasks = [...tasks];
    const idx = tasks.findIndex((x) => x.id === task.id);
    const newTask = {
      id: task.id,
      text: task.text
    };
    newTasks[idx] = newTask;
    setTasks(newTasks);
  };

  const deleteTask = (task) => setTasks(tasks.filter((t) => t.id !== task.id));

  const moveTask = (task, dir) => {
    const idx = tasks.findIndex((x) => x.id === task.id);
    if ((idx === 0 && dir === -1) || (idx === tasks.length - 1 && dir === 1)) {
      return;
    }
    const newTasks = [...tasks];
    const tmp = newTasks[idx + dir];
    newTasks[idx + dir] = newTasks[idx];
    newTasks[idx] = tmp;
    setTasks(newTasks);
  };

  return (
    <ScrollView>
      <TaskList
        tasks={tasks}
        moveTask={moveTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />

      <View style={styles.g}>
        <TaskInput createTask={createTask} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  g: {
    padding: 3,
    margin: 3,
    borderWidth: StyleSheet.hairlineWidth
  },
  hbox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  vbox: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  },
  ico: {
    flex: 1,
    height: "1em",
    padding: 10
  }
});

export default App;
