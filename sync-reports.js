// Run this script in the browser console while logged in as SuperAdmin
// This will sync all completed tasks with their report status

(async function syncCompletedTasks() {
  try {
    console.log('🔄 Starting sync of completed tasks with reports...');

    const token = localStorage.getItem('nn_auth_token');
    if (!token) {
      console.error('❌ No authentication token found. Please log in first.');
      return;
    }

    const response = await fetch('http://localhost:5000/api/tasks/sync-reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ Sync completed successfully!');
      console.log(`📊 Total tasks: ${data.data.total}`);
      console.log(`✅ Synced: ${data.data.synced}`);
      console.log(`❌ Failed: ${data.data.failed}`);
      console.log('🔄 Please refresh the Browse Reports page to see the updated statuses.');
    } else {
      console.error('❌ Sync failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Error during sync:', error);
  }
})();
