import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function Main() {
    const memeRef = useRef(null);
    const [allMemes, setAllMemes] = useState([]);
    
    const [meme, setMeme] = useState({
        topText: "",
        bottomText: "",
        imgUrl: "http://i.imgflip.com/1bij.jpg",
        name: "One Does Not Simply", 
        fontSize: 40,
        textColor: "#ffffff",
        strokeColor: "#000000",
        strokeWidth: 2,
    });

    // --- YOUR CUSTOM MEME DATA (The "Meme Brain") ---
    const memeTopics = {
        "school": [
            { top: "Teacher: The test is easy", bottom: "The Test:" },
            { top: "Me in class", bottom: "Wondering if I locked the door" },
            { top: "Assignment due at 11:59pm", bottom: "Me at 11:58pm:" },
            { top: "When the smart kid", bottom: "Gets the answer wrong" }
        ],
        "relationships": [
            { top: "My crush:", bottom: "Hi" },
            { top: "Me explaining why", bottom: "I'm still single" },
            { top: "Her: He's probably thinking about other girls", bottom: "Him: How do magnets work?" },
            { top: "When you finally", bottom: "Get a text back" }
        ],
        "work": [
            { top: "My Boss:", bottom: "We need this done by 5pm" },
            { top: "Me at work", bottom: "Pretending to look busy" },
            { top: "Payday:", bottom: "Money gone in 5 seconds" },
            { top: "Email from Boss", bottom: "Marked as unread" }
        ],
        "gaming": [
            { top: "One more game", bottom: "3 AM later..." },
            { top: "Lag:", bottom: "My greatest enemy" },
            { top: "Me carrying the team", bottom: "My back hurts" },
            { top: "When you die", bottom: "But it was lag" }
        ],
        "life": [
            { top: "Adulting be like:", bottom: "I want a refund" },
            { top: "My brain at 3AM:", bottom: "Remember that awkward thing from 2012?" },
            { top: "Bank Account:", bottom: "$0.00" },
            { top: "Life Plans:", bottom: "Survival Mode" }
        ],
        "gym": [
            { top: "Day 1 of Gym:", bottom: "Where are my abs?" },
            { top: "Leg Day", bottom: "Walking is overrated" },
            { top: "My diet starts", bottom: "Tomorrow" },
            { top: "Protein shake:", bottom: "Tastes like chalk" }
        ],
        "internet": [
            { top: "WiFi drops by 1 bar", bottom: "YouTube: 144p" },
            { top: "Me on Instagram", bottom: "Vs Me in Real Life" },
            { top: "Google Search:", bottom: "Why am I tired?" },
            { top: "Incorrect Password", bottom: "Updated Password: New Password cannot be Old Password" }
        ]
    };

    // Helper to get random item from array
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => setAllMemes(data.data.memes));
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setMeme(prev => ({ ...prev, [name]: value }));
    }

    function getNewImage() {
        const random = Math.floor(Math.random() * allMemes.length);
        const newMeme = allMemes[random];
        setMeme(prev => ({
            ...prev,
            imgUrl: newMeme.url,
            name: newMeme.name,
            topText: "",
            bottomText: ""
        }));
    }

    // --- THE NEW "SMART" GENERATOR ---
    function generateSmartText() {
        const nameLower = meme.name.toLowerCase();
        let selectedTopic = [];

        // 1. Keyword Matching: Try to guess context based on Image Name
        if (nameLower.includes("cat") || nameLower.includes("dog")) {
            selectedTopic = memeTopics.life; // Animals usually fit "Life" or "Gym"
        } else if (nameLower.includes("kid") || nameLower.includes("baby")) {
            selectedTopic = memeTopics.school;
        } else if (nameLower.includes("money") || nameLower.includes("success")) {
            selectedTopic = memeTopics.work;
        } else if (nameLower.includes("brain") || nameLower.includes("think")) {
            selectedTopic = memeTopics.life;
        } else {
            // 2. Universal Fallback: Pick a random category if no keyword matches
            const keys = Object.keys(memeTopics);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            selectedTopic = memeTopics[randomKey];
        }

        // 3. Pick a random text from the selected topic
        const randomText = getRandom(selectedTopic);

        setMeme(prev => ({
            ...prev,
            topText: randomText.top,
            bottomText: randomText.bottom
        }));
    }

    const handleDownload = async () => {
        if (memeRef.current) {
            const canvas = await html2canvas(memeRef.current, {
                useCORS: true,
                backgroundColor: null
            });
            const link = document.createElement("a");
            link.download = `meme-${meme.name.replace(/\s/g, '-')}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        }
    };

    return (
        <main style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            
            <div className="form" style={{ display: "grid", gap: "15px", width: "100%", maxWidth: "500px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <input
                        type="text"
                        placeholder="Top Text"
                        className="form--input"
                        name="topText"
                        value={meme.topText}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        placeholder="Bottom Text"
                        className="form--input"
                        name="bottomText"
                        value={meme.bottomText}
                        onChange={handleChange}
                    />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f3f3f3", padding: "10px", borderRadius: "8px" }}>
                    <label style={{ fontSize: "12px", display: "flex", flexDirection: "column" }}>
                        Font Size
                        <input 
                            type="number" name="fontSize" value={meme.fontSize} onChange={handleChange} 
                            style={{ width: "50px" }}
                        />
                    </label>
                    <label style={{ fontSize: "12px", display: "flex", flexDirection: "column" }}>
                        Text Color
                        <input type="color" name="textColor" value={meme.textColor} onChange={handleChange} />
                    </label>
                    <label style={{ fontSize: "12px", display: "flex", flexDirection: "column" }}>
                        Border Color
                        <input type="color" name="strokeColor" value={meme.strokeColor} onChange={handleChange} />
                    </label>
                    <label style={{ fontSize: "12px", display: "flex", flexDirection: "column" }}>
                        Border Width
                        <input 
                            type="number" name="strokeWidth" value={meme.strokeWidth} onChange={handleChange} min="0" max="5" 
                            style={{ width: "40px" }}
                        />
                    </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <button 
                        onClick={getNewImage}
                        style={{ background: "linear-gradient(90deg, #672280 0%, #A626D3 100%)", color: "white", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer" }}
                    >
                        Get new Image 🖼
                    </button>
                    <button 
                        onClick={generateSmartText}
                        style={{ background: "#F2994A", color: "white", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                    >
                        🔥 Auto-Fill Text
                    </button>
                </div>
                <button 
                    onClick={handleDownload}
                    style={{ background: "#3498db", color: "white", border: "none", padding: "12px", borderRadius: "5px", cursor: "pointer", width: "100%", fontWeight: "bold" }}
                >
                    📥 Download Meme
                </button>
            </div>

            <div className="meme" ref={memeRef} style={{ position: "relative", marginTop: "20px", display: "inline-block" }}>
                <img 
                    src={meme.imgUrl} 
                    alt="Meme" 
                    crossOrigin="anonymous" 
                    style={{ maxWidth: "100%", borderRadius: "4px", display: "block" }} 
                />
                
                <h2 style={{
                    position: "absolute",
                    width: "80%",
                    textAlign: "center",
                    left: "50%",
                    transform: "translateX(-50%)",
                    margin: 0,
                    fontFamily: "Impact, sans-serif",
                    fontSize: `${meme.fontSize}px`,
                    color: meme.textColor,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    WebkitTextStroke: `${meme.strokeWidth}px ${meme.strokeColor}`,
                    textShadow: "2px 2px 0px rgba(0,0,0,0.2)",
                    top: "10px",
                    pointerEvents: "none"
                }}>
                    {meme.topText}
                </h2>

                <h2 style={{
                    position: "absolute",
                    width: "80%",
                    textAlign: "center",
                    left: "50%",
                    transform: "translateX(-50%)",
                    margin: 0,
                    fontFamily: "Impact, sans-serif",
                    fontSize: `${meme.fontSize}px`,
                    color: meme.textColor,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    WebkitTextStroke: `${meme.strokeWidth}px ${meme.strokeColor}`,
                    textShadow: "2px 2px 0px rgba(0,0,0,0.2)",
                    bottom: "10px",
                    pointerEvents: "none"
                }}>
                    {meme.bottomText}
                </h2>
            </div>
        </main>
    );
}