import { Link } from "react-router-dom";
import AuthTabs from "../components/auth/AuthTabs";
import Signup from '../components/auth/Signup';
import Login from '../components/auth/Login';


export default function Auth() {
  return (
    <div className="h-dvh flex flex-col justify-center items-center landing-page__bg">
      <nav className='flex w-full p-4 px-6 justify-between items-center'>
        <Link to="/" className='text-white ff-hughs text-3xl'>
          Zuptalk
        </Link>
      </nav>

      <div className="w-full max-w-[600px] grow p-4 gap-4 flex flex-col justify-center items-center">
        <h2 className='text-white text-center text-4xl font-semibold mb-8'>Let's rock in livestreams ⚡</h2>
        <Login />
        <Signup />

      </div>
    </div>
  );
}
