import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Star
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

  const selectedOrder = useMemo(() => orders.find((order) => order.id === selectedOrderId) || null, [orders, selectedOrderId]);

  const loadOrders = useCallback(async () => {
    try {
      const rows = await listOrders();
      setOrders(rows);
      
      const reviewRows = await getAllReviews();
      setReviews(reviewRows);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  }, []);

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

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 30, marginBottom: 6 }}>Admin Dashboard</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>จัดการคำสั่งซื้อจากฐานข้อมูล Supabase และดูภาพรวมยอดขายแบบเรียลไทม์</p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0, marginBottom: 6 }}>รายละเอียดคำสั่งซื้อ</h3>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrderId(null)} style={iconButtonStyle}>
                <X size={16} />
              </button>
            </div>

            <div style={detailSectionStyle}>
              <h4 style={detailTitleStyle}>ข้อมูลลูกค้า</h4>
              <EditableRow label="ชื่อ" icon={<User size={14} />} value={selectedOrder.customer?.name || ''} onBlurSave={(value) => handleAdminFieldChange(selectedOrder.id, 'name', value)} />
              <EditableRow label="โทรศัพท์" value={selectedOrder.customer?.phone || ''} onBlurSave={(value) => handleAdminFieldChange(selectedOrder.id, 'phone', value)} />
              <EditableRow label="อีเมล" value={selectedOrder.customer?.email || ''} onBlurSave={(value) => handleAdminFieldChange(selectedOrder.id, 'email', value)} />
              <EditableTextAreaRow label="ที่อยู่" value={selectedOrder.customer?.address || ''} onBlurSave={(value) => handleAdminFieldChange(selectedOrder.id, 'address', value)} />
            </div>

            <div style={detailSectionStyle}>
              <h4 style={detailTitleStyle}>ข้อมูลออเดอร์</h4>
              <DetailRow label="วันที่สั่ง" value={selectedOrder.date || '-'} icon={<CalendarDays size={14} />} />
              <DetailRow label="วิธีชำระเงิน" value={selectedOrder.payment?.method || selectedOrder.paymentMethod || '-'} icon={<CreditCard size={14} />} />
              <DetailRow label="สถานะ" value={STATUS_OPTIONS.find((item) => item.value === selectedOrder.status)?.label || selectedOrder.status} icon={<Package size={14} />} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                <SmallCard label="ยอดสินค้า" value={formatPrice(selectedOrder.totals?.subtotal || 0)} />
                <SmallCard label="ค่าส่ง" value={formatPrice(selectedOrder.totals?.shipping || 0)} />
                <SmallCard label="ยอดรวม" value={formatPrice(selectedOrder.totals?.total || 0)} accent />
              </div>
            </div>

            <div style={detailSectionStyle}>
              <h4 style={detailTitleStyle}>รายการสินค้า</h4>
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
              <h4 style={detailTitleStyle}>จัดการหลังบ้าน</h4>
              <label style={labelStyle}>เลขพัสดุ</label>
              <div style={{ position: 'relative', marginBottom: 10 }}>
                <Truck size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input
                  defaultValue={selectedOrder.admin?.trackingNo || ''}
                  onBlur={(e) => handleAdminFieldChange(selectedOrder.id, 'trackingNo', e.target.value)}
                  placeholder="เช่น TH123456789"
                  style={{ ...fieldStyle, width: '100%', paddingLeft: 30 }}
                />
              </div>

              <label style={labelStyle}>บันทึกภายในทีมงาน</label>
              <textarea
                defaultValue={selectedOrder.admin?.note || ''}
                onBlur={(e) => handleAdminFieldChange(selectedOrder.id, 'note', e.target.value)}
                placeholder="หมายเหตุสำหรับแอดมิน"
                rows={3}
                style={{ ...fieldStyle, width: '100%', resize: 'vertical', padding: 10, height: 'auto' }}
              />
            </div>
          </div>
        </div>
      )}
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
