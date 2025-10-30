import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Star, Loader } from 'lucide-react';

const Category = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchBooks = useCallback(async (pageNum = 1, isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const response = await fetch(
                `${process.env.VITE_API_URL}/api/books?page=${pageNum}&limit=48&sort=createdAt&order=desc`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }

            const data = await response.json();

            if (data.success) {
                if (isLoadMore) {
                    setBooks(prevBooks => [...prevBooks, ...data.data.books]);
                } else {
                    setBooks(data.data.books || []);
                }

                // Check if there are more pages
                setHasMore(data.data.pagination?.hasNext || false);

                if (data.data.books?.length > 0) {
                    setPage(pageNum);
                }
            } else {
                throw new Error(data.message || 'Failed to load books');
            }
        } catch (err) {
            console.error('Books fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchBooks(1, false);
    }, [fetchBooks]);

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loadingMore || !hasMore) {
                return;
            }

            // Load more when near bottom
            if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.offsetHeight - 1000) {
                fetchBooks(page + 1, true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [page, loadingMore, hasMore, fetchBooks]);

    const renderStars = (rating) => {
        return (
            <div className="flex items-center justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-3 w-3 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    if (loading && books.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-20">
                        <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-xl text-gray-600">Loading amazing books...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && books.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-20 text-red-600">
                        <p className="text-xl mb-4">Error: {error}</p>
                        <button
                            onClick={() => fetchBooks(1, false)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Discover Amazing Books
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Browse through our collection of wonderful books. Scroll down to discover more!
                    </p>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
                    {books.map((book, index) => (
                        <div
                            key={`${book._id || book.id}-${index}`}
                            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                        >
                            <Link to={`/books/${book._id || book.id}`} className="block">
                                {/* Book Image Container */}
                                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl overflow-hidden relative">
                                    <img
                                        src={book.images?.[0]?.url || '/book-placeholder.png'}
                                        alt={book.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.src = '/book-placeholder.png';
                                        }}
                                    />

                                    {/* Featured Badge */}
                                    {book.featured && (
                                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                            Featured
                                        </div>
                                    )}

                                    {/* Discount Badge */}
                                    {book.originalPrice && book.originalPrice > book.price && (
                                        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                                            -{Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}%
                                        </div>
                                    )}
                                </div>

                                {/* Book Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors min-h-[3rem] text-sm leading-tight">
                                        {book.title}
                                    </h3>

                                    <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                                        by {book.author}
                                    </p>

                                    {/* Ratings */}
                                    {book.ratings && book.ratings.average > 0 && (
                                        <div className="flex items-center justify-center mb-3">
                                            {renderStars(book.ratings.average)}
                                            <span className="text-xs text-gray-500 ml-1">
                                                ({book.ratings.count})
                                            </span>
                                        </div>
                                    )}

                                    {/* Price */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg font-bold text-blue-600">
                                                ${book.price}
                                            </span>
                                            {book.originalPrice && book.originalPrice > book.price && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    ${book.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Format & Availability */}
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">
                                            {book.format}
                                        </span>
                                        {book.available === false && (
                                            <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full">
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Loading More Indicator */}
                {loadingMore && (
                    <div className="text-center py-8">
                        <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                        <p className="text-gray-600">Loading more books...</p>
                    </div>
                )}

                {/* End of Results */}
                {!hasMore && books.length > 0 && (
                    <div className="text-center py-8">
                        <div className="inline-block bg-white rounded-full px-6 py-3 shadow-lg">
                            <p className="text-gray-600 font-medium">
                                🎉 You've reached the end! {books.length} books loaded.
                            </p>
                        </div>
                    </div>
                )}

                {/* Error Loading More */}
                {error && books.length > 0 && (
                    <div className="text-center py-8">
                        <p className="text-red-600 mb-4">Error loading more books: {error}</p>
                        <button
                            onClick={() => fetchBooks(page + 1, true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Category;