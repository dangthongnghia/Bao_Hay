import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import './Newsapp.css';

const categoryMap = {
    'Thể thao': 'sports',
    'Sức khỏe': 'health',
    'Kinh doanh': 'business',
    'Công nghệ': 'technology',
    'Giải trí': 'entertainment',
    'Khoa học': 'science',
    'Thời sự': 'top'
};

const NewsApp = () => {
    const [search, setSearch] = useState("");
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('');

    const API_KEY = "pub_608022c7f499cf57209f8c2dd66b6ad969797";

    const getData = useCallback(async (searchQuery = "", category = "", retryCount = 0) => {
        try {
            setLoading(true);
            setError(null);
            
            let url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=vi&language=vi`;
            
            if (searchQuery) {
                url += `&q=${encodeURIComponent(searchQuery)}`;
            }
            
            if (category) {
                const apiCategory = categoryMap[category];
                url += `&category=${encodeURIComponent(apiCategory)}`;
            }
            
            console.log('Fetching URL:', url); // Debug log
            const response = await fetch(url);
            
            if (response.status === 429 && retryCount < 3) {
                // Retry after a delay if rate limited
                console.warn('Rate limited, retrying...');
                setTimeout(() => getData(searchQuery, category, retryCount + 1), 3000);
                return;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const jsonData = await response.json();
            console.log('API Response:', jsonData); // Debug log
            
            if (jsonData.status === 'success' && Array.isArray(jsonData.results)) {
                setNewsData(jsonData.results);
            } else {
                throw new Error('No results found');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
            setNewsData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const debouncedSearch = useCallback(
        (value) => {
            const timeoutId = setTimeout(() => {
                getData(value);
            }, 500);
            return () => clearTimeout(timeoutId);
        },
        [getData]
    );

    useEffect(() => {
        getData();
    }, [getData]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        getData("", category);
    };

    return (
        <div className="news-container">
            <div className="navbar">
                <div className="nav-container">
                    <div className="nav-header">
                        <h1 className="nav-title">
                            Báo <span className="nav-title-accent">hay</span>
                        </h1>
                    </div>
                    <div className="category-list">
                        {Object.keys(categoryMap).map((category) => (
                            <button
                                key={category}
                                className={`category-button ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <div className="search-bar">
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Tìm kiếm..."
                            className="search-input"
                        />
                    </div>
                </div>
            </div>

            {loading && <div className="loading">Đang tải...</div>}
            {error && <div className="error">{error}</div>}
            
            <div className="news-grid">
                {newsData.length > 0 ? (
                    <Card data={newsData} />
                ) : (
                    <div className="no-results">Không tìm thấy bài viết</div>
                )}
            </div>
        </div>
    );
};

export default NewsApp;