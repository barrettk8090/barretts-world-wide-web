import './Reading.css'
import SingleBook from '../../components/SingleBook'

export interface Book {
    title: string,
    author: string,
    image?: string,
    currentlyReading: boolean,
    rating ?: number,
    commentary?: string,
    order?: number,
}

const books2025:Array<Book> = [
    { 
        title: "Wind and Truth",
        author : "Brandon Sanderson",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1724944713i/203578847._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "Children of Time",
        author : "Adrian Tchaikovsky",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1431014197i/25499718._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "I Who Have Never Known Men",
        author : "Jacqueline Harpman",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1649947133i/60811826._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "Book club read w/ my sister",
    },
    { 
        title: "All Systems Red, The Murderbot Diaries #1",
        author : "Martha Wells",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1631585309i/32758901._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "Artificial Condition, The Murderbot Diaries #2",
        author : "Martha Wells",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1505590203i/36223860._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "Rogue Protocol, The Murderbot Diaries #3",
        author : "Martha Wells",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1506001607i/35519101._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "Exit Strategy, The Murderbot Diaries #4",
        author : "Martha Wells",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1518642623i/35519109._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "Network Effect, The Murderbot Diaries #5",
        author : "Martha Wells",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1640597293i/52381770._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "Fugitive Telemetry, The Murderbot Diaries #6",
        author : "Martha Wells",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1731700666i/53205854._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "System Collapse, The Murderbot Diaries #7",
        author : "Martha Wells",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1674575978i/65211701._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "Dungeon Crawler Carl, DCC #1",
        author : "Matt Dinniman",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1715780755i/211721806._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "Carl's Doomsday Scenario, DCC #2",
        author : "Matt Dinniman",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1719949673i/212393364._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "The Dungeon Anarchist's Cookbook, DCC #3",
        author : "Matt Dinniman",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1719949594i/211721809._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "The Gate of the Feral Gods, DCC #4",
        author : "Matt Dinniman",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1734098514i/220772908._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "The Butcher's Masquerade, DCC #5",
        author : "Matt Dinniman",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1734098643i/220772913._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "The Eye of the Bedlam Bride, DCC #6",
        author : "Matt Dinniman",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1734098749i/220772912._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "This Inevitable Ruin, DCC #7",
        author : "Matt Dinniman",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1760789256i/232497556._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "The Only One Left",
        author : "Riley Sager",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1668181003i/62703226._SX600_.jpg",
        currentlyReading: false,
        rating : 4,
        commentary : "",
    },
    { 
        title: "The Fifth Season, The Broken Earth #1",
        author : "N.K Jemisin",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1386803701i/19161852._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "The Obelisk Gate, The Broken Earth #2",
        author : "N.K Jemisin",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1660867781i/26228034._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "The Stone Sky, The Broken Earth #3",
        author : "N.K Jemisin",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1478547421i/31817749._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "Stor of Your Life and Others",
        author : "Ted Chiang",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1478010711i/31625351._SX600_.jpg",
        currentlyReading: false,
        rating : 5,
        commentary : "",
    },
    { 
        title: "You Weren't Meant to be Human",
        author : "Andrew Joseph White",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1756129048i/224004327._SX600_.jpg",
        currentlyReading: false,
        rating : 4,
        commentary : "",
    },
]

const books2026:Array<Book> = [
    {
        title: "The Waste Lands, The Dark Tower #3",
        author: "Stephen King",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1554304745i/94767.jpg",
        currentlyReading: true,
        // rating: 5,
        commentary:"",
        order: 2, 
    },
    {
        title: "The Drawing of the Three, The Dark Tower #2",
        author: "Stephen King",
        image: "",
        currentlyReading: false,
        rating: 5,
        commentary: "I was hooting and hollering throughout. Also a much better pace than book 1.",
        order: 1, 
    },
    {
        title: "The Emperor of All Maladies: A Biography of Cancer",
        author: "Siddhartha Mukherjee",
        image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1280771091i/7170627.jpg",
        currentlyReading: true,
        // rating: 5,
        commentary:"Probably definitely will not finish this this year.",
        order: 0, 
    },
]

export default function Reading(){
    return(
        <>
        <h1>barretts little bookshelf:</h1>
        <p> insert pic of home book shelf </p>

        <p> 🚨 warning: i only read bangers and mostly rate everything 5 stars because i am unable to think critically</p>

        <h3>currently reading: </h3>
        {books2026.map((currentBook)=>
            currentBook.currentlyReading == true ? 
            <SingleBook key={currentBook.order} bookDetails={currentBook}/> : <></>
         )}

        <h3>read in 2026:</h3>
        {books2026.map((currentBook)=>
            <SingleBook key={currentBook.order} bookDetails={currentBook}/>
         )}

        <h3>read in 2025:</h3>
        {books2025.map((currentBook)=>
            <SingleBook key={currentBook.order} bookDetails={currentBook}/>
         )}
        <p>
            <strong>{books2025[0].title}</strong> by {books2025[0].author}
        </p>
        </>
    )
}