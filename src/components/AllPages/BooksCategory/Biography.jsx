import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Biography = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    // Fetch books for Biography category
    useEffect(() => {
        const fetchBiographyBooks = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.VITE_API_URL}/api/books/category/Biography?page=${currentPage}&limit=12`
                );
                const data = await response.json();

                if (data.success) {
                    setBooks(data.data.books);
                    setTotalPages(data.data.pagination.totalPages);
                } else {
                    setError('Failed to load biography books');
                }
            } catch (err) {
                setError('Failed to load biography books');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBiographyBooks();
    }, [currentPage]);

    // Book Card Component
    const BookCard = ({ book }) => (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group">
            <div className="relative overflow-hidden">
                <img
                    src={book.images.find(img => img.isPrimary)?.url || book.images[0]?.url}
                    alt={book.images.find(img => img.isPrimary)?.alt || book.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {book.format}
                </div>
                {book.stock > 0 && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        In Stock
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2 h-10">
                    {book.title}
                </h3>
                <p className="text-gray-600 text-xs mb-2">by {book.author}</p>

                <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gradient bg-gradient-to-r from-amber-600 to-orange-600">
                        ₹{book.price}
                    </span>
                    <div className="flex items-center">
                        <div className="flex text-yellow-400 text-xs">
                            {'★'.repeat(Math.floor(book.ratings.average) || 0)}
                            {'☆'.repeat(5 - Math.floor(book.ratings.average) || 5)}
                        </div>
                        <span className="text-gray-500 text-xs ml-1">({book.ratings.count})</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105">
                        Add to Cart
                    </button>
                    <button className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-300">
                        ♡
                    </button>
                </div>
            </div>
        </div>
    );

    // Pagination Component
    const Pagination = () => (
        <div className="flex justify-center items-center space-x-4 mt-12">
            <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${currentPage === 1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transform hover:scale-105'
                    }`}
            >
                Previous
            </button>

            <span className="text-gray-700 font-semibold">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${currentPage === totalPages
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transform hover:scale-105'
                    }`}
            >
                Next
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading inspiring biographies...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p className="text-xl mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-red-500 text-white py-20 px-4">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Biography
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90">
                        Lives That Inspire, Stories That Transform
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-white text-amber-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Back to Home
                        </button>
                        <button className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:bg-opacity-20 transition-all duration-300">
                            Filter by Person
                        </button>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 left-10 animate-bounce">
                    <div className="bg-white bg-opacity-20 rounded-full p-3">
                        <span className="text-2xl">📜</span>
                    </div>
                </div>
                <div className="absolute bottom-4 right-10 animate-bounce delay-75">
                    <div className="bg-white bg-opacity-20 rounded-full p-3">
                        <span className="text-2xl">⭐</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Extraordinary Lives, Inspiring Stories
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Discover the remarkable journeys of influential figures, from world leaders and
                        scientific pioneers to artists and activists who shaped our world.
                    </p>
                </div>

                {/* Books Count */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {books.length} Biography Books Found
                            </h3>
                            <p className="text-gray-600">Page {currentPage} of {totalPages}</p>
                        </div>
                        <div className="flex gap-4 mt-4 sm:mt-0">
                            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
                                <option>Sort by: Newest</option>
                                <option>Sort by: Price Low to High</option>
                                <option>Sort by: Price High to Low</option>
                                <option>Sort by: Rating</option>
                            </select>
                            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
                                <option>Category: All</option>
                                <option>Leaders</option>
                                <option>Scientists</option>
                                <option>Artists</option>
                                <option>Athletes</option>
                                <option>Entrepreneurs</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Books Grid */}
                {books.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                            {books.map((book) => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                        <Pagination />
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📖</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Books Found</h3>
                        <p className="text-gray-600 mb-6">We couldn't find any biography books at the moment.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
                        >
                            Browse Other Categories
                        </button>
                    </div>
                )}

                {/* Biography Types */}
                <div className="mt-16">
                    <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        Types of Biographies
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Political Leaders', 'Scientific Minds', 'Artistic Souls', 'Sports Legends', 'Business Titans', 'Historical Figures', 'Cultural Icons', 'Modern Heroes'].map((type) => (
                            <div
                                key={type}
                                className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 border-transparent hover:border-amber-500"
                            >
                                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-lg">
                                    {type.charAt(0)}
                                </div>
                                <h4 className="font-semibold text-gray-800">{type}</h4>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 text-center text-white mt-16 shadow-2xl">
                    <h2 className="text-3xl font-bold mb-4">
                        Inspired by Great Lives?
                    </h2>
                    <p className="text-xl mb-6 opacity-90">
                        Join our biography readers club and get recommendations based on your interests!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button className="bg-white text-amber-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                            Get Inspired
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12 mt-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold mb-4">Biography Collection</h3>
                    <p className="text-gray-400 mb-6">
                        Learning from those who made history - Inspire, Learn, and Grow
                    </p>
                    <div className="flex justify-center space-x-6 text-sm text-gray-400">
                        <span>© 2024 Crazy Deals Online</span>
                        <span>•</span>
                        <span>Privacy Policy</span>
                        <span>•</span>
                        <span>Terms of Service</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Biography;