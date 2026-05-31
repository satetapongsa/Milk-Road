import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BadgeCheck,
  CalendarDays,
  CircleDot,
  CreditCard,
  Eye,
  LogOut,
  Package,
  Search,
  ShoppingBag,
  Trash2,
  Truck,
  TrendingUp,
  User,
  X,
  Star,
  FileText,
  Printer,
  ExternalLink
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { formatPrice } from '../data/products';
import { clearOrders, deleteOrderById, listOrders, updateOrderById } from '../lib/ordersApi';
import { getAllReviews } from '../lib/reviewsApi';

const ADMIN_SESSION_HOURS = 8;

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'รอดำเนินการ' },
  { value: 'Processing', label: 'กำลังจัดเตรียม' },
  { value: 'Shipped', label: 'จัดส่งแล้ว' },
  { value: 'Completed', label: 'สำเร็จ' },
  { value: 'Cancelled', label: 'ยกเลิก' }
];

const statusVisual = {
  Pending: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  Processing: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  Shipped: { bg: '#ecfeff', color: '#0f766e', border: '#99f6e4' },
  Completed: { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  Cancelled: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' }
};

const CHART_COLORS = ['#4f46e5', '#0891b2', '#16a34a', '#f97316', '#dc2626', '#9333ea'];

const parseThaiOrCommonDate = (raw) => {
  if (!raw || typeof raw !== 'string') return null;

  const direct = new Date(raw);
  if (!Number.isNaN(direct.getTime())) return direct;

  const parts = raw.split(/[./-]/).map((part) => Number(part));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null;

  const [day, month, yearRaw] = parts;
  const year = yearRaw > 2400 ? yearRaw - 543 : yearRaw;
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseOrderDate = (order) => {
  const fromTimestamp = parseThaiOrCommonDate(order.payment?.timestamp);
  if (fromTimestamp) return fromTimestamp;

  const fromDate = parseThaiOrCommonDate(order.date);
  if (fromDate) return fromDate;

  return new Date();
};

const formatChartDate = (date) => {
  try {
    return date.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' });
  } catch {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  
  // Custom Premium States
  const [notifications, setNotifications] = useState([]);
  const [products, setProducts] = useState([]);
  const [emailSendingState, setEmailSendingState] = useState('none');
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const selectedOrder = useMemo(() => orders.find((order) => order.id === selectedOrderId) || null, [orders, selectedOrderId]);

  const triggerLiveNotification = useCallback((order) => {
    // Bubble POP sound effect (Mixkit secure sound file)
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
    audio.play().catch(() => {});
    
    const notifId = Date.now() + Math.random().toString().slice(-4);
    const newNotif = {
      id: notifId,
      title: '🔔 มีออเดอร์สั่งซื้อเข้าใหม่!',
      orderId: order.id,
      customer: order.customer?.name || 'ลูกค้าทั่วไป',
      total: order.totals?.total || 0,
      timestamp: new Date().toLocaleTimeString('th-TH')
    };
    
    setNotifications(prev => [newNotif, ...prev]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notifId));
    }, 6000);
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      const rows = await listOrders();
      setOrders(prev => {
        if (prev && prev.length > 0) {
          const prevIds = new Set(prev.map(o => o.id));
          const newOrders = rows.filter(o => !prevIds.has(o.id));
          if (newOrders.length > 0) {
            newOrders.forEach(order => {
              triggerLiveNotification(order);
            });
          }
        }
        return rows;
      });
      
      const reviewRows = await getAllReviews();
      setReviews(reviewRows);

      // Fetch products to check for low stock
      const prodRes = await fetch('http://localhost:3001/api/products');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.map(p => ({ ...p, price: Number(p.price) })));
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  }, [triggerLiveNotification]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    const loginTimestamp = Number(localStorage.getItem('admin_login_time') || 0);

    if (!isAuthenticated || !loginTimestamp) {
      navigate('/admin-login');
      return;
    }

    const sessionAgeMs = Date.now() - loginTimestamp;
    const maxSessionMs = ADMIN_SESSION_HOURS * 60 * 60 * 1000;

    if (sessionAgeMs > maxSessionMs) {
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_login_time');
      navigate('/admin-login');
      return;
    }

    const initTimer = setTimeout(() => {
      loadOrders();
    }, 0);
    const interval = setInterval(loadOrders, 2500);
    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, [navigate, loadOrders]);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totals?.total || 0), 0);
    const completedOrders = orders.filter((order) => order.status === 'Completed').length;
    const pendingOrders = orders.filter((order) => ['Pending', 'Processing', 'Shipped'].includes(order.status)).length;

    const paymentMethods = orders.reduce((acc, order) => {
      const method = order.payment?.method || order.paymentMethod || 'ไม่ระบุ';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});

    return {
      totalOrders: orders.length,
      totalRevenue,
      completedOrders,
      pendingOrders,
      averageOrderValue: orders.length ? totalRevenue / orders.length : 0,
      paymentMethods
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return orders.filter((order) => {
      const byStatus = statusFilter === 'All' || order.status === statusFilter;
      if (!byStatus) return false;

      if (!q) return true;

      const searchable = [
        order.id,
        order.customer?.name,
        order.customer?.phone,
        order.customer?.email,
        order.payment?.method,
        order.date,
        order.admin?.trackingNo,
        order.admin?.note
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(q);
    });
  }, [orders, search, statusFilter]);

  const topProductsData = useMemo(() => {
    const aggregate = {};

    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.id || item.name;
        if (!key) return;

        if (!aggregate[key]) {
          aggregate[key] = {
            key,
            name: item.name || `สินค้า ${key}`,
            quantity: 0,
            revenue: 0
          };
        }

        const qty = Number(item.quantity || 0);
        const price = Number(item.price || 0);
        aggregate[key].quantity += qty;
        aggregate[key].revenue += qty * price;
      });
    });

    return Object.values(aggregate)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 8);
  }, [orders]);

  const revenueTrendData = useMemo(() => {
    const bucket = {};

    orders.forEach((order) => {
      const date = parseOrderDate(order);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      if (!bucket[key]) {
        bucket[key] = {
          dateKey: key,
          label: formatChartDate(date),
          revenue: 0,
          orders: 0
        };
      }

      bucket[key].revenue += Number(order.totals?.total || 0);
      bucket[key].orders += 1;
    });

    return Object.values(bucket)
      .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
      .slice(-14);
  }, [orders]);

  const paymentChartData = useMemo(
    () =>
      Object.entries(stats.paymentMethods).map(([method, count]) => ({
        name: method,
        value: count
      })),
    [stats.paymentMethods]
  );

  const handleLogout = () => {
    if (!window.confirm('ยืนยันการออกจากระบบ?')) return;
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_login_time');
    navigate('/');
  };

  const handleClearAll = async () => {
    if (!window.confirm('ยืนยันการลบคำสั่งซื้อทั้งหมด?')) return;

    try {
      await clearOrders();
      setSelectedOrderId(null);
      await loadOrders();
    } catch (error) {
      console.error('Failed to clear orders:', error);
      alert('ลบข้อมูลไม่สำเร็จ กรุณาลองใหม่');
    }
  };

  const handleDeleteOrder = async (targetId) => {
    if (!window.confirm(`ยืนยันการลบคำสั่งซื้อ ${targetId}?`)) return;

    try {
      await deleteOrderById(targetId);
      if (selectedOrderId === targetId) setSelectedOrderId(null);
      await loadOrders();
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert('ลบคำสั่งซื้อไม่สำเร็จ');
    }
  };

  const handleStatusChange = async (targetId, nextStatus) => {
    try {
      await updateOrderById(targetId, { status: nextStatus });
      await loadOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('อัปเดตสถานะไม่สำเร็จ');
    }
  };

  const handleAdminFieldChange = async (targetId, field, value) => {
    try {
      const target = orders.find((order) => order.id === targetId);
      if (!target) return;

      if (field === 'trackingNo' || field === 'note') {
        await updateOrderById(targetId, {
          admin: {
            ...target.admin,
            [field]: value
          }
        });
      }

      if (['name', 'phone', 'email', 'address'].includes(field)) {
        await updateOrderById(targetId, {
          customer: {
            ...target.customer,
            [field]: value
          }
        });
      }

      await loadOrders();
    } catch (error) {
      console.error('Failed to update order field:', error);
      alert('บันทึกข้อมูลไม่สำเร็จ');
    }
  };

  const handleSimulateShipping = async (targetId) => {
    try {
      const target = orders.find((order) => order.id === targetId);
      if (!target) return;
      
      const tracking = 'TH-' + Math.floor(10000000 + Math.random() * 90000000);
      
      await updateOrderById(targetId, {
        status: 'Shipped',
        admin: {
          ...target.admin,
          trackingNo: tracking,
          note: (target.admin?.note ? target.admin.note + '\n' : '') + '[จำลองแอดมิน] ได้กดจำลองจัดส่งด่วนและสร้างเลขพัสดุอัตโนมัติ'
        }
      });
      await loadOrders();
    } catch (error) {
      console.error('Failed to simulate shipping:', error);
      alert('จำลองการจัดส่งล้มเหลว');
    }
  };

  const handleSendEmailSimulate = async (orderId) => {
    setEmailSendingState('sending');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setEmailSendingState('success');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setEmailSendingState('none');
  };

  const handleExportSalesReportPDF = async () => {
    setIsExportingPDF(true);
    setTimeout(async () => {
      try {
        const html2pdf = (await import('html2pdf.js')).default;
        const element = document.getElementById('sales-report-pdf-template');
        const opt = {
          margin: 10,
          filename: `executive-sales-report-${new Date().toISOString().slice(0, 10)}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(element).save();
      } catch (error) {
        console.error('Failed to export PDF:', error);
        alert('เกิดข้อผิดพลาดในการดาวน์โหลด PDF');
      } finally {
        setIsExportingPDF(false);
      }
    }, 150);
  };

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 48 }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        
        {/* Top Navigation Bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <Link to="/admin" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                 แดชบอร์ดออเดอร์
            </Link>
            <Link to="/admin/products" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white' }}>
                <Package size={18} /> จัดการสินค้า
            </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 30, marginBottom: 6 }}>Admin Dashboard</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>จัดการคำสั่งซื้อจากฐานข้อมูล Neon (PostgreSQL) และดูภาพรวมยอดขายแบบเรียลไทม์</p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={handleExportSalesReportPDF}
              disabled={isExportingPDF}
              style={{
                ...secondaryButtonStyle,
                background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)'
              }}
            >
              <FileText size={15} />
              {isExportingPDF ? 'กำลังสร้างรายงาน PDF...' : '📊 ออกรายงานผู้บริหาร (PDF)'}
            </button>
            <button onClick={handleClearAll} style={dangerButtonStyle}>
              <Trash2 size={15} />
              ลบคำสั่งซื้อทั้งหมด
            </button>
            <button onClick={handleLogout} style={secondaryButtonStyle}>
              <LogOut size={15} />
              ออกจากระบบ
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, marginBottom: 18 }}>
          <StatCard icon={<ShoppingBag size={22} color="#4f46e5" />} label="คำสั่งซื้อทั้งหมด" value={String(stats.totalOrders)} />
          <StatCard icon={<TrendingUp size={22} color="#16a34a" />} label="รายได้รวม" value={formatPrice(stats.totalRevenue)} />
          <StatCard icon={<BadgeCheck size={22} color="#0f766e" />} label="สำเร็จแล้ว" value={String(stats.completedOrders)} />
          <StatCard icon={<CircleDot size={22} color="#ea580c" />} label="ระหว่างดำเนินการ" value={String(stats.pendingOrders)} />
          <StatCard icon={<CreditCard size={22} color="#2563eb" />} label="ค่าเฉลี่ยต่อออเดอร์" value={formatPrice(stats.averageOrderValue)} />
        </div>

        {/* LOW STOCK ALERT WIDGET */}
        {(() => {
          const lowStockProducts = products.filter(p => p.stock_quantity < 10);
          if (lowStockProducts.length === 0) return null;
          return (
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 12,
              padding: 16,
              marginBottom: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#b45309', fontWeight: 700, fontSize: 15 }}>
                <span>🚨 ตรวจพบสินค้าใกล้หมดคลัง ({lowStockProducts.length} รายการ)</span>
                <span style={{ fontSize: 11, background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 999, marginLeft: 'auto', fontWeight: 600 }}>
                  สต็อกต่ำกว่า 10 ชิ้น
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
                {lowStockProducts.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'white', padding: '8px 12px', borderRadius: 8, border: '1px solid #fef08a', fontSize: 13, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={p.image} style={{ width: 28, height: 28, borderRadius: 4, objectFit: 'cover', border: '1px solid #f1f5f9' }} alt="" />
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                    </div>
                    <span style={{ color: p.stock_quantity === 0 ? '#dc2626' : '#d97706', fontWeight: 700 }}>
                      {p.stock_quantity === 0 ? 'หมดสต็อก ❌' : `เหลือเพียง ${p.stock_quantity} ชิ้น`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14, marginBottom: 18 }}>
          <section style={sectionStyle}>
            <h3 style={sectionTitleStyle}>แนวโน้มยอดขายรายวัน (14 วันล่าสุด)</h3>
            {revenueTrendData.length === 0 ? (
              <EmptySection text="ยังไม่มีข้อมูลยอดขาย" />
            ) : (
              <div style={{ width: '100%', height: 290 }}>
                <ResponsiveContainer>
                  <LineChart data={revenueTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [name === 'revenue' ? formatPrice(Number(value)) : value, name === 'revenue' ? 'รายได้' : 'จำนวนออเดอร์']} />
                    <Legend formatter={(value) => (value === 'revenue' ? 'รายได้' : 'ออเดอร์')} />
                    <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="orders" stroke="#16a34a" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section style={sectionStyle}>
            <h3 style={sectionTitleStyle}>สัดส่วนวิธีชำระเงิน</h3>
            {paymentChartData.length === 0 ? (
              <EmptySection text="ยังไม่มีข้อมูลการชำระเงิน" />
            ) : (
              <div style={{ width: '100%', height: 290 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={paymentChartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                      {paymentChartData.map((entry, index) => (
                        <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} ออเดอร์`, 'จำนวน']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>
        </div>

        {/* Grid for Top Products and Reviews */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14, marginBottom: 18 }}>
            <section style={{ ...sectionStyle, alignSelf: 'start' }}>
              <h3 style={sectionTitleStyle}>สินค้าขายดีสุด (Top 8)</h3>
            {topProductsData.length === 0 ? (
              <EmptySection text="ยังไม่มีข้อมูลสินค้า" />
            ) : (
              <>
                <div style={{ width: '100%', height: 240, marginBottom: 8 }}>
                  <ResponsiveContainer>
                    <BarChart data={topProductsData} layout="vertical" margin={{ left: 0, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value) => [`${value} ชิ้น`, 'ขายได้']} />
                      <Bar dataKey="quantity" fill="#4f46e5" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                  {topProductsData.slice(0, 5).map((product, idx) => (
                    <div key={product.key} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 12 }}>
                        {idx + 1}. {product.name}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{product.quantity} ชิ้น</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* รีวิวล่าสุด */}
          <section style={{ ...sectionStyle, alignSelf: 'start' }}>
            <h3 style={sectionTitleStyle}>รีวิวจากลูกค้า (ล่าสุด)</h3>
            {reviews.length === 0 ? (
              <EmptySection text="ยังไม่มีรีวิวสินค้า" />
            ) : (
              <div style={{ maxHeight: 310, overflowY: 'auto', paddingRight: 4 }}>
                {reviews.slice(0, 10).map((review) => (
                  <div key={review.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{review.product_name || 'ไม่ระบุสินค้า'}</span>
                      <span style={{ display: 'flex', gap: 2 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} color={i < review.rating ? '#f59e0b' : '#e2e8f0'} fill={i < review.rating ? '#f59e0b' : 'none'} />
                        ))}
                      </span>
                    </div>
                    {review.comment && (
                      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-main)', fontStyle: 'italic', background: '#f8fafc', padding: '6px 10px', borderRadius: 6 }}>"{review.comment}"</p>
                    )}
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, textAlign: 'right' }}>
                      {new Date(review.created_at).toLocaleDateString('th-TH')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Order List Section - Full Width */}
        <section style={{ ...sectionStyle, overflowX: 'auto', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
              <h3 style={{ ...sectionTitleStyle, margin: 0 }}>รายการคำสั่งซื้อจากหน้าเว็บ</h3>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ค้นหาเลขออเดอร์/ลูกค้า/โน้ต"
                    style={{ ...fieldStyle, width: 250, paddingLeft: 32 }}
                  />
                </div>

                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...fieldStyle, width: 150 }}>
                  <option value="All">ทุกสถานะ</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <EmptySection text="ไม่พบคำสั่งซื้อที่ตรงเงื่อนไข" />
            ) : (
              <table style={{ width: '100%', minWidth: 1020, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={thStyle}>ออเดอร์</th>
                    <th style={thStyle}>ลูกค้า</th>
                    <th style={thStyle}>รวม</th>
                    <th style={thStyle}>ชำระเงิน</th>
                    <th style={thStyle}>วันที่</th>
                    <th style={thStyle}>สถานะ</th>
                    <th style={{ ...thStyle, width: 100 }}>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const visual = statusVisual[order.status] || statusVisual.Pending;
                    return (
                      <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: 600 }}>{order.id}</div>
                          <small style={{ color: 'var(--text-light)' }}>{(order.items || []).length} รายการสินค้า</small>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: 500 }}>{order.customer?.name || '-'}</div>
                          <small style={{ color: 'var(--text-muted)' }}>{order.customer?.phone || '-'}</small>
                        </td>
                        <td style={{ ...tdStyle, color: '#16a34a', fontWeight: 700 }}>{formatPrice(order.totals?.total || 0)}</td>
                        <td style={tdStyle}>{order.payment?.method || order.paymentMethod || '-'}</td>
                        <td style={tdStyle}>{order.date || '-'}</td>
                        <td style={tdStyle}>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            style={{
                              ...fieldStyle,
                              width: 142,
                              height: 34,
                              borderRadius: 999,
                              fontWeight: 600,
                              color: visual.color,
                              background: visual.bg,
                              border: `1px solid ${visual.border}`
                            }}
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => setSelectedOrderId(order.id)} style={iconButtonStyle} aria-label={`ดูรายละเอียด ${order.id}`}>
                              <Eye size={14} />
                            </button>
                            <button onClick={() => handleDeleteOrder(order.id)} style={dangerIconButtonStyle} aria-label={`ลบ ${order.id}`}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>
      </div>

      {selectedOrder && (
        <div style={overlayStyle} onClick={() => setSelectedOrderId(null)}>
          <div style={drawerStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 16, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, background: '#eef2ff', color: '#4f46e5', padding: '2px 8px', borderRadius: 999, fontWeight: 600, display: 'inline-block', marginBottom: 4 }}>
                  🛒 คำสั่งซื้อออนไลน์
                </span>
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: 18, color: '#0f172a' }}>รายละเอียดคำสั่งซื้อ</h3>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>ID: {selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrderId(null)} style={{ ...iconButtonStyle, width: 32, height: 32, borderRadius: '50%' }}>
                <X size={16} />
              </button>
            </div>

            {/* QUICK ACTIONS BUTTONS ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, marginBottom: 16 }}>
              <a 
                href={`/order/${selectedOrder.id}`} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  height: 40,
                  boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)',
                  transition: 'all 0.2s'
                }}
              >
                <Printer size={16} />
                ดูใบเสร็จ / ดาวน์โหลด PDF ใบเสร็จ
                <ExternalLink size={12} />
              </a>
              
              {['Pending', 'Processing'].includes(selectedOrder.status) && (
                <button
                  onClick={() => handleSimulateShipping(selectedOrder.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    height: 40,
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Truck size={16} />
                  ⚡ จำลองจัดส่งสินค้าและสร้างเลขพัสดุทันที
                </button>
              )}
            </div>

            <div style={detailSectionStyle}>
              <h4 style={{ ...detailTitleStyle, color: '#4f46e5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={15} /> ข้อมูลลูกค้า
              </h4>
              <EditableRow key={`name-${selectedOrder.id}`} label="ชื่อ" icon={<User size={14} />} value={selectedOrder.customer?.name || ''} onBlurSave={(value) => handleAdminFieldChange(selectedOrder.id, 'name', value)} />
              <EditableRow key={`phone-${selectedOrder.id}`} label="โทรศัพท์" value={selectedOrder.customer?.phone || ''} onBlurSave={(value) => handleAdminFieldChange(selectedOrder.id, 'phone', value)} />
              <EditableRow key={`email-${selectedOrder.id}`} label="อีเมล" value={selectedOrder.customer?.email || ''} onBlurSave={(value) => handleAdminFieldChange(selectedOrder.id, 'email', value)} />
              <EditableTextAreaRow key={`address-${selectedOrder.id}`} label="ที่อยู่" value={selectedOrder.customer?.address || ''} onBlurSave={(value) => handleAdminFieldChange(selectedOrder.id, 'address', value)} />
            </div>

            <div style={detailSectionStyle}>
              <h4 style={{ ...detailTitleStyle, color: '#4f46e5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Package size={15} /> ข้อมูลออเดอร์
              </h4>
              <DetailRow label="วันที่สั่ง" value={selectedOrder.date || '-'} icon={<CalendarDays size={14} />} />
              
              {/* BEAUTIFUL PAYMENT METHOD BADGE */}
              <div style={{ display: 'grid', gridTemplateColumns: '92px 1fr', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <CreditCard size={14} />
                  วิธีชำระเงิน
                </span>
                <div>
                  {(() => {
                    const method = selectedOrder.payment?.method || selectedOrder.paymentMethod || 'ไม่ระบุ';
                    if (method.includes('บัตร')) {
                      return (
                        <span style={{ fontSize: 12, fontWeight: 700, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '3px 8px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          💳 บัตรเครดิต/เดบิต (Visa)
                        </span>
                      );
                    } else if (method.includes('พร้อม') || method.includes('Prompt')) {
                      return (
                        <span style={{ fontSize: 12, fontWeight: 700, background: '#ecfeff', color: '#0891b2', border: '1px solid #a5f3fc', padding: '3px 8px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          📱 โอนผ่านพร้อมเพย์
                        </span>
                      );
                    } else {
                      return (
                        <span style={{ fontSize: 12, fontWeight: 700, background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', padding: '3px 8px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          🚚 เก็บเงินปลายทาง (COD)
                        </span>
                      );
                    }
                  })()}
                </div>
              </div>

              <DetailRow label="สถานะ" value={STATUS_OPTIONS.find((item) => item.value === selectedOrder.status)?.label || selectedOrder.status} icon={<CircleDot size={14} />} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 10 }}>
                <SmallCard label="ยอดสินค้า" value={formatPrice(selectedOrder.totals?.subtotal || 0)} />
                <SmallCard label="ค่าส่ง" value={formatPrice(selectedOrder.totals?.shipping || 0)} />
                <SmallCard label="ยอดรวม" value={formatPrice(selectedOrder.totals?.total || 0)} accent />
              </div>
            </div>

            <div style={detailSectionStyle}>
              <h4 style={{ ...detailTitleStyle, color: '#4f46e5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShoppingBag size={15} /> รายการสินค้า
              </h4>
              {(selectedOrder.items || []).map((item, index) => (
                <div key={`${item.id || item.name}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px dashed #e2e8f0' }}>
                  <img src={item.image || '/images/placeholder.png'} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0', flexShrink: 0 }} alt={item.name} />
                  <div style={{ flex: 1, fontSize: 13, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name || 'ไม่ระบุชื่อสินค้า'}</div>
                    <small style={{ color: 'var(--text-muted)' }}>{formatPrice(item.price || 0)} / ชิ้น</small>
                  </div>
                  <div style={{ fontSize: 13, textAlign: 'center' }}>x{item.quantity || 0}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', minWidth: 60 }}>{formatPrice((item.price || 0) * (item.quantity || 0))}</div>
                </div>
              ))}
            </div>

            <div style={detailSectionStyle}>
              <h4 style={{ ...detailTitleStyle, color: '#4f46e5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Truck size={15} /> จัดการหลังบ้าน
              </h4>
              <label style={labelStyle}>เลขพัสดุจัดส่ง</label>
              <div style={{ position: 'relative', marginBottom: 10 }}>
                <Truck size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input
                  key={`trackingNo-${selectedOrder.id}`}
                  defaultValue={selectedOrder.admin?.trackingNo || ''}
                  onBlur={(e) => handleAdminFieldChange(selectedOrder.id, 'trackingNo', e.target.value)}
                  placeholder="เช่น TH123456789"
                  style={{ ...fieldStyle, width: '100%', paddingLeft: 30 }}
                />
              </div>

              <label style={labelStyle}>บันทึกภายในทีมงาน</label>
              <textarea
                key={`note-${selectedOrder.id}`}
                defaultValue={selectedOrder.admin?.note || ''}
                onBlur={(e) => handleAdminFieldChange(selectedOrder.id, 'note', e.target.value)}
                placeholder="หมายเหตุสำหรับการจัดการภายใน..."
                rows={3}
                style={{ ...fieldStyle, width: '100%', resize: 'vertical', padding: 10, height: 'auto' }}
              />

              <button
                type="button"
                onClick={() => handleSendEmailSimulate(selectedOrder.id)}
                style={{
                  width: '100%',
                  marginTop: 12,
                  height: 38,
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#334155',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s'
                }}
              >
                <FileText size={15} />
                ✉️ จำลองส่งใบเสร็จเข้าอีเมลลูกค้า
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMAIL SIMULATION FULL SCREEN OVERLAY */}
      {emailSendingState !== 'none' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'var(--font-main)',
          textAlign: 'center',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {emailSendingState === 'sending' && (
            <div>
              <div className="payment-spinner" style={{
                width: 54,
                height: 54,
                border: '4px solid rgba(255, 255, 255, 0.1)',
                borderTop: '4px solid #4f46e5',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px auto'
              }}></div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>✉️ กำลังจัดเตรียมและจัดส่งใบเสร็จเข้าอีเมล...</h3>
              <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 6 }}>
                ระบบกำลังเรนเดอร์บิล PDF ความละเอียดสูงและส่งหาคุณ {selectedOrder?.customer?.name || 'ลูกค้า'}
              </p>
            </div>
          )}
          {emailSendingState === 'success' && (
            <div style={{ animation: 'bounceIn 0.5s ease-out' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
              }}>
                <BadgeCheck size={36} color="white" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>✓ จัดส่งอีเมลใบเสร็จสำเร็จ!</h3>
              <p style={{ color: '#e2e8f0', fontSize: 13, marginTop: 4 }}>
                ใบเสร็จรับเงินถูกส่งไปยัง {selectedOrder?.customer?.email || 'อีเมลลูกค้า'} เรียบร้อยแล้ว
              </p>
            </div>
          )}
        </div>
      )}

      {/* REAL-TIME NEW ORDER NOTIFICATION TOASTS */}
      <div style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 380,
        width: '100%'
      }}>
        {notifications.map(n => (
          <div key={n.id} style={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderLeft: '5px solid #10b981',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
            borderRadius: 12,
            padding: '16px 20px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            animation: 'slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fontFamily: 'var(--font-main)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#10b981', fontSize: 14, fontWeight: 700 }}>{n.title}</strong>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>{n.timestamp}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', fontFamily: 'monospace' }}>
              ID: {n.orderId}
            </div>
            <div style={{ fontSize: 12, color: '#cbd5e1' }}>
              คุณ {n.customer} ชำระยอดรวม <strong>{formatPrice(n.total)}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* SALES PDF EXPORT TEMPLATE */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div id="sales-report-pdf-template" style={{ width: '210mm', padding: '24px', background: 'white', color: '#0f172a', fontFamily: 'sans-serif' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #4f46e5', paddingBottom: 16, marginBottom: 20 }}>
            <div>
              <h1 style={{ margin: 0, color: '#4f46e5', fontSize: 24, fontWeight: 800 }}>PHARM ROAD</h1>
              <p style={{ margin: 4, color: '#64748b', fontSize: 12 }}>รายงานสรุปผลการดำเนินงานและยอดขายผู้บริหาร</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>วันที่ออกเอกสาร: {new Date().toLocaleDateString('th-TH')}</div>
              <div style={{ fontSize: 10, color: '#64748b' }}>รหัสรายงาน: SR-{Date.now().toString().slice(-6)}</div>
            </div>
          </div>

          <h3 style={{ fontSize: 16, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: 8, marginBottom: 12 }}>
            📈 ข้อมูลภาพรวมหลัก (Key Performance Indicators)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>คำสั่งซื้อทั้งหมด</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{stats.totalOrders} ออเดอร์</div>
            </div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>ยอดขายสะสมรวม</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#16a34a' }}>{formatPrice(stats.totalRevenue)}</div>
            </div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>เฉลี่ยต่อคำสั่งซื้อ</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#4f46e5' }}>{formatPrice(stats.averageOrderValue)}</div>
            </div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>อัตราออเดอร์สำเร็จ</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0f766e' }}>{stats.completedOrders} รายการ</div>
            </div>
          </div>

          <h3 style={{ fontSize: 16, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: 8, marginBottom: 12 }}>
            🏆 รายการสินค้าขายดี 5 อันดับแรก (Top Performing Products)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24, fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>อันดับ</th>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>ชื่อสินค้า</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>จำนวนที่ขายได้</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>รายได้รวมสะสม</th>
              </tr>
            </thead>
            <tbody>
              {topProductsData.slice(0, 5).map((p, idx) => (
                <tr key={p.key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px' }}>{idx + 1}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>{p.quantity} ชิ้น</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#16a34a', fontWeight: 700 }}>{formatPrice(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ fontSize: 16, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: 8, marginBottom: 12 }}>
            🧾 รายการคำสั่งซื้อล่าสุด (Recent Transactions Summary)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 30, fontSize: 11 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>รหัสออเดอร์</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>ลูกค้า</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>วิธีชำระ</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>สถานะ</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>ยอดชำระสุทธิ</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px', fontWeight: 600 }}>{o.id}</td>
                  <td style={{ padding: '8px' }}>{o.customer?.name || 'ลูกค้าทั่วไป'}</td>
                  <td style={{ padding: '8px' }}>{o.payment?.method || o.paymentMethod || 'COD'}</td>
                  <td style={{ padding: '8px' }}>{o.status}</td>
                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#4f46e5' }}>{formatPrice(o.totals?.total || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: 20, fontSize: 12, marginTop: 40 }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700 }}>Pharm Road Analytics Suite</p>
              <p style={{ margin: 2, color: '#64748b' }}>รายงานนี้สร้างขึ้นจากคลังข้อมูลจำลอง Neon PostgreSQL</p>
            </div>
            <div style={{ textAlign: 'center', width: 160 }}>
              <div style={{ height: 40, borderBottom: '1px solid #94a3b8', marginBottom: 4 }}></div>
              <p style={{ margin: 0, fontWeight: 600 }}>ลายเซ็นผู้บริหารอนุมัติ</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div style={statCardStyle}>
      <div style={{ width: 34, height: 34, borderRadius: 10, display: 'grid', placeItems: 'center', background: '#f8fafc' }}>{icon}</div>
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{value}</div>
      </div>
    </div>
  );
}

function EmptySection({ text }) {
  return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 26 }}>{text}</div>;
}

function DetailRow({ label, value, icon }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '92px 1fr', gap: 8, marginBottom: 6 }}>
      <div style={{ color: 'var(--text-muted)', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {icon}
        {label}
      </div>
      <div style={{ fontSize: 13, overflowWrap: 'anywhere' }}>{value}</div>
    </div>
  );
}

function EditableRow({ label, value, onBlurSave, icon }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '92px 1fr', gap: 8, marginBottom: 6 }}>
      <div style={{ color: 'var(--text-muted)', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {icon}
        {label}
      </div>
      <input
        defaultValue={value}
        onBlur={(e) => onBlurSave(e.target.value)}
        style={{ border: '1px solid var(--border)', borderRadius: 8, height: 32, padding: '0 8px', fontFamily: 'inherit', fontSize: 13 }}
      />
    </div>
  );
}

function EditableTextAreaRow({ label, value, onBlurSave }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '92px 1fr', gap: 8, marginBottom: 6 }}>
      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{label}</div>
      <textarea
        defaultValue={value}
        onBlur={(e) => onBlurSave(e.target.value)}
        rows={2}
        style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 8, fontFamily: 'inherit', fontSize: 13, resize: 'vertical' }}
      />
    </div>
  );
}

function SmallCard({ label, value, accent = false }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 8, background: accent ? '#eef2ff' : '#fff' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: accent ? '#4338ca' : 'var(--text-main)' }}>{value}</div>
    </div>
  );
}

const sectionStyle = {
  background: '#fff',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: 14,
  boxShadow: 'var(--shadow-sm)'
};

const sectionTitleStyle = {
  marginTop: 0,
  marginBottom: 10,
  fontSize: 17
};

const statCardStyle = {
  background: '#fff',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: 12,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  boxShadow: 'var(--shadow-sm)'
};

const thStyle = {
  textAlign: 'left',
  padding: 10,
  fontSize: 12,
  color: 'var(--text-muted)',
  fontWeight: 600
};

const tdStyle = {
  padding: 10,
  fontSize: 13,
  verticalAlign: 'middle'
};

const fieldStyle = {
  border: '1px solid var(--border)',
  borderRadius: 10,
  height: 36,
  padding: '0 10px',
  fontFamily: 'inherit',
  fontSize: 13,
  background: '#fff'
};

const secondaryButtonStyle = {
  border: '1px solid var(--border)',
  background: '#fff',
  color: 'var(--text-main)',
  borderRadius: 10,
  height: 38,
  padding: '0 12px',
  fontFamily: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
  fontWeight: 600
};

const dangerButtonStyle = {
  border: '1px solid #fecaca',
  background: '#fff5f5',
  color: '#b91c1c',
  borderRadius: 10,
  height: 38,
  padding: '0 12px',
  fontFamily: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
  fontWeight: 600
};

const iconButtonStyle = {
  border: '1px solid var(--border)',
  background: '#fff',
  color: 'var(--text-main)',
  width: 30,
  height: 30,
  borderRadius: 8,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};

const dangerIconButtonStyle = {
  border: '1px solid #fecaca',
  background: '#fff5f5',
  color: '#b91c1c',
  width: 30,
  height: 30,
  borderRadius: 8,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.45)',
  backdropFilter: 'blur(2px)',
  zIndex: 1100,
  display: 'flex',
  justifyContent: 'flex-end'
};

const drawerStyle = {
  width: '100%',
  maxWidth: 500,
  height: '100%',
  overflowY: 'auto',
  background: '#fff',
  padding: 14,
  borderLeft: '1px solid var(--border)',
  boxShadow: '-10px 0 30px rgba(0,0,0,0.12)'
};

const detailSectionStyle = {
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: 10,
  marginBottom: 10
};

const detailTitleStyle = {
  margin: 0,
  marginBottom: 8,
  fontSize: 14
};

const labelStyle = {
  display: 'block',
  marginBottom: 6,
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-muted)'
};
