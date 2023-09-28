import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ToDoItem from "./ToDoItem";

function App() {
  const [inputText, setInputText] = useState("");
  const [items, setItems] = useState([]);

  function handleChange(event) {
    const newValue = event.target.value;
    setInputText(newValue);
  }

  function addItem() {
    setItems((prevItems) => {
      return [...prevItems, { id: uuidv4(), text: inputText }];
    });
    setInputText("");
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
      <div className="form">
        <input onChange={handleChange} type="text" value={inputText} />
        <button onClick={addItem}>
          <span>Add</span>
        </button>
      </div>
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
