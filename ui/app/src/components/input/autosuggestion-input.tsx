import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AutoSuggestionProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const AutoSuggestion: React.FC<AutoSuggestionProps> = ({ label, options, value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState(value || "");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onChange(value); //
    if (value) {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "Tab") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        selectSuggestion(filteredSuggestions[selectedIndex]);
      }
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    onChange(suggestion);
    setFilteredSuggestions([]);
  };

  useEffect(() => {
    if (suggestionsRef.current && selectedIndex >= 0) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement;
      selectedElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <Label>
      {label}
      <div className="relative mt-2">
        <Input
          value={searchTerm}
          className="border border-gray"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        {filteredSuggestions.length > 0 && (
          <ul
            ref={suggestionsRef}
            className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md z-10 max-h-40 overflow-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`px-4 py-2 hover:bg-gray-100 text-black cursor-pointer ${
                  selectedIndex === index ? "bg-gray-200" : ""
                }`}
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Label>
  );
};

export default AutoSuggestion;