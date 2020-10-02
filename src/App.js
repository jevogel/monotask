import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
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

const EditableItem = ({ item, moveItem, updateItem, deleteItem }) => {
  const [value, setValue] = useState(item.text);

  return (
    <View style={styles.item}>
      <View style={styles.btnGroup}>
        <IcoBtn
          name="up arrow"
          uri={uri.up}
          color="blue"
          onPress={(event) => moveItem(item, -1)}
        />
        <IcoBtn
          name="down arrow"
          uri={uri.down}
          color="green"
          onPress={(event) => moveItem(item, 1)}
        />
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          onChangeText={setValue}
          onBlur={(event) => updateItem(item)}
          value={value}
        />
      </View>
      <View style={styles.btnGroup}>
        <IcoBtn
          name="close"
          uri={uri.close}
          color="red"
          onPress={(event) => deleteItem(item)}
        />
      </View>
    </View>
  );
};

const ItemList = ({ items, moveItem, updateItem, deleteItem }) => {
  const renderItem = ({ item }) => {
    return (
      <EditableItem
        item={item}
        moveItem={moveItem}
        updateItem={updateItem}
        deleteItem={deleteItem}
      />
    );
  };
  return <FlatList data={items} renderItem={renderItem} />;
};

const ItemInput = ({ label, createItem }) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    createItem({ id: Date.now().toString(), text: value });
    setValue("");
  };

  return (
    <View style={styles.textInputContainer}>
      <TextInput
        style={[styles.textInput, styles.mainInput]}
        placeholder={`Add ${label}...`}
        blurOnSubmit={false}
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
        value={value}
      />
    </View>
  );
};

const H1 = ({ children, ...props }) => (
  <Text style={styles.h1} {...props}>
    {children}
  </Text>
);

const ScrollContainer = ({ style, children }) => (
  <ScrollView style={[styles.container, style]}>{children}</ScrollView>
)

const Row = ({ style, children }) => (
  <View style={[styles.row, style]}>{children}</View>
)

const Col = ({ style, children }) => (
  <View style={[styles.col, style]}>{children}</View>
)

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);

  const createTask = (task) => createItem(tasks, setTasks, task);
  const createNote = (note) => createItem(notes, setNotes, note);
  const createItem = (items, setItems, item) => {
    if (item.text) setItems([...items, item]);
  };

  const updateTask = (task) => updateItem(tasks, setTasks, task);
  const updateNote = (note) => updateItem(notes, setNotes, note);
  const updateItem = (items, setItems, item) => {
    const newItems = [...items];
    const idx = items.findIndex((x) => x.id === item.id);
    const newItem = {
      id: item.id,
      text: item.text
    };
    newItems[idx] = newItem;
    setItems(newItems);
  };

  const deleteTask = (task) => deleteItem(tasks, setTasks, task);
  const deleteNote = (note) => deleteItem(notes, setNotes, note);
  const deleteItem = (items, setItems, item) =>
    setItems(items.filter((x) => x.id !== item.id));

  const moveTask = (task) => moveItem(tasks, setTasks, task);
  const moveNote = (note) => moveItem(notes, setNotes, note);
  const moveItem = (items, setItems, item, dir) => {
    // console.log("move item")
    // console.log("items: ", items)
    // console.log("setItems: ", setItems)
    // console.log("item: ", item)
    // console.log("dir: ", dir)
    const idx = items.findIndex((x) => x.id === item.id);
    if ((idx === 0 && dir === -1) || (idx === items.length - 1 && dir === 1)) {
      return;
    }
    const newItems = [...items];
    const tmp = newItems[idx + dir];
    newItems[idx + dir] = newItems[idx];
    newItems[idx] = tmp;
    setItems(newItems);
  };

  return (
    <ScrollContainer>
      <Row>
        <Col>
          <H1>Tasks</H1>
          <View>
            <ItemInput label="a task" createItem={createTask} />
          </View>
          <ItemList
            items={tasks}
            moveItem={moveTask}
            updateItem={updateTask}
            deleteItem={deleteTask}
          />
        </Col>

        <Col>
          <H1>Notes</H1>
          <View>
            <ItemInput label="a note" createItem={createNote} />
          </View>
          <ItemList
            items={notes}
            moveItem={moveNote}
            updateItem={updateNote}
            deleteItem={deleteNote}
          />
        </Col>
      </Row>
    </ScrollContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  col: {
    flexShrink: 0,
    flexGrow: 1,
    minWidth: "20em",
    maxWidth: "45em"
  },
  h1: {
    fontWeight: "bold",
    fontSize: "2em",
    margin: 10,
    marginTop: 20,
    marginBottom: 5
  },
  textInputContainer: {
    flexGrow: 1,
    flexShrink: 1,
    margin: 10
  },
  textInput: {
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0)"
  },
  mainInput: {
    borderColor: "black"
  },
  item: {
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 10,
    marginTop: 5
  },
  btnGroup: {
    flex: 1,
    flexDirection: "row",
    flexShrink: 1,
    flexGrow: 0,
    justifyContent: "space-evenly",
    padding: 10,
    marginHorizontal: 15,
  },
  ico: {
    height: 20,
    padding: 10
  }
});

export default App;
