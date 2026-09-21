import { useState, useRef, useEffect } from "react";
import "./styles/CustomSelect.css";

function CustomSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Select",
  icon = "🩸",
  optionIcons = {}
}) {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const selectedIcon =
    optionIcons[value] || icon;

  return (
    <div
      className="custom-select-group"
      ref={dropdownRef}
    >
      <label>
        {label}
      </label>

      <div className="custom-select">

        {/* Main Button */}
        <button
            type="button"
            className={`custom-select-button ${
              isOpen ? "active" : ""
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
          <span className="custom-select-left">

            <span className="custom-select-icon">
              {selectedIcon}
            </span>

            <span
              className={
                value
                  ? "custom-select-value"
                  : "custom-select-placeholder"
              }
            >
              {value || placeholder}
            </span>

          </span>

          <span
            className={`custom-select-arrow ${
              isOpen ? "rotate" : ""
            }`}
          >
            ▼
          </span>

        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="custom-select-menu">

            {options.map((option) => {

              const optionIcon =
                optionIcons[option] || icon;

              return (
                <button
                  type="button"
                  key={option}
                  className={`custom-select-option ${
                    value === option
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleSelect(option)
                  }
                >

                  <span className="option-left">

                    <span className="option-icon">
                      {optionIcon}
                    </span>

                    <span>
                      {option}
                    </span>

                  </span>

                  {value === option && (
                    <span className="option-check">
                      ✓
                    </span>
                  )}

                </button>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default CustomSelect;