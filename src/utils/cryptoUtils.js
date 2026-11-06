// Cryptographic & Integrity Gate Verification Utilities for SatyaCase

// Calculate pseudo SHA-256 hash for demonstration
export function generateSha256(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0000${hex}${hex}${hex}${hex}${hex}${hex}${hex}`.substring(0, 64);
}

// Extract EXIF details from uploaded image file
export function parseExifSimulated(file, customLat = null, customLng = null) {
  const fileName = file ? file.name : 'upload_evidence.jpg';
  const sizeKb = file ? Math.round(file.size / 1024) : 2450;
  const sizeMb = (sizeKb / 1024).toFixed(1) + ' MB';
  
  // Default realistic mock coordinates if not provided
  const lat = customLat || 12.9716 + (Math.random() - 0.5) * 0.05;
  const lng = customLng || 77.5946 + (Math.random() - 0.5) * 0.05;
  
  const cameraModels = [
    'Apple iPhone 15 Pro (48MP IMX803)',
    'Samsung Galaxy S24 Ultra (200MP HP2)',
    'Google Pixel 8 Pro (50MP GNV)',
    'OnePlus 12 (50MP LYT-808)',
  ];
  
  const cameraModel = cameraModels[Math.floor(Math.random() * cameraModels.length)];
  const timestamp = new Date().toISOString();
  const sha256 = generateSha256(fileName + timestamp + sizeKb);
  
  return {
    fileName,
    fileSize: sizeMb,
    sha256,
    gpsLat: Number(lat.toFixed(5)),
    gpsLng: Number(lng.toFixed(5)),
    timestamp,
    cameraModel,
    tampered: false,
    aiAuthenticityScore: Math.floor(Math.random() * 8) + 92, // 92 - 99%
  };
}

// Distance in meters between two lat/lng points using Haversine formula
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Calculate Grievance Integrity Score (0 - 100)
export function calculateIntegrityScore({ hasExif = true, gpsDistance = 0, isTampered = false, aiAuthenticity = 95 }) {
  let score = 100;
  
  if (!hasExif) score -= 35;
  if (isTampered) score -= 40;
  
  if (gpsDistance > 500) score -= 30;
  else if (gpsDistance > 150) score -= 15;
  else if (gpsDistance > 50) score -= 5;
  
  if (aiAuthenticity < 80) score -= (80 - aiAuthenticity);
  
  return Math.max(10, Math.min(100, Math.round(score)));
}

// Closure Integrity Gate Verification Engine
// Evaluates resolution evidence against complaint original evidence
export function verifyResolutionEvidence(grievance, resolutionUpload, forceInvalid = false) {
  const orig = grievance.originalEvidence;
  const blockedReasons = [];
  
  if (forceInvalid) {
    blockedReasons.push("❌ GPS GEOLOCATION MISMATCH: Resolution photo taken 1,540m away from reported grievance site (Max allowed: 150m).");
    blockedReasons.push("❌ EXIF METADATA STRIPPED: Missing hardware camera signature and timestamp header.");
    blockedReasons.push("❌ TEMPORAL ANOMALY: Resolution photo timestamp predates complaint assignment time.");
    blockedReasons.push("❌ AI VISION VERIFICATION FAILED: Surface reconstruction similarity score is 32% (Threshold: 75%).");
    
    return {
      approved: false,
      status: 'BLOCKED',
      blockedReasons,
      metrics: {
        distanceMeters: 1540,
        exifValid: false,
        timestampValid: false,
        similarityScore: 32,
        integrityScore: 28,
        sha256: generateSha256("invalid_resolution_" + Date.now()),
      }
    };
  }

  // Calculate distance between original complaint location and resolution photo location
  const resLat = resolutionUpload.gpsLat || orig.gpsLat + (Math.random() - 0.5) * 0.0005;
  const resLng = resolutionUpload.gpsLng || orig.gpsLng + (Math.random() - 0.5) * 0.0005;
  
  const distanceMeters = calculateDistanceMeters(orig.gpsLat, orig.gpsLng, resLat, resLng);
  
  // Rule 1: Geofence check (Max 150 meters delta)
  if (distanceMeters > 150) {
    blockedReasons.push(`❌ GPS GEOLOCATION MISMATCH: Resolution location is ${distanceMeters}m away from original incident site (Max allowed: 150m).`);
  }

  // Rule 2: EXIF & Timestamp check
  const exifValid = !resolutionUpload.exifMissing;
  if (!exifValid) {
    blockedReasons.push("❌ EXIF METADATA MISSING: Resolution image lacks original device EXIF telemetry.");
  }
  
  const timestampValid = resolutionUpload.timestampValid !== false;
  if (!timestampValid) {
    blockedReasons.push("❌ INVALID TIMESTAMP: Resolution photo timestamp is inconsistent with repair window.");
  }

  // Rule 3: AI Similarity / Repair check
  const similarityScore = resolutionUpload.aiSimilarityScore || Math.floor(Math.random() * 10) + 88;
  if (similarityScore < 75) {
    blockedReasons.push(`❌ REPAIR COMPARISON FAILED: AI site similarity is only ${similarityScore}% (Required: 75%+).`);
  }

  const approved = blockedReasons.length === 0;
  const integrityScore = calculateIntegrityScore({
    hasExif: exifValid,
    gpsDistance: distanceMeters,
    isTampered: !approved,
    aiAuthenticity: similarityScore,
  });

  return {
    approved,
    status: approved ? 'APPROVED' : 'BLOCKED',
    blockedReasons,
    metrics: {
      distanceMeters,
      exifValid,
      timestampValid,
      similarityScore,
      integrityScore,
      sha256: resolutionUpload.sha256 || generateSha256("valid_res_" + Date.now()),
    }
  };
}
