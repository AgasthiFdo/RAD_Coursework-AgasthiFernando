import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className='bg-[#0f172a] border-t border-white/5 text-gray-400 py-16 shadow-2xl overflow-hidden relative'>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#fbbf24]/20 to-transparent"></div>
      
      <div className='max-w-7xl mx-auto px-8 grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-12'>
        <div className="space-y-4">
          <h2 className='text-2xl font-black text-white tracking-tighter uppercase'>
            CocktAIl<span className='text-[#fbbf24]'>REcipeS</span> 🍸
          </h2>
          <p className='text-xs font-bold uppercase tracking-widest leading-loose opacity-60'>
            Feel The Beverages.<br/> Crafted for Connoisseurs.
          </p>
        </div>

        <div>
          <h3 className='font-black text-[10px] uppercase tracking-[0.2em] text-white mb-6'>Quick Explorer</h3>
          <ul className='space-y-3 text-[11px] font-bold uppercase tracking-wider'>
            <li><Link to="/" className='hover:text-[#fbbf24] transition-colors duration-300 flex items-center gap-2'><span className="w-1 h-1 bg-[#fbbf24] rounded-full"></span> Home</Link></li>
            <li><Link to="/category" className='hover:text-[#fbbf24] transition-colors duration-300 flex items-center gap-2'><span className="w-1 h-1 bg-[#fbbf24] rounded-full"></span> Category</Link></li>
            <li><Link to="/submit" className='hover:text-[#fbbf24] transition-colors duration-300 flex items-center gap-2'><span className="w-1 h-1 bg-[#fbbf24] rounded-full"></span> Recipes</Link></li>
            <li><Link to="/about" className='hover:text-[#fbbf24] transition-colors duration-300 flex items-center gap-2'><span className="w-1 h-1 bg-[#fbbf24] rounded-full"></span> About Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className='font-black text-[10px] uppercase tracking-[0.2em] text-white mb-6'>Support</h3>
          <ul className='space-y-3 text-[11px] font-bold uppercase tracking-wider'>
            <li><Link to="/submit" className='hover:text-[#fbbf24] transition-colors duration-300'>Partnerships</Link></li>
            <li><Link to="/submit" className='hover:text-[#fbbf24] transition-colors duration-300'>Terms of Service</Link></li>
            <li><Link to="/submit" className='hover:text-[#fbbf24] transition-colors duration-300'>Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-white mb-4">Be a Partner</h3>
            <p className="text-[11px] font-medium leading-relaxed mb-4">
              Join our exclusive network of beverage enthusiasts.
            </p>
          </div>
          <form className="flex group">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-l-2xl text-[10px] font-black tracking-widest focus:outline-none focus:border-[#fbbf24]/50 transition-all placeholder:text-gray-700"
            />
            <button
              type="submit"
              className="bg-[#fbbf24] text-[#0f172a] px-6 py-3 rounded-r-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-95"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">
          ©{new Date().getFullYear()} CocktAIl — All Rights Reserved.
        </div>
        <div className="flex gap-6">
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-700 hover:text-[#fbbf24] cursor-pointer transition-colors">Instagram</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-700 hover:text-[#fbbf24] cursor-pointer transition-colors">Twitter</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-700 hover:text-[#fbbf24] cursor-pointer transition-colors">Facebook</span>
        </div>
      </div>
    </footer>
  )
}