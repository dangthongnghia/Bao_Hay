// src/Components/Card.js
import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const Card = ({ data }) => {
  if (!Array.isArray(data)) {
    return <div>No news data available</div>;
  }

  return (
    <div className='cardContainer'>
      {data.map((article, index) => (
        <div className='card' key={`article-${index}`}>
          <img 
            src={article.image_url} 
            alt={article.title || 'News image'} 
            className='card-image'
            loading="lazy"
          />
          <div className='card-content'>
            <a 
              href={article.link}
              className='card-title'
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.title}
            </a>
            <p className='card-description'>{article.description}</p>
            <div className='card-footer'>
              <span className='source'>{article.source_id}</span>
              <span className='date'>{new Date(article.pubDate).toLocaleDateString()}</span>
            </div>
           
          </div>
        </div>
      ))}
    </div>
  );
};

Card.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      image_url: PropTypes.string,
      link: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      source_id: PropTypes.string,
      pubDate: PropTypes.string
    })
  ).isRequired
};

export default Card;
