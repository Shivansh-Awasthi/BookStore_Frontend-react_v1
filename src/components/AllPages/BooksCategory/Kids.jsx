import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Kids = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    // Fetch books for Kids category
    useEffect(() => {
        const fetchKidsBooks = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.VITE_API_URL}/api/books/category/Kid%20Story?page=${currentPage}&limit=12`
                );
                const data = await response.json();

                if (data.success) {
                    setBooks(data.data.books);
                    setTotalPages(data.data.pagination.totalPages);
                } else {
                    setError('Failed to load kids books');
                }
            } catch (err) {
                setError('Failed to load kids books');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchKidsBooks();
    }, [currentPage]);

    // Book Card Component
    const BookCard = ({ book }) => (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-pink-100 overflow-hidden group">
            <div className="relative overflow-hidden">
                <img
                    src={book.images.find(img => img.isPrimary)?.url || book.images[0]?.url}
                    alt={book.images.find(img => img.isPrimary)?.alt || book.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {book.format}
                </div>
                {book.stock > 0 && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        In Stock
                    </div>
                )}
            </div>

            <div className="p-4 bg-gradient-to-b from-white to-pink-50">
                <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2 h-10">
                    {book.title}
                </h3>
                <p className="text-gray-600 text-xs mb-2">by {book.author}</p>

                <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gradient bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
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
                    <button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-2 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Add to Cart
                    </button>
                    <button className="px-3 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-xl transition-colors duration-300 text-lg">
                        ❤️
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
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${currentPage === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 shadow-lg'
                    }`}
            >
                ← Previous
            </button>

            <span className="text-gray-700 font-bold text-lg">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${currentPage === totalPages
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 shadow-lg'
                    }`}
            >
                Next →
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-bounce text-6xl mb-4">📚</div>
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg">Loading magical kids stories...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <div className="text-6xl mb-4">😢</div>
                    <p className="text-xl mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                {/* Floating shapes */}
                <div className="absolute top-10 left-10 animate-bounce">🎈</div>
                <div className="absolute top-20 right-20 animate-bounce delay-75">🎨</div>
                <div className="absolute bottom-10 left-20 animate-bounce delay-150">🧸</div>
                <div className="absolute bottom-20 right-10 animate-bounce delay-200">🚀</div>

                <div className="relative max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-yellow-300 drop-shadow-lg">
                        Kids Stories
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90 font-semibold">
                        Where Imagination Takes Flight! ✨
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-white text-pink-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Back to Home
                        </button>
                        <button className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105">
                            Age Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Magical Adventures Await!
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Discover enchanting stories, colorful illustrations, and unforgettable characters
                        that will spark your child's imagination and love for reading!
                    </p>
                </div>

                {/* Books Count */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-pink-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                🎉 {books.length} Fun Kids Books Found!
                            </h3>
                            <p className="text-gray-600">Page {currentPage} of {totalPages}</p>
                        </div>
                        <div className="flex gap-4 mt-4 sm:mt-0">
                            <select className="border-2 border-pink-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                                <option>Sort by: Newest</option>
                                <option>Sort by: Price Low to High</option>
                                <option>Sort by: Price High to Low</option>
                                <option>Sort by: Rating</option>
                                <option>Sort by: Age Group</option>
                            </select>
                            <select className="border-2 border-pink-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                                <option>Age: All Ages</option>
                                <option>0-3 years</option>
                                <option>4-6 years</option>
                                <option>7-9 years</option>
                                <option>10-12 years</option>
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
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Kids Books Found</h3>
                        <p className="text-gray-600 mb-6">We're adding more magical stories soon!</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                        >
                            Explore Other Categories
                        </button>
                    </div>
                )}

                {/* Age Groups */}
                <div className="mt-16">
                    <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        Perfect for Every Age 🎯
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { age: '0-3 Years', icon: '👶', color: 'from-blue-400 to-cyan-400' },
                            { age: '4-6 Years', icon: '🧒', color: 'from-green-400 to-emerald-400' },
                            { age: '7-9 Years', icon: '👧', color: 'from-yellow-400 to-orange-400' },
                            { age: '10-12 Years', icon: '👦', color: 'from-purple-400 to-pink-400' }
                        ].map((group) => (
                            <div
                                key={group.age}
                                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 border-transparent hover:border-pink-300"
                            >
                                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${group.color} rounded-2xl flex items-center justify-center text-white text-2xl`}>
                                    {group.icon}
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg">{group.age}</h4>
                                <p className="text-gray-500 text-sm mt-1">Perfect Stories</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-2xl p-8 text-center text-white mt-16 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-4 left-4 text-2xl">🌈</div>
                    <div className="absolute top-4 right-4 text-2xl">⭐</div>
                    <div className="absolute bottom-4 left-4 text-2xl">🎁</div>
                    <div className="absolute bottom-4 right-4 text-2xl">✨</div>

                    <h2 className="text-3xl font-bold mb-4 relative z-10">
                        Join Our Kids Club! 🎪
                    </h2>
                    <p className="text-xl mb-6 opacity-90 relative z-10">
                        Get monthly story boxes with books, activities, and surprises!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto relative z-10">
                        <input
                            type="email"
                            placeholder="Parent's email..."
                            className="flex-1 px-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300 border-2 border-transparent"
                        />
                        <button className="bg-white text-pink-600 px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                            Join Fun! 🎉
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-12 mt-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold mb-4">Kids Storyland 🏰</h3>
                    <p className="text-pink-100 mb-6 text-lg">
                        Where every story creates magical memories! ✨
                    </p>
                    <div className="flex justify-center space-x-6 text-sm text-pink-200">
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

export default Kids;