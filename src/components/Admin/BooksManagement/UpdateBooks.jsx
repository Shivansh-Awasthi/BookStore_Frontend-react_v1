import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateBooks = () => {
    const [formData, setFormData] = useState({
        title: '',
        publisher: '',
        language: 'English',
        price: '',
        originalPrice: '',
        about: '',
        format: 'Paperback',
        category: '',
        author: '',
        tags: '',
        stock: '',
        featured: false,
        // Book details
        isbn: '',
        pages: '',
        country: 'India',
        publicationDate: '',
    });
    const [images, setImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [user, setUser] = useState(null);
    const [authorized, setAuthorized] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    // Categories for dropdown
    const categories = [
        'Fiction', 'Non-Fiction', 'Science', 'Technology', 'Biography',
        'History', 'Self-Help', 'Business', 'Children', 'Young Adult',
        'Romance', 'Mystery', 'Thriller', 'Fantasy', 'Science Fiction',
        'Horror', 'Poetry', 'Drama', 'Cookbooks', 'Travel', 'Religion',
        'Art', 'Music', 'Education', 'Health', 'Sports'
    ];

    const formats = ['Paperback', 'Hardcover', 'E-book', 'Audiobook'];

    // Check if user is admin and fetch book data
    useEffect(() => {
        const checkAuthorizationAndFetchBook = async () => {
            try {
                const token = localStorage.getItem('token');
                const userData = localStorage.getItem('user');

                if (!token || !userData) {
                    setCheckingAuth(false);
                    return;
                }

                const user = JSON.parse(userData);
                setUser(user);

                // Verify user role with backend
                const userResponse = await fetch(`${process.env.VITE_API_URL}/api/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    if (userData.success && userData.data.user.role === 'ADMIN') {
                        setAuthorized(true);

                        // Fetch book data
                        await fetchBookData(token);
                    }
                }
            } catch (err) {
                console.error('Authorization check or book fetch failed:', err);
                setError('Failed to load book data');
            } finally {
                setCheckingAuth(false);
                setFetchLoading(false);
            }
        };

        const fetchBookData = async (token) => {
            try {
                const response = await fetch(`${process.env.VITE_API_URL}/api/books/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        const book = data.data.book;

                        // Format the data for the form
                        setFormData({
                            title: book.title || '',
                            publisher: book.publisher || '',
                            language: book.language || 'English',
                            price: book.price || '',
                            originalPrice: book.originalPrice || '',
                            about: book.about || '',
                            format: book.format || 'Paperback',
                            category: book.category || '',
                            author: book.author || '',
                            tags: book.tags ? book.tags.join(', ') : '',
                            stock: book.stock || '',
                            featured: book.featured || false,
                            isbn: book.details?.isbn || '',
                            pages: book.details?.pages || '',
                            country: book.details?.country || 'India',
                            publicationDate: book.details?.publicationDate ?
                                new Date(book.details.publicationDate).toISOString().split('T')[0] : '',
                        });

                        // Set existing images
                        if (book.images && book.images.length > 0) {
                            setImages(book.images);
                        }
                    } else {
                        setError('Book not found');
                    }
                } else {
                    setError('Failed to fetch book data');
                }
            } catch (err) {
                console.error('Error fetching book:', err);
                setError('Failed to load book data');
            }
        };

        checkAuthorizationAndFetchBook();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        setError('');
        setSuccess('');
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const imagePreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            alt: file.name,
            isPrimary: newImages.length === 0 && images.length === 0, // First image is primary if no existing images
            file: file,
            isNew: true // Mark as new image
        }));

        setNewImages(prev => [...prev, ...imagePreviews]);
    };

    const removeImage = (index, isNew = false) => {
        if (isNew) {
            setNewImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setImages(prev => prev.filter((_, i) => i !== index));
        }
    };

    const setPrimaryImage = (index, isNew = false) => {
        if (isNew) {
            setNewImages(prev => prev.map((img, i) => ({
                ...img,
                isPrimary: i === index
            })));
            // Ensure no existing image is marked as primary
            setImages(prev => prev.map(img => ({
                ...img,
                isPrimary: false
            })));
        } else {
            setImages(prev => prev.map((img, i) => ({
                ...img,
                isPrimary: i === index
            })));
            // Ensure no new image is marked as primary
            setNewImages(prev => prev.map(img => ({
                ...img,
                isPrimary: false
            })));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validation
        if (!formData.title || !formData.publisher || !formData.price || !formData.category || !formData.author) {
            setError('Title, publisher, price, category, and author are required fields');
            setLoading(false);
            return;
        }

        if (parseFloat(formData.price) < 0) {
            setError('Price cannot be negative');
            setLoading(false);
            return;
        }

        if (formData.stock && parseInt(formData.stock) < 0) {
            setError('Stock cannot be negative');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');

            // Prepare book data for update
            const bookData = {
                ...formData,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                stock: formData.stock ? parseInt(formData.stock) : 0,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
                // Combine existing images and new images
                images: [
                    ...images.map(img => ({
                        url: img.url,
                        alt: img.alt,
                        isPrimary: img.isPrimary
                    })),
                    ...newImages.map(img => ({
                        url: img.url, // In real app, this would be the uploaded image URL
                        alt: img.alt,
                        isPrimary: img.isPrimary
                    }))
                ]
            };

            // Remove empty optional fields
            Object.keys(bookData).forEach(key => {
                if (bookData[key] === '' || bookData[key] === undefined) {
                    delete bookData[key];
                }
            });

            const response = await fetch(`${process.env.VITE_API_URL}/api/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookData)
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Book updated successfully!');
                // Update local images state with the response data if needed
                if (data.data.book.images) {
                    setImages(data.data.book.images);
                    setNewImages([]);
                }
            } else {
                setError(data.message || 'Failed to update book');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Update book error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Show loading while checking authorization
    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking authorization...</p>
                </div>
            </div>
        );
    }

    // Show loading while fetching book data
    if (fetchLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading book data...</p>
                </div>
            </div>
        );
    }

    // Show unauthorized message if user is not admin
    if (!authorized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this page. This area is restricted to administrators only.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                        >
                            Go to Home
                        </button>
                        {!user && (
                            <button
                                onClick={() => navigate('/login')}
                                className="border-2 border-blue-500 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Show error if book not found
    if (error && !formData.title) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Not Found</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/admin')}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                        >
                            Back to Admin
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="border-2 border-blue-500 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Update Book</h1>
                    <p className="text-gray-600 text-lg">
                        Edit the book details for "{formData.title}"
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                        {success}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Book Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Basic Information */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h3>

                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Book Title *
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Enter book title"
                                />
                            </div>

                            {/* Author */}
                            <div>
                                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                                    Author *
                                </label>
                                <input
                                    id="author"
                                    name="author"
                                    type="text"
                                    required
                                    value={formData.author}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Enter author name"
                                />
                            </div>

                            {/* Publisher */}
                            <div>
                                <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-2">
                                    Publisher *
                                </label>
                                <input
                                    id="publisher"
                                    name="publisher"
                                    type="text"
                                    required
                                    value={formData.publisher}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Enter publisher name"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Format */}
                            <div>
                                <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
                                    Format
                                </label>
                                <select
                                    id="format"
                                    name="format"
                                    value={formData.format}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                >
                                    {formats.map(format => (
                                        <option key={format} value={format}>{format}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Language */}
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                                    Language
                                </label>
                                <input
                                    id="language"
                                    name="language"
                                    type="text"
                                    value={formData.language}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Language"
                                />
                            </div>
                        </div>

                        {/* Right Column - Pricing & Details */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Pricing & Details</h3>

                            {/* Price */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (₹) *
                                </label>
                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="0.00"
                                />
                            </div>

                            {/* Original Price */}
                            <div>
                                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                                    Original Price (₹)
                                </label>
                                <input
                                    id="originalPrice"
                                    name="originalPrice"
                                    type="number"
                                    step="0.01"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="0.00"
                                />
                                <p className="mt-1 text-xs text-gray-500">Leave empty if no discount</p>
                            </div>

                            {/* Stock */}
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity
                                </label>
                                <input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="0"
                                />
                            </div>

                            {/* ISBN */}
                            <div>
                                <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-2">
                                    ISBN
                                </label>
                                <input
                                    id="isbn"
                                    name="isbn"
                                    type="text"
                                    value={formData.isbn}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Enter ISBN"
                                />
                            </div>

                            {/* Pages */}
                            <div>
                                <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Pages
                                </label>
                                <input
                                    id="pages"
                                    name="pages"
                                    type="number"
                                    value={formData.pages}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Number of pages"
                                />
                            </div>

                            {/* Publication Date */}
                            <div>
                                <label htmlFor="publicationDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Publication Date
                                </label>
                                <input
                                    id="publicationDate"
                                    name="publicationDate"
                                    type="date"
                                    value={formData.publicationDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Full Width Fields */}
                    <div className="mt-8 space-y-6 border-t pt-8">
                        {/* About/Description */}
                        <div>
                            <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">
                                Book Description
                            </label>
                            <textarea
                                id="about"
                                name="about"
                                rows={4}
                                value={formData.about}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                placeholder="Enter book description..."
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <input
                                id="tags"
                                name="tags"
                                type="text"
                                value={formData.tags}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                placeholder="Enter tags separated by commas (e.g., fiction, bestseller, award-winning)"
                            />
                        </div>

                        {/* Images Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Book Images
                            </label>

                            {/* Existing Images */}
                            {images.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Images</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {images.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={image.url}
                                                    alt={image.alt}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPrimaryImage(index, false)}
                                                        className={`text-xs px-2 py-1 rounded ${image.isPrimary
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-white text-gray-700'
                                                            }`}
                                                    >
                                                        {image.isPrimary ? 'Primary' : 'Set Primary'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index, false)}
                                                        className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                {image.isPrimary && (
                                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                        Primary
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add New Images */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                                >
                                    Add New Images
                                </label>
                                <p className="mt-2 text-sm text-gray-500">
                                    Upload additional book images
                                </p>
                            </div>

                            {/* New Image Previews */}
                            {newImages.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">New Images</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {newImages.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={image.url}
                                                    alt={image.alt}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPrimaryImage(index, true)}
                                                        className={`text-xs px-2 py-1 rounded ${image.isPrimary
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-white text-gray-700'
                                                            }`}
                                                    >
                                                        {image.isPrimary ? 'Primary' : 'Set Primary'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index, true)}
                                                        className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                {image.isPrimary && (
                                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                        Primary
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                    New
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Featured Checkbox */}
                        <div className="flex items-center">
                            <input
                                id="featured"
                                name="featured"
                                type="checkbox"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                                Feature this book on the homepage
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                                    Updating...
                                </>
                            ) : (
                                'Update Book'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateBooks;