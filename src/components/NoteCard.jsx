import { useEffect, useRef, useState } from "react";
import { autoGrow, moveCardUp, setNewOffset, bodyParser } from "../utils";
import { db } from "../appwrite/databases";
import Spinner from "../icons/Spinner";
import DeleteButton from "./DeleteButton";

const NoteCard = ({ note, setNotes }) => {
    const [saving, setSaving] = useState(false);
    const keyUpTimer = useRef(null);

    const [position, setPosition] = useState(JSON.parse(note.position));
    const body = bodyParser(note.body);
    const colors = JSON.parse(note.colors);
    const textAreaRef = useRef(null);

    let startPosn = { x: 0, y: 0 };
    const cardRef = useRef(null);

    useEffect(() => {
        autoGrow(textAreaRef);
    }, []);

    const mouseDown = (e) => {
        if (e.target.className === "card-header") {
            startPosn.x = e.clientX;
            startPosn.y = e.clientY;

            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);

            moveCardUp(cardRef.current);
        }
    };

    const mouseMove = (e) => {
        let mouseMoveDir = {
            x: startPosn.x - e.clientX,
            y: startPosn.y - e.clientY,
        };

        startPosn.x = e.clientX;
        startPosn.y = e.clientY;

        const newPosition = setNewOffset(cardRef.current, mouseMoveDir);

        setPosition(newPosition);
    };

    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);

        const newPosition = setNewOffset(cardRef.current); //{x,y}
        saveData("position", newPosition);
    };

    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };
        try {
            await db.notes.update(note.$id, payload);
        } catch (error) {
            console.error(error);
        }
        setSaving(false);
    };

    const handleKeyUp = (e) => {
        setSaving(true); // start looking for changes

        // if some Timer Id is there in timeout (avoid multiple callings)
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }

        // Set timer to trigger save in 2 seconds
        keyUpTimer.current = setTimeout(() => {
            saveData("body", textAreaRef.current.value);
        }, 2000);
    };

    return (
        <div
            ref={cardRef}
            className="card"
            style={{
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            <div
                onMouseDown={mouseDown}
                className="card-header"
                style={{ backgroundColor: colors.colorHeader }}
            >
                <DeleteButton setNotes={setNotes} noteId={note.$id} />
                {saving && (
                    <div className="card-saving">
                        <Spinner color={colors.colorText} />
                        <span style={{ color: colors.colorText }}>
                            saving...
                        </span>
                    </div>
                )}
            </div>
            <div className="card-body">
                <textarea
                    onKeyUp={handleKeyUp}
                    ref={textAreaRef}
                    style={{ color: colors.colorText }}
                    defaultValue={body}
                    onInput={() => {
                        autoGrow(textAreaRef);
                    }}
                    onFocus={() => moveCardUp(cardRef.current)}
                ></textarea>
            </div>
        </div>
    );
};

export default NoteCard;
