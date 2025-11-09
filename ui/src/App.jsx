import './App.css';
import ChatBox from './Components/ChatBox';

function App() {
  return (
    <div
      className="
        relative
        min-h-screen
        bg-[url('/images.jpeg')]
        bg-cover
        bg-center
        flex
        flex-col
        items-center
        justify-center
        text-white
        overflow-hidden
      "
    >
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/80"></div>

      <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl top-20 left-1/3 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl bottom-16 right-1/4 animate-pulse delay-150"></div>

      <div className="relative z-10 text-center px-6 py-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-red-500 to-yellow-300 drop-shadow-lg mb-3">
          Noida Institute of Engineering & Technology
        </h1>
        <p className="text-lg md:text-xl text-gray-200 font-medium tracking-wide">
          An Autonomous Engineering and Management College in Greater Noida, India
        </p>
      </div>

      <div className="relative z-10 mt-10">
        <ChatBox />
      </div>
    </div>
  );
}

export default App;
