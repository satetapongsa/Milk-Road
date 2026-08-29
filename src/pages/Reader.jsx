import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Lock, ShieldCheck, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Minimize, AlertTriangle, Layers, FileText, EyeOff } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import CCNAInteractiveReader from '../components/CCNAInteractiveReader';

export default function Reader() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, getProductById } = useProducts();
    const product = getProductById(id) || products[0];
    const { currentUser, isLoggedIn, isAdmin, openAuthModal } = useAuth();

    const [currentPage, setCurrentPage] = useState(1);
    const [zoom, setZoom] = useState(100);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(0);
    const [isScreenObscured, setIsScreenObscured] = useState(false);

    // Chapter outline with rich high-yield study content
    const chapters = [
        {
            title: "บทที่ 1: เซลล์และการลำเลียงสาร (Cell Biology & Membrane Transport)",
            page: 1,
            summary: "สรุปโครงสร้างเซลล์ ออร์แกเนลล์ เยื่อหุ้มเซลล์ การลำเลียงสารแบบ Passive & Active Transport และการแบ่งเซลล์ Mitosis vs Meiosis"
        },
        {
            title: "บทที่ 2: การหายใจระดับเซลล์ & สังเคราะห์แสง (Cellular Respiration & Photosynthesis)",
            page: 25,
            summary: "กระบวนการ Glycolysis, Krebs Cycle, ETC (ได้ 30-32 ATP) และการสังเคราะห์ด้วยแสง Light Reaction vs Calvin Cycle"
        },
        {
            title: "บทที่ 3: พันธุศาสตร์ & เทคโนโลยี DNA (Genetics & Molecular Biology)",
            page: 55,
            summary: "กฎของเมนเดล, Central Dogma (Replication, Transcription, Translation), การผ่าเหล่า Mutation และเทคโนโลยี PCR & Gel Electrophoresis"
        },
        {
            title: "บทที่ 4: กายวิภาคและสรีรวิทยาของมนุษย์ (Human Anatomy & Physiology)",
            page: 85,
            summary: "ระบบย่อยอาหาร (Enzymes & pH), ระบบประสาท (Action Potential Na+/K+), และระบบภูมิคุ้มกัน B-cell & T-cell"
        },
        {
            title: "บทที่ 5: นิเวศวิทยา & วิวัฒนาการ (Ecology & Evolution)",
            page: 120,
            summary: "ห่วงโซ่อาหาร กฎ 10%, การทดแทนทางนิเวศวิทยา และกฎสมดุลฮาร์ดี-ไวน์เบิร์ก (Hardy-Weinberg Equation: p² + 2pq + q² = 1)"
        }
    ];

    // =========================================================================
    // DRM SECURITY & SOLID BLACK SCREENSHOT PROTECTION (BLACKOUT SHIELD)
    // =========================================================================
    useEffect(() => {
        const preventDefaultAction = (e) => e.preventDefault();

        // 1. Disable Context Menu, Copy, Cut, Selection & Dragging
        document.addEventListener('contextmenu', preventDefaultAction);
        document.addEventListener('copy', preventDefaultAction);
        document.addEventListener('cut', preventDefaultAction);
        document.addEventListener('selectstart', preventDefaultAction);
        document.addEventListener('dragstart', preventDefaultAction);

        // 2. Blackout Screen on Window Blur, Visibility Hidden, or Mouse Leave (Snipping Tool Guard)
        const handleBlur = () => setIsScreenObscured(true);
        const handleFocus = () => setIsScreenObscured(false);
        const handleVisibilityChange = () => {
            if (document.hidden) setIsScreenObscured(true);
            else setIsScreenObscured(false);
        };

        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // 3. Disable Keyboard Capture Shortcuts & Clear Clipboard on PrtScn
        const handleKeyDown = (e) => {
            if (
                e.key === 'PrintScreen' ||
                (e.key === 's' && (e.metaKey || e.shiftKey)) ||
                (e.ctrlKey && ['p', 's', 'c', 'u', 'a'].includes(e.key.toLowerCase())) ||
                (e.metaKey && ['p', 's', 'c', 'u', 'a'].includes(e.key.toLowerCase())) ||
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))
            ) {
                e.preventDefault();
                setIsScreenObscured(true);
                if (navigator.clipboard) {
                    navigator.clipboard.writeText('🛡️ STUDYROAD PROTECTED CONTENT - SCREENSHOT BLOCKED').catch(() => {});
                }
                setTimeout(() => setIsScreenObscured(false), 2000);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', preventDefaultAction);
            document.removeEventListener('copy', preventDefaultAction);
            document.removeEventListener('cut', preventDefaultAction);
            document.removeEventListener('selectstart', preventDefaultAction);
            document.removeEventListener('dragstart', preventDefaultAction);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const totalPages = 150;

    if (product?.is_ccna_reader || String(id) === '7') {
        return <CCNAInteractiveReader product={product} />;
    }

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', userSelect: 'none', WebkitUserSelect: 'none' }}>
            
            {/* DRM Print & Screenshot CSS Guard */}
            <style>{`
                @media print {
                    body { display: none !important; }
                }
                .no-copy {
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
            `}</style>

            {/* SOLID BLACKOUT SCREEN OBSCURED OVERLAY (SCREENSHOT BLACKOUT SHIELD) */}
            {isScreenObscured && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: '#000000',
                    zIndex: 999999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    padding: '40px',
                    textAlign: 'center'
                }}>
                    <div style={{ background: '#1e1b4b', padding: 24, borderRadius: '50%', marginBottom: 20, border: '2px solid #6366f1' }}>
                        <EyeOff size={56} color="#818cf8" />
                    </div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', marginBottom: 10, letterSpacing: 1 }}>
                        🛡️ SCREENSHOT PROTECTION ACTIVE
                    </h2>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#a5b4fc', marginBottom: 12 }}>
                        เนื้อหาถูกซ่อนเพื่อป้องกันการบันทึกภาพหน้าจอ (Solid Blackout Guard)
                    </h3>
                    <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 500, lineHeight: 1.6 }}>
                        ระบบตรวจจับการแคปภาพหน้าจอหรือเปลี่ยนหน้าต่าง ระบบทำการจอดำ (Pure Black) เพื่อปกป้องลิขสิทธิ์หนังสือ<br />
                        กรุณากลับมาที่หน้าต่างเบราว์เซอร์หลักเพื่ออ่านต่อตามปกติ
                    </p>
                </div>
            )}

            {/* Top Reader Navigation Header (Indigo / Purple Homepage Theme) */}
            <header style={{ 
                background: '#ffffff', 
                borderBottom: '1px solid #e2e8f0', 
                padding: '12px 24px', 
                position: 'sticky', 
                top: 0, 
                zIndex: 100,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button 
                        onClick={() => navigate(-1)} 
                        style={{ 
                            background: '#f1f5f9', 
                            border: '1px solid #cbd5e1', 
                            borderRadius: '8px', 
                            padding: '8px 12px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            color: '#334155',
                            fontSize: '13px',
                            fontWeight: 600
                        }}
                    >
                        <ArrowLeft size={16} /> กลับ
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src="/images/logo.png" alt="StudyRoad" style={{ height: 32, borderRadius: 6 }} />
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                                {product?.name || 'สรุปชีทเรียนออนไลน์'}
                                <span style={{ background: '#eef2ff', color: '#4f46e5', fontSize: 10, padding: '2px 8px', borderRadius: 12, border: '1px solid #c7d2fe', fontWeight: 700 }}>
                                    <ShieldCheck size={11} style={{ verticalAlign: 'middle', marginRight: 2 }} /> DRM Protected
                                </span>
                            </div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>
                                โหมดอ่านในระบบเว็บ (StudyRoad Light Reader) | ลิขสิทธิ์เฉพาะผู้ซื้อเท่านั้น
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reader Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Zoom Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: 8, padding: 4, border: '1px solid #e2e8f0' }}>
                        <button 
                            onClick={() => setZoom(Math.max(75, zoom - 15))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#475569' }}
                            title="ย่อขนาด"
                        >
                            <ZoomOut size={16} />
                        </button>
                        <span style={{ fontSize: 12, fontWeight: 600, padding: '0 8px', color: '#334155', minWidth: 44, textAlign: 'center' }}>
                            {zoom}%
                        </span>
                        <button 
                            onClick={() => setZoom(Math.min(150, zoom + 15))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#475569' }}
                            title="ขยายขนาด"
                        >
                            <ZoomIn size={16} />
                        </button>
                    </div>

                    {/* Page Navigation */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f1f5f9', padding: '4px 10px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <button 
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            style={{ background: 'none', border: 'none', cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1, padding: 2 }}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>
                            หน้า {currentPage} / {totalPages}
                        </span>
                        <button 
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            style={{ background: 'none', border: 'none', cursor: currentPage === totalPages ? 'default' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1, padding: 2 }}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Fullscreen Button (Homepage Theme Gradient) */}
                    <button 
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        style={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
                        {isFullscreen ? 'ออกจากเต็มจอ' : 'เต็มจอ'}
                    </button>
                </div>
            </header>

            {/* Main Reader Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: isFullscreen ? '1fr' : '280px 1fr', minHeight: 'calc(100vh - 65px)' }}>
                {/* Left Sidebar: My Library & Chapter Navigation */}
                {!isFullscreen && (
                    <aside style={{ 
                        background: '#ffffff', 
                        borderRight: '1px solid #e2e8f0', 
                        padding: '20px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 20 
                    }}>
                        <div>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Layers size={14} color="#6366f1" /> สารบัญบทเรียน (Contents)
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {chapters.map((ch, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedChapter(idx);
                                            setCurrentPage(ch.page);
                                        }}
                                        style={{
                                            textAlign: 'left',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid',
                                            borderColor: selectedChapter === idx ? '#6366f1' : '#f1f5f9',
                                            background: selectedChapter === idx ? '#eef2ff' : '#f8fafc',
                                            color: selectedChapter === idx ? '#4f46e5' : '#334155',
                                            fontSize: '12px',
                                            fontWeight: selectedChapter === idx ? 700 : 500,
                                            cursor: 'pointer',
                                            lineHeight: 1.4,
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        {ch.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <FileText size={14} color="#6366f1" /> คลังชีทสรุปของฉัน
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {products.slice(0, 4).map(p => (
                                    <div 
                                        key={p.id}
                                        onClick={() => navigate(`/reader/${p.id}`)}
                                        style={{
                                            padding: '8px 10px',
                                            borderRadius: 6,
                                            background: p.id === product?.id ? '#eef2ff' : '#ffffff',
                                            border: '1px solid',
                                            borderColor: p.id === product?.id ? '#818cf8' : '#e2e8f0',
                                            fontSize: 11,
                                            fontWeight: 600,
                                            color: '#1e293b',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        📖 {p.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                )}

                {/* Center Canvas: Paper Reader with DRM Watermark */}
                <main style={{ 
                    padding: '30px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    background: '#f1f5f9',
                    overflowY: 'auto',
                    position: 'relative'
                }} className="no-copy">
                    
                    {/* Mandatory Auth Guard Overlay */}
                    {!isLoggedIn && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(255, 255, 255, 0.96)',
                            backdropFilter: 'blur(10px)',
                            zIndex: 100,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px',
                            textAlign: 'center'
                        }}>
                            <div style={{ background: '#eef2ff', color: '#4f46e5', padding: 20, borderRadius: '50%', marginBottom: 16 }}>
                                <Lock size={48} />
                            </div>
                            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
                                🔒 จำเป็นต้องเข้าสู่ระบบก่อนเข้าอ่านไฟล์สรุป
                            </h2>
                            <p style={{ fontSize: 14, color: '#64748b', maxWidth: 460, marginBottom: 24, lineHeight: 1.6 }}>
                                ทุกคนจำเป็นต้องมีบัญชีสมาชิกก่อนเข้าชมหรืออ่านไฟล์สรุปในระบบ กรุณาสมัครสมาชิกหรือเข้าสู่ระบบ หรือใช้บัญชีแอดมินเพื่อสิทธิ์การเข้าถึงทุกไฟล์ถาวร
                            </p>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button
                                    onClick={() => openAuthModal('กรุณาสมัครสมาชิกหรือเข้าสู่ระบบเพื่ออ่านไฟล์สรุป')}
                                    style={{
                                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: 10,
                                        fontWeight: 700,
                                        fontSize: 14,
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                                    }}
                                >
                                    🔑 สมัครสมาชิก / เข้าสู่ระบบ
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Paper Document Container (Light Theme Matching Homepage Accent) */}
                    <div 
                        style={{
                            width: '100%',
                            maxWidth: `${780 * (zoom / 100)}px`,
                            background: '#ffffff',
                            borderRadius: '16px',
                            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)',
                            padding: '50px 60px',
                            minHeight: `${1050 * (zoom / 100)}px`,
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid #e2e8f0',
                            transition: 'width 0.2s ease, min-height 0.2s ease'
                        }}
                    >
                        {/* DRM Security Watermark Overlay */}
                        <div 
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                pointerEvents: 'none',
                                opacity: 0.08,
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '80px',
                                padding: '40px',
                                transform: 'rotate(-25deg) scale(1.2)',
                                zIndex: 10
                            }}
                        >
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} style={{ fontSize: 18, fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: 2 }}>
                                    STUDYROAD PROTECTED • LICENSED COPY
                                </div>
                            ))}
                        </div>

                        {/* Document Header */}
                        <div style={{ borderBottom: '2px solid #4f46e5', paddingBottom: 16, marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                                    {chapters[selectedChapter]?.title || 'บทเรียนชีววิทยา'}
                                </span>
                                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '8px 0 0 0' }}>
                                    {product?.name || 'สรุปชีววิทยา ม.4-6 A-Level High-Yield'}
                                </h1>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: 11, color: '#64748b' }}>
                                <div>สิทธิ์การอ่าน: ถาวร (Lifetime)</div>
                                <div>หน้า {currentPage} / {totalPages}</div>
                            </div>
                        </div>

                        {/* Document Body Content */}
                        <div style={{ color: '#1e293b', lineHeight: 1.8, fontSize: 14, minHeight: 650 }}>
                            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, borderLeft: '4px solid #4f46e5', marginBottom: 24 }}>
                                <strong style={{ color: '#4f46e5', display: 'block', marginBottom: 4 }}>💡 หัวข้อประจำหน้า {currentPage}:</strong>
                                <p style={{ margin: 0, fontSize: 13, color: '#334155', fontWeight: 600 }}>
                                    {currentPage <= 24 && "บทที่ 1: เซลล์และการลำเลียงสาร (Cell Biology & Membrane Transport)"}
                                    {currentPage >= 25 && currentPage <= 54 && "บทที่ 2: การหายใจระดับเซลล์ & สังเคราะห์แสง (Cellular Respiration & Photosynthesis)"}
                                    {currentPage >= 55 && currentPage <= 84 && "บทที่ 3: พันธุศาสตร์ & เทคโนโลยี DNA (Genetics & Molecular Biology)"}
                                    {currentPage >= 85 && currentPage <= 119 && "บทที่ 4: กายวิภาคและสรีรวิทยาของมนุษย์ (Human Anatomy & Physiology)"}
                                    {currentPage >= 120 && "บทที่ 5: นิเวศวิทยา & วิวัฒนาการ (Ecology & Evolution)"}
                                </p>
                            </div>

                            {/* Dynamic Content Switcher per Page */}
                            {currentPage % 4 === 1 && (
                                <div>
                                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#4f46e5', marginBottom: 12 }}>
                                        หัวข้อย่อยที่ {Math.ceil(currentPage / 5)}.1: สรุปหลักการสำคัญและคีย์เวิร์ดออกสอบบ่อย (High-Yield Core Concepts)
                                    </h3>
                                    <p style={{ marginBottom: 16 }}>
                                        ในหมวดนี้ ข้อสอบเตรียมสอบมักจะเน้นวัดความเข้าใจเชิงลึกเกี่ยวกับกลไกสำคัญ และเปรียบเทียบข้อแตกต่างระหว่างระบบต่างๆ ผู้เรียนควรจำโครงสร้างและหน้าที่หลักให้แม่นยำก่อนทำโจทย์
                                    </p>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24, fontSize: 13 }}>
                                        <thead>
                                            <tr style={{ background: '#eef2ff', borderBottom: '2px solid #c7d2fe' }}>
                                                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#312e81' }}>หัวข้อ (Topic)</th>
                                                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#312e81' }}>ประเภท / คุณลักษณะ</th>
                                                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#312e81' }}>จุดเน้นออกสอบ (Exam Key Point)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '10px 12px', fontWeight: 600 }}>โครงสร้างหลัก (Core Structure)</td>
                                                <td style={{ padding: '10px 12px' }}>Double Membrane / Single Membrane</td>
                                                <td style={{ padding: '10px 12px' }}>ออกสอบบ่อยในพาร์ทเปรียบเทียบเซลล์พืช vs เซลล์สัตว์</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '10px 12px', fontWeight: 600 }}>กระบวนการพลังงาน (Energy Transport)</td>
                                                <td style={{ padding: '10px 12px' }}>ATP Synthesis / Proton Gradient</td>
                                                <td style={{ padding: '10px 12px' }}>ใช้ปฏิกิริยา Redox และ Chemiosmosis ในการสร้าง ATP</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '10px 12px', fontWeight: 600 }}>การควบคุมยีน (Gene Expression)</td>
                                                <td style={{ padding: '10px 12px' }}>Transcription & Translation</td>
                                                <td style={{ padding: '10px 12px' }}>เน้นลำดับเบส mRNA (5' ➔ 3') และ Codon Table</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {currentPage % 4 === 2 && (
                                <div>
                                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#4f46e5', marginBottom: 12 }}>
                                        หัวข้อย่อยที่ {Math.ceil(currentPage / 5)}.2: แผนผังกลไกและการคำนวณสูตรสำคัญ (Mechanisms & Formula Cheatsheet)
                                    </h3>
                                    <div style={{ background: '#f1f5f9', padding: 20, borderRadius: 12, marginBottom: 20, border: '1px solid #cbd5e1' }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1e1b4b', marginBottom: 8 }}>📌 สูตรคำนวณและสมการสำคัญประจำบท (Key Equation):</div>
                                        <div style={{ fontFamily: 'monospace', fontSize: 16, color: '#4f46e5', fontWeight: 700, background: '#ffffff', padding: '12px 16px', borderRadius: 8, border: '1px solid #c7d2fe' }}>
                                            {currentPage < 50 ? "Glucose + 6O₂ ➔ 6CO₂ + 6H₂O + 30-32 ATP (Cellular Respiration)" : "p² + 2pq + q² = 1  (Hardy-Weinberg Equilibrium)"}
                                        </div>
                                    </div>
                                    <ul style={{ paddingLeft: 20, margin: 0 }}>
                                        <li style={{ marginBottom: 10 }}>
                                            <strong>ขั้นตอนที่ 1:</strong> เริ่มต้นด้วยการสลายโมเลกุลในไซโทพลาซึม โดยไม่ต้องใช้ออกซิเจน ได้รับสุทธิ 2 ATP + 2 NADH
                                        </li>
                                        <li style={{ marginBottom: 10 }}>
                                            <strong>ขั้นตอนที่ 2:</strong> ลำเลียงเข้าสู่ Matrix ของไมโทคอนเดรีย เปลี่ยน Pyruvate เป็น Acetyl-CoA เพื่อเข้าสู่ Krebs Cycle
                                        </li>
                                        <li style={{ marginBottom: 10 }}>
                                            <strong>ขั้นตอนที่ 3:</strong> ถ่ายทอดอิเล็กตรอนที่ Cristae ปั๊ม H⁺ สร้างแรงดัน Chemiosmotic Gradient ผลิต ATP จำนวนมากที่สุด
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {currentPage % 4 === 3 && (
                                <div>
                                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#4f46e5', marginBottom: 12 }}>
                                        หัวข้อย่อยที่ {Math.ceil(currentPage / 5)}.3: ตัวอย่างตะลุยโจทย์จริงพร้อมวิธีคิดลัด (Real Exam Practice & Step-by-Step Solution)
                                    </h3>
                                    <div style={{ background: '#eef2ff', padding: 20, borderRadius: 12, border: '1px solid #c7d2fe', marginBottom: 20 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#312e81', marginBottom: 6 }}>
                                            📝 ตัวอย่างข้อสอบจริง (Exam Problem #{currentPage}):
                                        </div>
                                        <p style={{ fontSize: 13, color: '#1e293b', marginBottom: 12, lineHeight: 1.6 }}>
                                            ถ้านำเซลล์เม็ดเลือดแดงไปแช่ในสารละลายที่มีความเข้มข้นสูงกว่าภายในเซลล์ (Hypertonic Solution) จะเกิดปรากฏการณ์ใดขึ้น และส่งผลต่อรูปร่างเซลล์อย่างไร?
                                        </p>
                                        <div style={{ background: '#ffffff', padding: 14, borderRadius: 8, fontSize: 13, color: '#15803d', fontWeight: 600, border: '1px solid #bbf7d0' }}>
                                            ✅ เฉลยละเอียด: น้ำภายในเซลล์จะออสโมซิส (Osmosis) ออกสู่ภายนอก ทำให้เซลล์เหี่ยว (Crenation) เนื่องจากความกดดันออสโมติกภายนอกสูงกว่า!
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentPage % 4 === 0 && (
                                <div>
                                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#4f46e5', marginBottom: 12 }}>
                                        หัวข้อย่อยที่ {Math.ceil(currentPage / 5)}.4: สรุปข้อควรระวัง & ช้อยหลอกในห้องสอบ (Exam Pitfalls & Summary)
                                    </h3>
                                    <div style={{ background: '#fef2f2', padding: 18, borderRadius: 12, border: '1px solid #fecaca', marginBottom: 20 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#991b1b', marginBottom: 6 }}>
                                            ⚠️ 3 ช้อยหลอกยอดฮิตที่เด็กหลงผิดบ่อย:
                                        </div>
                                        <ol style={{ paddingLeft: 20, margin: 0, fontSize: 13, color: '#7f1d1d' }}>
                                            <li style={{ marginBottom: 6 }}>อย่าสับสนระหว่าง Facilitated Diffusion กับ Active Transport (Facilitated ไม่ใช้ ATP!)</li>
                                            <li style={{ marginBottom: 6 }}>เซลล์พืชมีไมโทคอนเดรียในการสลายอาหารเพื่อสร้าง ATP เช่นเดียวกับเซลล์สัตว์</li>
                                            <li style={{ marginBottom: 6 }}>ในระยะ Meiosis I จะเกิด Crossing Over ที่ระยะ Prophase I เท่านั้น</li>
                                        </ol>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Page Footer */}
                        <div style={{ position: 'absolute', bottom: 30, left: 60, right: 60, borderTop: '1px solid #f1f5f9', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
                            <span>StudyRoad Official Study Reader • DRM Protected Content</span>
                            <span>หน้า {currentPage}</span>
                        </div>
                    </div>

                    {/* Bottom Navigation Buttons */}
                    <div style={{ marginTop: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
                        <button 
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            style={{ padding: '8px 20px', borderRadius: 8, background: '#ffffff', border: '1px solid #cbd5e1', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                        >
                            ◀ หน้าก่อนหน้า
                        </button>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>
                            {currentPage} / {totalPages}
                        </span>
                        <button 
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            style={{ padding: '8px 20px', borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                        >
                            หน้าถัดไป ▶
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
