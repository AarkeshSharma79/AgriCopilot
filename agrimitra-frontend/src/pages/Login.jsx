import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, Mail, Lock, Eye, EyeOff, CloudSun, Lightbulb, Users, Leaf, AlertCircle } from "lucide-react";
import { login as apiLogin } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await apiLogin({ email, password });
      if (res?.data?.user) {
        login(res.data.user);
        navigate("/");
      } else {
        setErrorMsg("Invalid response from server.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Invalid credentials or server offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative p-4 md:p-8"
      style={{ backgroundImage: 'url("/images/register_bg.jpg")' }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Top Right Floating Text (Matches Mockup) */}
      <div className="absolute top-10 right-16 hidden 2xl:flex flex-col items-end font-display italic font-medium text-4xl text-forest-950/90 leading-[1.1] rotate-[-3deg]">
         <span>Farm</span>
         <span>Grow</span>
         <span>Thrive</span>
         <span className="flex items-center gap-2">Together <Leaf className="w-8 h-8 text-leaf-600 fill-leaf-600 -rotate-12" /></span>
      </div>

      <div className="relative z-10 w-full max-w-[1100px] flex flex-col lg:flex-row items-stretch rounded-[2rem] overflow-hidden shadow-2xl">
        
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 w-[45%] text-white bg-gradient-to-b from-forest-900/80 to-forest-950/95 backdrop-blur-sm relative">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <span className="w-12 h-12 rounded-2xl bg-leaf-500 flex items-center justify-center">
                <Sprout className="w-7 h-7 text-white" />
              </span>
              <div className="flex flex-col">
                 <span className="font-display font-bold text-3xl tracking-tight leading-none">AgriMitra</span>
                 <span className="text-[10px] text-leaf-400 font-semibold tracking-wide">Smart Farming • Better Tomorrow</span>
              </div>
            </div>
            
            <h1 className="text-[2.75rem] font-display font-bold leading-[1.1] mb-6">
              Welcome Back to a <span className="text-leaf-400">Greener Tomorrow</span>
            </h1>
            <p className="text-base text-white/80 font-medium mb-10 leading-relaxed max-w-sm">
              Log in to access your personalized crop advice, live weather updates, and smart farming dashboard.
            </p>

            <div className="flex gap-4">
               <div className="bg-white/90 p-4 py-5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center w-24">
                 <Sprout className="w-7 h-7 text-forest-800 mb-2" />
                 <p className="font-bold text-[10px] text-forest-950 leading-tight">Crop<br/>Guidance</p>
               </div>
               <div className="bg-white/90 p-4 py-5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center w-24">
                 <CloudSun className="w-7 h-7 text-forest-800 mb-2" />
                 <p className="font-bold text-[10px] text-forest-950 leading-tight">Local<br/>Weather</p>
               </div>
               <div className="bg-white/90 p-4 py-5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center w-24">
                 <Lightbulb className="w-7 h-7 text-forest-800 mb-2" />
                 <p className="font-bold text-[10px] text-forest-950 leading-tight">Expert<br/>Advice</p>
               </div>
               <div className="bg-white/90 p-4 py-5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center w-24">
                 <Users className="w-7 h-7 text-forest-800 mb-2" />
                 <p className="font-bold text-[10px] text-forest-950 leading-tight">Stronger<br/>Community</p>
               </div>
            </div>
          </div>
          
          <div className="mt-12 bg-forest-900/40 border border-white/10 p-5 rounded-2xl backdrop-blur-md flex items-center gap-4 w-max">
             <Leaf className="w-7 h-7 text-leaf-400" />
             <div>
               <p className="font-bold text-lg leading-tight">Healthy Farms</p>
               <p className="text-white text-lg leading-tight">Happier Communities”</p>
             </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-[55%] bg-[#F5F7F5] p-8 md:p-12 relative flex flex-col justify-center">
          
          {/* Top Toggle */}
          <div className="flex bg-[#EAECEA] rounded-xl p-1 mb-10 w-full max-w-sm">
             <Link to="/register" className="flex-1 py-2.5 rounded-lg text-gray-500 font-semibold text-sm hover:text-gray-700 transition-colors text-center">Sign Up</Link>
             <button type="button" className="flex-1 py-2.5 rounded-lg bg-[#558661] text-white font-semibold text-sm shadow-sm">Sign In</button>
          </div>

          <div className="mb-8">
            <h2 className="text-[1.75rem] font-display font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500 text-sm max-w-sm">Sign in to your AgriMitra account to continue managing your farm.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 text-sm font-semibold text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Address */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#558661] focus:border-[#558661] transition-all outline-none text-sm placeholder:text-gray-400" placeholder="Enter your email" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type={showPassword ? "text" : "password"} required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#558661] focus:border-[#558661] transition-all outline-none text-sm placeholder:text-gray-400" placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-1 pb-4">
              <a href="#" className="text-sm font-bold text-[#497554] hover:underline">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-[#365A40] hover:bg-[#2A4732] text-white font-bold text-[15px] transition-all disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? "Signing In..." : "Sign In"}
            </button>
            
            <p className="text-center text-sm font-medium text-gray-500 mt-6 lg:hidden">
              Don't have an account? <Link to="/register" className="text-[#365A40] font-bold hover:underline">Sign Up</Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}
