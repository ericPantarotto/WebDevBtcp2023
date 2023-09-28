import React, { useState } from "react";
// import notes from "../notes";
import CreateArea from "./CreateArea";
import Footer from "./Footer";
import Header from "./Header";
import Note from "./Note";
//DEBUG: import { v4 as uuidv4 } from "uuid";
function App() {
  //HACK: check chrome console: console.log(notes);

  const [items, setItems] = useState([]);

  function addItem(inputText) {
    setItems((prevItems) => {
      return [...prevItems, inputText];
      // return [...prevItems, { id: uuidv4(), title: inputText.title, content: inputText.content }];
    });
  }

  function deleteItem(id) {
    setItems((prevItems) => {
      return prevItems.filter((item, index) => {
        // return item.id !== id;
        return index !== id;
      });
    });
  }

  return (
    <div>
      <Header />

      <CreateArea onAdd={addItem} />

      {items.map((noteItem, index) => (
        <Note
          key={index}
          id={index}
          // id={noteItem.id}
          title={noteItem.title}
          content={noteItem.content}
          onChecked={deleteItem}
        />
      ))}
      {/* <Note key={1} title="Note title" content="Note content" /> */}
      <Footer />
    </div>
  );
}

export default App;
