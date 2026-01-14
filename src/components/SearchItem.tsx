interface SingleQueryProp {
    query: string,
}

export default function SearchItem({ query }: SingleQueryProp){
    const googleBase: string = "https://www.google.com/search?q="
    const googleUrl: string = googleBase + query.split(" ").join("+")

    return(
        <span className="query-item">
            <a href={googleUrl} target="_blank" rel="noopener noreferrer">
            🔍 {query}
            </a>
        </span>
    )
}