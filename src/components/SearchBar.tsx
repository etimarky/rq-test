import React, { ChangeEvent, useEffect, useState } from 'react';
import { tss } from '../tss';
import { Pokemon } from 'src/hooks/useGetPokemons';

interface SearchBarProps {
    onSearch: (value: string) => void;
};
export const SearchBar = ({ onSearch }: SearchBarProps) => {
    const { classes } = useStyles();
    const [value, setValue] = useState('')

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value
        setValue(newVal)
        onSearch(newVal)

    }

    return (
        <input
            type="text"
            value={value}
            onChange={handleSearch}
            placeholder="Search..."
            className={classes.input}
            id="search-input"
        />
    )
};

const useStyles = tss.create(({ theme }) => ({
    input: {
        padding: "10px 14px",
        width: "100%",
        maxWidth: "300px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "16px",
        outline: "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",

        "&:focus": {
            borderColor: "#4a90e2",
            boxShadow: "0 0 0 3px rgba(74, 144, 226, 0.3)",
        },
    },
}));
