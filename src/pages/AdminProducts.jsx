import { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Plus, Trash2, Edit3, X, Image as ImageIcon, Search, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../data/products';
import { addProduct, updateProduct, deleteProduct, refillAllStock } from '../lib/productsApi';
import { API_BASE } from '../config';

const ADMIN_SESSION_HOURS = 8;

export default function AdminProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    useEffect(() => {
        const fetchAdminProducts = async () => {
            try {
                const res = await fetch(`${API_BASE}/admin/products`);
                if (!res.ok) throw new Error('Failed to fetch admin products');
                const data = await res.json();
                setProducts(data.map(p => ({ ...p, price: Number(p.price) })));
            } catch (err) {
                console.error("Error fetching admin products:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAdminProducts();
    }, []);
    
    // Auth Check
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('admin_authenticated');
        const loginTimestamp = Number(localStorage.getItem('admin_login_time') || 0);

        if (!isAuthenticated || !loginTimestamp) {
            navigate('/admin-login');
            return;
        }

        const sessionAgeMs = Date.now() - loginTimestamp;
        if (sessionAgeMs > ADMIN_SESSION_HOURS * 60 * 60 * 1000) {
            localStorage.removeItem('admin_authenticated');
            localStorage.removeItem('admin_login_time');
            navigate('/admin-login');
        }
    }, [navigate]);

    const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);
    
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toString().includes(search);
            const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
            return matchSearch && matchCategory;
        });
    }, [products, search, categoryFilter]);

    // DRAWER STATE
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', category: '', price: 0, stock_quantity: 0, image: '', description: '', is_active: true, ingredients: '', origin: '', mfg_date: '', exp_date: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);

    const openDrawer = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name || '',
                category: product.category || '',
                price: product.price || 0,
                stock_quantity: product.stock_quantity || 0,
                image: product.image || '',
                description: product.description || '',
                is_active: product.is_active !== false,
                ingredients: product.ingredients || '',
                origin: product.origin || '',
                mfg_date: product.mfg_date || '',
                exp_date: product.exp_date || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', category: '', price: 0, stock_quantity: 0, image: '', description: '', is_active: true, ingredients: '', origin: '', mfg_date: '', exp_date: '' });
        }
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setEditingProduct(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingProduct) {
                const updated = await updateProduct(editingProduct.id, formData);
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p));
                alert('แก้ไขข้อมูลสำเร็จ');
            } else {
                const added = await addProduct(formData);
                setProducts(prev => [added, ...prev]);
                alert('เพิ่มข้อมูลใหม่สำเร็จ');
            }
            closeDrawer();
        } catch (error) {
            console.error('Failed to save product:', error);
            alert(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message || error}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบออเดอร์ "${name}" ?\n*ข้อควรระวัง: หากลบแล้วจะไม่สามารถกู้กลับมาได้`)) return;
        
        try {
            await deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            alert('ลบข้อมูลสำเร็จ');
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('เกิดข้อผิดพลาด ไม่สามารถลบสินค้าได้ อาจมีออเดอร์ผูกอยู่');
        }
    };

    const handleQuickStockAdjust = async (targetId, delta) => {
        const prod = products.find(p => p.id === targetId);
        if (!prod) return;

        const nextStock = Math.max(0, prod.stock_quantity + delta);
        if (nextStock === prod.stock_quantity) return;

        try {
            await updateProduct(targetId, {
                name: prod.name,
                category: prod.category,
                price: Number(prod.price),
                stock_quantity: nextStock,
                image: prod.image,
                description: prod.description,
                is_active: prod.is_active !== false
            });
            setProducts(prev => prev.map(p => p.id === targetId ? { ...p, stock_quantity: nextStock } : p));
        } catch (error) {
            console.error('Failed to quick adjust stock:', error);
            alert('ปรับคลังสินค้าไม่สำเร็จ');
        }
    };

    const executeBulkRefill = async () => {
        setIsLoading(true);
        try {
            await refillAllStock(1000);
            setProducts(prev => prev.map(p => ({ ...p, stock_quantity: 1000 })));
            alert('เติมสต็อกสินค้าทุกรายการเป็น 1,000 ชิ้นสำเร็จเรียบร้อยแล้ว!');
        } catch (error) {
            console.error('Failed to bulk refill stock:', error);
            alert(`เกิดข้อผิดพลาดในการเติมสต็อก: ${error.message || error}`);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '24px' }}>
            {/* Top Navigation Bar */}
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 12, marginBottom: 24 }}>
                <Link to="/admin" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white' }}>
                    <LayoutDashboard size={18} /> แดชบอร์ดออเดอร์
                </Link>
                <Link to="/admin/products" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Package size={18} /> จัดการสินค้า
                </Link>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', background: 'white', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1 style={{ fontSize: 24, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Package size={28} color="var(--primary)" /> จัดการข้อมูลสินค้าคลัง
                        </h1>
                        <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: 14 }}>
                            ดูแลราคาสินค้า รูปภาพ และสต็อกคงเหลือทั้งหมด
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <button 
                            onClick={() => setIsRefillModalOpen(true)} 
                            disabled={isLoading}
                            className="btn" 
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 8, 
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '24px',
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)',
                                transition: 'all 0.2s ease-in-out'
                            }}
                        >
                            <Package size={18} /> เติมสต็อกทุกสินค้า (1,000 ชิ้น)
                        </button>
                        <button onClick={() => openDrawer()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Plus size={18} /> เพิ่มสินค้าใหม่
                        </button>
                    </div>
                </div>

                <div style={{ padding: 24 }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
                            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="ค้นหาชื่อสินค้า หรือ รหัส..."
                                style={{ width: '100%', padding: '10px 16px 10px 40px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14 }}
                            />
                        </div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={{ padding: '10px 16px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, minWidth: 150 }}
                        >
                            {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'ทุกหมวดหมู่' : c}</option>)}
                        </select>
                    </div>

                    <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 8 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 700 }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                                <tr>
                                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-light)', fontSize: 13 }}>สินค้า</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-light)', fontSize: 13 }}>หมวดหมู่</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-light)', fontSize: 13, textAlign: 'right' }}>ราคาขาย</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-light)', fontSize: 13, textAlign: 'center' }}>สต็อก</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-light)', fontSize: 13, textAlign: 'center' }}>สถานะ</th>
                                    <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-light)', fontSize: 13, textAlign: 'center', width: 100 }}>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>กำลังโหลด...</td></tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>ไม่พบข้อมูลสินค้า...</td></tr>
                                ) : (
                                    filteredProducts.map(product => (
                                        <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
                                                    ) : (
                                                        <div style={{ width: 48, height: 48, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>
                                                            <ImageIcon size={20} />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: 14 }}>{product.name}</div>
                                                        <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>รหัส: {product.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: 14 }}>{product.category}</td>
                                            <td style={{ padding: '12px 16px', fontSize: 14, textAlign: 'right', fontWeight: 600, color: 'var(--primary)' }}>{formatPrice(product.price)}</td>
                                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                 <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                     <button 
                                                         onClick={() => handleQuickStockAdjust(product.id, -1)}
                                                         style={{ width: 24, height: 24, border: '1px solid #cbd5e1', background: 'white', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold', color: '#64748b', outline: 'none' }}
                                                         title="ลดสต็อก 1 ชิ้น"
                                                     >
                                                         -
                                                     </button>
                                                     <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600, minWidth: 60, background: product.stock_quantity > 10 ? '#dcfce7' : product.stock_quantity > 0 ? '#fef08a' : '#fee2e2', color: product.stock_quantity > 10 ? '#16a34a' : product.stock_quantity > 0 ? '#ca8a04' : '#dc2626' }}>
                                                         {product.stock_quantity} ชิ้น
                                                     </span>
                                                     <button 
                                                         onClick={() => handleQuickStockAdjust(product.id, 1)}
                                                         style={{ width: 24, height: 24, border: '1px solid #cbd5e1', background: 'white', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold', color: '#64748b', outline: 'none' }}
                                                         title="เพิ่มสต็อก 1 ชิ้น"
                                                     >
                                                         +
                                                     </button>
                                                 </div>
                                            </td>
                                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: product.is_active ? '#16a34a' : '#64748b' }}>
                                                    {product.is_active ? 'เปิดขาย' : 'ซ่อนไว้'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                                    <button onClick={() => openDrawer(product)} style={{ border: 'none', background: '#f1f5f9', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(product.id, product.name)} style={{ border: 'none', background: '#fee2e2', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#dc2626' }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Editing Drawer Modal */}
            {isDrawerOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(2px)', zIndex: 1100, display: 'flex', justifyContent: 'flex-end' }} onClick={closeDrawer}>
                    <div style={{ width: '100%', maxWidth: 500, height: '100%', background: '#fff', borderLeft: '1px solid var(--border)', boxShadow: '-10px 0 30px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                        
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: 20 }}>{editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
                            <button onClick={closeDrawer} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
                                <X size={24} color="var(--text-light)" />
                            </button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                            <form id="productForm" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>ชื่อสินค้า <span style={{color:'red'}}>*</span></label>
                                        <input required name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="เช่น OG Kush" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>หมวดหมู่ <span style={{color:'red'}}>*</span></label>
                                        <input required name="category" value={formData.category} onChange={handleChange} style={inputStyle} placeholder="เช่น Indica" />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 16 }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>ราคา (บาท) <span style={{color:'red'}}>*</span></label>
                                        <input required type="number" min="0" step="0.01" name="price" value={formData.price} onChange={handleChange} style={inputStyle} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>จำนวนสต็อก (ชิ้น) <span style={{color:'red'}}>*</span></label>
                                        <input required type="number" min="0" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} style={inputStyle} />
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle}>รายละเอียดสินค้า</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} placeholder="บรรยายสรรพคุณ..." />
                                </div>

                                <div style={{ display: 'flex', gap: 16 }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>ส่วนผสมหลัก</label>
                                        <input name="ingredients" value={formData.ingredients} onChange={handleChange} style={inputStyle} placeholder="เช่น Paracetamol 500mg, Starch" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>แหล่งผลิต/ผู้ผลิต</label>
                                        <input name="origin" value={formData.origin} onChange={handleChange} style={inputStyle} placeholder="เช่น ประเทศไทย" />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 16 }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>วันที่ผลิต</label>
                                        <input type="date" name="mfg_date" value={formData.mfg_date} onChange={handleChange} style={inputStyle} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>วันที่หมดอายุ</label>
                                        <input type="date" name="exp_date" value={formData.exp_date} onChange={handleChange} style={inputStyle} />
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle}>URL รูปภาพ (หน้าปก)</label>
                                    <input name="image" value={formData.image} onChange={handleChange} style={inputStyle} placeholder="https://example.com/image.png" />
                                    {formData.image && (
                                        <div style={{ marginTop: 12, border: '1px dashed var(--border)', padding: 8, borderRadius: 8, display: 'inline-block' }}>
                                            <img src={formData.image} alt="Preview" style={{ height: 100, borderRadius: 4, objectFit: 'contain' }} onError={(e) => { e.target.src = '/images/placeholder.png'; }} />
                                        </div>
                                    )}
                                </div>

                                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '16px', border: '1px solid var(--border)', borderRadius: 8, background: formData.is_active ? '#f8fafc' : 'white' }}>
                                    <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} style={{ width: 20, height: 20, cursor: 'pointer' }} />
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>เปิดขายสินค้านี้บนหน้าเว็บ</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>หากชำระเงินไม่เสร็จ หรือสินค้าหมด สามารถปิดไว้ชั่วคราวได้</div>
                                    </div>
                                </label>
                            </form>
                        </div>

                        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 12, justifyContent: 'flex-end', background: '#f8fafc' }}>
                            <button type="button" onClick={closeDrawer} className="btn btn-outline" style={{ background: 'white' }}>ยกเลิก</button>
                            <button type="submit" form="productForm" className="btn btn-primary" disabled={isSaving}>
                                {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Custom Premium Refill Confirmation Modal */}
            {isRefillModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.45)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 16
                }} onClick={() => setIsRefillModalOpen(false)}>
                    <div style={{
                        background: 'white',
                        borderRadius: 20,
                        padding: '32px 24px',
                        maxWidth: 400,
                        width: '100%',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        textAlign: 'center'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{
                            background: '#ecfdf5',
                            color: '#10b981',
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px auto'
                        }}>
                            <Package size={28} />
                        </div>
                        
                        <h3 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                            ยืนยันการเติมสต็อกสินค้า
                        </h3>
                        <p style={{ margin: '0 0 24px 0', fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>
                            คุณต้องการรีเซ็ตและเติมสต็อกของสินค้าทุกรายการในคลังให้เป็น <b>1,000 ชิ้น</b> ใช่หรือไม่?
                        </p>
                        
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button 
                                onClick={() => setIsRefillModalOpen(false)} 
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    borderRadius: 12,
                                    border: '1px solid #cbd5e1',
                                    background: 'white',
                                    color: '#64748b',
                                    fontWeight: 600,
                                    fontSize: 14,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                ยกเลิก
                            </button>
                            <button 
                                onClick={() => {
                                    setIsRefillModalOpen(false);
                                    executeBulkRefill();
                                }} 
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    borderRadius: 12,
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: 14,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                ยืนยันการเติม
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const labelStyle = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-main)' };
const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit' };
