import Button from "./Button";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          {/* Replace text with <img src="/logo.png" /> */}
          <h1 className="text-2xl font-bold text-gray-800">
            Your<span className="text-[#DF3F33]">Logo</span>
          </h1>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            label="Login"
            className="px-6 py-2 text-gray-700 border border-gray-300"
          />
          <Button label="Register" className="px-6 py-2" />
        </div>
      </div>
    </header>
  );
};

export default Header;
