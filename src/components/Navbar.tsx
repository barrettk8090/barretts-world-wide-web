import { Link } from "react-router-dom";

export default function Navbar(){

    return (
        <div>
            <h1><Link to="/">🌐 barrett's world wide web</Link></h1>
            <p>navigate what im doing:</p>
            <ul>
                <li><Link to="/photos">i'm taking photos</Link></li>
                <li><Link to="/fiction">i'm writing fiction</Link></li>
                <li><Link to="/blog">i'm writing personal stuff</Link></li>
                <li><Link to="/learning">i'm learning</Link></li>
                <li><Link to="/watching">i'm watching</Link></li>
                <li><Link to="/reading">i'm reading</Link></li>
                <li><Link to="/searching">i'm searching</Link></li>
                <li><a href="https://github.com/barrettk8090">i'm coding</a></li>
            </ul>
            <hr/>
        </div>
    );
}