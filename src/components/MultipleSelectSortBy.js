import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";

export default function MultipleSelectSortBy({setSortBy}) {

    const [selectedOption, setSelectedOption] = useState("");
    const [dropDownClicked, setDropDownClicked] = useState(false);

    const handleOptionSelected = (option) => {
        setSelectedOption(option);
        setDropDownClicked(false);
        setSortBy(option === "Popularity" ? "popularity.desc" : option === "Rating" ? "vote_average.desc" : option === "Release Date" ? "release_date.desc" : null);
    }
    const handleRemoveOptions = () => {
        setSelectedOption("");
        setSortBy(null);
    }

  
    const handleDropDown = (state) => {
      setDropDownClicked(state);
    }
  
  const [options, setOptions] = useState([
      { value: 'Popularity (default)', label: 'Popularity' },
      { value: 'Rating', label: 'Rating' },
      { value: 'Release Date', label: 'Release Date' }
    ]);
  
    return (
        <div className={`z-10 w-full sm:w-40 md:w-48 lg:w-56 rounded-t-md bg-amber-800 px-2 sm:px-3 py-2 text-white cursor-pointer relative ${dropDownClicked ? 'rounded-b-none' : 'rounded-b-md'}`} >
            <div className='flex row justify-between font-semibold' onClick={() => handleDropDown(!dropDownClicked)}>
                <div className='flex flex-wrap'> 
                    {selectedOption === "" ? 
                    (
                    <p className="text-gray-300 text-sm sm:text-base">Sort By...</p>
                    ) : (
                    <p key={selectedOption} className={`text-sm sm:text-base font-semibold flex items-center text-gray-100 text-center truncate`} >{selectedOption}</p>
                    )
                    }        
                </div>
                <p className="hover:text-indigo-800 right-0 items-center text-center flex" onClick={() => handleRemoveOptions()}>{selectedOption != "" ? "x" : <IoIosArrowDown /> }</p>
                <ul className={`flex flex-col overflow-y-auto absolute left-0 z-10 top-full bg-white text-black w-full py-2 rounded-b-md max-h-60 ${dropDownClicked ? 'block' : 'hidden'}`}>
                    {options.map((option) => (
                        <li key={option.value} className='py-1 hover:bg-zinc-200 px-4' onClick={() => handleOptionSelected(option.value)}>
                        {option.label}  
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}