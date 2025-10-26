import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [booksByCategory, setBooksByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Categories to display with their routes
    const categories = [
        { name: 'History', route: '/collections/history' },
        { name: 'Science', route: '/collections/science' },
        { name: 'Kid Story', route: '/collections/kids' },
        { name: 'Fiction', route: '/collections/fiction' },
        { name: 'Biography', route: '/collections/biography' }
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
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group cursor-pointer"
            onClick={() => navigate(`/products/${book._id}`)}
        >
            <div className="relative overflow-hidden">
                <img
                    src={book.images.find(img => img.isPrimary)?.url || book.images[0]?.url}
                    alt={book.images.find(img => img.isPrimary)?.alt || book.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {book.format}
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2 h-10">
                    {book.title}
                </h3>
                <p className="text-gray-600 text-xs mb-2">by {book.author}</p>

                <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gradient bg-gradient-to-r from-blue-600 to-purple-600">
                        ₹{book.price}
                    </span>
                    <div className="flex items-center">
                        <div className="flex text-yellow-400 text-xs">
                            {'★'.repeat(5)}
                        </div>
                        <span className="text-gray-500 text-xs ml-1">({book.ratings.count})</span>
                    </div>
                </div>

                <button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation to book page
                        // Add to cart logic here
                        console.log('Add to cart:', book._id);
                    }}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );

    // Category Section Component
    const CategorySection = ({ category, books }) => (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {category.name} Books
                </h2>
                <button
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center"
                    onClick={() => navigate(category.route)}
                >
                    View All
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {books && books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <BookCard key={book._id} book={book} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No books found in this category
                </div>
            )}
        </section>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading amazing books...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-20 px-4">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-pulse">
                        Crazy Deals Online
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90">
                        Discover Your Next Favorite Book with Amazing Discounts!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            onClick={() => navigate('/collections/science')}
                        >
                            Shop Now
                        </button>
                        <button
                            className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:bg-opacity-20 transition-all duration-300"
                            onClick={() => {
                                // Scroll to categories section
                                document.getElementById('categories-section')?.scrollIntoView({
                                    behavior: 'smooth'
                                });
                            }}
                        >
                            Browse Categories
                        </button>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 left-10 animate-bounce">
                    <div className="bg-white bg-opacity-20 rounded-full p-3">
                        <span className="text-2xl">📚</span>
                    </div>
                </div>
                <div className="absolute bottom-4 right-10 animate-bounce delay-75">
                    <div className="bg-white bg-opacity-20 rounded-full p-3">
                        <span className="text-2xl">🔥</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Featured Categories */}
                <div className="text-center mb-16" id="categories-section">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Featured Categories
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Explore our vast collection of books across different genres.
                        From thrilling adventures to educational masterpieces, we have it all!
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-500"
                            onClick={() => navigate(category.route)}
                        >
                            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg">
                                {category.name.charAt(0)}
                            </div>
                            <h3 className="font-semibold text-gray-800">{category.name}</h3>
                            <p className="text-gray-500 text-sm mt-1">
                                {booksByCategory[category.name]?.length || 0} books
                            </p>
                        </div>
                    ))}
                </div>

                {/* Books by Category */}
                <div className="space-y-16">
                    {categories.map((category) => (
                        <CategorySection
                            key={category.name}
                            category={category}
                            books={booksByCategory[category.name]}
                        />
                    ))}
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-center text-white mt-16 shadow-2xl">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Start Reading?
                    </h2>
                    <p className="text-xl mb-6 opacity-90">
                        Join thousands of happy readers and discover your next adventure!
                    </p>
                    <button
                        className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                        onClick={() => navigate('/collections/science')}
                    >
                        Explore All Books
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12 mt-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold mb-4">Crazy Deals Online Bookstore</h3>
                    <p className="text-gray-400 mb-6">
                        Your one-stop destination for amazing book deals and literary adventures
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
                        <span>© 2024 Crazy Deals Online</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Privacy Policy</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Terms of Service</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;