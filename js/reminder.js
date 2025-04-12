document.addEventListener('DOMContentLoaded', function() {
  console.log('Reminders page loaded');
  
  // Handle checkbox changes
  document.querySelectorAll('.reminder-checkbox input').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const card = this.closest('.reminder-card');
      if (this.checked) {
        card.classList.add('completed');
      } else {
        card.classList.remove('completed');
      }
    });
  });

  // Add reminder button click handler
  document.getElementById('addReminderBtn').addEventListener('click', function() {
    // In a real app, this would show a modal to add a new reminder
    console.log('Add reminder button clicked');
  });
});

document.addEventListener('DOMContentLoaded', function() {
// DOM Elements
const addReminderBtn = document.getElementById('addReminderBtn');
const quickAddBtn = document.querySelector('.quick-add .add-btn');
const filterSelects = document.querySelectorAll('.filter-select');
const notificationBtn = document.querySelector('.notification-btn');
const reminderCardsContainer = document.querySelectorAll('.reminder-cards');

// Sample data for reminders
let reminders = [
{
  id: 1,
  title: 'Pay electricity bill',
  date: '2024-05-20',
  category: 'Bills',
  amount: 850,
  completed: false
},
{
  id: 2,
  title: 'Netflix subscription',
  date: '2024-05-25',
  category: 'Subscriptions',
  amount: 649,
  completed: false
},
{
  id: 3,
  title: 'Credit card payment',
  date: '2024-06-01',
  category: 'Payments',
  amount: 12500,
  completed: false
},
{
  id: 4,
  title: 'Rent payment',
  date: '2024-05-01',
  category: 'Housing',
  amount: 15000,
  completed: true
},
{
  id: 5,
  title: 'Internet bill',
  date: '2024-05-05',
  category: 'Bills',
  amount: 800,
  completed: true
}
];

// Initialize the page
function init() {
renderReminders();
setupEventListeners();
updateNotificationBadge();
}

// Set up event listeners
function setupEventListeners() {
// Add reminder buttons
addReminderBtn.addEventListener('click', showAddReminderModal);
quickAddBtn.addEventListener('click', showAddReminderModal);

// Filter changes
filterSelects.forEach(select => {
  select.addEventListener('change', filterReminders);
});

// Notification button
notificationBtn.addEventListener('click', toggleNotifications);

// Handle clicks on reminder cards (event delegation)
reminderCardsContainer.forEach(container => {
  container.addEventListener('click', handleReminderCardClick);
});
}

// Render reminders based on current filters
function renderReminders() {
const categoryFilter = document.querySelector('.filter-select:nth-of-type(1)').value;
const statusFilter = document.querySelector('.filter-select:nth-of-type(2)').value;

// Filter reminders
let filteredReminders = reminders.filter(reminder => {
  const matchesCategory = categoryFilter === 'All Categories' || reminder.category === categoryFilter;
  const matchesStatus = 
    statusFilter === 'All' || 
    (statusFilter === 'Upcoming' && !reminder.completed) || 
    (statusFilter === 'Completed' && reminder.completed);
  
  return matchesCategory && matchesStatus;
});

// Separate completed and upcoming
const upcomingReminders = filteredReminders.filter(r => !r.completed);
const completedReminders = filteredReminders.filter(r => r.completed);

// Render upcoming reminders
const upcomingContainer = document.querySelector('.upcoming-section .reminder-cards');
upcomingContainer.innerHTML = upcomingReminders.map(createReminderCard).join('') || 
  '<div class="no-reminders">No upcoming reminders</div>';

// Render completed reminders
const completedContainer = document.querySelector('.completed-section .reminder-cards');
completedContainer.innerHTML = completedReminders.map(createReminderCard).join('') || 
  '<div class="no-reminders">No completed reminders</div>';
}

// Create HTML for a reminder card
function createReminderCard(reminder) {
const formattedDate = new Date(reminder.date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
});

return `
  <div class="reminder-card ${reminder.completed ? 'completed' : ''}" data-id="${reminder.id}">
    <div class="reminder-checkbox">
      <input type="checkbox" id="reminder${reminder.id}" ${reminder.completed ? 'checked' : ''}>
    </div>
    <div class="reminder-content">
      <h3 class="reminder-title">${reminder.title}</h3>
      <div class="reminder-meta">
        <div class="reminder-date">
          <i class="fas fa-calendar-alt"></i>
          <span>Due ${formattedDate}</span>
        </div>
        <div class="reminder-category">${reminder.category}</div>
        <div class="reminder-amount">₹${reminder.amount.toLocaleString()}</div>
      </div>
    </div>
    <div class="reminder-actions">
      <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
      <button class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
    </div>
  </div>
`;
}

// Handle clicks on reminder cards
function handleReminderCardClick(e) {
const card = e.target.closest('.reminder-card');
if (!card) return;

const id = parseInt(card.dataset.id);
const reminder = reminders.find(r => r.id === id);

// Checkbox clicked
if (e.target.matches('input[type="checkbox"]')) {
  reminder.completed = e.target.checked;
  updateNotificationBadge();
  renderReminders();
}

// Edit button clicked
if (e.target.closest('.edit-btn')) {
  editReminder(reminder);
}

// Delete button clicked
if (e.target.closest('.delete-btn')) {
  deleteReminder(id);
}
}

// Show add reminder modal
function showAddReminderModal() {
// In a real app, this would show a modal with a form
// For this example, we'll add a sample reminder
const newReminder = {
  id: Date.now(), // Use timestamp as unique ID
  title: `New Reminder ${reminders.length + 1}`,
  date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
  category: 'Bills',
  amount: Math.floor(Math.random() * 5000) + 500,
  completed: false
};

reminders.unshift(newReminder);
updateNotificationBadge();
renderReminders();

// Scroll to the new reminder
const newCard = document.querySelector(`.reminder-card[data-id="${newReminder.id}"]`);
if (newCard) {
  newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
}

// Edit a reminder
function editReminder(reminder) {
// In a real app, this would show a modal with the reminder's data
// For this example, we'll just update the title
const newTitle = prompt('Edit reminder title:', reminder.title);
if (newTitle && newTitle.trim() !== '') {
  reminder.title = newTitle.trim();
  renderReminders();
}
}

// Delete a reminder
function deleteReminder(id) {
if (confirm('Are you sure you want to delete this reminder?')) {
  reminders = reminders.filter(r => r.id !== id);
  updateNotificationBadge();
  renderReminders();
}
}

// Filter reminders based on selected filters
function filterReminders() {
renderReminders();
}

// Toggle notifications dropdown
function toggleNotifications() {
// In a real app, this would show a dropdown with notifications
console.log('Notifications clicked');
document.querySelector('.notification-badge').textContent = '0';
}

// Update notification badge count
function updateNotificationBadge() {
const upcomingCount = reminders.filter(r => !r.completed).length;
document.querySelector('.notification-badge').textContent = upcomingCount > 0 ? upcomingCount : '';
}

// Initialize the app
init();
});