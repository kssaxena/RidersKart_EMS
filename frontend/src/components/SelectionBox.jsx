const SelectBox = ({
  LabelName = "",
  Name = "",
  Value,
  Placeholder = "Select an option",
  Options = [],
  onChange,
  className = "",
  Required = true,
}) => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="py-4 w-full">
        {LabelName && (
          <label
            htmlFor={Name}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {LabelName}
          </label>
        )}

        <select
          id={Name}
          name={Name}
          required={Required}
          className={`w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 ease-in-out hover:shadow-md ${className}`}
          {...(onChange
            ? { value: Value ?? "", onChange }
            : { defaultValue: "" })}
        >
          <option value="" disabled>
            {Placeholder}
          </option>

          {Options.map((option) => (
            <option key={option._id} value={option._id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectBox;
