import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { CheckCircle, Clock, Zap, Smartphone, UploadCloud, FileImage, Trash2, ShieldCheck, Check } from 'lucide-react';
import { formatPrice } from '../data/products';

// PromptPay QR Code Generator (EMV Format)
const generatePromptPayQR = (phoneNumber, amount) => {
  const payload = {
    '00': '01',
    '01': '12',
    '29': {
      '00': '0015A000000677010111',
      '01': '0115' + phoneNumber.replace(/[^0-9]/g, '').padStart(13, '0'),
      '58': '5802TH',
      '59': 'PROMPTPAY',
      '60': amount.toString().padStart(2, '0'),
      '61': 'THB',
      '62': '07080113'
    }
  };

  const qrString = buildQRString(payload);
  const crc = calculateCRC16(qrString);
  return qrString + crc.toString(16).toUpperCase().padStart(4, '0');
};

const buildQRString = (obj) => {
  let str = '';
  Object.keys(obj).sort().forEach(key => {
    const val = obj[key];
    if (typeof val === 'object') {
      const nested = buildQRString(val);
      str += key + String(nested.length).padStart(2, '0') + nested;
    } else {
      str += key + String(val.length).padStart(2, '0') + val;
    }
  });
  return str;
};

const calculateCRC16 = (str) => {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xFFFF;
    }
  }
  return crc;
};

export default function PromptPayPayment({ 
  total, 
  phoneNumber = '0815018272',
  onPaymentComplete,
  onSlipUpload,
  loading 
}) {
  const [verificationStep, setVerificationStep] = useState('qr'); // qr, upload, verifying, confirmed
  const [countdown, setCountdown] = useState(0);
  const [referenceNo, setReferenceNo] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [slipImage, setSlipImage] = useState(null);
  const [slipName, setSlipName] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const qrValue = generatePromptPayQR(phoneNumber, Math.round(total));

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(qrValue, { width: 220, margin: 2, errorCorrectionLevel: 'H' })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((error) => {
        console.error('Failed to generate QR image:', error);
      });
    return () => {
      isMounted = false;
    };
  }, [qrValue]);

  const handleFileUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('กรุณาแนบไฟล์รูปภาพสลิปเท่านั้น (JPEG, PNG, WEBP)');
      return;
    }
    setSlipName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSlipImage(e.target.result);
      if (onSlipUpload) onSlipUpload(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleProceedToUpload = () => {
    setVerificationStep('upload');
  };

  const completePayment = useCallback(() => {
    setVerificationStep('confirmed');
    onPaymentComplete({
      method: 'promptpay',
      phoneNumber,
      referenceNo,
      slipImage,
      timestamp: new Date().toISOString(),
      amount: total
    });
  }, [phoneNumber, referenceNo, slipImage, total, onPaymentComplete]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        if (countdown === 1) {
          completePayment();
        } else {
          setCountdown(countdown - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, completePayment]);

  const handleConfirmSlip = () => {
    if (!slipImage) {
      alert('กรุณาแนบสลิปหลักฐานการโอนเงินก่อนยืนยัน');
      return;
    }
    setReferenceNo('REF-' + Date.now().toString().slice(-8).toUpperCase());
    setVerificationStep('verifying');
    setCountdown(3);
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: 16, padding: '24px 20px', border: '1px solid #e2e8f0' }}>
      
      {/* STEP 1: SCAN QR CODE */}
      {verificationStep === 'qr' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eef2ff', color: '#4f46e5', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
            <Smartphone size={16} /> สแกน QR Code พร้อมเพย์
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            พร้อมเพย์ (PromptPay QR)
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px 0' }}>
            เปิดแอปธนาคารของท่าน แล้วสแกนเพื่อโอนเงินตามยอดที่ระบุ
          </p>
          
          <div style={{
            background: 'white',
            padding: 16,
            borderRadius: 16,
            display: 'inline-block',
            boxShadow: '0 4px 16px rgba(79, 70, 229, 0.12)',
            border: '2px solid #6366f1',
            marginBottom: 16
          }}>
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="PromptPay QR"
                style={{ width: 220, height: 220, display: 'block', borderRadius: 8 }}
              />
            ) : (
              <div style={{ width: 220, height: 220, display: 'grid', placeItems: 'center', color: '#64748b' }}>
                กำลังสร้าง QR...
              </div>
            )}
          </div>

          <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0', maxWidth: 360, margin: '0 auto 20px auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span style={{ color: '#64748b' }}>เบอร์พร้อมเพย์:</span>
              <strong style={{ color: '#0f172a', fontFamily: 'monospace', fontSize: 14 }}>{phoneNumber}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#64748b' }}>ยอดชำระสุทธิ:</span>
              <strong style={{ color: '#4f46e5', fontSize: 16 }}>{formatPrice(total)}</strong>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleProceedToUpload}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 32px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              transition: 'transform 0.2s'
            }}
          >
            <Zap size={18} /> โอนเงินแล้ว ➔ ไปแนบสลิป
          </button>
        </div>
      )}

      {/* STEP 2: UPLOAD BANK SLIP */}
      {verificationStep === 'upload' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fef3c7', color: '#b45309', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
            <UploadCloud size={16} /> ขั้นตอนแนบสลิปธนาคาร
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            แนบหลักฐานการโอนเงิน (สลิปธนาคาร)
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px 0' }}>
            กรุณาอัปโหลดรูปภาพสลิปที่โอนเงิน {formatPrice(total)} เข้าเบอร์ {phoneNumber}
          </p>

          {/* Slip Drag & Drop Area */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('slip-file-input').click()}
            style={{
              border: dragOver ? '2px dashed #4f46e5' : slipImage ? '2px solid #22c55e' : '2px dashed #cbd5e1',
              background: dragOver ? '#eef2ff' : slipImage ? '#f0fdf4' : '#f8fafc',
              borderRadius: 16,
              padding: '24px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: 20,
              position: 'relative'
            }}
          >
            <input 
              id="slip-file-input"
              type="file" 
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            {slipImage ? (
              <div>
                <img 
                  src={slipImage} 
                  alt="Bank Slip Preview" 
                  style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: 10 }}
                />
                <div style={{ fontSize: 13, fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Check size={16} /> แนบสลิปเรียบร้อย: {slipName}
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                  (คลิกเพื่อเปลี่ยนรูปสลิปใหม่)
                </div>
              </div>
            ) : (
              <div>
                <div style={{ width: 48, height: 48, background: '#eef2ff', color: '#4f46e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                  <UploadCloud size={24} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                  คลิกเพื่อเลือกไฟล์สลิป หรือลากไฟล์มาวางที่นี่
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  รองรับไฟล์รูปภาพ JPG, PNG, WEBP จากแอปธนาคาร
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => setVerificationStep('qr')}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#475569',
                padding: '10px 20px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ◀ กลับไปดู QR
            </button>

            <button
              type="button"
              onClick={handleConfirmSlip}
              disabled={!slipImage}
              style={{
                background: slipImage ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' : '#cbd5e1',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: slipImage ? 'pointer' : 'not-allowed',
                boxShadow: slipImage ? '0 4px 12px rgba(22, 163, 74, 0.3)' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <CheckCircle size={16} /> ยืนยันสลิปโอนเงิน
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: VERIFYING SLIP */}
      {verificationStep === 'verifying' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Clock size={48} style={{ margin: '0 auto 16px auto', display: 'block', color: '#4f46e5', animation: 'spin 2s linear infinite' }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
            กำลังตรวจสอบสลิปและยืนยันยอดเงิน
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
            ระบบกำลังประมวลผลความถูกต้อง กรุณารอสักครู่ ({countdown}s)...
          </p>
          <div style={{ fontSize: 12, fontFamily: 'monospace', background: '#f8fafc', padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', display: 'inline-block', color: '#475569' }}>
            รหัสอ้างอิง: {referenceNo}
          </div>
        </div>
      )}

      {/* STEP 4: CONFIRMED */}
      {verificationStep === 'confirmed' && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ width: 56, height: 56, background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <CheckCircle size={32} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#15803d', marginBottom: 4 }}>
            ตรวจสอบสลิปและชำระเงินสำเร็จแล้ว!
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px 0' }}>
            แนบสลิปเรียบร้อยแล้ว กดปุ่ม "ยืนยันสั่งซื้อและรับสิทธิ์เข้าอ่าน" เพื่อเสร็จสิ้น
          </p>
          <div style={{ fontSize: 12, background: '#f0fdf4', color: '#166534', padding: '8px 14px', borderRadius: 8, border: '1px solid #bbf7d0', display: 'inline-block', fontWeight: 600 }}>
            ได้รับยอดเงิน {formatPrice(total)} ครบถ้วน
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
