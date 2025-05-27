import trollFace from "../assets/troll-face.png"
import React from "react"
export default function Header() {

    

    return (
        <header className="header">
            <img 
                src={trollFace} 
            />
            <h1>Meme Generator</h1>
        </header>
    )
}