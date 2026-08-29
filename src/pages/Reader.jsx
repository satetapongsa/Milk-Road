import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Lock, ShieldCheck, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Minimize, AlertTriangle, Layers, FileText, EyeOff, Sun, Moon, Bookmark, Compass, Sparkles } from 'lucide-react';
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
    const [themeMode, setThemeMode] = useState('light'); // light | sepia | dark
    const [selectedChapter, setSelectedChapter] = useState(0);
    const [isScreenObscured, setIsScreenObscured] = useState(false);
    const [bookmarkedPages, setBookmarkedPages] = useState([]);

    // Chapter outline for Online Textbooks
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

    // DRM Screenshot Protection
    useEffect(() => {
        const preventDefaultAction = (e) => e.preventDefault();

        document.addEventListener('contextmenu', preventDefaultAction);
        document.addEventListener('copy', preventDefaultAction);
        document.addEventListener('cut', preventDefaultAction);
        document.addEventListener('selectstart', preventDefaultAction);
        document.addEventListener('dragstart', preventDefaultAction);

        const handleBlur = () => setIsScreenObscured(true);
        const handleFocus = () => setIsScreenObscured(false);
        const handleVisibilityChange = () => {
            if (document.hidden) setIsScreenObscured(true);
            else setIsScreenObscured(false);
        };

        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('contextmenu', preventDefaultAction);
            document.removeEventListener('copy', preventDefaultAction);
            document.removeEventListener('cut', preventDefaultAction);
            document.removeEventListener('selectstart', preventDefaultAction);
            document.removeEventListener('dragstart', preventDefaultAction);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const totalPages = 150;

    if (product?.is_ccna_reader || String(id) === '7') {
        return <CCNAInteractiveReader product={product} />;
    }

    const toggleBookmark = (pg) => {
        if (bookmarkedPages.includes(pg)) {
            setBookmarkedPages(bookmarkedPages.filter(p => p !== pg));
        } else {
            setBookmarkedPages([...bookmarkedPages, pg]);
        }
    };

    // Styling configurations based on Theme Mode (Light / Sepia / Dark)
    const getThemeStyles = () => {
        if (themeMode === 'sepia') {
            return {
                bg: '#fbf0d9',
                headerBg: '#f4e6c8',
                paperBg: '#f6ecdc',
                text: '#433422',
                border: '#e6d5b8',
                cardBg: '#efdfc4',
                accent: '#8c5826'
            };
        }
        if (themeMode === 'dark') {
            return {
                bg: '#0f172a',
                headerBg: '#1e293b',
                paperBg: '#1e293b',
                text: '#f8fafc',
                border: '#334155',
                cardBg: '#0f172a',
                accent: '#818cf8'
            };
        }
        return {
            bg: '#f8fafc',
            headerBg: '#ffffff',
            paperBg: '#ffffff',
            text: '#1e293b',
            border: '#e2e8f0',
            cardBg: '#f8fafc',
            accent: '#4f46e5'
        };
    };

    const theme = getThemeStyles();

    return (
        <div style={{ background: theme.bg, minHeight: '100vh', color: theme.text, userSelect: 'none', transition: 'background 0.3s ease, color 0.3s ease' }}>
            
            {/* SOLID BLACKOUT SCREEN OVERLAY */}
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
                    <h2 style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', marginBottom: 10 }}>
                        🛡️ TEXTBOOK PROTECTION ACTIVE
                    </h2>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#a5b4fc' }}>
                        เนื้อหาตำราเรียนถูกปกป้องเพื่อสงวนลิขสิทธิ์
                    </h3>
                </div>
            )}

            {/* Top Toolbar Navigation Header */}
            <header style={{
                height: '64px',
                background: theme.headerBg,
                borderBottom: `1px solid ${theme.border}`,
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button 
                        onClick={() => navigate(-1)} 
                        style={{ 
                            background: theme.bg, 
                            border: `1px solid ${theme.border}`, 
                            borderRadius: '10px', 
                            padding: '8px 14px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            color: theme.text,
                            fontSize: '13px',
                            fontWeight: 700
                        }}
                    >
                        <ArrowLeft size={16} /> ออกจากตำรา
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src="/images/logo.png" alt="StudyRoad" style={{ height: 32, borderRadius: 6 }} />
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: theme.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                                📖 {product?.name || 'ตำราเรียนออนไลน์'}
                                <span style={{ background: '#eef2ff', color: '#4f46e5', fontSize: 10, padding: '2px 8px', borderRadius: 12, border: '1px solid #c7d2fe', fontWeight: 700 }}>
                                    Online Textbook
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reader Controls Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    
                    {/* Theme Switcher Chips */}
                    <div style={{ display: 'flex', background: theme.bg, borderRadius: 12, padding: 3, border: `1px solid ${theme.border}` }}>
                        <button
                            onClick={() => setThemeMode('light')}
                            style={{
                                background: themeMode === 'light' ? '#ffffff' : 'transparent',
                                color: themeMode === 'light' ? '#4f46e5' : '#64748b',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                            }}
                        >
                            <Sun size={14} /> สว่าง
                        </button>
                        <button
                            onClick={() => setThemeMode('sepia')}
                            style={{
                                background: themeMode === 'sepia' ? '#efdfc4' : 'transparent',
                                color: themeMode === 'sepia' ? '#433422' : '#64748b',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}
                        >
                            ☕ ถนอมสายตา
                        </button>
                        <button
                            onClick={() => setThemeMode('dark')}
                            style={{
                                background: themeMode === 'dark' ? '#334155' : 'transparent',
                                color: themeMode === 'dark' ? '#ffffff' : '#64748b',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                            }}
                        >
                            <Moon size={14} /> มืด
                        </button>
                    </div>

                    {/* Bookmark Button */}
                    <button
                        onClick={() => toggleBookmark(currentPage)}
                        style={{
                            background: bookmarkedPages.includes(currentPage) ? '#fef08a' : theme.bg,
                            border: `1px solid ${theme.border}`,
                            color: bookmarkedPages.includes(currentPage) ? '#854d0e' : theme.text,
                            padding: '8px 14px',
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}
                    >
                        <Bookmark size={15} fill={bookmarkedPages.includes(currentPage) ? "#854d0e" : "none"} />
                        {bookmarkedPages.includes(currentPage) ? 'บุ๊กมาร์กแล้ว' : 'บันทึกหน้าที่อ่าน'}
                    </button>

                    {/* Page Navigation */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: theme.bg, padding: '4px 10px', borderRadius: 10, border: `1px solid ${theme.border}` }}>
                        <button 
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            style={{ background: 'none', border: 'none', cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1, padding: 2, color: theme.text }}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span style={{ fontSize: 12, fontWeight: 700, color: theme.text }}>
                            หน้า {currentPage} / {totalPages}
                        </span>
                        <button 
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            style={{ background: 'none', border: 'none', cursor: currentPage === totalPages ? 'default' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1, padding: 2, color: theme.text }}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Reader Workspace */}
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', minHeight: 'calc(100vh - 64px)' }}>
                
                {/* Left Textbook Table of Contents Drawer */}
                <aside style={{
                    background: theme.headerBg,
                    borderRight: `1px solid ${theme.border}`,
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20
                }}>
                    <div>
                        <h4 style={{ fontSize: 12, fontWeight: 800, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Layers size={16} /> สารบัญตำราเรียน (Contents)
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {chapters.map((ch, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setSelectedChapter(idx);
                                        setCurrentPage(ch.page);
                                    }}
                                    style={{
                                        textAlign: 'left',
                                        padding: '12px 14px',
                                        borderRadius: '12px',
                                        border: '1px solid',
                                        borderColor: selectedChapter === idx ? theme.accent : theme.border,
                                        background: selectedChapter === idx ? (themeMode === 'dark' ? '#312e81' : '#eef2ff') : theme.cardBg,
                                        color: selectedChapter === idx ? (themeMode === 'dark' ? '#ffffff' : '#4f46e5') : theme.text,
                                        fontSize: '12px',
                                        fontWeight: selectedChapter === idx ? 800 : 500,
                                        cursor: 'pointer',
                                        lineHeight: 1.5,
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {ch.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', borderTop: `1px solid ${theme.border}`, paddingTop: 16 }}>
                        <h4 style={{ fontSize: 12, fontWeight: 800, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FileText size={16} /> ตำราเรียนอื่นๆ ในคลัง
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {products.slice(0, 4).map(p => (
                                <div 
                                    key={p.id}
                                    onClick={() => navigate(`/reader/${p.id}`)}
                                    style={{
                                        padding: '10px 12px',
                                        borderRadius: 8,
                                        background: p.id === product?.id ? (themeMode === 'dark' ? '#1e293b' : '#eef2ff') : theme.paperBg,
                                        border: '1px solid',
                                        borderColor: p.id === product?.id ? theme.accent : theme.border,
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: theme.text,
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    📘 {p.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Textbook Reading View */}
                <main style={{ 
                    padding: '40px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    background: theme.bg,
                    overflowY: 'auto'
                }}>
                    
                    {/* Textbook Page Container */}
                    <div 
                        style={{
                            width: '100%',
                            maxWidth: '820px',
                            background: theme.paperBg,
                            borderRadius: '24px',
                            boxShadow: themeMode === 'dark' ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px -5px rgba(0,0,0,0.06)',
                            padding: '50px 60px',
                            minHeight: '750px',
                            position: 'relative',
                            border: `1px solid ${theme.border}`,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {/* Page Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, paddingBottom: 16, marginBottom: 32 }}>
                            <div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: theme.accent, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    STUDYROAD ONLINE TEXTBOOK
                                </span>
                                <h1 style={{ fontSize: 20, fontWeight: 800, margin: '4px 0 0 0', color: theme.text }}>
                                    {product?.name || 'ตำราเรียนออนไลน์'}
                                </h1>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: 11, color: theme.text, opacity: 0.7 }}>
                                <div>หน้า {currentPage} / {totalPages}</div>
                                {bookmarkedPages.includes(currentPage) && (
                                    <span style={{ color: '#d97706', fontWeight: 700 }}>🔖 บุ๊กมาร์กแล้ว</span>
                                )}
                            </div>
                        </div>

                        {/* Textbook Body Content (Dynamic Page Renderer) */}
                        <div style={{ color: theme.text, lineHeight: 1.9, fontSize: 15 }}>
                            <div style={{ background: theme.cardBg, padding: 18, borderRadius: 12, borderLeft: `4px solid ${theme.accent}`, marginBottom: 28 }}>
                                <strong style={{ color: theme.accent, display: 'block', marginBottom: 4 }}>💡 สรุปเนื้อหาสำคัญประจำหน้า {currentPage}:</strong>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                                    {currentPage <= 24 && "บทที่ 1: เซลล์และการลำเลียงสาร (Cell Biology & Membrane Transport)"}
                                    {currentPage >= 25 && currentPage <= 54 && "บทที่ 2: การหายใจระดับเซลล์ & สังเคราะห์แสง (Cellular Respiration & Photosynthesis)"}
                                    {currentPage >= 55 && currentPage <= 84 && "บทที่ 3: พันธุศาสตร์ & เทคโนโลยี DNA (Genetics & Molecular Biology)"}
                                    {currentPage >= 85 && currentPage <= 119 && "บทที่ 4: กายวิภาคและสรีรวิทยาของมนุษย์ (Human Anatomy & Physiology)"}
                                    {currentPage >= 120 && "บทที่ 5: นิเวศวิทยา & วิวัฒนาการ (Ecology & Evolution)"}
                                </p>
                            </div>

                            {/* Dynamic Textbook Topic Content */}
                            {currentPage % 4 === 1 && (
                                <div>
                                    <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.accent, marginBottom: 14 }}>
                                        หัวข้อย่อยที่ {Math.ceil(currentPage / 5)}.1: สรุปหลักการและคำศัพท์สำคัญออกสอบบ่อย (High-Yield Core Concepts)
                                    </h3>
                                    <p style={{ marginBottom: 20 }}>
                                        ตำราเรียนหัวข้อนี้เน้นสร้างความเข้าใจเชิงทฤษฎีและเปรียบเทียบการทำงานของระบบต่างๆ ผู้เรียนควรศึกษาตารางสรุปเพื่อความแม่นยำในการทำข้อสอบ
                                    </p>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24, fontSize: 14 }}>
                                        <thead>
                                            <tr style={{ background: theme.cardBg, borderBottom: `2px solid ${theme.border}` }}>
                                                <th style={{ padding: '12px 14px', textAlign: 'left', color: theme.text }}>หัวข้อ (Topic)</th>
                                                <th style={{ padding: '12px 14px', textAlign: 'left', color: theme.text }}>รายละเอียดองค์ความรู้</th>
                                                <th style={{ padding: '12px 14px', textAlign: 'left', color: theme.text }}>จุดออกสอบ (Exam Key Point)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                                <td style={{ padding: '12px 14px', fontWeight: 700 }}>โครงสร้างเยื่อหุ้ม (Membrane Structure)</td>
                                                <td style={{ padding: '12px 14px' }}>Phospholipid Bilayer + Fluid Mosaic Model</td>
                                                <td style={{ padding: '12px 14px' }}>คุณสมบัติ Selective Permeable (เลือกผ่าน)</td>
                                            </tr>
                                            <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                                <td style={{ padding: '12px 14px', fontWeight: 700 }}>การสังเคราะห์พลังงาน (Energy Synthesis)</td>
                                                <td style={{ padding: '12px 14px' }}>Proton Gradient & ATP Synthase Complex</td>
                                                <td style={{ padding: '12px 14px' }}>สร้าง ATP ผ่าน Chemiosmosis Coupling</td>
                                            </tr>
                                            <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                                <td style={{ padding: '12px 14px', fontWeight: 700 }}>รหัสพันธุกรรม (Genetic Code)</td>
                                                <td style={{ padding: '12px 14px' }}>Triplet Codon (AUG Start, UAA/UAG/UGA Stop)</td>
                                                <td style={{ padding: '12px 14px' }}>เน้นทิศทางการอ่านสาย mRNA จาก 5' ไป 3'</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {currentPage % 4 === 2 && (
                                <div>
                                    <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.accent, marginBottom: 14 }}>
                                        หัวข้อย่อยที่ {Math.ceil(currentPage / 5)}.2: สูตรและสมการคำนวณสำคัญ (Textbook Equations & Cheatsheet)
                                    </h3>
                                    <div style={{ background: theme.cardBg, padding: 22, borderRadius: 14, marginBottom: 24, border: `1px solid ${theme.border}` }}>
                                        <div style={{ fontSize: 14, fontWeight: 800, color: theme.text, marginBottom: 8 }}>📌 สมการหลักประจำบทเรียน:</div>
                                        <div style={{ fontFamily: 'monospace', fontSize: 17, color: theme.accent, fontWeight: 800, background: theme.paperBg, padding: '14px 18px', borderRadius: 10, border: `1px solid ${theme.border}` }}>
                                            {currentPage < 50 ? "Glucose + 6O₂ ➔ 6CO₂ + 6H₂O + 30-32 ATP" : "p² + 2pq + q² = 1  (Hardy-Weinberg Equation)"}
                                        </div>
                                    </div>
                                    <ul style={{ paddingLeft: 22, margin: 0 }}>
                                        <li style={{ marginBottom: 12 }}>
                                            <strong>ขั้นตอนที่ 1 (Glycolysis):</strong> สลายโมเลกุลใน Cytosol ได้รับสุทธิ 2 ATP + 2 NADH
                                        </li>
                                        <li style={{ marginBottom: 12 }}>
                                            <strong>ขั้นตอนที่ 2 (Krebs Cycle):</strong> เกิดขึ้นที่ Mitochondrial Matrix สลาย Acetyl-CoA ได้ CO₂ และ Coenzyme
                                        </li>
                                        <li style={{ marginBottom: 12 }}>
                                            <strong>ขั้นตอนที่ 3 (Electron Transport):</strong> เกิดที่ Cristae ปั๊ม H⁺ สร้าง ATP ปริมาณสูงสุด
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {currentPage % 4 === 3 && (
                                <div>
                                    <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.accent, marginBottom: 14 }}>
                                        หัวข้อย่อยที่ {Math.ceil(currentPage / 5)}.3: ตัวอย่างโจทย์คิดวิเคราะห์ (Textbook Case Study & Exercise)
                                    </h3>
                                    <div style={{ background: theme.cardBg, padding: 22, borderRadius: 14, border: `1px solid ${theme.border}`, marginBottom: 24 }}>
                                        <div style={{ fontSize: 15, fontWeight: 800, color: theme.text, marginBottom: 8 }}>
                                            📝 แบบฝึกหัดวิเคราะห์กรณีศึกษา (Case Study #{currentPage}):
                                        </div>
                                        <p style={{ fontSize: 14, color: theme.text, marginBottom: 14, lineHeight: 1.7 }}>
                                            ถ้านำเซลล์เม็ดเลือดแดงไปแช่ในสารละลายที่มีความเข้มข้นสูงกว่าภายในเซลล์ (Hypertonic Solution) จะเกิดปรากฏการณ์ใดขึ้น และส่งผลต่อรูปร่างเซลล์อย่างไร?
                                        </p>
                                        <div style={{ background: theme.paperBg, padding: 16, borderRadius: 10, fontSize: 14, color: '#16a34a', fontWeight: 700, border: '1px solid #bbf7d0' }}>
                                            ✅ เฉลยละเอียด: น้ำภายในเซลล์จะออสโมซิส (Osmosis) ออกสู่ภายนอก ทำให้เซลล์เหี่ยว (Crenation) เนื่องจากความกดดันออสโมติกภายนอกสูงกว่า!
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentPage % 4 === 0 && (
                                <div>
                                    <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.accent, marginBottom: 14 }}>
                                        หัวข้อย่อยที่ {Math.ceil(currentPage / 5)}.4: สรุปจุดควรระวังประจำบท (Textbook Pitfalls & Summary)
                                    </h3>
                                    <div style={{ background: theme.cardBg, padding: 20, borderRadius: 14, border: `1px solid ${theme.border}`, marginBottom: 24 }}>
                                        <div style={{ fontSize: 15, fontWeight: 800, color: '#dc2626', marginBottom: 8 }}>
                                            ⚠️ 3 ข้อควรระวังในการทำข้อสอบ:
                                        </div>
                                        <ol style={{ paddingLeft: 22, margin: 0, fontSize: 14 }}>
                                            <li style={{ marginBottom: 8 }}>อย่าสับสนระหว่าง Facilitated Diffusion กับ Active Transport (Facilitated ไม่ใช้ ATP!)</li>
                                            <li style={{ marginBottom: 8 }}>เซลล์พืชมีไมโทคอนเดรียในการสลายอาหารเพื่อสร้าง ATP เช่นเดียวกับเซลล์สัตว์</li>
                                            <li style={{ marginBottom: 8 }}>ในระยะ Meiosis I จะเกิด Crossing Over ที่ระยะ Prophase I เท่านั้น</li>
                                        </ol>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Page Footer */}
                        <div style={{ position: 'absolute', bottom: 30, left: 60, right: 60, borderTop: `1px solid ${theme.border}`, paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: theme.text, opacity: 0.6 }}>
                            <span>StudyRoad Online Textbook Platform</span>
                            <span>หน้า {currentPage} / {totalPages}</span>
                        </div>
                    </div>

                    {/* Bottom Navigation Control Bar */}
                    <div style={{ marginTop: 24, display: 'flex', gap: 14, alignItems: 'center' }}>
                        <button 
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            style={{
                                padding: '10px 24px',
                                borderRadius: 12,
                                background: theme.paperBg,
                                border: `1px solid ${theme.border}`,
                                color: theme.text,
                                cursor: currentPage === 1 ? 'default' : 'pointer',
                                fontSize: 14,
                                fontWeight: 700,
                                opacity: currentPage === 1 ? 0.4 : 1
                            }}
                        >
                            ◀ หน้าก่อนหน้า
                        </button>

                        <span style={{ fontSize: 14, fontWeight: 800, color: theme.text }}>
                            หน้า {currentPage} / {totalPages}
                        </span>

                        <button 
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: '10px 24px',
                                borderRadius: 12,
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                color: 'white',
                                border: 'none',
                                cursor: currentPage === totalPages ? 'default' : 'pointer',
                                fontSize: 14,
                                fontWeight: 800,
                                opacity: currentPage === totalPages ? 0.4 : 1,
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                            }}
                        >
                            หน้าถัดไป ▶
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
