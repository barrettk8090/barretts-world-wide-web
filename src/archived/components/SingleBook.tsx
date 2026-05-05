import type { Book } from '../pages/Reading/Reading';

interface SingleBookProps {
    bookDetails: Book;
}

function ratingToStars(rating: number): string {
    return '⭐'.repeat(rating);
}

export default function SingleBook({ bookDetails }: SingleBookProps) {

    return (
        <div className="book-card">
            <img className="book-img" src={bookDetails?.image}></img>
            <div className="book-deets">
                <p className="book-title">{bookDetails.title}</p>
                <p>{bookDetails.author}</p>
                {bookDetails.rating && (
                    <p className="book-rating">{ratingToStars(bookDetails.rating)}</p>
                )}
                {bookDetails.commentary ? (
                    <p className="commentary">{bookDetails.commentary}</p>
                ) : null}
            </div>
        </div>
    )
}