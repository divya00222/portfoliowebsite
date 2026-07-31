/**
 * DJ Chaudhary Portfolio Engine — PHP & REST API Integration Layer
 *
 * Replaces Firebase Firestore SDK with standard PHP + MySQL API endpoints via fetch().
 * Maintains the exact function signatures required by the frontend application.
 */

// Cached items for polling / real-time emulation
const cachedCollections = {};

// Subscribe to collection updates via PHP API
export function listenToCollection(collectionName, callback) {
  const fetchCollection = async () => {
    try {
      const response = await fetch(`/get-items.php?type=${encodeURIComponent(collectionName)}`);
      const result = await response.json();
      if (result && result.success && Array.isArray(result.data)) {
        cachedCollections[collectionName] = result.data;
        callback(result.data);
      } else if (Array.isArray(result)) {
        cachedCollections[collectionName] = result;
        callback(result);
      }
    } catch (err) {
      console.warn(`PHP API fetch warning for ${collectionName}:`, err);
    }
  };

  // Initial fetch
  fetchCollection();

  // Periodic polling every 5 seconds to simulate real-time updates
  const intervalId = setInterval(fetchCollection, 5000);

  // Return unsubscribe handle
  return () => clearInterval(intervalId);
}

// Send contact message via PHP backend API
export async function sendContactMessage(formData) {
  const response = await fetch('/add-item.php?type=messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to submit message to backend');
  }

  return result;
}
