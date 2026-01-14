import './Searching.css'
import SearchItem from '../../components/SearchItem'

export interface SearchQuery {
    query: string,
}

const queries: Array<SearchQuery> = [
    {
        query: "king k rool dk64"
    },
    {
        query: "gerran howell interview"
    },
    {
        query: "gerran howell young dracula"
    },
    {
        query: "connor storrie youtube"
    },
    {
        query: "fujifilm xt5"
    },
    {
        query: "fujifilm x100vi"
    },
    {
        query: "denver fire"
    },
    {
        query: "sourdough recipe"
    },
]

export default function Searching(){
    return(
        <>
            <h1>some things i have been googling <br/>(for your entertainment):</h1>
            <p>you can click on any these to experience what it was like for me to google them</p>
            <div className="search-container">
                {queries.map((singleQuery) => (
                    <SearchItem key={singleQuery.query} query={singleQuery.query} />
                ))}
            </div>
        </>
    )
}