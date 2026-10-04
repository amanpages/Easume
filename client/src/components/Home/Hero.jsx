import { useSelector } from "react-redux";
import "../Hero.css";
import { Link, useNavigate } from "react-router-dom";

export default function Hero() {

  const {user} = useSelector(state=> state.auth);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/app?register");
  };

  return (
    <section className="bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gridBackground.png')] w-full bg-no-repeat bg-cover bg-center text-sm pb-44">
      <nav className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-6 w-full">
        <a href="#">
          <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
        </a>

        <div
          className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:transition-all max-md:duration-300 max-md:overflow-hidden max-md:h-full max-md:bg-white/50 max-md:backdrop-blur max-md:flex-col max-md:justify-center flex items-center gap-10 font-medium}`}
        >
          <a href="#" className="hover:text-green-700">
            Home
          </a>
          <a href="#features" className="hover:text-green-700">
            Features
          </a>
          <a href="#testimonials" className="hover:text-green-700">
            Testimonies
          </a>
          <a href="#contact" className="hover:text-green-700">
            Contact
          </a>
        </div>
        {user ? (
          <Link to="/app" className="hidden md:block px-8 py-2 bg-green-500 hover:bg-green-700 active:scale-95 transition-all rounded-full text-white">
            Dashboard
          </Link>
        ) : (
          <Link to="/app?state=login" className="hidden md:block bg-green-500 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition">
            Login
          </Link>
        )}
        

        {/* <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden bg-gray-800 hover:bg-black text-white p-2 rounded-md aspect-square font-medium transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12h16" />
            <path d="M4 18h16" />
            <path d="M4 6h16" />
          </svg>
        </button> */}
      </nav>

      <div className="flex items-center gap-2 border border-slate-300 hover:border-slate-400/70 rounded-full w-max mx-auto px-4 py-2 mt-40 md:mt-32">
        <span>New announcement on your inbox</span>
        <button className="flex items-center gap-1 font-medium">
          <span>Read more</span>
          <svg
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.959 9.5h11.083m0 0L9.501 3.958M15.042 9.5l-5.541 5.54"
              stroke="#050040"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <h5 className="text-4xl md:text-7xl font-medium max-w-[850px] text-center mx-auto mt-8">
        Build resume faster with Easume
      </h5>

      <p className="text-sm md:text-base mx-auto max-w-2xl text-center mt-6 max-md:px-2">
        Build, updated resume without wrestling with different platforms, our
        site handle the heavy lifting so you can build faster.
      </p>

      <div className="mx-auto w-full flex items-center justify-center gap-3 mt-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition"
          onClick={handleClick}
          type="button" hidden={user}
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
