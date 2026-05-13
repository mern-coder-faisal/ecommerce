import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  DollarSign, Users, Package, ShoppingCart, TrendingUp,
  LogOut, Zap, Home, RefreshCw, Shield, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../utils/api';

const STATUS_COLORS = {
  pending: '#fbbf24',
  processing: '#6c63ff',
  shipped: '#43d9ad',
  delivered: '#22c55e',
  cancelled: '#ff6b6b',
};

// Mock fallback data for when backend is offline
const MOCK_STATS = {
  totalSales: 48320.50,
  totalOrders: 40,
  totalUsers: 8,
  totalProducts: 12,
  monthlySales: [
    { month: 'Dec', revenue: 4200, orders: 5 },
    { month: 'Jan', revenue: 6800, orders: 9 },
    { month: 'Feb', revenue: 5100, orders: 7 },
    { month: 'Mar', revenue: 9400, orders: 12 },
    { month: 'Apr', revenue: 7600, orders: 10 },
    { month: 'May', revenue: 12800, orders: 15 },
  ]
};

const MOCK_ORDERS = [
  { _id: '1', customerName: 'Alice Johnson', email: 'alice.johnson@example.com', total: 299.99, status: 'delivered', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), products: [{ name: 'NextGen Pro Headphones', quantity: 1 }] },
  { _id: '2', customerName: 'Bob Smith', email: 'bob.smith@example.com', total: 749.99, status: 'shipped', createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), products: [{ name: 'Ultra-wide Monitor 34"', quantity: 1 }] },
  { _id: '3', customerName: 'Carol White', email: 'carol.white@example.com', total: 189.00, status: 'processing', createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), products: [{ name: 'Minimalist Mechanical Keyboard', quantity: 1 }] },
  { _id: '4', customerName: 'David Lee', email: 'david.lee@example.com', total: 119.98, status: 'pending', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), products: [{ name: 'Smart Water Bottle', quantity: 2 }] },
  { _id: '5', customerName: 'Emma Brown', email: 'emma.brown@example.com', total: 549.00, status: 'delivered', createdAt: new Date(Date.now() - 86400000 * 6).toISOString(), products: [{ name: 'Ergonomic Office Chair', quantity: 1 }] },
  { _id: '6', customerName: 'Frank Davis', email: 'frank.davis@example.com', total: 330.00, status: 'cancelled', createdAt: new Date(Date.now() - 86400000 * 8).toISOString(), products: [{ name: 'Premium Leather Backpack', quantity: 1 }] },
];

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '28px 24px',
      display: 'flex', flexDirection: 'column', gap: 16,
      transition: 'all 0.3s ease',
      animation: `fadeUp 0.5s ease both`, animationDelay: `${delay}s`,
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = color; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: 'var(--text2)', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: 'var(--text)' }}>{value}</p>
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: `${color}18`, border: `1px solid ${color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={22} color={color} />
        </div>
      </div>
      {sub && <p style={{ color: 'var(--text2)', fontSize: 13 }}>{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 13 }}>
          {p.name === 'revenue' ? '$' : ''}{p.value.toLocaleString()} {p.name}
        </p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', stock: '', image: '', description: '' });
  const [newCategory, setNewCategory] = useState('');
  const [newBanner, setNewBanner] = useState({ title: '', description: '', image: '', link: '' });
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        api.adminStats(),
        api.adminOrders(),
        api.getProducts(),
        api.getCategories(),
        api.getBanners(),
        api.getSettings(),
      ]);

      const [statsRes, ordersRes, productsRes, categoriesRes, bannersRes, settingsRes] = results;

      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      else setStats(MOCK_STATS);

      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value);
      else setOrders(MOCK_ORDERS);

      if (productsRes.status === 'fulfilled') setProducts(productsRes.value);
      else setProducts([]);

      if (categoriesRes.status === 'fulfilled') setCategories(categoriesRes.value.map((item) => item.name));
      else setCategories([]);

      if (bannersRes.status === 'fulfilled') setBanners(bannersRes.value);
      else setBanners([]);

      if (settingsRes.status === 'fulfilled') setSettings(settingsRes.value || {});
      else setSettings({});

      const allFailed = results.every(r => r.status === 'rejected');
      setUsingMock(allFailed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.updateOrderStatus(orderId, status);
      setOrders((current) => current.map((order) => order._id === orderId ? { ...order, status } : order));
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.category) {
      alert('Please select a category or create one if the list is empty.');
      return;
    }
    if (!newProduct.name || !newProduct.price) {
      alert('Name and Price are required.');
      return;
    }
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price) || 0,
        stock: parseInt(newProduct.stock) || 0,
      };
      await api.createProduct(productData);
      setNewProduct({ name: '', price: '', category: '', stock: '', image: '', description: '' });
      setShowProductModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to add product', err);
      alert('Error adding product: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(productId);
      fetchData();
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const handleAddCategory = async () => {
    try {
      await api.createCategory({ name: newCategory });
      setNewCategory('');
      setShowCategoryModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to add category', err);
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const category = categories.find(c => c === categoryName);
      if (category) {
        await api.deleteCategory(category._id || categoryName);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to delete category', err);
    }
  };

  const handleAddBanner = async () => {
    try {
      await api.createBanner(newBanner);
      setNewBanner({ title: '', description: '', image: '', link: '' });
      setShowBannerModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to add banner', err);
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      await api.deleteBanner(bannerId);
      fetchData();
    } catch (err) {
      console.error('Failed to delete banner', err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await api.updateSettings(settings);
      fetchData();
    } catch (err) {
      console.error('Failed to save settings', err);
    }
  };

  const pieData = stats ? [
    { name: 'Electronics', value: 45 },
    { name: 'Furniture', value: 22 },
    { name: 'Lifestyle', value: 20 },
    { name: 'Accessories', value: 13 },
  ] : [];
  const PIE_COLORS = ['#6c63ff', '#ff6b6b', '#43d9ad', '#fbbf24'];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'Orders' },
    { id: 'products', label: 'Products' },
    { id: 'categories', label: 'Categories' },
    { id: 'banners', label: 'Banners' },
    { id: 'settings', label: 'Settings' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav */}
      <header style={{
        height: 64, background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', padding: '0 28px',
        gap: 16,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={15} color="#fff" />
          </span>
          NextGen
        </Link>
        <span style={{ color: 'var(--border)', fontSize: 18 }}>|</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Shield size={14} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--accent)' }}>Admin Dashboard</span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {usingMock && (
            <span style={{ fontSize: 12, color: 'var(--accent2)', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', padding: '4px 10px', borderRadius: 6 }}>
              Demo Mode
            </span>
          )}
          <button onClick={fetchData} style={{ color: 'var(--text2)', padding: 8, borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <RefreshCw size={15} />
          </button>
          <button onClick={toggleTheme} style={{ color: 'var(--text2)', padding: 8, borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>
              {user?.name?.[0] || 'A'}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>{user?.name}</span>
          </div>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 8,
            background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)',
            color: 'var(--accent2)', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600,
          }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div style={{ flex: 1, padding: '32px 28px', maxWidth: 1320, width: '100%', margin: '0 auto' }}>
        {/* Page title */}
        <div style={{ marginBottom: 32, animation: 'fadeUp 0.4s ease both' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
            Welcome back, {user?.name} 👋
          </h1>
          <p style={{ color: 'var(--text2)' }}>Here's what's happening with your store today.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: 'var(--surface)', padding: 4, borderRadius: 10, width: 'fit-content', border: '1px solid var(--border)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: '8px 20px', borderRadius: 7,
              background: activeTab === t.id ? 'var(--accent)' : 'transparent',
              color: activeTab === t.id ? '#fff' : 'var(--text2)',
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14,
              transition: 'all 0.2s',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ height: 140, background: 'var(--surface)', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s infinite', animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <>
                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
                  <StatCard icon={DollarSign} label="Total Revenue" value={`$${stats.totalSales.toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} sub="All-time sales" color="#43d9ad" delay={0} />
                  <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} sub="Across all time" color="#6c63ff" delay={0.08} />
                  <StatCard icon={Users} label="Active Users" value={stats.totalUsers} sub="Registered users" color="#fbbf24" delay={0.16} />
                  <StatCard icon={Package} label="Products" value={stats.totalProducts} sub="In catalog" color="#ff6b6b" delay={0.24} />
                </div>

                {/* Charts row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
                  {/* Revenue chart */}
                  <div style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: '24px',
                    animation: 'fadeUp 0.5s ease 0.3s both',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Monthly Revenue</h3>
                        <p style={{ color: 'var(--text2)', fontSize: 13 }}>Last 6 months</p>
                      </div>
                      <TrendingUp size={18} color="var(--accent3)" />
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={stats.monthlySales}>
                        <defs>
                          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="month" tick={{ fill: 'var(--text2)', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="revenue" stroke="#6c63ff" strokeWidth={2.5} fill="url(#revGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Category pie */}
                  <div style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: '24px',
                    animation: 'fadeUp 0.5s ease 0.4s both',
                  }}>
                    <div style={{ marginBottom: 24 }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Sales by Category</h3>
                      <p style={{ color: 'var(--text2)', fontSize: 13 }}>Distribution</p>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                          {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8 }} />
                        <Legend formatter={(v) => <span style={{ color: 'var(--text2)', fontSize: 12 }}>{v}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent orders preview */}
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                  animation: 'fadeUp 0.5s ease 0.5s both',
                }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Recent Orders</h3>
                      <p style={{ color: 'var(--text2)', fontSize: 13 }}>Latest 5 orders</p>
                    </div>
                    <button onClick={() => setActiveTab('orders')} style={{ color: 'var(--accent)', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600 }}>View all →</button>
                  </div>
                  <OrderTable orders={orders.slice(0, 5)} onStatusChange={handleStatusChange} onOrderClick={(order) => { setSelectedOrder(order); setShowOrderModal(true); }} />
                </div>
              </>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', animation: 'fadeUp 0.4s ease both' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>All Orders</h3>
                  <p style={{ color: 'var(--text2)', fontSize: 13 }}>{orders.length} total orders</p>
                </div>
                <OrderTable orders={orders} onStatusChange={handleStatusChange} onOrderClick={(order) => { setSelectedOrder(order); setShowOrderModal(true); }} />
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div style={{ display: 'grid', gap: 24, animation: 'fadeUp 0.4s ease both' }}>
                {/* Orders bar */}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Monthly Orders</h3>
                  <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 24 }}>Order volume over time</p>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={stats.monthlySales}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fill: 'var(--text2)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--text2)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="orders" fill="#6c63ff" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Revenue area */}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Revenue Trend</h3>
                  <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 24 }}>Monthly revenue trajectory</p>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={stats.monthlySales}>
                      <defs>
                        <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#43d9ad" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#43d9ad" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fill: 'var(--text2)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="#43d9ad" strokeWidth={2.5} fill="url(#revGrad2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div style={{ animation: 'fadeUp 0.4s ease both' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Product Management</h3>
                    <p style={{ color: 'var(--text2)', fontSize: 13 }}>{products.length} products in catalog</p>
                  </div>
                  <button onClick={() => setShowProductModal(true)} style={{
                    background: 'var(--accent)', color: '#fff', border: 'none', padding: '10px 20px',
                    borderRadius: 8, fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer'
                  }}>
                    Add Product
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                  {products.map(product => (
                    <div key={product._id} style={{
                      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden', transition: 'all 0.2s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ height: 180, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {product.image ? (
                          <Link to={`/product/${product._id}`} style={{ width: '100%', height: '100%', display: 'block' }}>
                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </Link>
                        ) : (
                          <Link to={`/product/${product._id}`} style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={48} color="var(--text2)" />
                          </Link>
                        )}
                      </div>
                      <div style={{ padding: 16 }}>
                        <Link to={`/product/${product._id}`} style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}>
                          {product.name}
                        </Link>
                        <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 8 }}>{product.category}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--accent)' }}>
                            ${product.price}
                          </span>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button style={{
                              padding: '6px 12px', borderRadius: 6, background: 'var(--bg2)', border: '1px solid var(--border)',
                              color: 'var(--text2)', fontSize: 12, cursor: 'pointer'
                            }}>
                              Edit
                            </button>
                            <button onClick={() => handleDeleteProduct(product._id)} style={{
                              padding: '6px 12px', borderRadius: 6, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
                              color: 'var(--accent2)', fontSize: 12, cursor: 'pointer'
                            }}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {products.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text2)' }}>No products found</div>
                )}
              </div>
            )}

            {/* CATEGORIES TAB */}
            {activeTab === 'categories' && (
              <div style={{ animation: 'fadeUp 0.4s ease both' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Category Management</h3>
                    <p style={{ color: 'var(--text2)', fontSize: 13 }}>{categories.length} categories</p>
                  </div>
                  <button onClick={() => setShowCategoryModal(true)} style={{
                    background: 'var(--accent)', color: '#fff', border: 'none', padding: '10px 20px',
                    borderRadius: 8, fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer'
                  }}>
                    Add Category
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
                  {categories.map((category, index) => (
                    <div key={index} style={{
                      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                      padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>{category}</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={{
                          padding: '6px 12px', borderRadius: 6, background: 'var(--bg2)', border: '1px solid var(--border)',
                          color: 'var(--text2)', fontSize: 12, cursor: 'pointer'
                        }}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteCategory(category)} style={{
                          padding: '6px 12px', borderRadius: 6, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
                          color: 'var(--accent2)', fontSize: 12, cursor: 'pointer'
                        }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {categories.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text2)' }}>No categories found</div>
                )}
              </div>
            )}

            {/* BANNERS TAB */}
            {activeTab === 'banners' && (
              <div style={{ animation: 'fadeUp 0.4s ease both' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Banner Management</h3>
                    <p style={{ color: 'var(--text2)', fontSize: 13 }}>{banners.length} banners</p>
                  </div>
                  <button onClick={() => setShowBannerModal(true)} style={{
                    background: 'var(--accent)', color: '#fff', border: 'none', padding: '10px 20px',
                    borderRadius: 8, fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer'
                  }}>
                    Add Banner
                  </button>
                </div>
                <div style={{ display: 'grid', gap: 16 }}>
                  {banners.map(banner => (
                    <div key={banner._id} style={{
                      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                      padding: 20, display: 'flex', gap: 20, alignItems: 'center'
                    }}>
                      <div style={{ width: 120, height: 80, background: 'var(--bg2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {banner.image ? (
                          <img src={banner.image} alt={banner.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', borderRadius: 6 }} />
                        ) : (
                          <Package size={24} color="var(--text2)" />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{banner.title}</h4>
                        <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 8 }}>{banner.description}</p>
                        {banner.link && <a href={banner.link} style={{ color: 'var(--accent)', fontSize: 13 }}>{banner.link}</a>}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={{
                          padding: '6px 12px', borderRadius: 6, background: 'var(--bg2)', border: '1px solid var(--border)',
                          color: 'var(--text2)', fontSize: 12, cursor: 'pointer'
                        }}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteBanner(banner._id)} style={{
                          padding: '6px 12px', borderRadius: 6, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
                          color: 'var(--accent2)', fontSize: 12, cursor: 'pointer'
                        }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {banners.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text2)' }}>No banners found</div>
                )}
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div style={{ animation: 'fadeUp 0.4s ease both' }}>
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Settings</h3>
                  <p style={{ color: 'var(--text2)', fontSize: 13 }}>Configure your store settings</p>
                </div>
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Store Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Store Name</label>
                        <input type="text" defaultValue={settings.storeName || ''} style={{
                          width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)',
                          background: 'var(--bg)', color: 'var(--text)', fontSize: 14
                        }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Contact Email</label>
                        <input type="email" defaultValue={settings.contactEmail || ''} style={{
                          width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)',
                          background: 'var(--bg)', color: 'var(--text)', fontSize: 14
                        }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Payment & Shipping</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Default Shipping Fee</label>
                        <input type="number" defaultValue={settings.shippingFee || 0} style={{
                          width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)',
                          background: 'var(--bg)', color: 'var(--text)', fontSize: 14
                        }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Free Shipping Threshold</label>
                        <input type="number" defaultValue={settings.freeShippingThreshold || 0} style={{
                          width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)',
                          background: 'var(--bg)', color: 'var(--text)', fontSize: 14
                        }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <button style={{
                      padding: '10px 20px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)',
                      color: 'var(--text2)', fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer'
                    }}>
                      Cancel
                    </button>
                    <button onClick={handleSaveSettings} style={{
                      padding: '10px 20px', borderRadius: 8, background: 'var(--accent)', border: 'none',
                      color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer'
                    }}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 24,
            width: '90%', maxWidth: 500, maxHeight: '90vh', overflow: 'auto'
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Add New Product</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              <input
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                style={{ padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
              />
              <input
                placeholder="Price"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                style={{ padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                style={{ padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
              >
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input
                placeholder="Stock Quantity"
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                style={{ padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
              />
              <input
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                style={{ padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
              />
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                rows={3}
                style={{ padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowProductModal(false)} style={{
                flex: 1, padding: '12px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)',
                color: 'var(--text2)', fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer'
              }}>
                Cancel
              </button>
              <button onClick={handleAddProduct} style={{
                flex: 1, padding: '12px', borderRadius: 8, background: 'var(--accent)', border: 'none',
                color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer'
              }}>
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 24,
            width: '90%', maxWidth: 400
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Add New Category</h3>
            <input
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowCategoryModal(false)} style={{
                flex: 1, padding: '12px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)',
                color: 'var(--text2)', fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer'
              }}>
                Cancel
              </button>
              <button onClick={handleAddCategory} style={{
                flex: 1, padding: '12px', borderRadius: 8, background: 'var(--accent)', border: 'none',
                color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer'
              }}>
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {showBannerModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 24,
            width: '90%', maxWidth: 500
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Add New Banner</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              <input
                placeholder="Banner Title"
                value={newBanner.title}
                onChange={(e) => setNewBanner({...newBanner, title: e.target.value})}
                style={{ padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
              />
              <input
                placeholder="Image URL"
                value={newBanner.image}
                onChange={(e) => setNewBanner({...newBanner, image: e.target.value})}
                style={{ padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
              />
              <input
                placeholder="Link URL (optional)"
                value={newBanner.link}
                onChange={(e) => setNewBanner({...newBanner, link: e.target.value})}
                style={{ padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
              />
              <textarea
                placeholder="Description"
                value={newBanner.description}
                onChange={(e) => setNewBanner({...newBanner, description: e.target.value})}
                rows={3}
                style={{ padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowBannerModal(false)} style={{
                flex: 1, padding: '12px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)',
                color: 'var(--text2)', fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer'
              }}>
                Cancel
              </button>
              <button onClick={handleAddBanner} style={{
                flex: 1, padding: '12px', borderRadius: 8, background: 'var(--accent)', border: 'none',
                color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer'
              }}>
                Add Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 24,
            width: '90%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>Order Details</h3>
              <button onClick={() => { setShowOrderModal(false); setSelectedOrder(null); }} style={{ fontSize: 24, cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text2)' }}>×</button>
            </div>
            <div style={{ display: 'grid', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 4 }}>Customer Name</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 4 }}>Email</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{selectedOrder.email}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 4 }}>Phone</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{selectedOrder.phone || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 4 }}>Status</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>{selectedOrder.status}</p>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 8 }}>Delivery Address</p>
                <p style={{ fontSize: 14 }}>{selectedOrder.address}</p>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 12 }}>Products</p>
                {selectedOrder.products?.map((prod, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontWeight: 600 }}>{prod.name}</p>
                      <p style={{ color: 'var(--text2)', fontSize: 13 }}>Qty: {prod.quantity}</p>
                    </div>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>${(prod.price * prod.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span>Subtotal</span>
                  <span>${selectedOrder.total?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
                  <span>Total</span>
                  <span>${selectedOrder.total?.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button onClick={() => { setShowOrderModal(false); setSelectedOrder(null); }} style={{
                  padding: '12px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)',
                  color: 'var(--text2)', fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer'
                }}>
                  Close
                </button>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    handleStatusChange(selectedOrder._id, e.target.value);
                    setSelectedOrder({ ...selectedOrder, status: e.target.value });
                  }}
                  style={{
                    padding: '12px', borderRadius: 8, background: 'var(--accent)', border: 'none',
                    color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderTable({ orders, onStatusChange, onOrderClick }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--bg2)' }}>
            {['Customer', 'Product', 'Total', 'Status', 'Date'].map(h => (
              <th key={h} style={{
                padding: '12px 20px', textAlign: 'left',
                color: 'var(--text2)', fontSize: 12,
                fontFamily: 'var(--font-display)', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                borderBottom: '1px solid var(--border)',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={o._id} style={{
              borderBottom: '1px solid var(--border)',
              transition: 'background 0.15s',
              cursor: 'pointer'
            }}
              onClick={() => onOrderClick?.(o)}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ padding: '14px 20px' }}>
                <div onClick={(e) => { e.stopPropagation(); onOrderClick?.(o); }} style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, color: 'var(--accent)', cursor: 'pointer' }}>{o.customerName}</div>
                <div style={{ color: 'var(--text2)', fontSize: 12 }}>{o.email}</div>
              </td>
              <td style={{ padding: '14px 20px', color: 'var(--text2)', fontSize: 13 }}>
                {o.products?.[0]?.name || 'N/A'}
                {o.products?.length > 1 && <span style={{ color: 'var(--accent)', fontSize: 11, marginLeft: 6 }}>+{o.products.length - 1}</span>}
              </td>
              <td style={{ padding: '14px 20px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
                ${o.total?.toFixed(2)}
              </td>
              <td style={{ padding: '14px 20px' }}>
                <select
                  value={o.status}
                  onChange={(e) => onStatusChange?.(o._id, e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 16,
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    color: 'var(--text)', fontFamily: 'var(--font-display)', fontWeight: 700,
                  }}
                >
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
              <td style={{ padding: '14px 20px', color: 'var(--text2)', fontSize: 13 }}>
                {new Date(o.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text2)' }}>No orders found</div>
      )}
    </div>
  );
}
