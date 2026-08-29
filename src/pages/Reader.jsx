import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Lock, ShieldCheck, Layers, FileText, EyeOff, Sun, Moon, Bookmark, Sparkles, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import CCNAInteractiveReader from '../components/CCNAInteractiveReader';

export default function Reader() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, getProductById } = useProducts();
    const product = getProductById(id) || products[0];
    const { currentUser, isLoggedIn, isAdmin, openAuthModal } = useAuth();

    const [themeMode, setThemeMode] = useState('light'); // light | sepia | dark
    const [selectedChapter, setSelectedChapter] = useState(0);
    const [isScreenObscured, setIsScreenObscured] = useState(false);
    const [bookmarkedChapters, setBookmarkedChapters] = useState([]);
    const [activeSectionId, setActiveSectionId] = useState('chapter-1');

    // 5 Comprehensive Structured Textbook Chapters (Continuous Vertical Flow)
    const chapters = [
        {
            id: 'chapter-1',
            number: 1,
            title: "บทที่ 1: ชีววิทยาของเซลล์และกลไกเยื่อหุ้ม (Cell Biology & Membrane Transport)",
            readTime: "15 นาที",
            pages: "หน้า 1 - 4",
            summary: "เจาะลึกโครงสร้างเซลล์ ออร์แกเนลล์สำคัญ เยื่อหุ้มเซลล์ กลไกการลำเลียงสารแบบ Passive & Active Transport และวัฏจักรการแบ่งเซลล์ Mitosis vs Meiosis"
        },
        {
            id: 'chapter-2',
            number: 2,
            title: "บทที่ 2: การหายใจระดับเซลล์และการสังเคราะห์ด้วยแสง (Cellular Respiration & Photosynthesis)",
            readTime: "18 นาที",
            pages: "หน้า 5 - 8",
            summary: "สรุปละเอียด Glycolysis, Krebs Cycle, Electron Transport Chain (การผลิต 30-32 ATP) และปฏิกิริยาแสง Light Reaction vs Calvin Cycle ในคลอโรพลาสต์"
        },
        {
            id: 'chapter-3',
            number: 3,
            title: "บทที่ 3: พันธุศาสตร์โมเลกุลและเทคโนโลยี DNA (Genetics & Biotechnology)",
            readTime: "20 นาที",
            pages: "หน้า 9 - 12",
            summary: "กฎทางพันธุศาสตร์ของเมนเดล, Central Dogma (Replication, Transcription, Translation), การกลายพันธุ์ Mutation และเทคโนโลยี PCR, Gel Electrophoresis"
        },
        {
            id: 'chapter-4',
            number: 4,
            title: "บทที่ 4: กายวิภาคและสรีรวิทยาของมนุษย์ (Human Anatomy & Physiology)",
            readTime: "22 นาที",
            pages: "หน้า 13 - 16",
            summary: "กลไกระบบย่อยอาหารและการดูดซึมสารอาหาร, การส่งกระแสประสาท Action Potential (Na+/K+ Pump) และระบบภูมิคุ้มกันร่างกายแบบเจาะจง B-cell & T-cell"
        },
        {
            id: 'chapter-5',
            number: 5,
            title: "บทที่ 5: นิเวศวิทยา ประชากร และวิวัฒนาการ (Ecology, Population & Evolution)",
            readTime: "16 นาที",
            pages: "หน้า 17 - 20",
            summary: "ห่วงโซ่อาหาร กฎ 10%, การเปลี่ยนแปลงแทนที่ทางนิเวศวิทยา, การคำนวณสมดุลฮาร์ดี-ไวน์เบิร์ก (Hardy-Weinberg Equation: p² + 2pq + q² = 1)"
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

    // Active Section Observer for smooth TOC tracking on vertical scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY + 180;
            for (let i = chapters.length - 1; i >= 0; i--) {
                const el = document.getElementById(chapters[i].id);
                if (el && el.offsetTop <= scrollPos) {
                    setActiveSectionId(chapters[i].id);
                    setSelectedChapter(i);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [chapters]);

    if (product?.is_ccna_reader || String(id) === '7') {
        return <CCNAInteractiveReader product={product} />;
    }

    const scrollToChapter = (chapterId) => {
        const el = document.getElementById(chapterId);
        if (el) {
            const yOffset = -80;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const toggleBookmark = (chId) => {
        if (bookmarkedChapters.includes(chId)) {
            setBookmarkedChapters(bookmarkedChapters.filter(id => id !== chId));
        } else {
            setBookmarkedChapters([...bookmarkedChapters, chId]);
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
                accent: '#8c5826',
                tableHeader: '#e8d7be'
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
                accent: '#818cf8',
                tableHeader: '#273549'
            };
        }
        return {
            bg: '#f8fafc',
            headerBg: '#ffffff',
            paperBg: '#ffffff',
            text: '#1e293b',
            border: '#e2e8f0',
            cardBg: '#f8fafc',
            accent: '#4f46e5',
            tableHeader: '#eef2ff'
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

            {/* Top Sticky Toolbar Header */}
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
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
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
                                    Vertical Scroll Reader
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

                    {/* Bookmark Current Chapter */}
                    <button
                        onClick={() => toggleBookmark(activeSectionId)}
                        style={{
                            background: bookmarkedChapters.includes(activeSectionId) ? '#fef08a' : theme.bg,
                            border: `1px solid ${theme.border}`,
                            color: bookmarkedChapters.includes(activeSectionId) ? '#854d0e' : theme.text,
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
                        <Bookmark size={15} fill={bookmarkedChapters.includes(activeSectionId) ? "#854d0e" : "none"} />
                        {bookmarkedChapters.includes(activeSectionId) ? 'บุ๊กมาร์กบทนี้แล้ว' : 'บุ๊กมาร์กบทนี้'}
                    </button>
                </div>
            </header>

            {/* Main Textbook Workspace (Split Layout) */}
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', minHeight: 'calc(100vh - 64px)' }}>
                
                {/* Left Sticky Table of Contents Sidebar */}
                <aside style={{
                    background: theme.headerBg,
                    borderRight: `1px solid ${theme.border}`,
                    padding: '30px 20px',
                    position: 'sticky',
                    top: '64px',
                    height: 'calc(100vh - 64px)',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20
                }}>
                    <div>
                        <h4 style={{ fontSize: 12, fontWeight: 800, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Layers size={16} /> สารบัญตำราเรียน (Contents)
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {chapters.map((ch, idx) => {
                                const isActive = activeSectionId === ch.id;
                                return (
                                    <button
                                        key={ch.id}
                                        onClick={() => scrollToChapter(ch.id)}
                                        style={{
                                            textAlign: 'left',
                                            padding: '12px 14px',
                                            borderRadius: '12px',
                                            border: '1px solid',
                                            borderColor: isActive ? theme.accent : theme.border,
                                            background: isActive ? (themeMode === 'dark' ? '#312e81' : '#eef2ff') : theme.cardBg,
                                            color: isActive ? (themeMode === 'dark' ? '#ffffff' : '#4f46e5') : theme.text,
                                            fontSize: '12px',
                                            fontWeight: isActive ? 800 : 500,
                                            cursor: 'pointer',
                                            lineHeight: 1.5,
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.8 }}>{ch.pages}</span>
                                            <span style={{ fontSize: 11, opacity: 0.6 }}>⏱️ {ch.readTime}</span>
                                        </div>
                                        {ch.title}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', borderTop: `1px solid ${theme.border}`, paddingTop: 16 }}>
                        <h4 style={{ fontSize: 12, fontWeight: 800, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
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

                {/* Main Continuous Vertical Textbook Flow */}
                <main style={{ 
                    padding: '40px 60px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    background: theme.bg
                }}>
                    
                    <div style={{ width: '100%', maxWidth: '860px' }}>
                        
                        {/* Textbook Cover & Overview Banner */}
                        <div style={{
                            background: theme.paperBg,
                            borderRadius: '24px',
                            padding: '40px 48px',
                            border: `1px solid ${theme.border}`,
                            boxShadow: themeMode === 'dark' ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px -5px rgba(0,0,0,0.06)',
                            marginBottom: 40
                        }}>
                            <span style={{ fontSize: 12, fontWeight: 800, color: theme.accent, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                                STUDYROAD ONLINE TEXTBOOK • VERTICAL READING EDITION
                            </span>
                            <h1 style={{ fontSize: 28, fontWeight: 900, margin: '8px 0 16px 0', color: theme.text, lineHeight: 1.3 }}>
                                {product?.name || 'สรุปชีววิทยา ม.4-6 A-Level High-Yield Master Textbook'}
                            </h1>
                            <p style={{ fontSize: 15, lineHeight: 1.8, color: theme.text, opacity: 0.85, margin: 0 }}>
                                {product?.description || 'ตำราเรียนออนไลน์ฉบับสมบูรณ์ ออกแบบเพื่อให้อ่านต่อเนื่องในแนวตั้งได้อย่างสบายตา เลื่อนอ่านได้ยาวตั้งแต่บทที่ 1 ถึงบทที่ 5 ครอบคลุมเนื้อหาสำคัญทั้งหมด 20 หน้า'}
                            </p>
                        </div>

                        {/* ========================================================================= */}
                        {/* CHAPTER 1 */}
                        {/* ========================================================================= */}
                        <article 
                            id="chapter-1"
                            style={{
                                background: theme.paperBg,
                                borderRadius: '24px',
                                padding: '48px',
                                border: `1px solid ${theme.border}`,
                                boxShadow: themeMode === 'dark' ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px -5px rgba(0,0,0,0.06)',
                                marginBottom: 40
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, paddingBottom: 16, marginBottom: 28 }}>
                                <div>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: theme.accent, letterSpacing: 1 }}>หน้า 1 - 4 • บทที่ 1</span>
                                    <h2 style={{ fontSize: 22, fontWeight: 800, margin: '4px 0 0 0', color: theme.text }}>
                                        ชีววิทยาของเซลล์และกลไกเยื่อหุ้ม (Cell Biology & Membrane Transport)
                                    </h2>
                                </div>
                                <span style={{ fontSize: 12, background: theme.cardBg, padding: '4px 10px', borderRadius: 8, border: `1px solid ${theme.border}` }}>
                                    ⏱️ 15 นาที
                                </span>
                            </div>

                            <div style={{ background: theme.cardBg, padding: 18, borderRadius: 12, borderLeft: `4px solid ${theme.accent}`, marginBottom: 28 }}>
                                <strong style={{ color: theme.accent, display: 'block', marginBottom: 4 }}>💡 ภาพรวมสรุปบทที่ 1:</strong>
                                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }}>
                                    เน้นโครงสร้างและหน้าที่ของออร์แกเนลล์ 2 ชั้น vs 1 ชั้น กลไกการลำเลียงสารผ่านเยื่อหุ้มเซลล์แบบไม่ใช้ ATP (Simple & Facilitated Diffusion) และแบบใช้ ATP (Active Transport)
                                </p>
                            </div>

                            <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.accent, marginBottom: 14 }}>
                                1.1 สรุปหน้าที่ออร์แกเนลล์สำคัญออกสอบบ่อย (Organelle Functions)
                            </h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 28, fontSize: 14 }}>
                                <thead>
                                    <tr style={{ background: theme.tableHeader, borderBottom: `2px solid ${theme.border}` }}>
                                        <th style={{ padding: '12px 14px', textAlign: 'left', color: theme.text }}>ออร์แกเนลล์</th>
                                        <th style={{ padding: '12px 14px', textAlign: 'left', color: theme.text }}>ชนิดเยื่อหุ้ม</th>
                                        <th style={{ padding: '12px 14px', textAlign: 'left', color: theme.text }}>หน้าที่สำคัญออกสอบ A-Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>Nucleus</td>
                                        <td style={{ padding: '12px 14px' }}>2 ชั้น (Double)</td>
                                        <td style={{ padding: '12px 14px' }}>ศูนย์กลางควบคุมการทำงานและเก็บบันทึกรหัสพันธุกรรม DNA/RNA</td>
                                    </tr>
                                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>Mitochondria</td>
                                        <td style={{ padding: '12px 14px' }}>2 ชั้น (Double)</td>
                                        <td style={{ padding: '12px 14px' }}>สร้างพลังงาน ATP ผ่าน Krebs Cycle (Matrix) และ ETC (Cristae)</td>
                                    </tr>
                                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>Chloroplast</td>
                                        <td style={{ padding: '12px 14px' }}>2 ชั้น (Double)</td>
                                        <td style={{ padding: '12px 14px' }}>สังเคราะห์ด้วยแสง: Thylakoid (Light Rxn) & Stroma (Calvin Cycle)</td>
                                    </tr>
                                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>Smooth ER (SER)</td>
                                        <td style={{ padding: '12px 14px' }}>1 ชั้น (Single)</td>
                                        <td style={{ padding: '12px 14px' }}>สังเคราะห์ไขมัน สเตียรอยด์ กำจัดสารพิษ (Liver) และสะสม Ca²⁺</td>
                                    </tr>
                                </tbody>
                            </table>

                            <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.accent, marginBottom: 14 }}>
                                1.2 กลไกการลำเลียงสารผ่านเยื่อหุ้มเซลล์ (Membrane Transport)
                            </h3>
                            <ul style={{ paddingLeft: 22, margin: '0 0 24px 0', lineHeight: 1.9 }}>
                                <li style={{ marginBottom: 10 }}>
                                    <strong>Simple Diffusion:</strong> เคลื่อนที่จากความเข้มข้นสูง ➔ ต่ำ ผ่านชั้น Phospholipid โดยไม่ใช้ ATP (เช่น O₂, CO₂, สารละลายในไขมัน)
                                </li>
                                <li style={{ marginBottom: 10 }}>
                                    <strong>Facilitated Diffusion:</strong> อาศัยโปรตีนตัวพา (Carrier/Channel Protein) เคลื่อนที่จากสูง ➔ ต่ำ ไม่ใช้ ATP (เช่น Glucose ในเซลล์เม็ดเลือดแดง, H₂O ผ่าน Aquaporin)
                                </li>
                                <li style={{ marginBottom: 10 }}>
                                    <strong>Active Transport:</strong> เคลื่อนที่สวนทางจากความเข้มข้นต่ำ ➔ สูง ต้องใช้ ATP และโปรตีนตัวพา (เช่น Na⁺/K⁺ Pump ในเซลล์ประสาท)
                                </li>
                            </ul>
                        </article>

                        {/* ========================================================================= */}
                        {/* CHAPTER 2 */}
                        {/* ========================================================================= */}
                        <article 
                            id="chapter-2"
                            style={{
                                background: theme.paperBg,
                                borderRadius: '24px',
                                padding: '48px',
                                border: `1px solid ${theme.border}`,
                                boxShadow: themeMode === 'dark' ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px -5px rgba(0,0,0,0.06)',
                                marginBottom: 40
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, paddingBottom: 16, marginBottom: 28 }}>
                                <div>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: theme.accent, letterSpacing: 1 }}>หน้า 5 - 8 • บทที่ 2</span>
                                    <h2 style={{ fontSize: 22, fontWeight: 800, margin: '4px 0 0 0', color: theme.text }}>
                                        การหายใจระดับเซลล์และการสังเคราะห์ด้วยแสง (Cellular Respiration & Photosynthesis)
                                    </h2>
                                </div>
                                <span style={{ fontSize: 12, background: theme.cardBg, padding: '4px 10px', borderRadius: 8, border: `1px solid ${theme.border}` }}>
                                    ⏱️ 18 นาที
                                </span>
                            </div>

                            <div style={{ background: theme.cardBg, padding: 22, borderRadius: 14, marginBottom: 24, border: `1px solid ${theme.border}` }}>
                                <div style={{ fontSize: 14, fontWeight: 800, color: theme.text, marginBottom: 8 }}>📌 สมการชีวเคมีหลักประจำบทเรียน:</div>
                                <div style={{ fontFamily: 'monospace', fontSize: 16, color: theme.accent, fontWeight: 800, background: theme.paperBg, padding: '12px 16px', borderRadius: 10, border: `1px solid ${theme.border}` }}>
                                    Glucose + 6O₂ ➔ 6CO₂ + 6H₂O + 30-32 ATP (Cellular Respiration)
                                </div>
                            </div>

                            <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.accent, marginBottom: 14 }}>
                                2.1 สรุป 4 ขั้นตอนการสลายอาหารระดับเซลล์ (4 Respiration Steps)
                            </h3>
                            <ol style={{ paddingLeft: 22, margin: '0 0 24px 0', lineHeight: 1.9 }}>
                                <li style={{ marginBottom: 10 }}>
                                    <strong>Glycolysis (เกิดที่ Cytoplasm):</strong> สลายกลูโคส (6C) เป็น 2 Pyruvate (3C) ได้สุทธิ <strong>2 ATP + 2 NADH</strong>
                                </li>
                                <li style={{ marginBottom: 10 }}>
                                    <strong>Acetyl-CoA Formation (เกิดที่ Matrix):</strong> เปลี่ยน 2 Pyruvate เป็น 2 Acetyl-CoA (2C) ปล่อย 2 CO₂ และได้ <strong>2 NADH</strong>
                                </li>
                                <li style={{ marginBottom: 10 }}>
                                    <strong>Krebs Cycle (เกิดที่ Matrix):</strong> หมุน 2 รอบ ได้สุทธิ <strong>2 ATP + 6 NADH + 2 FADH₂ + 4 CO₂</strong>
                                </li>
                                <li style={{ marginBottom: 10 }}>
                                    <strong>Electron Transport Chain (เกิดที่ Cristae):</strong> ถ่ายทอดอิเล็กตรอน ปั๊ม H⁺ และใช้ O₂ เป็นตัวรับอิเล็กตรอนตัวสุดท้าย สร้าง ATP มากที่สุด (~26-28 ATP)
                                </li>
                            </ol>
                        </article>

                        {/* ========================================================================= */}
                        {/* CHAPTER 3 */}
                        {/* ========================================================================= */}
                        <article 
                            id="chapter-3"
                            style={{
                                background: theme.paperBg,
                                borderRadius: '24px',
                                padding: '48px',
                                border: `1px solid ${theme.border}`,
                                boxShadow: themeMode === 'dark' ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px -5px rgba(0,0,0,0.06)',
                                marginBottom: 40
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, paddingBottom: 16, marginBottom: 28 }}>
                                <div>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: theme.accent, letterSpacing: 1 }}>หน้า 9 - 12 • บทที่ 3</span>
                                    <h2 style={{ fontSize: 22, fontWeight: 800, margin: '4px 0 0 0', color: theme.text }}>
                                        พันธุศาสตร์โมเลกุลและเทคโนโลยี DNA (Genetics & Biotechnology)
                                    </h2>
                                </div>
                                <span style={{ fontSize: 12, background: theme.cardBg, padding: '4px 10px', borderRadius: 8, border: `1px solid ${theme.border}` }}>
                                    ⏱️ 20 นาที
                                </span>
                            </div>

                            <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.accent, marginBottom: 14 }}>
                                3.1 Central Dogma ของพันธุศาสตร์โมเลกุล
                            </h3>
                            <div style={{ background: theme.cardBg, padding: 18, borderRadius: 12, marginBottom: 24, border: `1px solid ${theme.border}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontWeight: 800, fontSize: 15, color: theme.accent, textAlign: 'center' }}>
                                    <div>DNA<div style={{ fontSize: 11, color: theme.text, opacity: 0.7, fontWeight: 500 }}>Replication</div></div>
                                    <span>➔ Transcription ➔</span>
                                    <div>mRNA<div style={{ fontSize: 11, color: theme.text, opacity: 0.7, fontWeight: 500 }}>Codon (5'➔3')</div></div>
                                    <span>➔ Translation ➔</span>
                                    <div>Protein<div style={{ fontSize: 11, color: theme.text, opacity: 0.7, fontWeight: 500 }}>Amino Acids</div></div>
                                </div>
                            </div>

                            <ul style={{ paddingLeft: 22, margin: '0 0 24px 0', lineHeight: 1.9 }}>
                                <li style={{ marginBottom: 10 }}>
                                    <strong>Polymerase Chain Reaction (PCR):</strong> เทคนิคเพิ่มปริมาณ DNA ในหลอดทดลองผ่าน 3 อุณหภูมิ (Denaturation ➔ Annealing ➔ Extension)
                                </li>
                                <li style={{ marginBottom: 10 }}>
                                    <strong>Gel Electrophoresis:</strong> แยกชิ้นส่วน DNA ตามขนาดประจุ โดย DNA (ประจุลบ) จะวิ่งเข้าหาขั้วบวก (+) ชิ้นเล็กวิ่งได้ไกลกว่าชิ้นใหญ่
                                </li>
                            </ul>
                        </article>

                        {/* ========================================================================= */}
                        {/* CHAPTER 4 */}
                        {/* ========================================================================= */}
                        <article 
                            id="chapter-4"
                            style={{
                                background: theme.paperBg,
                                borderRadius: '24px',
                                padding: '48px',
                                border: `1px solid ${theme.border}`,
                                boxShadow: themeMode === 'dark' ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px -5px rgba(0,0,0,0.06)',
                                marginBottom: 40
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, paddingBottom: 16, marginBottom: 28 }}>
                                <div>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: theme.accent, letterSpacing: 1 }}>หน้า 13 - 16 • บทที่ 4</span>
                                    <h2 style={{ fontSize: 22, fontWeight: 800, margin: '4px 0 0 0', color: theme.text }}>
                                        กายวิภาคและสรีรวิทยาของมนุษย์ (Human Anatomy & Physiology)
                                    </h2>
                                </div>
                                <span style={{ fontSize: 12, background: theme.cardBg, padding: '4px 10px', borderRadius: 8, border: `1px solid ${theme.border}` }}>
                                    ⏱️ 22 นาที
                                </span>
                            </div>

                            <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.accent, marginBottom: 14 }}>
                                4.1 การส่งกระแสประสาท (Action Potential Stages)
                            </h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 28, fontSize: 14 }}>
                                <thead>
                                    <tr style={{ background: theme.tableHeader, borderBottom: `2px solid ${theme.border}` }}>
                                        <th style={{ padding: '12px 14px', textAlign: 'left', color: theme.text }}>ระยะกระแสประสาท</th>
                                        <th style={{ padding: '12px 14px', textAlign: 'left', color: theme.text }}>สถานะช่องไอออน (Ion Channels)</th>
                                        <th style={{ padding: '12px 14px', textAlign: 'left', color: theme.text }}>ศักย์ไฟฟ้า (Membrane Potential)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>Resting State</td>
                                        <td style={{ padding: '12px 14px' }}>Na+/K+ Pump ทำงาน (3 Na+ ออก / 2 K+ เข้า)</td>
                                        <td style={{ padding: '12px 14px' }}>-70 mV</td>
                                    </tr>
                                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>Depolarization</td>
                                        <td style={{ padding: '12px 14px' }}>ช่อง Na+ เปิดกว้าง Na+ ไหลทะลักเข้าสู่เซลล์</td>
                                        <td style={{ padding: '12px 14px' }}>+35 mV</td>
                                    </tr>
                                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>Repolarization</td>
                                        <td style={{ padding: '12px 14px' }}>ช่อง Na+ ปิด, ช่อง K+ เปิด K+ ไหลออกนอกเซลล์</td>
                                        <td style={{ padding: '12px 14px' }}>กลับสู่ค่าลบ (-70 mV)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </article>

                        {/* ========================================================================= */}
                        {/* CHAPTER 5 */}
                        {/* ========================================================================= */}
                        <article 
                            id="chapter-5"
                            style={{
                                background: theme.paperBg,
                                borderRadius: '24px',
                                padding: '48px',
                                border: `1px solid ${theme.border}`,
                                boxShadow: themeMode === 'dark' ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px -5px rgba(0,0,0,0.06)',
                                marginBottom: 60
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, paddingBottom: 16, marginBottom: 28 }}>
                                <div>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: theme.accent, letterSpacing: 1 }}>หน้า 17 - 20 • บทที่ 5</span>
                                    <h2 style={{ fontSize: 22, fontWeight: 800, margin: '4px 0 0 0', color: theme.text }}>
                                        นิเวศวิทยา ประชากร และวิวัฒนาการ (Ecology, Population & Evolution)
                                    </h2>
                                </div>
                                <span style={{ fontSize: 12, background: theme.cardBg, padding: '4px 10px', borderRadius: 8, border: `1px solid ${theme.border}` }}>
                                    ⏱️ 16 นาที
                                </span>
                            </div>

                            <div style={{ background: theme.cardBg, padding: 22, borderRadius: 14, marginBottom: 24, border: `1px solid ${theme.border}` }}>
                                <div style={{ fontSize: 14, fontWeight: 800, color: theme.text, marginBottom: 8 }}>📌 กฎสมดุลฮาร์ดี-ไวน์เบิร์ก (Hardy-Weinberg Equation):</div>
                                <div style={{ fontFamily: 'monospace', fontSize: 17, color: theme.accent, fontWeight: 800, background: theme.paperBg, padding: '12px 16px', borderRadius: 10, border: `1px solid ${theme.border}`, marginBottom: 10 }}>
                                    p + q = 1  และ  p² + 2pq + q² = 1
                                </div>
                                <p style={{ margin: 0, fontSize: 13, color: theme.text, opacity: 0.8 }}>
                                    p = ความถี่ของแอลลีลเด่น (A), q = ความถี่ของแอลลีลด้อย (a), 2pq = ความถี่ของจีโนไทป์เฮเทอโรไซกัส (Aa)
                                </p>
                            </div>

                            <div style={{ background: '#fef2f2', padding: 20, borderRadius: 14, border: '1px solid #fecaca', marginBottom: 20 }}>
                                <div style={{ fontSize: 15, fontWeight: 800, color: '#dc2626', marginBottom: 8 }}>
                                    ⚠️ ข้อควรระวังในการทำข้อสอบนิเวศวิทยา:
                                </div>
                                <ol style={{ paddingLeft: 22, margin: 0, fontSize: 14, color: '#7f1d1d', lineHeight: 1.8 }}>
                                    <li>การถ่ายทอดพลังงานในห่วงโซ่อาหารเป็นไปตามกฎ 10% (อีก 90% สูญเสียไปในรูปความร้อนและการหายใจ)</li>
                                    <li>สารพิษตกค้าง (Biological Magnification) จะสะสมเพิ่มขึ้นตามลำดับขั้นการกิน โดยผู้บริโภคลำดับสุดท้ายจะมีสารพิษสะสมสูงสุด!</li>
                                </ol>
                            </div>

                            {/* End of Book Milestone */}
                            <div style={{ textAlign: 'center', padding: '32px 0 16px 0', borderTop: `1px solid ${theme.border}`, marginTop: 32 }}>
                                <div style={{ width: 50, height: 50, background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                                    <CheckCircle2 size={28} />
                                </div>
                                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#15803d', margin: '0 0 6px 0' }}>
                                    🎉 คุณอ่านจบครบทั้ง 20 หน้าของตำราเรียนเล่มนี้แล้ว!
                                </h3>
                                <p style={{ fontSize: 13, color: theme.text, opacity: 0.7, margin: 0 }}>
                                    สามารถทบทวนเนื้อหาโดยคลิกเลือกบทที่สนใจจากแถบสารบัญด้านซ้ายมือได้ตลอดเวลา
                                </p>
                            </div>
                        </article>

                    </div>
                </main>
            </div>
        </div>
    );
}
