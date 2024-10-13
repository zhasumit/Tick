import React from "react";
import { useContext } from "react";
import { NoteContext } from "../context/NoteContext";
import { db } from "../appwrite/databases";

const Color = ({ color }) => {
    const { selectedNote, notes, setNotes } = useContext(NoteContext);
    const changeColor = () => {
        console.log("Selected color:", selectedNote);
        try {
            const currentNoteIndex = notes.findIndex(
                (note) => note.$id === selectedNote.$id
            );

            const updatedNote = {
                ...notes[currentNoteIndex],
                colors: JSON.stringify(color),
            };

            const newNotes = [...notes];
            newNotes[currentNoteIndex] = updatedNote;
            setNotes(newNotes);

            db.notes.update(selectedNote.$id, {
                colors: JSON.stringify(color),
            });
        } catch (error) {
            alert("No note selected!");
        }
    };

    return (
        <div
            className="color"
            onClick={changeColor}
            style={{ backgroundColor: color.colorHeader }}
        ></div>
    );
};

export default Color;
