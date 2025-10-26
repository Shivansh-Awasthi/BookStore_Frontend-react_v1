import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SingleBookPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    // Fetch single book by ID
    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.VITE_API_URL}/api/books/${id}`
                );
                const data = await response.json();

                if (data.success) {
                    setBook(data.data.book);
                } else {
                    setError('Book not found');
                }
            } catch (err) {
                setError('Failed to load book details');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBook();
        }
    }, [id]);

    // Calculate discount percentage
    const calculateDiscount = () => {
        if (!book || !book.originalPrice) return 0;
        return Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading book details...</p>
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "The book you're looking for doesn't exist."}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="hover:text-blue-600 transition-colors"
                    >
                        Home
                    </button>
                    <span>→</span>
                    <button
                        onClick={() => navigate(`/collections/${book.category.toLowerCase()}`)}
                        className="hover:text-blue-600 transition-colors capitalize"
                    >
                        {book.category}
                    </button>
                    <span>→</span>
                    <span className="text-gray-900 font-medium truncate">{book.title}</span>
                </nav>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="bg-gray-100 rounded-xl overflow-hidden">
                                <img
                                    src={book.images[selectedImage]?.url}
                                    alt={book.images[selectedImage]?.alt || book.title}
                                    className="w-full h-96 object-cover"
                                />
                            </div>

                            {/* Thumbnail Images */}
                            {book.images.length > 1 && (
                                <div className="flex space-x-4 overflow-x-auto pb-2">
                                    {book.images.map((image, index) => (
                                        <button
                                            key={image._id}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                                                }`}
                                        >
                                            <img
                                                src={image.url}
                                                alt={image.alt}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Book Details */}
                        <div className="space-y-6">
                            {/* Title and Author */}
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                    {book.title}
                                </h1>
                                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

                                {/* Ratings */}
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="flex text-yellow-400">
                                        {'★'.repeat(Math.floor(book.ratings.average) || 0)}
                                        {'☆'.repeat(5 - Math.floor(book.ratings.average) || 5)}
                                    </div>
                                    <span className="text-gray-500">
                                        ({book.ratings.count} review{book.ratings.count !== 1 ? 's' : ''})
                                    </span>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="flex items-center space-x-4">
                                <span className="text-3xl font-bold text-gray-900">
                                    ₹{book.price}
                                </span>
                                {book.originalPrice && book.originalPrice > book.price && (
                                    <>
                                        <span className="text-xl text-gray-500 line-through">
                                            ₹{book.originalPrice}
                                        </span>
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                                            {calculateDiscount()}% OFF
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${book.available && book.stock > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {book.available && book.stock > 0
                                    ? `✓ In Stock (${book.stock} available)`
                                    : '✗ Out of Stock'
                                }
                            </div>

                            {/* Key Details */}
                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                                <div>
                                    <span className="text-gray-600">Format:</span>
                                    <span className="ml-2 font-semibold">{book.format}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Publisher:</span>
                                    <span className="ml-2 font-semibold">{book.publisher}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Language:</span>
                                    <span className="ml-2 font-semibold">{book.language}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Pages:</span>
                                    <span className="ml-2 font-semibold">{book.details?.pages}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">ISBN:</span>
                                    <span className="ml-2 font-semibold">{book.details?.isbn}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Country:</span>
                                    <span className="ml-2 font-semibold">{book.details?.country}</span>
                                </div>
                            </div>

                            {/* Quantity and Actions */}
                            {book.available && book.stock > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-700 font-semibold">Quantity:</span>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center font-semibold">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            Max: {book.stock}
                                        </span>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                                            Add to Cart - ₹{(book.price * quantity).toFixed(2)}
                                        </button>
                                        <button className="w-12 h-12 border-2 border-gray-300 rounded-xl flex items-center justify-center hover:border-gray-400 transition-colors">
                                            <span className="text-xl">❤️</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Quick Info */}
                            <div className="bg-blue-50 rounded-xl p-4">
                                <div className="flex items-center space-x-4 text-sm text-gray-700">
                                    <div className="flex items-center space-x-1">
                                        <span>🚚</span>
                                        <span>Free delivery</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span>🔄</span>
                                        <span>7-day returns</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span>🛡️</span>
                                        <span>Secure payment</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information Tabs */}
                    <div className="border-t border-gray-200">
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* About Section */}
                                <div className="lg:col-span-2">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">About This Book</h3>
                                    <p className="text-gray-700 leading-relaxed">{book.about}</p>

                                    {/* Tags */}
                                    {book.tags && book.tags.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="font-semibold text-gray-900 mb-2">Tags:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {book.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Details */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">Book Details</h4>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Published:</span>
                                                <span className="font-medium">{formatDate(book.createdAt)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Last Updated:</span>
                                                <span className="font-medium">{formatDate(book.updatedAt)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Category:</span>
                                                <span className="font-medium capitalize">{book.category}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Format:</span>
                                                <span className="font-medium">{book.format}</span>
                                            </div>
                                            {book.featured && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Status:</span>
                                                    <span className="font-medium text-blue-600">Featured</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Share Section */}
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">Share This Book</h4>
                                        <div className="flex space-x-4">
                                            <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                                f
                                            </button>
                                            <button className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                                                t
                                            </button>
                                            <button className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                                                in
                                            </button>
                                            <button className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                                                wa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Books Call to Action */}
                <div className="mt-12 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Love this book? Explore more in {book.category}
                    </h3>
                    <button
                        onClick={() => navigate(`/category/${book.category}`)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                    >
                        Browse {book.category} Books
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SingleBookPage;