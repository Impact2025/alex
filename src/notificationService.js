// Notification Service for scheduling daily reminders

// Check if notifications are supported
export const isNotificationSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    console.log('Notifications not supported');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);

    if (permission === 'granted') {
      localStorage.setItem('ajax_notifications_enabled', 'true');
      return true;
    } else {
      localStorage.setItem('ajax_notifications_enabled', 'false');
      return false;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Check if user has enabled notifications
export const areNotificationsEnabled = () => {
  return localStorage.getItem('ajax_notifications_enabled') === 'true' &&
         Notification.permission === 'granted';
};

// Schedule daily notifications
export const scheduleDailyNotifications = () => {
  if (!areNotificationsEnabled()) {
    console.log('Notifications not enabled');
    return;
  }

  // Clear any existing intervals
  const existingInterval = localStorage.getItem('ajax_notification_interval');
  if (existingInterval) {
    clearInterval(parseInt(existingInterval));
  }

  // Check every minute if it's time to send a notification
  const intervalId = setInterval(() => {
    checkAndSendNotification();
  }, 60000); // Check every minute

  localStorage.setItem('ajax_notification_interval', intervalId.toString());

  // Also check immediately
  checkAndSendNotification();
};

// Check if it's time to send a notification
const checkAndSendNotification = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const today = now.toISOString().split('T')[0];

  // Morning notification at 07:00
  if (hours === 7 && minutes === 0) {
    const lastMorning = localStorage.getItem('ajax_last_morning_notification');
    if (lastMorning !== today) {
      sendMorningNotification();
      localStorage.setItem('ajax_last_morning_notification', today);
    }
  }

  // Evening notification at 19:00
  if (hours === 19 && minutes === 0) {
    const lastEvening = localStorage.getItem('ajax_last_evening_notification');
    if (lastEvening !== today) {
      sendEveningNotification();
      localStorage.setItem('ajax_last_evening_notification', today);
    }
  }
};

// Send morning notification
const sendMorningNotification = () => {
  if (!areNotificationsEnabled()) return;

  const morningMessages = [
    { title: '🌅 Goedemorgen Kampioen!', body: 'Start je dag met de ochtend check-in en verdien punten! 💪' },
    { title: '⚽ Tijd om te Beginnen!', body: 'Je ochtend intentie wacht op je. Laten we punten verdienen! 🌟' },
    { title: '🏆 Nieuwe Dag, Nieuwe Kansen!', body: 'Open de app en start met punten verzamelen! 🔥' },
    { title: '💪 Goedemorgen Ajax Ster!', body: 'Klaar voor een nieuwe dag vol punten? Start nu! ⭐' },
  ];

  const message = morningMessages[Math.floor(Math.random() * morningMessages.length)];

  new Notification(message.title, {
    body: message.body,
    icon: '/ajax-icon-192.png',
    badge: '/ajax-icon-192.png',
    tag: 'ajax-morning',
    requireInteraction: false,
    vibrate: [200, 100, 200],
  });
};

// Send evening notification
const sendEveningNotification = () => {
  if (!areNotificationsEnabled()) return;

  const eveningMessages = [
    { title: '🌙 Tijd voor je Avondritueel!', body: 'Voltooi je missies en verdien extra punten! ⚽' },
    { title: '⭐ Avond Check-in!', body: 'Schrijf wat je dankbaar voor bent en verdien punten! 🙏' },
    { title: '🏆 Maak je Dag Compleet!', body: 'Je avondmissies wachten! Verdien punten voor het slapen! 😴' },
    { title: '💪 Laatste Kans Vandaag!', body: 'Voltooi je dagelijkse missies en word kampioen! 🔥' },
  ];

  const message = eveningMessages[Math.floor(Math.random() * eveningMessages.length)];

  new Notification(message.title, {
    body: message.body,
    icon: '/ajax-icon-192.png',
    badge: '/ajax-icon-192.png',
    tag: 'ajax-evening',
    requireInteraction: false,
    vibrate: [200, 100, 200],
  });
};

// Send test notification
export const sendTestNotification = () => {
  if (!areNotificationsEnabled()) {
    console.log('Notifications not enabled');
    return;
  }

  new Notification('🎉 Test Notificatie!', {
    body: 'Notificaties werken! Je krijgt elke dag om 07:00 en 19:00 een melding. ⚽',
    icon: '/ajax-icon-192.png',
    badge: '/ajax-icon-192.png',
    tag: 'ajax-test',
    requireInteraction: false,
  });
};

// Register service worker
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};
