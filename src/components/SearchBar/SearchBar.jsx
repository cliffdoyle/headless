import { useState } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch }) => {
  const [term, setTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e) => {
    setTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setTerm('');
    onSearch('');
  };

  return (
    <div className={styles.searchContainer}>
      <div className={`${styles.searchWrapper} ${isFocused ? styles.focused : ''}`}>
        <div className={styles.searchIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search articles by title, content, or author..."
          value={term}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={styles.searchInput}
        />
        {term && (
          <button
            onClick={handleClear}
            className={styles.clearButton}
            type="button"
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;