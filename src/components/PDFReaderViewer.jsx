import { useState } from 'react';
import { BookOpen, Maximize2, Minimize2, ShoppingCart, Check, FileText, Sparkles, Layers } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function PDFReaderViewer({ product, pdfUrl = "/downloads/biology_summary_m46.pdf" }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeChapter, setActiveChapter] = useState('all');
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const chapters = [
        { id: 'ch1', title: 'บทที่ 1: เซลล์และการลำเลียงสาร' },
        { id: 'ch2', title: 'บทที่ 2: การหายใจระดับเซลล์ & สังเคราะห์แสง' },
        { id: 'ch3', title: 'บทที่ 3: พันธุศาสตร์ & เทคโนโลยี DNA' },
        { id: 'ch4', title: 'บทที่ 4: สรีรวิทยาของมนุษย์' },
        { id: 'ch5', title: 'บทที่ 5: นิเวศวิทยา & วิวัฒนาการ' }
    ];

    const handleAddToCart = () => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div 
            style={{ 
                background: '#0f172a', 
                borderRadius: '20px', 
                overflow: 'hidden', 
                border: '1px solid #334155',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                marginTop: '40px',
                position: isFullscreen ? 'fixed' : 'relative',
                top: isFullscreen ? 0 : 'auto',
                left: isFullscreen ? 0 : 'auto',
                width: isFullscreen ? '100vw' : '100%',
                height: isFullscreen ? '100vh' : 'auto',
                zIndex: isFullscreen ? 9999 : 1
            }}
        >
            {/* Toolbar Header */}
            <div style={{ 
                background: 'linear-gradient(135deg, #1e293b, #0f172a)', 
                padding: '16px 24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: '1px solid #334155',
                flexWrap: 'wrap',
                gap: '12px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', padding: '8px', borderRadius: '10px', display: 'flex' }}>
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', gap: 6 }}>
                            📖 ระบบอ่านไฟล์สรุปในเว็บไซต์ (Interactive Web PDF Reader)
                            <span style={{ background: '#4f46e5', color: 'white', fontSize: 10, padding: '2px 8px', borderRadius: 12 }}>
                                Live Preview
                            </span>
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                            {product?.name || 'สรุปชีววิทยา ม.4-6 A-Level High-Yield'}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        style={{
                            background: '#334155',
                            color: '#e2e8f0',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}
                    >
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        {isFullscreen ? 'ย่อหน้าจอ' : 'ขยายเต็มจอ'}
                    </button>

                    <a 
                        href={`/reader/${product?.id || 1}`}
                        style={{
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}
                    >
                        <BookOpen size={16} /> เปิดอ่านแบบเต็มจอ (DRM Light Reader)
                    </a>

                    {product && (
                        <button 
                            onClick={handleAddToCart}
                            style={{
                                background: isAdded ? '#818cf8' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: 'white',
                                border: 'none',
                                padding: '8px 18px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                            }}
                        >
                            {isAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
                            {isAdded ? 'เพิ่มแล้ว' : `สั่งซื้อฉบับเต็ม (฿${product.price})`}
                        </button>
                    )}
                </div>
            </div>

            {/* Chapter Quick Jump Bar */}
            <div style={{ background: '#1e293b', padding: '10px 24px', borderBottom: '1px solid #334155', display: 'flex', gap: '8px', overflowX: 'auto' }}>
                <span style={{ color: '#94a3b8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 4, marginRight: 8, flexShrink: 0 }}>
                    <Layers size={14} /> สารบัญบทเรียน:
                </span>
                {chapters.map(ch => (
                    <button
                        key={ch.id}
                        onClick={() => setActiveChapter(ch.id)}
                        style={{
                            background: activeChapter === ch.id ? '#4f46e5' : '#0f172a',
                            color: activeChapter === ch.id ? 'white' : '#cbd5e1',
                            border: '1px solid #334155',
                            padding: '4px 12px',
                            borderRadius: '16px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            flexShrink: 0,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {ch.title}
                    </button>
                ))}
            </div>

            {/* PDF Embed Area */}
            <div style={{ position: 'relative', height: isFullscreen ? 'calc(100vh - 120px)' : '600px', background: '#334155' }}>
                <iframe
                    src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                    title="PDF Viewer"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none'
                    }}
                />
            </div>

            {/* Bottom Info Bar */}
            <div style={{ background: '#0f172a', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={14} color="#818cf8" /> อ่านฟรีตัวอย่างในเว็บ 2 หน้าแรก | ซื้อสินค้าเพื่อรับสิทธิ์อัปเดตเวอร์ชัน 2026 ฟรีตลอดชีพ
                </span>
                <span>StudyRoad Interactive Reader v2.0</span>
            </div>
        </div>
    );
}
