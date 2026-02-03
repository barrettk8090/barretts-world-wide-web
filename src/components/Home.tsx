import { useState } from "react"
import { Link } from "react-router-dom"
import Dreaming from "./Dreaming"

export default function Home() {
    const [openPhotos, setOpenPhotos] = useState(false)
    const [openWriting, setOpenWriting] = useState(false)
    const [openMisc, setOpenMisc] = useState(false)

    function toggleSection(section: 'photos' | 'writing' | 'misc') {
        if (section === 'photos') {
            setOpenPhotos(!openPhotos)
            setOpenWriting(false)
            setOpenMisc(false)
        } else if (section === 'writing') {
            setOpenWriting(!openWriting)
            setOpenPhotos(false)
            setOpenMisc(false)
        } else if (section === 'misc') {
            setOpenMisc(!openMisc)
            setOpenPhotos(false)
            setOpenWriting(false)
        }
    }

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>barrett kowalsky</h1>
                <p className="home-tagline">i am a guy doing a bunch of different stuff. based in denver, co.</p>
            </header>

            <nav className="home-nav">
                {/* Experience - Direct Link */}
                <div className="home-nav-item">
                    <Link to="/projects">
                        <h2 className="home-heading">experience</h2>
                    </Link>
                </div>

                {/* Photography - Expandable */}
                <div className="home-nav-item">
                    <h2 
                        className={`home-heading expandable ${openPhotos ? 'open' : ''}`}
                        onClick={() => toggleSection('photos')}
                    >
                        photography
                    </h2>
                    <div className={`home-submenu ${openPhotos ? 'open' : ''}`}>
                        <Link to="/photography">from a camera</Link>
                        <Link to="/camera-roll">from a phone</Link>
                    </div>
                </div>

                {/* Writing - Expandable */}
                <div className="home-nav-item">
                    <h2 
                        className={`home-heading expandable ${openWriting ? 'open' : ''}`}
                        onClick={() => toggleSection('writing')}
                    >
                        writing
                    </h2>
                    <div className={`home-submenu ${openWriting ? 'open' : ''}`}>
                        <Link to="/blog">blog</Link>
                        <Link to="/fiction">fiction</Link>
                        <Link to="/dev-content">developer content</Link>
                        <a href="https://github.com/barrettk8090" target="_blank" rel="noopener noreferrer">code</a>
                    </div>
                </div>

                {/* Misc - Expandable */}
                <div className="home-nav-item">
                    <h2 
                        className={`home-heading expandable ${openMisc ? 'open' : ''}`}
                        onClick={() => toggleSection('misc')}
                    >
                        misc
                    </h2>
                    <div className={`home-submenu ${openMisc ? 'open' : ''}`}>
                        {/* <Link to="/learning">i'm learning</Link> */}
                        <Link to="/watching">i'm watching</Link>
                        <Link to="/reading">i'm reading</Link>
                        <Link to="/searching">i'm searching</Link>
                    </div>
                </div>
            </nav>

            <Dreaming />
        </div>
    )
}