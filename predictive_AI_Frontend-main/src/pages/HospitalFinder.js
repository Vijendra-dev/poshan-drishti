import React, { useState, useCallback } from 'react';

function HospitalFinder({ userId, lang = 'en' }) {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [searchMethod, setSearchMethod] = useState('gps');
  const [manualLocation, setManualLocation] = useState('');

  const txt = (hi, en) => lang === 'hi' ? hi : en;

  // ========================================
  // 🧪 GPS TEST FUNCTION
  // ========================================
  const testGPS = useCallback(() => {
    console.log('🧪 Testing GPS availability...');
    console.log('Navigator exists:', !!navigator);
    console.log('Geolocation exists:', !!navigator.geolocation);
    console.log('Protocol:', window.location.protocol);
    console.log('Hostname:', window.location.hostname);
    
    if (navigator.permissions) {
      navigator.permissions.query({name: 'geolocation'}).then(result => {
        console.log('Geolocation permission:', result.state);
      });
    }
    
    alert('Check browser console (F12) for GPS test results');
  }, []);

  // ========================================
  // 🌐 IP-BASED LOCATION (FALLBACK)
  // ========================================
  const getIPLocation = useCallback(async () => {
    console.log('🌐 Trying IP-based location...');
    setLoading(true);
    
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      console.log('🌐 IP Location data:', data);
      
      if (data.latitude && data.longitude) {
        const loc = {
          lat: data.latitude,
          lng: data.longitude,
          accuracy: 10000, // IP-based is less accurate
          timestamp: Date.now(),
          source: 'ip'
        };
        setUserLocation(loc);
        setLocationName(`${data.city}, ${data.region}`);
        console.log('✅ IP-based location set');
      } else {
        throw new Error('No location data from IP');
      }
    } catch (error) {
      console.log('❌ IP location failed:', error);
      alert(txt('IP-based location भी नहीं मिला। Manual entry use करें।', 'IP-based location also failed. Use manual entry.'));
    }
    
    setLoading(false);
  }, [lang]);

  // ========================================
  // 📍 GPS LOCATION
  // ========================================
  const getGPSLocation = useCallback(() => {
    console.log('🚀 Starting GPS location detection...');
    setLoading(true);

    // Check for HTTPS requirement
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      console.log('❌ HTTPS required for GPS');
      alert(txt('GPS के लिए HTTPS connection चाहिए। Localhost पर काम करेगा।', 'GPS requires HTTPS connection. Will work on localhost.'));
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      console.log('❌ Geolocation not supported');
      alert(txt('GPS नहीं है', 'No GPS'));
      setLoading(false);
      return;
    }

    console.log('📍 Requesting geolocation...');
    // Clear any previous location to force fresh detection
    setUserLocation(null);
    setLocationName('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('✅ Got position:', position.coords);
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        setUserLocation(loc);
        
        // Get location name
        try {
          console.log('🌍 Fetching location name...');
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}`,
            { headers: { 'User-Agent': 'HealthApp/1.0' } }
          );
          const data = await res.json();
          console.log('📍 Location data:', data);
          const city = data?.address?.city || data?.address?.town || data?.address?.village || data?.address?.district || '';
          const state = data?.address?.state || '';
          setLocationName(city ? `${city}, ${state}` : `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`);
        } catch (error) {
          console.log('❌ Error fetching location name:', error);
          setLocationName(`${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`);
        }
        
        setLoading(false);
        console.log('✅ GPS location detection complete');
      },
      (error) => {
        console.log('❌ GPS Error:', error);
        let errorMsg = txt('Location नहीं मिला', 'Location not found');
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = txt('Location permission denied. Please allow location access in browser settings.', 'Location permission denied. Please allow location access in browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = txt('Location information unavailable. Try manual entry.', 'Location information unavailable. Try manual entry.');
            break;
          case error.TIMEOUT:
            errorMsg = txt('Location request timed out. Try again.', 'Location request timed out. Try again.');
            break;
        }
        alert(errorMsg);
        setLoading(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000,
        maximumAge: 0  // Force fresh location, don't use cached
      }
    );
  }, [lang]);

  // ========================================
  // 🔍 SEARCH IN GOOGLE MAPS (100% WORKING)
  // ========================================
  const searchInGoogleMaps = (query) => {
    let url;
    if (userLocation) {
      url = `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${userLocation.lat},${userLocation.lng},14z`;
    } else if (manualLocation.trim()) {
      url = `https://www.google.com/maps/search/${encodeURIComponent(query + ' near ' + manualLocation)}`;
    } else {
      url = `https://www.google.com/maps/search/${encodeURIComponent(query + ' near me')}`;
    }
    window.open(url, '_blank');
  };

  // ========================================
  // 📱 OPEN DIRECTIONS
  // ========================================
  const openDirectionsTo = (place) => {
    if (userLocation) {
      window.open(`https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${encodeURIComponent(place)}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/dir//${encodeURIComponent(place)}`, '_blank');
    }
  };

  const cities = ['Delhi', 'Mumbai', 'Lucknow', 'Patna', 'Jaipur', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad', 'Bhopal', 'Ranchi', 'Varanasi'];

  // ========================================
  // 🏥 FACILITY CATEGORIES
  // ========================================
  const facilityCategories = [
    {
      icon: '🏥',
      title: txt('अस्पताल', 'Hospitals'),
      color: '#dc3545',
      searches: [
        { label: txt('सरकारी अस्पताल', 'Govt Hospital'), query: 'government hospital' },
        { label: txt('प्राइवेट अस्पताल', 'Private Hospital'), query: 'private hospital' },
        { label: txt('जिला अस्पताल', 'District Hospital'), query: 'district hospital' },
        { label: txt('मेडिकल कॉलेज', 'Medical College'), query: 'medical college hospital' }
      ]
    },
    {
      icon: '👶',
      title: txt('आंगनवाड़ी / ICDS', 'Anganwadi / ICDS'),
      color: '#28a745',
      searches: [
        { label: txt('आंगनवाड़ी केंद्र', 'Anganwadi Centre'), query: 'anganwadi centre' },
        { label: 'ICDS Centre', query: 'ICDS centre' },
        { label: txt('बाल विकास केंद्र', 'Child Development'), query: 'child development centre' },
        { label: txt('पोषण केंद्र', 'Nutrition Centre'), query: 'nutrition centre' }
      ]
    },
    {
      icon: '🏨',
      title: txt('PHC / स्वास्थ्य केंद्र', 'PHC / Health Centre'),
      color: '#17a2b8',
      searches: [
        { label: 'PHC', query: 'PHC primary health centre' },
        { label: 'CHC', query: 'CHC community health centre' },
        { label: txt('उप स्वास्थ्य केंद्र', 'Sub Health Centre'), query: 'sub health centre' },
        { label: txt('स्वास्थ्य केंद्र', 'Health Centre'), query: 'government health centre' }
      ]
    },
    {
      icon: '🍼',
      title: txt('NRC / पोषण पुनर्वास', 'NRC / Nutrition Rehab'),
      color: '#fd7e14',
      searches: [
        { label: 'NRC', query: 'NRC nutrition rehabilitation centre' },
        { label: txt('कुपोषण उपचार केंद्र', 'Malnutrition Treatment'), query: 'malnutrition treatment centre' },
        { label: txt('पोषण पुनर्वास', 'Nutrition Rehab'), query: 'nutrition rehabilitation' },
        { label: 'MTC', query: 'MTC malnutrition treatment centre' }
      ]
    },
    {
      icon: '💊',
      title: txt('क्लिनिक / डॉक्टर', 'Clinic / Doctor'),
      color: '#6f42c1',
      searches: [
        { label: txt('क्लिनिक', 'Clinic'), query: 'clinic' },
        { label: txt('बाल रोग विशेषज्ञ', 'Pediatrician'), query: 'pediatrician child specialist' },
        { label: txt('डिस्पेंसरी', 'Dispensary'), query: 'dispensary' },
        { label: txt('डॉक्टर', 'Doctor'), query: 'doctor' }
      ]
    },
    {
      icon: '🤰',
      title: txt('मातृत्व / प्रसूति', 'Maternity'),
      color: '#e91e63',
      searches: [
        { label: txt('मातृत्व अस्पताल', 'Maternity Hospital'), query: 'maternity hospital' },
        { label: txt('प्रसूति केंद्र', 'Delivery Centre'), query: 'delivery centre' },
        { label: txt('महिला अस्पताल', 'Women Hospital'), query: 'women hospital' },
        { label: txt('जननी सुरक्षा', 'Janani Suraksha'), query: 'janani suraksha hospital' }
      ]
    }
  ];

  // ========================================
  // 🎨 RENDER
  // ========================================
  return (
    <div style={{ padding: '15px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Title */}
      <h2 style={{ color: '#4f46e5', textAlign: 'center', marginBottom: '20px' }}>
        🏥 {txt('अस्पताल और आंगनवाड़ी खोजें', 'Find Hospitals & Anganwadi')}
      </h2>

      {/* ===== EMERGENCY ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
        padding: '20px', borderRadius: '12px', marginBottom: '20px',
        textAlign: 'center', color: 'white'
      }}>
        <h3 style={{ margin: '0 0 15px 0' }}>🚨 {txt('आपातकालीन हेल्पलाइन', 'Emergency Helpline')}</h3>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { num: '108', label: txt('एम्बुलेंस', 'Ambulance') },
            { num: '112', label: txt('इमरजेंसी', 'Emergency') },
            { num: '102', label: txt('माँ/बच्चा', 'Mother/Child') },
            { num: '1098', label: txt('बाल हेल्पलाइन', 'Child Helpline') }
          ].map(item => (
            <button key={item.num} onClick={() => window.open(`tel:${item.num}`, '_self')}
              style={{
                padding: '12px 20px', background: 'white', color: '#dc2626',
                border: 'none', borderRadius: '8px', fontWeight: 'bold',
                cursor: 'pointer', fontSize: '14px'
              }}>
              📞 {item.num} - {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== LOCATION SECTION ===== */}
      <div style={{
        background: '#f0f4ff', padding: '20px', borderRadius: '12px',
        marginBottom: '20px', border: '2px solid #4f46e5'
      }}>
        <h3 style={{ color: '#4f46e5', marginTop: 0 }}>
          📍 {txt('अपनी Location सेट करें', 'Set Your Location')}
        </h3>

        {/* Method Toggle */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button onClick={() => setSearchMethod('gps')}
            style={{
              flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
              background: searchMethod === 'gps' ? '#06b6d4' : 'white',
              color: searchMethod === 'gps' ? 'white' : '#333',
              border: searchMethod === 'gps' ? 'none' : '2px solid #ddd'
            }}>
            📍 GPS (Precise)
          </button>
          <button onClick={() => setSearchMethod('ip')}
            style={{
              flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
              background: searchMethod === 'ip' ? '#4f46e5' : 'white',
              color: searchMethod === 'ip' ? 'white' : '#333',
              border: searchMethod === 'ip' ? 'none' : '2px solid #ddd'
            }}>
            🌐 IP (Approx)
          </button>
          <button onClick={() => setSearchMethod('manual')}
            style={{
              flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
              background: searchMethod === 'manual' ? '#10b981' : 'white',
              color: searchMethod === 'manual' ? 'white' : '#333',
              border: searchMethod === 'manual' ? 'none' : '2px solid #ddd'
            }}>
            ✏️ Manual
          </button>
        </div>

        {/* GPS */}
        {searchMethod === 'gps' && (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button onClick={getGPSLocation} disabled={loading}
                style={{
                  flex: 1, padding: '15px',
                background: loading ? '#cbd5e1' : (userLocation ? '#10b981' : '#06b6d4'),
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontWeight: 'bold', fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}>
                {loading ? '⏳ Detecting...' : (userLocation ? '✅ Location Set!' : txt('📍 Location Detect करें', '📍 Detect Location'))}
              </button>
              {userLocation && (
                <button onClick={getGPSLocation} disabled={loading}
                  style={{
                    padding: '15px 20px',
                    background: '#06b6d4',
                    color: 'white', border: 'none', borderRadius: '8px',
                    fontWeight: 'bold', fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}>
                  🔄 {txt('Refresh', 'Refresh')}
                </button>
              )}
              <button onClick={testGPS}
                style={{
                  padding: '15px 20px',
                  background: '#f59e0b',
                  color: 'black', border: 'none', borderRadius: '8px',
                  fontWeight: 'bold', fontSize: '14px',
                  cursor: 'pointer'
                }}>
                🧪 Test GPS
              </button>
            </div>
            {locationName && (
              <div style={{
                marginTop: '12px', padding: '12px', background: '#dcfce7',
                borderRadius: '8px', color: '#166534', textAlign: 'center'
              }}>
                📍 <strong>{locationName}</strong>
                {userLocation?.accuracy && (
                  <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
                    Accuracy: ±{Math.round(userLocation.accuracy)}m
                  </div>
                )}
                {userLocation && (
                  <div style={{ fontSize: '11px', marginTop: '5px', color: '#666' }}>
                    Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* IP Location */}
        {searchMethod === 'ip' && (
          <div>
            <button onClick={getIPLocation} disabled={loading}
              style={{
                width: '100%', padding: '15px',
                background: loading ? '#cbd5e1' : (userLocation ? '#4f46e5' : '#4f46e5'),
                color: 'white', border: 'none', borderRadius: '8px',
                fontWeight: 'bold', fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}>
              {loading ? '⏳ Detecting...' : (userLocation ? '✅ Location Set!' : txt('🌐 IP Location Detect करें', '🌐 Detect IP Location'))}
            </button>
            {locationName && (
              <div style={{
                marginTop: '12px', padding: '12px', background: '#dcfce7',
                borderRadius: '8px', color: '#166534', textAlign: 'center'
              }}>
                🌐 <strong>{locationName}</strong> (Approximate)
                {userLocation?.accuracy && (
                  <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
                    Accuracy: ±{Math.round(userLocation.accuracy/1000)}km
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {searchMethod === 'manual' && (
          <div>
            <input
              type="text"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              placeholder={txt('अपना शहर/गांव लिखें (जैसे: Lucknow)', 'Enter your city/village (e.g., Lucknow)')}
              style={{
                width: '100%', padding: '14px', borderRadius: '8px',
                border: '2px solid #10b981', fontSize: '16px',
                marginBottom: '12px', boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {cities.map(city => (
                <button key={city} onClick={() => setManualLocation(city)}
                  style={{
                    padding: '8px 14px',
                    background: manualLocation === city ? '#10b981' : 'white',
                    color: manualLocation === city ? 'white' : '#333',
                    border: '1px solid #10b981', borderRadius: '20px',
                    cursor: 'pointer', fontSize: '13px'
                  }}>
                  {city}
                </button>
              ))}
            </div>
            {manualLocation && (
              <div style={{
                marginTop: '12px', padding: '12px', background: '#dcfce7',
                borderRadius: '8px', color: '#166534', textAlign: 'center'
              }}>
                📍 {txt('Location:', 'Location:')} <strong>{manualLocation}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== FACILITY SEARCH CARDS ===== */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>
          🔍 {txt('क्या खोजना है चुनें', 'Choose What to Search')}
        </h3>

        {facilityCategories.map((category, idx) => (
          <div key={idx} style={{
            background: 'white', borderRadius: '12px', marginBottom: '15px',
            border: `3px solid ${category.color}`, overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            {/* Category Header */}
            <div style={{
              background: category.color, padding: '12px 15px',
              color: 'white', fontWeight: 'bold', fontSize: '16px'
            }}>
              {category.icon} {category.title}
            </div>

            {/* Search Buttons */}
            <div style={{ padding: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {category.searches.map((search, sIdx) => (
                <button key={sIdx} onClick={() => searchInGoogleMaps(search.query)}
                  style={{
                    padding: '10px 18px', background: `${category.color}15`,
                    color: category.color, border: `2px solid ${category.color}`,
                    borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                    fontSize: '13px', transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = category.color;
                    e.target.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = `${category.color}15`;
                    e.target.style.color = category.color;
                  }}
                >
                  🔍 {search.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ===== QUICK DIRECTIONS ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
        padding: '20px', borderRadius: '12px', marginBottom: '20px', color: 'white'
      }}>
        <h3 style={{ margin: '0 0 15px 0' }}>
          🚗 {txt('सीधे रास्ता पाएं', 'Get Direct Directions')}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {[
            { icon: '🏥', label: txt('नजदीकी अस्पताल', 'Nearest Hospital'), query: 'nearest hospital' },
            { icon: '👶', label: txt('नजदीकी आंगनवाड़ी', 'Nearest Anganwadi'), query: 'nearest anganwadi' },
            { icon: '🏨', label: txt('नजदीकी PHC', 'Nearest PHC'), query: 'nearest PHC' },
            { icon: '💊', label: txt('नजदीकी मेडिकल', 'Nearest Medical'), query: 'nearest medical store' }
          ].map((item, idx) => (
            <button key={idx} onClick={() => openDirectionsTo(item.query)}
              style={{
                padding: '12px 20px', background: 'white', color: '#4f46e5',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 'bold', fontSize: '14px'
              }}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== MAP ===== */}
      {(userLocation || manualLocation) && (
        <div style={{
          borderRadius: '12px', overflow: 'hidden',
          marginBottom: '20px', border: '2px solid #4f46e5'
        }}>
          <div style={{
            background: '#4f46e5', padding: '10px 15px',
            color: 'white', fontWeight: 'bold'
          }}>
            🗺️ {txt('आपकी Location', 'Your Location')}
          </div>
          {userLocation ? (
            <iframe
              title="Map"
              width="100%"
              height="250"
              frameBorder="0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${userLocation.lng - 0.02},${userLocation.lat - 0.02},${userLocation.lng + 0.02},${userLocation.lat + 0.02}&layer=mapnik&marker=${userLocation.lat},${userLocation.lng}`}
            />
          ) : (
            <div style={{
              padding: '40px', textAlign: 'center', background: '#f8f9fa'
            }}>
              📍 {manualLocation}
            </div>
          )}
        </div>
      )}

      {/* ===== HOW IT WORKS ===== */}
      <div style={{
        background: '#ecfdf5', padding: '20px', borderRadius: '12px',
        marginBottom: '20px', border: '2px solid #10b981'
      }}>
        <h3 style={{ color: '#047857', marginTop: 0 }}>
          ℹ️ {txt('कैसे काम करता है?', 'How it works?')}
        </h3>
        <div style={{ color: '#333', fontSize: '14px', lineHeight: '1.8' }}>
          <p style={{ margin: '8px 0' }}>
            1️⃣ {txt('पहले अपनी Location सेट करें (GPS या Manual)', 'First set your location (GPS or Manual)')}
          </p>
          <p style={{ margin: '8px 0' }}>
            2️⃣ {txt('फिर जो खोजना है उस पर Click करें', 'Then click on what you want to search')}
          </p>
          <p style={{ margin: '8px 0' }}>
            3️⃣ {txt('Google Maps में सारे नजदीकी results दिखेंगे', 'All nearby results will show in Google Maps')}
          </p>
          <p style={{ margin: '8px 0' }}>
            4️⃣ {txt('वहां से directions और contact details मिलेंगे', 'Get directions and contact details from there')}
          </p>
          <div style={{ marginTop: '15px', padding: '10px', background: '#fef3c7', borderRadius: '6px', border: '1px solid #fcd34d' }}>
            <strong>🔧 {txt('GPS Troubleshooting:', 'GPS Troubleshooting:')}</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>{txt('Browser में location permission allow करें', 'Allow location permission in browser')}</li>
              <li>{txt('Refresh button से location को update करें', 'Use Refresh button to update location')}</li>
              <li>{txt('यदि GPS काम न करे तो Manual option use करें', 'If GPS doesn\'t work, use Manual option')}</li>
              <li>{txt('Mobile में GPS on होना चाहिए', 'GPS should be ON in mobile')}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ===== GOVERNMENT HELPLINES ===== */}
      <div style={{
        background: 'white', padding: '20px', borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0 }}>📞 {txt('सरकारी हेल्पलाइन', 'Government Helplines')}</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px'
        }}>
          {[
            { num: '108', name: txt('एम्बुलेंस', 'Ambulance'), color: '#dc2626' },
            { num: '112', name: txt('इमरजेंसी', 'Emergency'), color: '#ec4899' },
            { num: '102', name: txt('माँ/बच्चा', 'Mother/Child'), color: '#8b5cf6' },
            { num: '104', name: txt('स्वास्थ्य', 'Health'), color: '#06b6d4' },
            { num: '1098', name: txt('बाल हेल्पलाइन', 'Child Helpline'), color: '#10b981' },
            { num: '181', name: txt('महिला', 'Women'), color: '#f97316' },
            { num: '1800-180-1104', name: txt('पोषण', 'Nutrition'), color: '#b45309' }
          ].map(h => (
            <button key={h.num} onClick={() => window.open(`tel:${h.num}`, '_self')}
              style={{
                padding: '15px 10px', background: `${h.color}15`,
                border: `2px solid ${h.color}`, borderRadius: '8px',
                cursor: 'pointer', textAlign: 'center'
              }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: h.color }}>{h.num}</div>
              <div style={{ fontSize: '11px', color: '#333', marginTop: '5px' }}>{h.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HospitalFinder;