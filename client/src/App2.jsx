import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import avatar from "./assets/avatar.png";

const App2 = () => {
    const socket = useMemo(
        () =>
            io("http://localhost:3000", {
                withCredentials: true,
            }),
        []
    );

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    // const [room, setRoom] = useState("");
    const [socketID, setSocketId] = useState("");
    const [roomName, setRoomName] = useState("");
    const [username, setUsername] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ message, roomName, username })
        if (!message || !roomName || !username) {
            return;
        }
        socket.emit("message", { message, roomName, username });
        setMessage("");
        setMessages((messages) => [...messages, { message, username }]);
    };

    const joinRoomHandler = (e) => {
        // e.preventDefault();
        setRoomName(e.target.value);
        console.log(roomName)
        socket.emit("join-room", roomName);
        setRoomName(roomName);
    };

    useEffect(() => {
        socket.on("connect", () => {
            setSocketId(socket.id);
            console.log("connected", socket.id);
        });

        socket.on("receive-message", (data) => {
            console.log(data);
            let { message, username } = data;
            setMessages((messages) => [...messages, { message, username }]);
        });

        socket.on("welcome", (s) => {
            console.log(s);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <> 
        <div className="max-w-md mx-auto ">

       
         
            <button className="btn" onClick={() => document.getElementById('my_modal_1').showModal()}>Join or Create room</button>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <input type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter Username"
                        className="input w-full max-w-xs"
                        required />
                    <input type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="Type here"
                        className="input w-full max-w-xs"
                        required />

                    <div className="modal-action">
                        <form method="dialog">

                            <button
                                onClick={joinRoomHandler}
                                className="btn">
                                Join Room</button>
                        </form>
                    </div>
                </div>
            </dialog>
            <div className="flex flex-row">

                <input type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter Message"
                    className="input input-bordered w-full max-w-xl" />
                <button
                    onClick={handleSubmit}
                    type="submit"
                    className="btn">Send</button>
            </div>




            {messages.map((data, i) => (
                <div key={i}>
                    <div className={data.username === username ? "chat chat-end" : "chat chat-start"}>
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <img alt="Tailwind CSS chat bubble component" src={avatar} />
                            </div>
                        </div>
                        <div className="chat-header">
                            {data.username}
                        </div>
                        <div className="chat-bubble">{data.message}</div>
                    </div>
                </div>
            ))}

        </div>

        </>
    );
};

export default App2;
