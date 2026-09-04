import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-ink text-cream mt-24">
      <div className="container-page py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <h3 className="text-2xl font-display font-semibold mb-3">
            Taste<span className="text-ember">Hub</span>
          </h3>
          <p className="text-sm text-cream/60 leading-relaxed">
            Fresh, fast, and delivered hot to your door. Your favorite meals, one tap away.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-ember hover:border-ember transition-colors">
              <FiInstagram size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-ember hover:border-ember transition-colors">
              <FiTwitter size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-ember hover:border-ember transition-colors">
              <FiFacebook size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm tracking-wide">Explore</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li><Link to="/menu" className="hover:text-ember transition-colors">Full Menu</Link></li>
            <li><Link to="/orders" className="hover:text-ember transition-colors">Track Order</Link></li>
            <li><Link to="/cart" className="hover:text-ember transition-colors">My Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm tracking-wide">Company</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li><a href="#" className="hover:text-ember transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-ember transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-ember transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm tracking-wide">Support</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li><a href="#" className="hover:text-ember transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-ember transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-ember transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} TasteHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
