import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-8xl font-display font-semibold text-ember mb-4">404</h1>
    <p className="text-xl font-display font-semibold mb-2">Page not found</p>
    <p className="text-ink/50 mb-8">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/" className="btn-primary">Back to Home</Link>
  </div>
);

export default NotFound;
