import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar(){
    const [openPhotos, setOpenPhotos] = useState(false)
    const [openWriting, setOpenWriting] = useState(false)
    const [openMisc, setOpenMisc] = useState(false)

    function togglePhotoMenu(){
        if (openPhotos) {
            setOpenPhotos(false)
        } else {
            setOpenPhotos(true)
            setOpenWriting(false)
            setOpenMisc(false)
        }
    }

    function toggleWritingMenu(){
        if (openWriting) {
            setOpenWriting(false)
        } else 
            setOpenWriting(true)
            setOpenPhotos(false)
            setOpenMisc(false)
    }

    function toggleMiscMenu(){
        if (openMisc) {
            setOpenMisc(false)
        } else {
            setOpenMisc(true)
            setOpenPhotos(false)
            setOpenWriting(false)
        }
    }


    return (
        <div>
            <h1><Link to="/">🌐 barrett's world wide web</Link></h1>
            <p>navigate what im doing:</p>
            <div>
                
                <span onClick={() => togglePhotoMenu()}>photos </span> 
            / 
                <span onClick={() => toggleWritingMenu()}> writing</span> /
                <span onClick={() => toggleMiscMenu()}> misc</span>

                { openPhotos ? 
                    <ul>
                            <li><Link to="/photos">photography</Link></li>
                            <li><Link to="/camera-roll">camera roll</Link></li>
                    </ul> : <></>
                }

                {
                    openWriting ?
                        <ul>
                            <li><Link to="/blog">blog</Link></li>
                            <li><Link to="/fiction">fiction</Link></li>
                            <li>developer content</li> 
                            <li><a href="https://github.com/barrettk8090">code</a></li>
                        </ul> : <></>
                }

                {
                    openMisc ? 
                    <ul>
                        <li><Link to="/learning">i'm learning</Link></li>
                        <li><Link to="/watching">i'm watching</Link></li>
                        <li><Link to="/reading">i'm reading</Link></li>
                        <li><Link to="/searching">i'm searching</Link></li>
                    </ul> : <></>
                } 

                <hr/>
            </div>
        </div>
    );
}