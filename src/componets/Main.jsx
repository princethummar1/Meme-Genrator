import React, { useEffect } from "react"

 export default function Main() {

    const [meme,setMeme] = React.useState({
        topText:"",
        bottomText:"",
        imgUrl :""
    })

    const [allMeme,setAllMeme] = React.useState([null])

    useEffect(()=>{
    fetch('https://api.imgflip.com/get_memes')
    .then(res => res.json())
    .then(  
        data => setAllMeme(data.data.memes)
    )
    },[])
    
    function handelChange(event){
        console.log("Changed!");
        const {name,value} = event.currentTarget
        setMeme((prevMeme)=>{
            return(
                {...meme
                ,[name]:value
                }
            )
        })
    }

    function imageChange(){
        setMeme((prev => {
            let random = Math.floor(Math.random()*100)
            console.log(random);
            return(
                {...meme,imgUrl:allMeme[random].url}
            )
        }))
    }

    return (
        <main>
            <div className="form">
                <label>Top Text
                    <input
                        type="text"
                        placeholder="One does not simply"
                        name="topText"
                        onChange={handelChange}
                        value={meme.topText}
                    />
                </label>

                <label>Bottom Text
                    <input
                        type="text"
                        placeholder="Walk into Mordor"
                        name="bottomText"
                        value={meme.bottomText}
                        onChange={handelChange}
                    />
                </label>
                <button onClick={imageChange}>Get a new meme image 🖼</button>
            </div>
            <div className="meme">
                <img src={meme.imgUrl} />
                <span className="top">{meme.topText}</span>
                <span className="bottom">{meme.bottomText}</span>
            </div>
        </main>
    )
}