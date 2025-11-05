import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, ShoppingBag, ChevronLeft, ChevronRight, Star, Clock } from 'lucide-react';
import Footer from '../../Header/Footer';

const HomePage = () => {
    const [booksByCategory, setBooksByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);
    const navigate = useNavigate();

    // Categories to display with their routes and images
    const categories = [
        {
            name: 'Fiction',
            route: '/collections/fiction',
            image: 'https://i.postimg.cc/HLvRsJ6m/Fiction.png',
            color: 'bg-purple-200'
        },
        {
            name: 'Science',
            route: '/collections/science',
            image: 'https://i.postimg.cc/85F3F109/groovy-back-to-school-clipart-science-book-illustration-in-trendy-retro-y2k-style-png.png',
            color: 'bg-blue-200'
        },
        {
            name: 'History',
            route: '/collections/history',
            image: 'https://i.postimg.cc/nzs5sHP6/history.png',
            color: 'bg-yellow-100'
        },
        {
            name: 'Mystery',
            route: '/collections/mystery',
            image: 'https://i.postimg.cc/PxLcLtR0/pngtree-ancient-vintage-mystery-book-with-ornate-details-png-image-14657244.png',
            color: 'bg-pink-200'
        },
        {
            name: 'Romance',
            route: '/collections/romance',
            image: 'https://i.postimg.cc/9M4S4Wk0/romance.png',
            color: 'bg-pink-100'
        }
    ];

    const trendingBooks = [
        { id: 1, title: "When Famous Meets Fluffy", author: "Aisha", price: "₹12.99", image: 'bg-blue-200' },
        { id: 2, title: "Ikigai", author: "Héctor García & Francesc Miralles", price: "₹12.00", image: 'bg-cyan-200' },
        { id: 3, title: "Neverwhere", author: "Neil Gaiman", price: "₹10.00", image: 'bg-gray-800' },
        { id: 4, title: "The Order of Time", author: "Carlo Rovelli", price: "₹14.00", image: 'bg-purple-400' },
        { id: 5, title: "We Are Not Here", author: "Various", price: "₹20.00", image: 'bg-orange-200' },
    ];

    const audioBooks = [
        { id: 1, title: "The sky between you and me", author: "S. C. Lally", duration: "58 hrs 24 mins" },
        { id: 2, title: "Normal People", author: "Sally Rooney", duration: "4 hrs 13 mins" },
        { id: 3, title: "A way to success", author: "Alex Roberts", duration: "4 hrs 30 mins" },
        { id: 4, title: "The fact of a body", author: "Chris McClean", duration: "11 hrs 08 mins" },
        { id: 5, title: "Harry potter", author: "J.K. Rowling", duration: "54 hrs 08 mins" },
        { id: 6, title: "The Witch", author: "Susan Smith", duration: "14 hrs 28 mins" },
    ];

    const feedbacks = [
        {
            id: 1,
            text: "Bookish is a breath of fresh air in the digital reading space. The design is clean, organized, and makes browsing feel effortless. I especially love the seamless integration with various reading devices and the personalized recommendations.",
            author: "Aroma Kane",
            role: "Senior Consultant",
            rating: 5,
        },
        {
            id: 2,
            text: "I was instantly drawn to the elegance of Bookish. The interface is smooth, responsive, and intuitively designed. Whether searching through catalogs or checking the designer's selections, I don't need to figure out navigation.",
            author: "Fanny Osinski",
            role: "Brand Architect",
            rating: 5,
        },
    ];

    // Fetch books for each category
    useEffect(() => {
        const fetchBooksByCategory = async () => {
            try {
                setLoading(true);
                const categoryBooks = {};

                for (const category of categories) {
                    try {
                        const response = await fetch(
                            `${process.env.VITE_API_URL}/api/books/category/${category.name}?page=1&limit=8`
                        );
                        const data = await response.json();

                        if (data.success) {
                            categoryBooks[category.name] = data.data.books;
                        }
                    } catch (err) {
                        console.error(`Error fetching ${category.name} books:`, err);
                    }
                }

                setBooksByCategory(categoryBooks);
            } catch (err) {
                setError('Failed to load books');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooksByCategory();
    }, []);

    // Book Card Component
    const BookCard = ({ book }) => (
        <div
            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/products/${book._id}`)}
        >
            <img
                src={book.images.find(img => img.isPrimary)?.url || book.images[0]?.url}
                alt={book.images.find(img => img.isPrimary)?.alt || book.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="font-bold text-navy mb-1 text-sm">{book.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{book.author}</p>
                <p className="font-bold text-navy mb-3">₹{book.price}</p>
                <button
                    className="w-full bg-navy text-white py-2 rounded text-sm font-medium hover:bg-opacity-90"
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('Add to cart:', book._id);
                    }}
                >
                    Add to bag
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="w-full bg-cream min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-navy mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading amazing books...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-cream min-h-screen flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-navy text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-cream overflow-x-hidden">
            {/* Hero Section */}
            <section className="flex items-center justify-between px-8 py-16 bg-cream">
                <div className="flex-1 pr-8">
                    <h1 className="text-5xl font-bold text-navy mb-4 leading-tight">Where every page begins a journey...</h1>
                    <p className="text-gray-600 mb-6 text-lg">A huge collection of ebook books based on new curiosity, by search answer, about your interest you want.</p>
                    <button
                        className="bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 mb-8"
                        onClick={() => navigate('/collections/fiction')}
                    >
                        Get a book →
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 bg-yellow-300 rounded-full border-2 border-white"></div>
                            ))}
                        </div>
                        <div>
                            <div className="font-bold text-navy">10K+</div>
                            <div className="text-sm text-gray-600">Happy Customers</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative">
                    <div className="bg-yellow-300 rounded-3xl p-12 relative z-10 min-h-96">
                        <div className="flex justify-center items-center h-full">
                            <div className="text-6xl">📖</div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 right-0 bg-white rounded-2xl p-6 shadow-lg w-72 z-20">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-navy mb-2">Norwegian Wood</h3>
                            <p className="text-sm text-gray-600 mb-4">Haruki Murakami - In a train to a futuristic present, Toru finds himself unraveling the mysterious workings of time and love.</p>
                            <p className="text-2xl font-bold text-navy mb-4">₹20.00</p>
                            <button className="w-full bg-navy text-white py-2 rounded-lg font-medium hover:bg-opacity-90">Add to bag</button>
                        </div>
                    </div>

                    <div className="absolute right-6 bottom-6 flex gap-3 z-30">
                        <button className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center hover:bg-opacity-90">
                            <ChevronLeft size={20} />
                        </button>
                        <button className="w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center hover:bg-opacity-90">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-navy">Featured Categories</h2>
                    <button
                        className="text-navy font-medium hover:underline"
                        onClick={() => navigate('/categories')}
                    >
                        All Categories →
                    </button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                    {categories.map(cat => (
                        <div
                            key={cat.name}
                            className={`${cat.color} rounded-2xl p-6 text-center cursor-pointer hover:shadow-lg transition flex flex-col items-center justify-center`}
                            onClick={() => navigate(cat.route)}
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-16 h-16 object-contain mb-2"
                            />
                            <p className="text-sm font-medium text-gray-800">{cat.name}</p>
                            <p className="text-gray-500 text-xs mt-1">
                                {booksByCategory[cat.name]?.length || 0} books
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trending Books */}
            <section className="px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-navy">Trending Books</h2>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                            <ChevronLeft size={18} />
                        </button>
                        <button className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center hover:bg-opacity-90">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-5 gap-6">
                    {trendingBooks.map(book => (
                        <div key={book.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                            <div className={`${book.image} h-48 flex items-center justify-center text-4xl`}></div>
                            <div className="p-4">
                                <h3 className="font-bold text-navy mb-1 text-sm">{book.title}</h3>
                                <p className="text-xs text-gray-600 mb-2">{book.author}</p>
                                <p className="font-bold text-navy mb-3">{book.price}</p>
                                <button className="w-full bg-navy text-white py-2 rounded text-sm font-medium hover:bg-opacity-90">Add to bag</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Audio Books */}
            <section className="px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-navy">Audio Books</h2>
                    <button className="text-navy font-medium hover:underline">
                        Show All →
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-8">
                    {audioBooks.map(book => (
                        <div key={book.id} className="flex gap-4 bg-white p-4 rounded-lg hover:shadow-lg transition">
                            <div className="w-20 h-20 bg-gray-300 rounded-lg flex-shrink-0"></div>
                            <div className="flex-1">
                                <h3 className="font-bold text-navy text-sm mb-1">{book.title}</h3>
                                <p className="text-xs text-gray-600 mb-2">{book.author}</p>
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Clock size={14} />
                                    {book.duration}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quote Section */}
            <section className="bg-black text-white px-8 py-12 my-12 rounded-2xl mx-8">
                <div className="max-w-4xl">
                    <p className="text-3xl font-bold italic text-center mb-4">
                        "I do believe something very magical can happen when you read a book."
                    </p>
                    <p className="text-center text-gray-400">— J.K. Rowling</p>
                </div>
            </section>

            {/* Promo Boxes */}
            <section className="px-8 py-12 grid grid-cols-3 gap-6">
                <div className="bg-teal-600 rounded-2xl p-8 text-white">
                    <h3 className="text-xl font-bold mb-2">New Publications</h3>
                    <p className="text-sm mb-4">Discover the latest releases</p>
                    <button className="text-white underline text-sm font-medium">Show more →</button>
                </div>
                <div className="bg-blue-900 rounded-2xl p-8 text-white">
                    <h3 className="text-xl font-bold mb-2">Sale on History books</h3>
                    <p className="text-sm mb-4">Enjoy special discounts</p>
                    <button className="text-white underline text-sm font-medium">Shop now →</button>
                </div>
                <div className="bg-red-400 rounded-2xl p-8 text-white">
                    <h3 className="text-xl font-bold mb-2">Top Rated</h3>
                    <p className="text-sm mb-4">Best sellers this week</p>
                    <button className="text-white underline text-sm font-medium">Browse →</button>
                </div>
            </section>

            {/* Customer Feedback */}
            <section className="px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-navy">Customer Feedback</h2>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                            <ChevronLeft size={18} />
                        </button>
                        <button className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center hover:bg-opacity-90">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    {feedbacks.map(feedback => (
                        <div key={feedback.id} className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
                            <div className="flex gap-1 mb-4">
                                {[...Array(feedback.rating)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6">{feedback.text}</p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                <div>
                                    <p className="font-bold text-navy text-sm">{feedback.author}</p>
                                    <p className="text-xs text-gray-600">{feedback.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Newsletter */}
            <section className="bg-purple-400 text-white px-8 py-16 rounded-2xl mx-8 mb-12">
                <div className="max-w-2xl">
                    <h2 className="text-4xl font-bold mb-4">Subscribe to our Newsletter</h2>
                    <p className="mb-6 text-purple-100">Get the latest news and offers from Bookish. We publish updates regularly on our blog and you can unsubscribe at any time.</p>
                    <div className="flex gap-4">
                        <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg text-black" />
                        <button className="bg-navy text-white px-8 py-3 rounded-lg font-medium hover:bg-opacity-90">Subscribe</button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HomePage;