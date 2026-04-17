import React, { useState } from 'react';
import { useLang } from '../LanguageContext';

function ScanPage({ userId }) {
  const { t } = useLang();

  // ============ PHOTO + ML MODEL STATES ============
  const [preview, setPreview] = useState(null);
  const [mlResult, setMlResult] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState(null);

  // ============ EDEMA STATES ============
  const [edemaResult, setEdemaResult] = useState(null);
  const [edemaQuestions, setEdemaQuestions] = useState({
    feet_swelling: false,
    hands_swelling: false,
    face_swelling: false,
    skin_pitting: false
  });

  // ============ ANEMIA QUESTIONS STATES ============
  const [anemiaResult, setAnemiaResult] = useState(null);
  const [anemiaQuestions, setAnemiaQuestions] = useState({
    pale_eyes: false,
    pale_nails: false,
    pale_tongue: false,
    weakness: false,
    fast_breathing: false
  });

  // ============================================================
  //  📸 PHOTO UPLOAD + ROBOFLOW ML MODEL CALL
  // ============================================================
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview dikhao
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setMlResult(null);
    setMlError(null);
    setMlLoading(true);

    try {
      // File ko base64 me convert karo
      const base64 = await convertToBase64(file);

      // Roboflow API call
      const response = await fetch(
        "https://classify.roboflow.com/anemia-detection-sj4uf-vdcb0/3?api_key=TSwUmxmdEhxvdddiy66f",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: base64
        }
      );

      if (!response.ok) {
        throw new Error("API call failed: " + response.status);
      }

      const data = await response.json();

      // Result parse karo
      if (data && data.predictions) {
        // Sabse zyada confidence wala result lo
        const topPrediction = Object.entries(data.predictions)
          .sort((a, b) => b[1].confidence - a[1].confidence)[0];

        if (topPrediction) {
          setMlResult({
            className: topPrediction[0],
            confidence: topPrediction[1].confidence
          });
        }
      } else if (data && data.top) {
        setMlResult({
          className: data.top,
          confidence: data.confidence
        });
      }
    } catch (err) {
      console.error("ML Error:", err);
      setMlError("Model call failed. Check internet connection.");
    } finally {
      setMlLoading(false);
    }
  };

  // Base64 converter function
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // "data:image/jpeg;base64,xxxxx" me se sirf base64 part lo
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Result ka color
  const getResultStyle = () => {
    if (!mlResult) return {};
    const isAnemic = mlResult.className.toLowerCase().includes("anemi");
    return {
      background: isAnemic ? "#f8d7da" : "#d4edda",
      border: `3px solid ${isAnemic ? "#dc3545" : "#28a745"}`,
      color: isAnemic ? "#dc3545" : "#28a745"
    };
  };

  // ============================================================
  //  💧 EDEMA CHECK
  // ============================================================
  const handleEdemaChange = (key) => {
    setEdemaQuestions({ ...edemaQuestions, [key]: !edemaQuestions[key] });
  };

  const checkEdema = () => {
    const yesCount = Object.values(edemaQuestions).filter(v => v).length;
    let severity, message;
    if (yesCount >= 3) {
      severity = 'SEVERE';
      message = `🔴 ${t('sev_sam')} - ${t('adv_sam')}`;
    } else if (yesCount >= 1) {
      severity = 'MODERATE';
      message = `🟠 ${t('sev_mam')} - ${t('adv_mam')}`;
    } else {
      severity = 'NORMAL';
      message = `🟢 ${t('sev_normal')}`;
    }
    setEdemaResult({ severity, message, yesCount });
  };

  // ============================================================
  //  🩸 ANEMIA QUESTIONS CHECK
  // ============================================================
  const handleAnemiaChange = (key) => {
    setAnemiaQuestions({ ...anemiaQuestions, [key]: !anemiaQuestions[key] });
  };

  const checkAnemia = () => {
    const yesCount = Object.values(anemiaQuestions).filter(v => v).length;
    let severity, message;
    if (yesCount >= 4) {
      severity = 'SEVERE';
      message = `🔴 ${t('adv_sam')}`;
    } else if (yesCount >= 2) {
      severity = 'MODERATE';
      message = `🟠 ${t('adv_mam')}`;
    } else {
      severity = 'NORMAL';
      message = `🟢 ${t('adv_normal')}`;
    }
    setAnemiaResult({ severity, message, yesCount });
  };

  const getSeverityColor = (s) => {
    if (s === 'SEVERE') return '#dc3545';
    if (s === 'MODERATE') return '#fd7e14';
    return '#28a745';
  };

  // ============================================================
  //  🖥️ UI RENDER
  // ============================================================
  return (
    <div style={{
      background: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2>🔍 {t('scan_title')}</h2>

      {/* ========================================= */}
      {/*  📸 PHOTO UPLOAD + ML MODEL SECTION       */}
      {/* ========================================= */}
      <div style={{
        background: '#f0f4ff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '25px',
        border: '3px solid #667eea'
      }}>
        <h3>📸 AI Anemia Detection - Eye Photo</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          👁️ Aankh ki photo upload karo - AI batayega anemia hai ya nahi
        </p>

        {/* Upload Button */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoUpload}
          style={{
            width: '100%',
            padding: '15px',
            border: '2px dashed #667eea',
            borderRadius: '8px',
            cursor: 'pointer',
            background: '#f8f9ff',
            fontSize: '16px'
          }}
        />

        {/* Image Preview */}
        {preview && (
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <img
              src={preview}
              alt="Eye"
              style={{
                maxWidth: '300px',
                borderRadius: '12px',
                border: '3px solid #667eea',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            />
          </div>
        )}

        {/* Loading */}
        {mlLoading && (
          <div style={{
            marginTop: '15px',
            padding: '20px',
            textAlign: 'center',
            background: '#fff3cd',
            borderRadius: '8px',
            border: '2px solid #ffc107'
          }}>
            <p style={{ fontSize: '18px' }}>⏳ AI analyzing...</p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Model eye photo check kar raha hai...
            </p>
          </div>
        )}

        {/* Error */}
        {mlError && (
          <div style={{
            marginTop: '15px',
            padding: '15px',
            background: '#f8d7da',
            borderRadius: '8px',
            border: '2px solid #dc3545'
          }}>
            <p style={{ color: '#dc3545', fontWeight: 'bold' }}>
              ❌ {mlError}
            </p>
          </div>
        )}

        {/* ✅ ML RESULT */}
        {mlResult && (
          <div style={{
            marginTop: '15px',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            ...getResultStyle()
          }}>
            <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>
              {mlResult.className.toLowerCase().includes("anemi")
                ? "🔴 ANEMIA DETECTED"
                : "🟢 NO ANEMIA"
              }
            </h3>

            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
              Result: {mlResult.className}
            </p>

            <p style={{ fontSize: '18px', marginTop: '10px' }}>
              Confidence: {(mlResult.confidence * 100).toFixed(1)}%
            </p>

            {/* Confidence Bar */}
            <div style={{
              width: '100%',
              height: '20px',
              background: '#e0e0e0',
              borderRadius: '10px',
              marginTop: '15px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(mlResult.confidence * 100).toFixed(1)}%`,
                height: '100%',
                background: mlResult.className.toLowerCase().includes("anemi")
                  ? '#dc3545'
                  : '#28a745',
                borderRadius: '10px',
                transition: 'width 1s ease'
              }} />
            </div>

            {/* Advice */}
            <div style={{
              marginTop: '15px',
              padding: '15px',
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '8px'
            }}>
              {mlResult.className.toLowerCase().includes("anemi") ? (
                <div>
                  <p style={{ fontWeight: 'bold', color: '#dc3545' }}>
                    ⚠️ Doctor se milein
                  </p>
                  <p>• Iron-rich food khayein (palak, eggs, meat)</p>
                  <p>• Nearest health center jayein</p>
                  <p>• Blood test karwayein</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontWeight: 'bold', color: '#28a745' }}>
                    ✅ Aankh normal dikh rahi hai
                  </p>
                  <p>• Healthy diet continue karein</p>
                  <p>• Regular checkup karwayein</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================= */}
      {/*  💧 EDEMA CHECK SECTION                   */}
      {/* ========================================= */}
      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '25px',
        border: '2px solid #17a2b8'
      }}>
        <h3>💧 {t('scan_edema')}</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          {t('scan_edema_desc')}
        </p>

        {[
          { key: 'feet_swelling', label: t('edema_q1'), detail: t('edema_q1_detail') },
          { key: 'hands_swelling', label: t('edema_q2'), detail: t('edema_q2_detail') },
          { key: 'face_swelling', label: t('edema_q3'), detail: t('edema_q3_detail') },
          { key: 'skin_pitting', label: t('edema_q4'), detail: t('edema_q4_detail') }
        ].map(q => (
          <div key={q.key} onClick={() => handleEdemaChange(q.key)} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px', borderRadius: '8px', cursor: 'pointer',
            marginBottom: '8px',
            border: edemaQuestions[q.key]
              ? '2px solid #dc3545'
              : '2px solid #ddd',
            background: edemaQuestions[q.key] ? '#f8d7da' : 'white',
            transition: 'all 0.3s'
          }}>
            <span style={{ fontSize: '20px' }}>
              {edemaQuestions[q.key] ? '✅' : '⬜'}
            </span>
            <div>
              <p style={{ fontWeight: 'bold', fontSize: '15px' }}>{q.label}</p>
              <p style={{ fontSize: '12px', color: '#666' }}>{q.detail}</p>
            </div>
          </div>
        ))}

        <button onClick={checkEdema} style={{
          marginTop: '15px', padding: '12px 24px', width: '100%',
          background: '#17a2b8', color: 'white', border: 'none',
          borderRadius: '8px', cursor: 'pointer', fontSize: '16px',
          fontWeight: '600'
        }}>
          🔍 {t('scan_check')}
        </button>

        {edemaResult && (
          <div style={{
            marginTop: '15px', padding: '15px', borderRadius: '8px',
            background: edemaResult.severity === 'NORMAL'
              ? '#d4edda'
              : edemaResult.severity === 'MODERATE'
                ? '#fff3cd'
                : '#f8d7da',
            border: `2px solid ${getSeverityColor(edemaResult.severity)}`
          }}>
            <p style={{
              fontWeight: 'bold',
              color: getSeverityColor(edemaResult.severity)
            }}>
              {edemaResult.message}
            </p>
            <p style={{ marginTop: '8px', fontSize: '14px' }}>
              {edemaResult.yesCount}/4
            </p>
          </div>
        )}
      </div>

      {/* ========================================= */}
      {/*  🩸 ANEMIA QUESTIONS SECTION              */}
      {/* ========================================= */}
      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '25px',
        border: '2px solid #e91e63'
      }}>
        <h3>🩸 {t('scan_anemia')}</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          {t('scan_anemia_desc')}
        </p>

        {[
          { key: 'pale_eyes', label: t('anemia_q1'), detail: t('anemia_q1_detail') },
          { key: 'pale_nails', label: t('anemia_q2'), detail: t('anemia_q2_detail') },
          { key: 'pale_tongue', label: t('anemia_q3'), detail: t('anemia_q3_detail') },
          { key: 'weakness', label: t('anemia_q4'), detail: t('anemia_q4_detail') },
          { key: 'fast_breathing', label: t('anemia_q5'), detail: t('anemia_q5_detail') }
        ].map(q => (
          <div key={q.key} onClick={() => handleAnemiaChange(q.key)} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px', borderRadius: '8px', cursor: 'pointer',
            marginBottom: '8px',
            border: anemiaQuestions[q.key]
              ? '2px solid #e91e63'
              : '2px solid #ddd',
            background: anemiaQuestions[q.key] ? '#fce4ec' : 'white',
            transition: 'all 0.3s'
          }}>
            <span style={{ fontSize: '20px' }}>
              {anemiaQuestions[q.key] ? '✅' : '⬜'}
            </span>
            <div>
              <p style={{ fontWeight: 'bold', fontSize: '15px' }}>{q.label}</p>
              <p style={{ fontSize: '12px', color: '#666' }}>{q.detail}</p>
            </div>
          </div>
        ))}

        <button onClick={checkAnemia} style={{
          marginTop: '15px', padding: '12px 24px', width: '100%',
          background: '#e91e63', color: 'white', border: 'none',
          borderRadius: '8px', cursor: 'pointer', fontSize: '16px',
          fontWeight: '600'
        }}>
          🔍 {t('scan_check')}
        </button>

        {anemiaResult && (
          <div style={{
            marginTop: '15px', padding: '15px', borderRadius: '8px',
            background: anemiaResult.severity === 'NORMAL'
              ? '#d4edda'
              : anemiaResult.severity === 'MODERATE'
                ? '#fff3cd'
                : '#f8d7da',
            border: `2px solid ${getSeverityColor(anemiaResult.severity)}`
          }}>
            <p style={{
              fontWeight: 'bold',
              color: getSeverityColor(anemiaResult.severity)
            }}>
              {anemiaResult.message}
            </p>
            <p style={{ marginTop: '8px', fontSize: '14px' }}>
              {anemiaResult.yesCount}/5
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScanPage;