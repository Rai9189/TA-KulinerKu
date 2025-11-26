import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAppContext } from '../context/AppContext';
import { toast } from 'sonner@2.0.3';
import { UtensilsCrossed } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { refreshUser } = useAppContext(); // gunakan hook dari context
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Semua field harus diisi');
      return;
    }

    // LOGIN dengan Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password) // Catatan: simpan password hash di produksi
      .single();

    if (error || !data) {
      toast.error('Email atau password salah');
      return;
    }

    // Simpan token (id user) di localStorage
    localStorage.setItem('token', data.id);

    // Refresh context agar user & role ter-update
    await refreshUser();

    toast.success('Login berhasil!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl text-center mb-2">Selamat Datang</h1>
          <p className="text-center text-gray-600 mb-8">Login ke KulinerKu</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Belum punya akun?{' '}
              <Link to="/register" className="text-orange-500 hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-500 text-center">
              Untuk demo, gunakan email apapun dan password minimal 6 karakter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
