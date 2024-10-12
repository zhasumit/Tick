import { useEffect, useRef, useState } from "react";
import Trash from "../icons/Trash";

const NoteCard = ({ note }) => {
    const [position, setPosition] = useState(JSON.parse(note.position));
    const colors = JSON.parse(note.colors);
    const body = JSON.parse(note.body);
    const textAreaRef = useRef(null);

    let startPosn = { x: 0, y: 0 };
    const cardRef = useRef(null);

    useEffect(() => {
        autoGrow(textAreaRef);
    }, []);

    const autoGrow = (textArea) => {
        const { current } = textAreaRef;
        current.style.height = "auto";
        current.style.height = `${current.scrollHeight}px`;
    };

    const mouseDown = (e) => {
        startPosn.x = e.clientX;
        startPosn.y = e.clientY;

        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
    };

    const mouseMove = (e) => {
        let mouseMoveDir = {
            x: startPosn.x - e.clientX,
            y: startPosn.y - e.clientY,
        };

        startPosn.x = e.clientX;
        startPosn.y = e.clientY;

        setPosition({
            x: cardRef.current.offsetLeft - mouseMoveDir.x,
            y: cardRef.current.offsetTop - mouseMoveDir.y,
        });
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
                ></textarea>
            </div>
        </div>
    );
};

export default NoteCard;
