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
                <p className="book-title">{bookDetails.title}</p>
                <p>{bookDetails.author}</p>
                {bookDetails.commentary ? (
                    <p className="commentary">{bookDetails.commentary}</p>
                ) : null}
            </div>
        </div>
    )
}