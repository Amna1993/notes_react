import React, { useEffect, useState } from 'react';
import './styles.css';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [noteIndex, setNoteIndex] = useState(1);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem('notes'));
    if (storedNotes) {
      setNotes(storedNotes);
      setNoteIndex(storedNotes.length + 1);
    }
  }, []);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const addNote = () => {
    if (title.trim() !== '' && text.trim() !== '') {
      const note = {
        index: noteIndex,
        title: title,
        text: text,
        color: getRandomColor()
      };

      const newNotes = [...notes, note];
      setNotes(newNotes);
      localStorage.setItem('notes', JSON.stringify(newNotes));

      setTitle('');
      setText('');
      setNoteIndex(noteIndex + 1);
    } else {
      alert('Please enter both title and notes before adding.');
    }
  };

  const editNote = (index) => {
    const noteToEdit = notes.find(note => note.index === index);
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setText(noteToEdit.text);

      if (window.confirm("Are you sure you want to update this note?")) {
        const updatedNotes = notes.map(note =>
          note.index === index ? { ...note, title: title, text: text } : note
        );
        setNotes(updatedNotes);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
      }
    } else {
      alert('Note not found for editing.');
    }
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter(note => note.index !== index);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const deleteAll = () => {
    if (window.confirm("Are you sure you want to delete all notes?")) {
      setNotes([]);
      localStorage.removeItem('notes');
    }
  };

  const searchNotes = () => {
    setSearchTerm(searchTerm.toLowerCase());
  };

  return (
    <div>
      <nav className="navbar">
        <div className="search-container">
          <h1><a href="/">Smart Notes</a></h1>
          <div className="search-box">
            <input
              type="text"
              id="search-input"
              className="search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="button" id="search-button" onClick={searchNotes}>Search</button>
          </div>
        </div>
      </nav>
      <div className="container">
        <form id="note-form" onSubmit={(e) => { e.preventDefault(); addNote(); }}>
          <h1>Add Notes</h1>
          <input
            type="text"
            id="add-title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            name="text"
            id="add-notes"
            placeholder="Notes"
            cols="30"
            rows="5"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <button type="button" className="add-btn" onClick={addNote}>Add Note</button>
        </form>

        <div id="notes-container" className="notes-container">
          <h1>Your Notes</h1>
          <button className="delete-all" onClick={deleteAll}>Delete All</button>
          {notes.filter(note =>
            note.title.toLowerCase().includes(searchTerm) || note.text.toLowerCase().includes(searchTerm)
          ).map(note => (
            <div className="note" style={{ backgroundColor: note.color }} key={note.index} data-index={note.index}>
              <div className="note-header">
                <h3>Note {note.index}</h3>
                <div className="note-buttons">
                  <button className="edit-button" onClick={() => editNote(note.index)}>Edit</button>
                  <button className="delete-button" onClick={() => deleteNote(note.index)}>Delete</button>
                </div>
              </div>
              <div className="title-notes">
                <h3>Title: {note.title}</h3>
                <p>Note: {note.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
