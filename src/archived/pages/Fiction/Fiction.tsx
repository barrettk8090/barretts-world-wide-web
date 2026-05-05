import './Fiction.css'
import bob from '../../assets/bob.jpg'

export default function Fiction(){
    return(
        <div className="fiction-container">
            <h1>This page is under construction!</h1>
            <p>Coming soon!</p>
            <img className="construction-image" src={bob} alt="Bob the Builder"/>
        </div>
    )
}