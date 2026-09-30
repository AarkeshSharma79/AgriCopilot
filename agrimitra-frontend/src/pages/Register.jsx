import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, MapPin, Loader2, CheckCircle2, AlertCircle, User, Mail, Lock, Eye, EyeOff, CloudSun, Lightbulb, Users, Leaf } from "lucide-react";
import { register as apiRegister } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  // Location States
  const [locationStatus, setLocationStatus] = useState("idle"); // idle | detecting | success | error
  const [locationData, setLocationData] = useState({
    lat: null,
    lng: null,
    city: "",
    state: "",
    country: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDetectLocation = () => {
    setLocationStatus("detecting");
    
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          
          setLocationData({
            lat: latitude,
            lng: longitude,
            city: data.address.city || data.address.town || data.address.village || data.address.county || "",
            state: data.address.state || "",
            country: data.address.country || ""
          });
          setLocationStatus("success");
        } catch (err) {
          console.error("Geocoding failed", err);
          setLocationStatus("error");
        }
      },
      (err) => {
        console.error("GPS Denied/Failed", err);
        setLocationStatus("error");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!agreed) {
      setErrorMsg("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const payload = { 
        name, 
        email, 
        password,
        ...(locationData.city && { location: {
          lat: locationData.lat,
          lng: locationData.lng,
          district: locationData.city,
          state: locationData.state
        }})
      };

      const res = await apiRegister(payload);
      if (res?.data?.user) {
        login(res.data.user);
        navigate("/");
      } else {
        setErrorMsg("Invalid response from server.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed. Please try again.");
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
              Empowering Farmers for a <span className="text-leaf-400">Greener Tomorrow</span>
            </h1>
            <p className="text-base text-white/80 font-medium mb-10 leading-relaxed max-w-sm">
              Join AgriMitra and get personalized crop advice, weather updates, and smart farming solutions.
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
        <div className="w-full lg:w-[55%] bg-[#F5F7F5] p-8 md:p-12 relative flex flex-col">
          
          {/* Top Toggle */}
          <div className="flex bg-[#EAECEA] rounded-xl p-1 mb-10 w-full max-w-sm">
             <button type="button" className="flex-1 py-2.5 rounded-lg bg-[#558661] text-white font-semibold text-sm shadow-sm">Sign Up</button>
             <Link to="/login" className="flex-1 py-2.5 rounded-lg text-gray-500 font-semibold text-sm hover:text-gray-700 transition-colors text-center">Sign In</Link>
          </div>

          <div className="mb-8">
            <h2 className="text-[1.75rem] font-display font-bold text-gray-900 mb-2">Create Your Account</h2>
            <p className="text-gray-500 text-sm max-w-sm">Join AgriMitra and be part of a smarter, stronger farming future.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 text-sm font-semibold text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 flex-1">
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#558661] focus:border-[#558661] transition-all outline-none text-sm placeholder:text-gray-400" placeholder="Enter your full name" />
              </div>
            </div>

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
                <input type={showPassword ? "text" : "password"} required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#558661] focus:border-[#558661] transition-all outline-none text-sm placeholder:text-gray-400" placeholder="Create a password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#558661] focus:border-[#558661] transition-all outline-none text-sm placeholder:text-gray-400" placeholder="Confirm password" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Location Section */}
            <div className="pt-2">
               <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                 <MapPin className="w-4 h-4 text-gray-800" /> Your Current Location (Optional)
               </label>
               
               {locationStatus === "idle" || locationStatus === "error" ? (
                 <>
                   <button type="button" onClick={handleDetectLocation} className="w-full py-3.5 rounded-xl bg-[#497554] hover:bg-[#3D6346] text-white text-sm font-semibold transition-colors flex justify-center items-center gap-2">
                      <MapPin size={18} /> Detect My Location
                   </button>
                   <p className="text-xs text-gray-500 mt-2 leading-relaxed">Your location helps us provide local weather, crop insights, and personalized recommendations.</p>
                   
                   <div className="flex items-center gap-3 my-5">
                     <div className="flex-1 h-px bg-gray-300"></div>
                     <span className="text-xs text-gray-400 font-medium">or</span>
                     <div className="flex-1 h-px bg-gray-300"></div>
                   </div>

                   <div className="relative">
                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                     <input type="text" value={locationData.city} onChange={(e) => setLocationData({...locationData, city: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#558661] focus:border-[#558661] transition-all outline-none text-sm placeholder:text-gray-400" placeholder="Enter city, state or village manually" />
                   </div>
                 </>
               ) : locationStatus === "detecting" ? (
                  <div className="w-full py-3.5 rounded-xl bg-gray-200 text-gray-600 text-sm font-semibold flex justify-center items-center gap-2">
                     <Loader2 size={18} className="animate-spin" /> Detecting location...
                  </div>
               ) : (
                  <div className="w-full py-3.5 px-4 rounded-xl border border-[#497554] bg-[#497554]/10 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <CheckCircle2 size={20} className="text-[#497554]" />
                       <div>
                         <p className="text-sm font-bold text-gray-900">Location detected</p>
                         <p className="text-xs text-gray-600">{locationData.city}, {locationData.state}</p>
                       </div>
                     </div>
                     <button type="button" onClick={() => setLocationStatus("idle")} className="text-xs font-bold text-[#497554] hover:underline">Change</button>
                  </div>
               )}
            </div>

            {/* Terms */}
            <div className="flex items-center gap-3 pt-4 pb-2">
              <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#497554] focus:ring-[#497554]" />
              <label htmlFor="terms" className="text-sm text-gray-700 leading-tight">
                I agree to the <a href="#" className="text-[#497554] font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-[#497554] font-bold hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-[#365A40] hover:bg-[#2A4732] text-white font-bold text-[15px] transition-all disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            
            <p className="text-center text-sm font-medium text-gray-500 mt-4">
              Already have an account? <Link to="/login" className="text-[#365A40] font-bold hover:underline">Sign In</Link>
            </p>
          </form>
        </div>
        </div>
    </div>
  );
}
