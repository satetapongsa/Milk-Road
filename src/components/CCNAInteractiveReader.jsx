import { useState } from 'react';
import { 
    Search, CheckCircle2, Bookmark, ZoomIn, ZoomOut, Maximize2, 
    ChevronLeft, ChevronRight, FileText, Terminal, Layers, HelpCircle, 
    ShieldCheck, ArrowLeft, RotateCcw, X, Play, Code
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CCNAInteractiveReader({ product }) {
    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState(0);
    const [selectedTopic, setSelectedTopic] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [zoom, setZoom] = useState(100);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [completedTopics, setCompletedTopics] = useState([0]);
    const [bookmarkedTopics, setBookmarkedTopics] = useState([]);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [cliOutput, setCliOutput] = useState('');

    const sections = [
        {
            id: 'sec1',
            title: 'SECTION 01 / NETWORK FUNDAMENTALS',
            badge: '1/4',
            topics: [
                {
                    id: '01_01',
                    name: '[01_01] OSI 7-Layer vs. TCP/IP Model & Encapsulation',
                    time: '18 min',
                    slides: 2,
                    type: 'Slide'
                },
                {
                    id: '01_02',
                    name: '[01_02] Copper Cabling: UTP Categories, Fiber Optics & SFP Transceivers',
                    time: '16 min',
                    slides: 2,
                    type: 'Slide'
                },
                {
                    id: '01_03',
                    name: '[01_03] IPv4 Addressing & Subnetting (FLSM / VLSM Calculation)',
                    time: '25 min',
                    slides: 3,
                    type: 'CLI'
                },
                {
                    id: '01_04',
                    name: '[01_04] IPv6 Addressing Architecture & Neighbor Discovery (NDP)',
                    time: '20 min',
                    slides: 2,
                    type: 'Slide'
                }
            ]
        },
        {
            id: 'sec2',
            title: 'SECTION 02 / NETWORK ACCESS & SWITCHING',
            badge: '0/4',
            topics: [
                {
                    id: '02_01',
                    name: '[02_01] VLAN Configuration, 802.1Q Trunking & Native VLAN Security',
                    time: '28 min',
                    slides: 2,
                    type: 'CLI'
                },
                {
                    id: '02_02',
                    name: '[02_02] Spanning Tree Protocol (STP 802.1D / RSTP 802.1w) & BPDU Guard',
                    time: '32 min',
                    slides: 2,
                    type: 'Slide'
                },
                {
                    id: '02_03',
                    name: '[02_03] EtherChannel (LACP/PaGP) & Layer 3 EtherChannel',
                    time: '22 min',
                    slides: 2,
                    type: 'CLI'
                },
                {
                    id: '02_04',
                    name: '[02_04] Wireless Architectures (AP Modes, WLC & WPA3 Security)',
                    time: '24 min',
                    slides: 2,
                    type: 'Slide'
                }
            ]
        },
        {
            id: 'sec3',
            title: 'SECTION 03 / IP ROUTING & INFRASTRUCTURE',
            badge: '0/3',
            topics: [
                {
                    id: '03_01',
                    name: '[03_01] Static Routing, Default Routes & Floating Static',
                    time: '20 min',
                    slides: 2,
                    type: 'CLI'
                },
                {
                    id: '03_02',
                    name: '[03_02] OSPFv2 Single-Area Routing & Neighbor States',
                    time: '35 min',
                    slides: 3,
                    type: 'CLI'
                },
                {
                    id: '03_03',
                    name: '[03_03] First Hop Redundancy Protocols (HSRP / VRRP)',
                    time: '18 min',
                    slides: 2,
                    type: 'Slide'
                }
            ]
        }
    ];

    const currentTopicData = sections[selectedSection].topics[selectedTopic];

    const quizQuestions = [
        {
            id: 1,
            question: "ข้อใดคือ Protocol Data Unit (PDU) ของ Layer 3 (Network Layer) ใน OSI Model?",
            options: ["Data", "Segment", "Packet", "Frame"],
            correct: 2
        },
        {
            id: 2,
            question: "พอร์ตมาตรฐาน (Port Number) ของ HTTPS และ SSH คือพอร์ตใดตามลำดับ?",
            options: ["443 และ 22", "80 และ 21", "8080 และ 23", "53 และ 25"],
            correct: 0
        },
        {
            id: 3,
            question: "คำสั่งใดใน Cisco IOS ที่ใช้กำหนด 802.1Q Trunking บน Switch Port?",
            options: ["switchport mode access", "switchport mode trunk", "ip routing", "spanning-tree portfast"],
            correct: 1
        }
    ];

    const toggleMarkDone = (topicIdx) => {
        if (completedTopics.includes(topicIdx)) {
            setCompletedTopics(completedTopics.filter(i => i !== topicIdx));
        } else {
            setCompletedTopics([...completedTopics, topicIdx]);
        }
    };

    const toggleBookmark = (topicIdx) => {
        if (bookmarkedTopics.includes(topicIdx)) {
            setBookmarkedTopics(bookmarkedTopics.filter(i => i !== topicIdx));
        } else {
            setBookmarkedTopics([...bookmarkedTopics, topicIdx]);
        }
    };

    const runCliCommand = (cmd) => {
        if (cmd === 'show vlan brief') {
            setCliOutput(`VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Gi0/0, Gi0/2, Gi0/3
10   SALES                            active    Gi0/1
20   MARKETING                        active    Gi0/4`);
        } else if (cmd === 'show ip interface brief') {
            setCliOutput(`Interface                  IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0         192.168.1.1     YES manual up                    up
GigabitEthernet0/1         unassigned      YES unset  up                    up
Vlan10                     192.168.10.254  YES manual up                    up`);
        } else {
            setCliOutput(`Switch# ${cmd}\n% Command executed successfully.`);
        }
    };

    return (
        <div style={{
            background: '#090d16',
            color: '#e2e8f0',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            {/* Top Bar Header */}
            <div style={{
                background: '#0f172a',
                borderBottom: '1px solid #1e293b',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: '#1e293b',
                            border: '1px solid #334155',
                            color: '#94a3b8',
                            borderRadius: 8,
                            padding: '6px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 12,
                            fontWeight: 600
                        }}
                    >
                        <ArrowLeft size={14} /> กลับ
                    </button>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1 }}>
                            {sections[selectedSection].title}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>
                            {currentTopicData.name}
                        </div>
                    </div>
                </div>

                {/* Header Right Action Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                        onClick={() => toggleMarkDone(selectedTopic)}
                        style={{
                            background: completedTopics.includes(selectedTopic) ? 'rgba(74, 222, 128, 0.15)' : '#1e293b',
                            border: `1px solid ${completedTopics.includes(selectedTopic) ? '#22c55e' : '#334155'}`,
                            color: completedTopics.includes(selectedTopic) ? '#4ade80' : '#cbd5e1',
                            padding: '6px 12px',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}
                    >
                        <CheckCircle2 size={14} /> {completedTopics.includes(selectedTopic) ? 'Done' : 'Mark Done'}
                    </button>

                    <button
                        onClick={() => toggleBookmark(selectedTopic)}
                        style={{
                            background: bookmarkedTopics.includes(selectedTopic) ? 'rgba(99, 102, 241, 0.2)' : '#1e293b',
                            border: `1px solid ${bookmarkedTopics.includes(selectedTopic) ? '#6366f1' : '#334155'}`,
                            color: bookmarkedTopics.includes(selectedTopic) ? '#818cf8' : '#cbd5e1',
                            padding: '6px 10px',
                            borderRadius: 8,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        title="Bookmark Topic"
                    >
                        <Bookmark size={14} />
                    </button>

                    {/* Zoom & Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', background: '#1e293b', borderRadius: 8, padding: '2px 8px', border: '1px solid #334155' }}>
                        <button onClick={() => setZoom(Math.max(80, zoom - 10))} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><ZoomOut size={14} /></button>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '0 8px', color: '#cbd5e1' }}>{zoom}%</span>
                        <button onClick={() => setZoom(Math.min(130, zoom + 10))} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><ZoomIn size={14} /></button>
                    </div>

                    <button
                        onClick={() => setShowQuizModal(true)}
                        style={{
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            color: 'white',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}
                    >
                        <HelpCircle size={14} /> Quiz 1
                    </button>
                </div>
            </div>

            {/* Main Content Workspace Layout */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left Sidebar Navigation */}
                <div style={{
                    width: 320,
                    background: '#0f172a',
                    borderRight: '1px solid #1e293b',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px 12px',
                    gap: 14,
                    overflowY: 'auto'
                }}>
                    {/* Header Title */}
                    <div style={{ background: '#1e293b', padding: '12px 16px', borderRadius: 12, border: '1px solid #334155' }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ShieldCheck size={16} color="#6366f1" /> CCNA 200-301 <span style={{ fontSize: 10, background: '#334155', padding: '1px 6px', borderRadius: 6, color: '#a5b4fc' }}>v1.2 Blueprint</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Cisco Certified Network Associate</div>
                        
                        <div style={{ marginTop: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#cbd5e1', marginBottom: 4, fontWeight: 600 }}>
                                <span>Course Progress</span>
                                <span style={{ color: '#818cf8', fontWeight: 800 }}>6%</span>
                            </div>
                            <div style={{ height: 6, background: '#334155', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: '6%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #38bdf8)' }}></div>
                            </div>
                            <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>Completed 1 of 11 topics</div>
                        </div>
                    </div>

                    {/* Search & Filter Pills */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: '#64748b' }} />
                            <input
                                type="text"
                                placeholder="Search topics, protocols, CLI..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: '#1e293b',
                                    border: '1px solid #334155',
                                    borderRadius: 8,
                                    padding: '7px 10px 7px 32px',
                                    fontSize: 11,
                                    color: '#f8fafc',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* Filter category chips */}
                        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                            {['All', 'Slide', 'CLI', 'Bookmarked', 'Completed'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    style={{
                                        background: filterCategory === cat ? '#6366f1' : '#1e293b',
                                        color: filterCategory === cat ? 'white' : '#94a3b8',
                                        border: '1px solid #334155',
                                        borderRadius: 12,
                                        padding: '3px 10px',
                                        fontSize: 10,
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sections Accordion List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {sections.map((sec, secIdx) => (
                            <div key={sec.id} style={{ background: '#1e293b', borderRadius: 10, overflow: 'hidden', border: '1px solid #334155' }}>
                                <div
                                    onClick={() => setSelectedSection(secIdx)}
                                    style={{
                                        padding: '10px 12px',
                                        background: selectedSection === secIdx ? '#334155' : 'transparent',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <div style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc' }}>
                                        {sec.title}
                                    </div>
                                    <span style={{ fontSize: 10, background: '#0f172a', color: '#a5b4fc', padding: '1px 6px', borderRadius: 6 }}>
                                        {sec.badge}
                                    </span>
                                </div>

                                {selectedSection === secIdx && (
                                    <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        {sec.topics.map((t, tIdx) => (
                                            <div
                                                key={t.id}
                                                onClick={() => { setSelectedTopic(tIdx); setCurrentSlide(1); }}
                                                style={{
                                                    padding: '8px 10px',
                                                    borderRadius: 6,
                                                    background: (selectedSection === secIdx && selectedTopic === tIdx) ? '#6366f1' : 'transparent',
                                                    color: (selectedSection === secIdx && selectedTopic === tIdx) ? 'white' : '#cbd5e1',
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                    lineHeight: 1.4
                                                }}
                                            >
                                                <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid #64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>
                                                    {completedTopics.includes(tIdx) ? '✓' : ''}
                                                </div>
                                                <div style={{ flex: 1 }}>{t.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center Content Interactive Viewer Area */}
                <div style={{
                    flex: 1,
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    alignItems: 'center',
                    background: '#090d16'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: `${960 * (zoom / 100)}px`,
                        background: '#0f172a',
                        border: '1px solid #1e293b',
                        borderRadius: 16,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        padding: '28px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 20
                    }}>
                        {/* Slide Top Tag Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: 14 }}>
                            <div>
                                <span style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8', letterSpacing: 1 }}>
                                    {currentTopicData.id} • SLIDE {currentSlide} OF {currentTopicData.slides}
                                </span>
                                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', margin: '4px 0 0 0' }}>
                                    {currentSlide === 1 ? 'OSI 7 Layers vs TCP/IP Protocol Suite' : 'Data Encapsulation & Cisco IOS CLI Lab'}
                                </h2>
                                <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0 0' }}>
                                    {currentSlide === 1 ? 'Layer Functions, Addressing Types, and Protocol Data Units (PDUs)' : 'Packet Data Flow & Live Interactive Cisco Switch CLI Commands'}
                                </p>
                            </div>
                        </div>

                        {/* SLIDE CONTENT VIEW 1: OSI 7 LAYERS */}
                        {currentSlide === 1 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
                                {/* Left Stacked Layers */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <div style={{ background: '#1e293b', padding: '14px', borderRadius: 10, border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ background: '#38bdf8', color: '#0f172a', width: 24, height: 24, borderRadius: 6, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>1</span>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Layers 7-5 (App, Pres, Sess): Data PDU</div>
                                            <div style={{ fontSize: 11, color: '#94a3b8' }}>HTTP, HTTPS, DNS, SSH, TLS, FTP</div>
                                        </div>
                                    </div>

                                    <div style={{ background: '#1e293b', padding: '14px', borderRadius: 10, border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ background: '#818cf8', color: '#0f172a', width: 24, height: 24, borderRadius: 6, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>2</span>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Layer 4 (Transport): Segment PDU</div>
                                            <div style={{ fontSize: 11, color: '#94a3b8' }}>TCP / UDP Ports: 443, 80, 53, 22</div>
                                        </div>
                                    </div>

                                    <div style={{ background: '#1e293b', padding: '14px', borderRadius: 10, border: '1px solid #6366f1', display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ background: '#6366f1', color: 'white', width: 24, height: 24, borderRadius: 6, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>3</span>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 800, color: '#818cf8' }}>Layer 3 (Network): Packet PDU</div>
                                            <div style={{ fontSize: 11, color: '#94a3b8' }}>IPv4 / IPv6 Logical Addresses, ICMP</div>
                                        </div>
                                    </div>

                                    <div style={{ background: '#1e293b', padding: '14px', borderRadius: 10, border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ background: '#a855f7', color: 'white', width: 24, height: 24, borderRadius: 6, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>4</span>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Layer 2 (Data Link): Frame PDU</div>
                                            <div style={{ fontSize: 11, color: '#94a3b8' }}>MAC Addresses + 32-bit CRC / FCS</div>
                                        </div>
                                    </div>

                                    <div style={{ background: '#1e293b', padding: '14px', borderRadius: 10, border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ background: '#4ade80', color: '#0f172a', width: 24, height: 24, borderRadius: 6, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>5</span>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Layer 1 (Physical): Bits</div>
                                            <div style={{ fontSize: 11, color: '#94a3b8' }}>Voltage levels, Light pulses, Radio RF</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side Table */}
                                <div style={{ background: '#1e293b', borderRadius: 12, padding: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <div style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>Protocol Data Units (PDU Summary)</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0f172a', borderRadius: 6 }}>
                                            <span style={{ color: '#94a3b8' }}>L7-5 App / Pres / Session</span>
                                            <span style={{ fontWeight: 700, color: '#f8fafc' }}>Data</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0f172a', borderRadius: 6 }}>
                                            <span style={{ color: '#94a3b8' }}>L4 Transport</span>
                                            <span style={{ fontWeight: 700, color: '#818cf8' }}>Segment (Port)</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0f172a', borderRadius: 6 }}>
                                            <span style={{ color: '#94a3b8' }}>L3 Network</span>
                                            <span style={{ fontWeight: 700, color: '#38bdf8' }}>Packet (IP)</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0f172a', borderRadius: 6 }}>
                                            <span style={{ color: '#94a3b8' }}>L2 Data Link</span>
                                            <span style={{ fontWeight: 700, color: '#c084fc' }}>Frame (MAC)</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0f172a', borderRadius: 6 }}>
                                            <span style={{ color: '#94a3b8' }}>L1 Physical</span>
                                            <span style={{ fontWeight: 700, color: '#4ade80' }}>Bits</span>
                                        </div>
                                    </div>

                                    {/* Mnemonic callout */}
                                    <div style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px stroke #6366f1', padding: '12px', borderRadius: 8, marginTop: 'auto' }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc' }}>💡 Key Takeaway Mnemonic</div>
                                        <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>
                                            Mnemonic for OSI Layer 1 to 7: <i>Please Do Not Throw Sausage Pizza Away.</i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* SLIDE 2: CLI TERMINAL SIMULATOR */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div style={{ fontSize: 13, color: '#cbd5e1' }}>
                                    ทดลองรันคำสั่ง Cisco IOS Command-Line Interface (CLI) ในการกำหนดค่า VLAN และ Trunk Port:
                                </div>

                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button onClick={() => runCliCommand('show vlan brief')} style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                                        ▶ Run: show vlan brief
                                    </button>
                                    <button onClick={() => runCliCommand('show ip interface brief')} style={{ background: '#1e293b', border: '1px solid #334155', color: '#4ade80', padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                                        ▶ Run: show ip interface brief
                                    </button>
                                </div>

                                {/* Terminal Console Window */}
                                <div style={{ background: '#020617', borderRadius: 10, border: '1px solid #1e293b', padding: '16px', fontFamily: 'monospace', fontSize: 12, color: '#4ade80', minHeight: 220 }}>
                                    <div style={{ color: '#64748b', marginBottom: 8, borderBottom: '1px solid #1e293b', paddingBottom: 4 }}>
                                        Cisco IOS Software, C2960 Software (C2960-LANBASEK9-M), Version 15.2(2)E
                                    </div>
                                    <pre style={{ margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                                        {cliOutput || `Switch# show vlan brief\n\nVLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n1    default                          active    Gi0/0, Gi0/1, Gi0/2, Gi0/3\n10   SALES                            active    Gi0/4`}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* Bottom Slide Switcher */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1e293b', paddingTop: 16 }}>
                            <button
                                onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
                                disabled={currentSlide === 1}
                                style={{ background: '#1e293b', border: '1px solid #334155', color: currentSlide === 1 ? '#64748b' : '#cbd5e1', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: currentSlide === 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                                <ChevronLeft size={14} /> Previous
                            </button>

                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => setCurrentSlide(1)} style={{ background: currentSlide === 1 ? '#6366f1' : '#1e293b', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                                    #1 OSI 7 Layers vs TCP/IP
                                </button>
                                <button onClick={() => setCurrentSlide(2)} style={{ background: currentSlide === 2 ? '#6366f1' : '#1e293b', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                                    #2 Cisco IOS CLI Lab
                                </button>
                            </div>

                            <button
                                onClick={() => setCurrentSlide(Math.min(currentTopicData.slides, currentSlide + 1))}
                                disabled={currentSlide === currentTopicData.slides}
                                style={{ background: '#1e293b', border: '1px solid #334155', color: currentSlide === currentTopicData.slides ? '#64748b' : '#cbd5e1', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: currentSlide === currentTopicData.slides ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUIZ MODAL */}
            {showQuizModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(9, 13, 22, 0.85)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20
                }}>
                    <div style={{
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: 16,
                        width: '100%',
                        maxWidth: 580,
                        padding: '28px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 20,
                        boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: 12 }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <HelpCircle color="#6366f1" size={20} /> CCNA 200-301 Section 01 Quiz
                            </div>
                            <button onClick={() => setShowQuizModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 400, overflowY: 'auto' }}>
                            {quizQuestions.map((q, qIdx) => (
                                <div key={q.id} style={{ background: '#1e293b', padding: '14px', borderRadius: 10, border: '1px solid #334155' }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', marginBottom: 10 }}>
                                        {qIdx + 1}. {q.question}
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        {q.options.map((opt, optIdx) => (
                                            <button
                                                key={optIdx}
                                                onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                                                style={{
                                                    background: quizAnswers[q.id] === optIdx ? '#6366f1' : '#0f172a',
                                                    color: quizAnswers[q.id] === optIdx ? 'white' : '#cbd5e1',
                                                    border: '1px solid #334155',
                                                    padding: '8px 12px',
                                                    borderRadius: 6,
                                                    fontSize: 11,
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    fontWeight: 600
                                                }}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setQuizSubmitted(true)}
                            style={{
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                color: 'white',
                                border: 'none',
                                padding: '12px',
                                borderRadius: 10,
                                fontWeight: 800,
                                fontSize: 13,
                                cursor: 'pointer'
                            }}
                        >
                            {quizSubmitted ? '🎉 คะแนนของคุณ: 3 / 3 (ผ่านเกณฑ์ 100%)' : 'ส่งคำตอบแบบทดสอบ'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
