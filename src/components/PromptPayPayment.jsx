import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { CheckCircle, Clock, Zap } from 'lucide-react';
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

const buildQRString = (obj, prefix = '') => {
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
  loading 
}) {
  const [verificationStep, setVerificationStep] = useState('qr'); // qr, verifying, confirmed
  const [countdown, setCountdown] = useState(0);
  const [referenceNo, setReferenceNo] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (verificationStep === 'verifying' && countdown === 0) {
      setCountdown(8);
    }
  }, [verificationStep]);

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
  }, [countdown]);

  const handleScanConfirm = () => {
    setReferenceNo('REF-' + Date.now().toString().slice(-8).toUpperCase());
    setVerificationStep('verifying');
    setCountdown(8);
  };

  const completePayment = () => {
    setVerificationStep('confirmed');
    onPaymentComplete({
      method: 'promptpay',
      phoneNumber,
      referenceNo,
      timestamp: new Date().toISOString(),
      amount: total
    });
  };

  const qrValue = generatePromptPayQR(phoneNumber, Math.round(total));

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(qrValue, { width: 240, margin: 2, errorCorrectionLevel: 'H' })
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

  return (
    <div className="promptpay-payment">
      <style>{`
        .promptpay-payment {
          padding: 24px;
          background: white;
          border-radius: 12px;
          color: #333;
          border: 2px solid #e0e0e0;
        }

        .payment-step {
          text-align: center;
        }

        .qr-container {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin: 24px 0;
          display: inline-block;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          animation: popIn 0.5s ease-out;
          border: 3px solid #4CAF50;
        }

        @keyframes popIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .qr-container canvas {
          width: 240px !important;
          height: 240px !important;
        }

        .payment-info {
          margin: 20px 0;
          font-size: 16px;
          line-height: 1.6;
          color: #333;
        }

        .payment-info strong {
          display: block;
          font-size: 20px;
          margin: 10px 0;
          color: #4CAF50;
          font-weight: 700;
        }

        .countdown-timer {
          font-size: 48px;
          font-weight: bold;
          color: #4CAF50;
          margin: 20px 0;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        .verification-status {
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }

        .status-pending {
          background: #f5f5f5;
          border: 2px solid #ddd;
        }

        .status-confirmed {
          background: #e8f5e9;
          border: 2px solid #4CAF50;
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
        }

        .payment-confirm-btn {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 14px 36px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 16px;
          transition: all 0.3s;
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .payment-confirm-btn:hover {
          background: #45a049;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
        }

        .payment-confirm-btn:disabled {
          background: #ccc;
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .reference-text {
          font-size: 14px;
          margin-top: 12px;
          font-family: monospace;
          background: #f5f5f5;
          padding: 8px 12px;
          border-radius: 4px;
          word-break: break-all;
          color: #333;
          border-left: 4px solid #4CAF50;
        }

        .success-icon {
          animation: bounce 0.6s ease-out;
        }

        @keyframes bounce {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        h3 {
          color: #333;
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
        }

        p {
          color: #666;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {verificationStep === 'qr' && (
        <div className="payment-step">
          <h3 style={{ marginBottom: 8, fontSize: 20 }}>📱 PromptPay</h3>
          <p style={{ marginBottom: 20, fontSize: 14 }}>สแกน QR Code เพื่อชำระเงิน</p>
          
          <div className="qr-container">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="PromptPay QR"
                style={{ width: 240, height: 240, display: 'block' }}
              />
            ) : (
              <div style={{ width: 240, height: 240, display: 'grid', placeItems: 'center', color: '#666' }}>
                กำลังสร้าง QR...
              </div>
            )}
          </div>

          <div className="payment-info">
            <span>เบอร์โทรศัพท์:</span>
            <strong>{phoneNumber}</strong>
            <span style={{ marginTop: 16, display: 'block' }}>จำนวนเงิน:</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <button 
            className="payment-confirm-btn"
            onClick={handleScanConfirm}
            disabled={loading}
          >
            <Zap size={18} />
            ชำระเงินแล้ว
          </button>
          
          <p style={{ fontSize: 12, marginTop: 16 }}>
            กดปุ่มหลังจากทำการชำระเงินผ่าน PromptPay แล้ว
          </p>
        </div>
      )}

      {verificationStep === 'verifying' && (
        <div className="payment-step">
          <div style={{ marginBottom: 20 }}>
            <Clock size={48} style={{ margin: '0 auto', display: 'block', animation: 'spin 2s linear infinite', color: '#4CAF50' }} />
          </div>
          <h3 style={{ fontSize: 20 }}>กำลังตรวจสอบการชำระเงิน</h3>
          <p style={{ marginBottom: 20 }}>รอสักครู่...</p>
          
          <div className="verification-status status-pending">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, fontSize: 16 }}>
              <span>📡 ตรวจสอบการชำระ</span>
            </div>
          </div>

          <div className="countdown-timer">{countdown}s</div>

          <div className="reference-text">
            หมายเลขอ้างอิง: {referenceNo}
          </div>
        </div>
      )}

      {verificationStep === 'confirmed' && (
        <div className="payment-step">
          <div style={{ marginBottom: 20 }} className="success-icon">
            <CheckCircle size={56} style={{ margin: '0 auto', display: 'block', color: '#4CAF50' }} />
          </div>
          <h3 style={{ fontSize: 20, color: '#4CAF50' }}>✓ ชำระเงินสำเร็จ</h3>
          
          <div className="verification-status status-confirmed">
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#2e7d32' }}>
              ✓ ได้รับชำระเงิน {formatPrice(total)}
            </div>
            <div style={{ fontSize: 14, marginBottom: 8, color: '#333' }}>
              เบอร์โทร: {phoneNumber}
            </div>
            <div style={{ fontSize: 14, fontFamily: 'monospace', color: '#333' }}>
              อ้างอิง: {referenceNo}
            </div>
          </div>

          <p style={{ fontSize: 13, marginTop: 16, color: '#4CAF50', fontWeight: 500 }}>
            ✓ การสั่งซื้อของคุณได้รับการยืนยันแล้ว
          </p>
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
