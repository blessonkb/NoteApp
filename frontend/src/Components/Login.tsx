import { useState } from "react";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            if (data.user) {
                localStorage.setItem('userName', data.user.name);
                localStorage.setItem('userEmail', data.user.email);
            }
            
            window.location.href = '/'; 
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background font-sans text-text">
            <div className="bg-white shadow-xl border border-border rounded-xl w-full max-w-sm p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sidebar to-accent"></div>
                <h2 className="text-3xl font-bold text-center mb-8 tracking-tight text-sidebar">
                    LOGIN
                </h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 pl-11 text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                required
                            />
                            <span className="absolute left-4 top-3.5 text-text-secondary opacity-50">✉️</span>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 pl-11 text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                required
                            />
                            <span className="absolute left-4 top-3.5 text-text-secondary opacity-50">🔒</span>
                        </div>
                    </div>

                    <div className="text-right text-xs">
                        <Link to="/register" className="text-accent font-semibold hover:text-accent/80 transition-colors">
                            Create an account
                        </Link>
                    </div>

                    {error && <div className="text-red-500 text-xs text-center font-medium bg-red-50 py-2 rounded border border-red-100">{error}</div>}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed tracking-wide"
                    >
                        {loading ? 'Logging in...' : 'LOGIN'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
