import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ToDoItem from "./ToDoItem";
import InputArea from "./InputArea";

function App() {
  const [items, setItems] = useState([]);

  function addItem(inputText) {
    setItems((prevItems) => {
      return [...prevItems, { id: uuidv4(), text: inputText }];
    });
  }
  function onDelete(id) {
    console.log(id);
    setItems((prevItems) => {
      return prevItems.filter((item, index) => {
        // console.log(item);
        return item.id !== id;
      });
    });
  }
  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <InputArea onAdd={addItem} />
      <div>
        <ul>
          {items.map((todoItem, index) => (
            <ToDoItem
              key={index}
              id={todoItem.id}
              text={todoItem.text}
              onChecked={onDelete}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
