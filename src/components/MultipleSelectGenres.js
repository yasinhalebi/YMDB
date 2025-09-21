import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { fetchGenres } from '../services/api';

export default function MultipleSelectGenres({ setSelectedGenres, mediaType = 'movie' }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dropDownClicked, setDropDownClicked] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoading(true);
        const genres = await fetchGenres(mediaType);
        setOptions(genres.map(genre => ({ value: genre.name, label: genre.name })));
      } catch (err) {
        console.error(`Error fetching ${mediaType} genres:`, err.response?.data || err.message);
        setError('Failed to load genres.');
      } finally {
        setLoading(false);
      }
    };
    loadGenres();
  }, [mediaType]);

  const handleDropDown = () => {
    if (!loading) {
      setDropDownClicked(!dropDownClicked);
    }
  };

  const handleRemoveOptions = () => {
    setSelectedOptions([]);
    setSelectedGenres([]);
  };

  const handleOptionSelected = (option) => {
    if (!selectedOptions.includes(option.value)) {
      const newSelectedOptions = [...selectedOptions, option.value];
      setSelectedOptions(newSelectedOptions);
      setSelectedGenres(newSelectedOptions);
    }
  };

  const handleRemoveOption = (option) => {
    const newSelectedOptions = selectedOptions.filter(item => item !== option);
    setSelectedOptions(newSelectedOptions);
    setSelectedGenres(newSelectedOptions);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div
      className={`z-10 w-full sm:w-48 md:w-56 lg:w-64 rounded-t-md bg-amber-800 px-2 sm:px-3 py-2 text-white cursor-pointer relative ${
        dropDownClicked && !loading ? 'rounded-b-none' : 'rounded-b-md'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex justify-between font-semibold" onClick={handleDropDown}>
        <div className="flex flex-wrap gap-1">
          {loading ? (
            <p className="text-gray-300">Loading genres...</p>
          ) : selectedOptions.length === 0 ? (
            <p className="text-gray-300">Select Genres...</p>
          ) : (
            selectedOptions.map((option, index) => (
              <p
                key={index}
                className="mt-1 font-light flex mr-1 items-center text-gray-300 text-[10px] sm:text-xs text-center pb-[2px] bg-orange-950 rounded-md px-1 hover:text-gray-400 truncate max-w-[100px] sm:max-w-[120px]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveOption(option);
                }}
              >
                {option}
              </p>
            ))
          )}
        </div>
        <p
          className="hover:text-indigo-800 right-0 items-center text-center flex"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveOptions();
          }}
        >
          {selectedOptions.length !== 0 ? 'x' : <IoIosArrowDown />}
        </p>
      </div>
      <ul
        className={`flex flex-col overflow-y-auto absolute left-0 z-10 top-full bg-white text-black w-full py-2 rounded-b-md max-h-60 ${
          dropDownClicked && !loading ? 'block' : 'hidden'
        }`}
      >
        {options.map((option) => (
          <li
            key={option.value}
            className="py-1 hover:bg-zinc-200 px-4"
            onClick={() => handleOptionSelected(option)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}