import React from "react";
import notes from "../notes";
import Footer from "./Footer";
import Header from "./Header";
import Note from "./Note";

function App() {
  //HACK: check chrome console: console.log(notes);
  return (
    <div>
      <Header />
      {/* <Note /> */}
      {notes.map((noteItem) => (
        <Note
          key={noteItem.key}
          title={noteItem.title}
          content={noteItem.content}
        />
      ))}
      <Footer />
    </div>
  );
}

export default App;
