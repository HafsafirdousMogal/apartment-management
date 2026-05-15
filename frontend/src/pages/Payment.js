import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { colors } from '../utils/styles';

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentId, amount, month, type } = location.state || {};

  const [step, setStep] = useState('method');
  const [method, setMethod] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [pin, setPin] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMethodSelect = (m) => {
    setMethod(m);
    setStep('details');
  };

  const handleProceed = () => {
    setStep('pin');
  };

  const handlePayment = async () => {
    setLoading(true);
    setStep('processing');

    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      if (type === 'rent') {
        await API.put(`/rent/${paymentId}/pay`);
      } else {
        await API.put(`/maintenance-charges/${paymentId}/pay`);
      }
      setResult('success');
    } catch (err) {
      setResult('failed');
    } finally {
      setLoading(false);
      setStep('result');
    }
  };

  const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: '📱', desc: 'Pay using any UPI app' },
    { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
    { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks supported' },
  ];

  const banks = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'Yes Bank'];

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={{ color: '#888', fontSize: '12px' }}>Amount to pay</p>
            <p style={{ color: '#fff', fontSize: '24px', fontWeight: '500' }}>₹{amount}</p>
            <p style={{ color: '#666', fontSize: '12px' }}>{month}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#e879a0', fontSize: '13px', fontWeight: '500' }}>🏢 ApartmentMS</p>
            <p style={{ color: '#555', fontSize: '12px' }}>Secure Payment</p>
          </div>
        </div>

        <div style={styles.divider}></div>

        {/* Step: Choose Method */}
        {step === 'method' && (
          <div>
            <p style={styles.stepTitle}>Choose payment method</p>
            {paymentMethods.map((m) => (
              <div key={m.id} onClick={() => handleMethodSelect(m.id)} style={styles.methodCard}>
                <span style={{ fontSize: '20px' }}>{m.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontSize: '14px' }}>{m.label}</p>
                  <p style={{ color: '#666', fontSize: '12px' }}>{m.desc}</p>
                </div>
                <span style={{ color: '#888' }}>›</span>
              </div>
            ))}
            <button onClick={() => navigate(-1)} style={styles.cancelBtn}>Cancel</button>
          </div>
        )}

        {/* Step: Payment Details */}
        {step === 'details' && (
          <div>
            {method === 'upi' && (
              <div>
                <p style={styles.stepTitle}>Enter UPI ID</p>
                <input
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  style={styles.input}
                />
                <div style={styles.upiApps}>
                  {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                    <div key={app} onClick={() => setUpiId(`user@${app.toLowerCase()}`)}
                      style={styles.upiApp}>
                      <p style={{ color: '#fff', fontSize: '12px' }}>{app}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {method === 'card' && (
              <div>
                <p style={styles.stepTitle}>Enter card details</p>
                <input placeholder="Card Number" value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)} style={styles.input} maxLength={16} />
                <input placeholder="Cardholder Name" value={cardName}
                  onChange={(e) => setCardName(e.target.value)} style={{ ...styles.input, marginTop: '10px' }} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <input placeholder="MM/YY" value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)} style={styles.input} maxLength={5} />
                  <input placeholder="CVV" value={cardCvv} type="password"
                    onChange={(e) => setCardCvv(e.target.value)} style={styles.input} maxLength={3} />
                </div>
              </div>
            )}

            {method === 'netbanking' && (
              <div>
                <p style={styles.stepTitle}>Select your bank</p>
                <div style={styles.banksGrid}>
                  {banks.map((bank) => (
                    <div key={bank} style={styles.bankCard} onClick={() => setUpiId(bank)}>
                      <p style={{ color: '#fff', fontSize: '13px' }}>🏦</p>
                      <p style={{ color: '#aaa', fontSize: '12px' }}>{bank}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleProceed} style={styles.payBtn}>
              Proceed to Pay ₹{amount}
            </button>
            <button onClick={() => setStep('method')} style={styles.cancelBtn}>Back</button>
          </div>
        )}

        {/* Step: PIN */}
        {step === 'pin' && (
          <div style={{ textAlign: 'center' }}>
            <p style={styles.stepTitle}>
              {method === 'upi' ? 'Enter UPI PIN' : method === 'card' ? 'Enter Card PIN' : 'Enter OTP'}
            </p>
            <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>
              {method === 'upi' ? `Paying via ${upiId}` : `Amount: ₹${amount}`}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: pin.length > i ? '#e879a0' : '#2a2a3a',
                  border: '2px solid #e879a0', transition: 'all 0.2s'
                }}></div>
              ))}
            </div>
            <div style={styles.numpad}>
              {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((num, i) => (
                <button key={i} style={styles.numBtn}
                  onClick={() => {
                    if (num === '⌫') setPin(p => p.slice(0, -1));
                    else if (num !== '' && pin.length < 4) setPin(p => p + num);
                  }}>
                  {num}
                </button>
              ))}
            </div>
            <button
              onClick={handlePayment}
              disabled={pin.length < 4}
              style={{ ...styles.payBtn, opacity: pin.length < 4 ? 0.5 : 1, marginTop: '16px' }}>
              Confirm Payment
            </button>
            <button onClick={() => setStep('details')} style={styles.cancelBtn}>Back</button>
          </div>
        )}

        {/* Step: Processing */}
        {step === 'processing' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={styles.spinner}></div>
            <p style={{ color: '#fff', fontSize: '16px', marginTop: '24px' }}>Processing payment...</p>
            <p style={{ color: '#666', fontSize: '13px', marginTop: '8px' }}>Please do not close this window</p>
          </div>
        )}

        {/* Step: Result */}
        {step === 'result' && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            {result === 'success' ? (
              <>
                <div style={styles.successIcon}>✓</div>
                <h3 style={{ color: '#2ecc71', fontSize: '20px', margin: '16px 0 8px' }}>Payment Successful!</h3>
                <p style={{ color: '#888', fontSize: '14px' }}>₹{amount} paid for {month}</p>
                <p style={{ color: '#555', fontSize: '12px', marginTop: '8px' }}>
                  Transaction ID: TXN{Date.now()}
                </p>
              </>
            ) : (
              <>
                <div style={styles.failIcon}>✗</div>
                <h3 style={{ color: '#ff4d4d', fontSize: '20px', margin: '16px 0 8px' }}>Payment Failed!</h3>
                <p style={{ color: '#888', fontSize: '14px' }}>Please try again</p>
              </>
            )}
            <button onClick={() => navigate(-1)} style={{ ...styles.payBtn, marginTop: '24px' }}>
              Go Back
            </button>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  overlay: {
    minHeight: '100vh',
    background: '#0a0a0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  modal: {
    background: '#17171f',
    border: '1px solid #2a2a3a',
    borderRadius: '16px',
    padding: '28px',
    width: '100%',
    maxWidth: '420px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },
  divider: {
    height: '1px',
    background: '#2a2a3a',
    marginBottom: '20px'
  },
  stepTitle: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: '500',
    marginBottom: '16px'
  },
  methodCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#1e1e2a',
    border: '1px solid #2a2a3a',
    borderRadius: '10px',
    padding: '14px',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'border-color 0.2s'
  },
  input: {
    width: '100%',
    background: '#1e1e2a',
    border: '1px solid #2a2a3a',
    color: '#fff',
    padding: '12px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  upiApps: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px',
    flexWrap: 'wrap'
  },
  upiApp: {
    background: '#1e1e2a',
    border: '1px solid #2a2a3a',
    borderRadius: '8px',
    padding: '10px 16px',
    cursor: 'pointer',
    textAlign: 'center'
  },
  banksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginBottom: '16px'
  },
  bankCard: {
    background: '#1e1e2a',
    border: '1px solid #2a2a3a',
    borderRadius: '8px',
    padding: '12px',
    cursor: 'pointer',
    textAlign: 'center'
  },
  payBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #e879a0, #4361ee)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '16px'
  },
  cancelBtn: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    color: '#666',
    border: '1px solid #2a2a3a',
    borderRadius: '10px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  numpad: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    maxWidth: '240px',
    margin: '0 auto'
  },
  numBtn: {
    background: '#1e1e2a',
    border: '1px solid #2a2a3a',
    color: '#fff',
    padding: '16px',
    borderRadius: '10px',
    fontSize: '18px',
    cursor: 'pointer'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '3px solid #2a2a3a',
    borderTop: '3px solid #e879a0',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  },
  successIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: '#2ecc7120',
    border: '2px solid #2ecc71',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    color: '#2ecc71',
    margin: '0 auto'
  },
  failIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: '#ff4d4d20',
    border: '2px solid #ff4d4d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    color: '#ff4d4d',
    margin: '0 auto'
  }
};

export default Payment;