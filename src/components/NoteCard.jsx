import { useEffect, useRef, useState } from "react";
import Trash from "../icons/Trash";
import { autoGrow, moveCardUp, setNewOffset, bodyParser } from "../utils";

const NoteCard = ({ note }) => {
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
        startPosn.x = e.clientX;
        startPosn.y = e.clientY;

        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);

        moveCardUp(cardRef.current);
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
                <Trash />
            </div>
            <div className="card-body">
                <textarea
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
