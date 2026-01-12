interface SingleBookProps {
    bookDetails: {
        image?: string;
        title: string;
        author: string;
        commentary?: string;
        [key: string]: string | undefined;
    };
}

export default function SingleBook({ bookDetails }: SingleBookProps) {

    return (
        <div className="book-card">
            <img className="book-img" src={bookDetails?.image}></img>
            <div className="book-deets">
                <li>{bookDetails.title}</li>
                <li>{bookDetails.author}</li>
                <li>{bookDetails?.commentary}</li>
            </div>
        </div>
    )
}