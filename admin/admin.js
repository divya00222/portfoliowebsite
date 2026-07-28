// Admin Dashboard Core JS Engine
import { auth, db, storage } from '../js/firebase-config.js';
import {
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

// Global Admin State
let currentUser = null;
let activeTab = 'projects';
let currentEditingId = null;

// Cached collections state
let projectsData = [];
let skillsData = [];
let experienceData = [];
let testimonialsData = [];
let messagesData = [];

// DOM Elements
const adminUserDisplay = document.getElementById('adminUserDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const addNewItemBtn = document.getElementById('addNewItemBtn');

// Stat Elements
const statProjects = document.getElementById('statProjects');
const statMessages = document.getElementById('statMessages');
const statUnread = document.getElementById('statUnread');
const statSkills = document.getElementById('statSkills');
const statExperience = document.getElementById('statExperience');
const msgBadge = document.getElementById('msgBadge');

// Modal Elements
const itemModal = document.getElementById('itemModal');
const modalTitle = document.getElementById('modalTitle');
const itemModalForm = document.getElementById('itemModalForm');
const modalFormFields = document.getElementById('modalFormFields');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');

// 1. Auth Guard Listener
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = '/admin/login.html';
  } else {
    currentUser = user;
    if (adminUserDisplay) {
      adminUserDisplay.textContent = `Connected: ${user.email || 'Admin'}`;
    }
    initializeRealtimeSubscriptions();
  }
});

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = '/admin/login.html';
  });
}

// 2. Tab Navigation Handler
tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetTab = btn.getAttribute('data-tab');
    activeTab = targetTab;

    tabButtons.forEach((b) => {
      b.classList.remove('bg-amber-500/15', 'border-amber-500/40', 'text-amber-400', 'font-bold');
      b.classList.add('bg-slate-900', 'border-slate-800', 'text-slate-400');
    });

    btn.classList.remove('bg-slate-900', 'border-slate-800', 'text-slate-400');
    btn.classList.add('bg-amber-500/15', 'border-amber-500/40', 'text-amber-400', 'font-bold');

    tabContents.forEach((content) => {
      if (content.id === `tab-${targetTab}`) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });

    if (activeTab === 'messages') {
      addNewItemBtn.classList.add('hidden');
    } else {
      addNewItemBtn.classList.remove('hidden');
    }
  });
});

// 3. Firestore Realtime Subscriptions
function initializeRealtimeSubscriptions() {
  // Projects
  onSnapshot(collection(db, 'projects'), (snapshot) => {
    projectsData = [];
    snapshot.forEach((docSnap) => {
      projectsData.push({ id: docSnap.id, ...docSnap.data() });
    });
    projectsData.sort((a, b) => (a.order || 0) - (b.order || 0));
    statProjects.textContent = projectsData.length;
    renderProjects();
  });

  // Skills
  onSnapshot(collection(db, 'skills'), (snapshot) => {
    skillsData = [];
    snapshot.forEach((docSnap) => {
      skillsData.push({ id: docSnap.id, ...docSnap.data() });
    });
    skillsData.sort((a, b) => (a.order || 0) - (b.order || 0));
    statSkills.textContent = skillsData.length;
    renderSkills();
  });

  // Experience
  onSnapshot(collection(db, 'experience'), (snapshot) => {
    experienceData = [];
    snapshot.forEach((docSnap) => {
      experienceData.push({ id: docSnap.id, ...docSnap.data() });
    });
    experienceData.sort((a, b) => (a.order || 0) - (b.order || 0));
    statExperience.textContent = experienceData.length;
    renderExperience();
  });

  // Testimonials
  onSnapshot(collection(db, 'testimonials'), (snapshot) => {
    testimonialsData = [];
    snapshot.forEach((docSnap) => {
      testimonialsData.push({ id: docSnap.id, ...docSnap.data() });
    });
    renderTestimonials();
  });

  // Messages
  onSnapshot(collection(db, 'messages'), (snapshot) => {
    messagesData = [];
    snapshot.forEach((docSnap) => {
      messagesData.push({ id: docSnap.id, ...docSnap.data() });
    });
    const unreadCount = messagesData.filter((m) => !m.read).length;
    statMessages.textContent = messagesData.length;
    statUnread.textContent = `${unreadCount} unread`;
    if (unreadCount > 0) {
      msgBadge.textContent = unreadCount;
      msgBadge.classList.remove('hidden');
    } else {
      msgBadge.classList.add('hidden');
    }
    renderMessages();
  });
}

// 4. Render Functions

function renderProjects() {
  const container = document.getElementById('projectsContainer');
  if (!container) return;
  if (projectsData.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-slate-500 text-sm col-span-full">No projects found in Firestore. Click "+ Add New Item" to create one.</div>`;
    return;
  }

  container.innerHTML = projectsData.map((p) => `
    <div class="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 relative group">
      <div>
        <div class="relative h-40 w-full rounded-xl overflow-hidden bg-slate-900 mb-3 border border-slate-800">
          <img src="${p.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'}" alt="${p.title}" class="w-full h-full object-cover">
          <span class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-amber-500/30 text-amber-300 text-[10px] font-mono">
            ${p.category || 'General'}
          </span>
        </div>
        <h3 class="font-bold text-white text-base">${p.title}</h3>
        <p class="text-xs text-amber-400 font-mono mb-2">${p.tagline || ''}</p>
        <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">${p.description || ''}</p>
        <div class="flex flex-wrap gap-1">
          ${(p.technologies || []).map((t) => `<span class="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-mono border border-slate-800">${t}</span>`).join('')}
        </div>
      </div>
      <div class="pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
        <span class="text-slate-500">ID: ${p.id.substring(0, 8)}...</span>
        <div class="flex space-x-2">
          <button onclick="window.editItem('${p.id}')" class="px-3 py-1 rounded bg-slate-800 hover:bg-amber-500/20 text-amber-400 border border-slate-700 transition-colors">Edit</button>
          <button onclick="window.deleteItem('projects', '${p.id}')" class="px-3 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderSkills() {
  const container = document.getElementById('skillsContainer');
  if (!container) return;
  if (skillsData.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-slate-500 text-sm col-span-full">No skills found.</div>`;
    return;
  }

  container.innerHTML = skillsData.map((s) => `
    <div class="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold text-white text-sm">${s.name}</span>
          <span class="text-xs font-mono text-amber-400 font-bold">${s.level}%</span>
        </div>
        <p class="text-[11px] font-mono text-slate-400 mb-2">${s.category} | ${s.experienceYears || '1+ Yrs'}</p>
        <p class="text-xs text-slate-400 line-clamp-2">${s.description || ''}</p>
      </div>
      <div class="pt-2 border-t border-slate-800 flex justify-end space-x-2 text-xs font-mono">
        <button onclick="window.editItem('${s.id}')" class="px-2.5 py-1 rounded bg-slate-800 text-amber-400 border border-slate-700">Edit</button>
        <button onclick="window.deleteItem('skills', '${s.id}')" class="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderExperience() {
  const container = document.getElementById('experienceContainer');
  if (!container) return;
  if (experienceData.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-slate-500 text-sm">No experience items found.</div>`;
    return;
  }

  container.innerHTML = experienceData.map((e) => `
    <div class="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row justify-between items-start gap-4">
      <div class="space-y-1 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-base font-bold text-white">${e.role}</span>
          <span class="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30">${e.year}</span>
        </div>
        <p class="text-xs font-mono text-slate-400">${e.company} | ${e.location || 'Remote'} | <span class="text-slate-300">${e.type || 'Full-time'}</span></p>
        <p class="text-xs text-slate-300 mt-2">${e.description || ''}</p>
      </div>
      <div class="flex space-x-2 shrink-0">
        <button onclick="window.editItem('${e.id}')" class="px-3 py-1.5 rounded bg-slate-800 text-amber-400 border border-slate-700 text-xs font-mono">Edit</button>
        <button onclick="window.deleteItem('experience', '${e.id}')" class="px-3 py-1.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderTestimonials() {
  const container = document.getElementById('testimonialsContainer');
  if (!container) return;
  if (testimonialsData.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-slate-500 text-sm col-span-full">No testimonials found.</div>`;
    return;
  }

  container.innerHTML = testimonialsData.map((t) => `
    <div class="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
      <div class="flex items-center space-x-3">
        <img src="${t.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'}" class="w-10 h-10 rounded-full object-cover border border-amber-500/40">
        <div>
          <h4 class="font-bold text-white text-sm">${t.name}</h4>
          <p class="text-xs font-mono text-amber-400">${t.role} — ${t.company}</p>
        </div>
      </div>
      <p class="text-xs italic text-slate-300">"${t.content}"</p>
      <div class="pt-2 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
        <span class="text-amber-400">★ ${t.rating || 5} Stars</span>
        <div class="flex space-x-2">
          <button onclick="window.editItem('${t.id}')" class="px-2.5 py-1 rounded bg-slate-800 text-amber-400 border border-slate-700">Edit</button>
          <button onclick="window.deleteItem('testimonials', '${t.id}')" class="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderMessages() {
  const container = document.getElementById('messagesContainer');
  if (!container) return;
  if (messagesData.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-slate-500 text-sm">No messages received yet.</div>`;
    return;
  }

  container.innerHTML = messagesData.map((m) => `
    <div class="glass-card rounded-2xl p-5 border ${m.read ? 'border-slate-800' : 'border-amber-500/50 bg-amber-500/5'} space-y-3">
      <div class="flex flex-wrap justify-between items-start gap-2">
        <div>
          <h4 class="font-bold text-white text-base">${m.name}</h4>
          <p class="text-xs font-mono text-amber-400">${m.email} ${m.phone ? '| ' + m.phone : ''}</p>
        </div>
        <span class="text-[11px] font-mono text-slate-500">${m.timestamp ? new Date(m.timestamp).toLocaleString() : ''}</span>
      </div>
      <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
        <p class="font-bold text-amber-300 mb-1">Subject: ${m.subject || 'Portfolio Contact'}</p>
        <p>${m.message}</p>
      </div>
      <div class="flex justify-between items-center text-xs font-mono pt-2">
        <button onclick="window.toggleRead('${m.id}', ${!m.read})" class="text-slate-400 hover:text-white">
          ${m.read ? 'Mark Unread' : 'Mark Read ✓'}
        </button>
        <div class="flex space-x-2">
          <a href="mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Portfolio Inquiry')}" class="px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold">Reply Email</a>
          <button onclick="window.deleteItem('messages', '${m.id}')" class="px-3 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

// 5. Delete & Toggle Functions
window.deleteItem = async (colName, id) => {
  if (confirm(`Are you sure you want to delete this ${colName} entry from Firestore?`)) {
    try {
      await deleteDoc(doc(db, colName, id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  }
};

window.toggleRead = async (id, newReadState) => {
  try {
    await updateDoc(doc(db, 'messages', id), { read: newReadState });
  } catch (err) {
    console.error('Failed to update message status:', err);
  }
};

// 6. Modal Open & Form Generator
addNewItemBtn.addEventListener('click', () => {
  currentEditingId = null;
  modalTitle.textContent = `Add New ${activeTab.toUpperCase().slice(0, -1)}`;
  buildModalFields(activeTab, null);
  itemModal.classList.remove('hidden');
  itemModal.classList.add('flex');
});

window.editItem = (id) => {
  currentEditingId = id;
  let targetItem = null;
  if (activeTab === 'projects') targetItem = projectsData.find((p) => p.id === id);
  if (activeTab === 'skills') targetItem = skillsData.find((s) => s.id === id);
  if (activeTab === 'experience') targetItem = experienceData.find((e) => e.id === id);
  if (activeTab === 'testimonials') targetItem = testimonialsData.find((t) => t.id === id);

  modalTitle.textContent = `Edit ${activeTab.toUpperCase().slice(0, -1)}`;
  buildModalFields(activeTab, targetItem);
  itemModal.classList.remove('hidden');
  itemModal.classList.add('flex');
};

closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

function closeModal() {
  itemModal.classList.add('hidden');
  itemModal.classList.remove('flex');
}

function buildModalFields(tab, data) {
  modalFormFields.innerHTML = '';

  if (tab === 'projects') {
    modalFormFields.innerHTML = `
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Project Title</label>
        <input type="text" name="title" value="${data?.title || ''}" required class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
      </div>
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Tagline</label>
        <input type="text" name="tagline" value="${data?.tagline || ''}" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Category</label>
          <select name="category" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
            <option value="Hotel" ${data?.category === 'Hotel' ? 'selected' : ''}>Hotel</option>
            <option value="Mobile Store" ${data?.category === 'Mobile Store' ? 'selected' : ''}>Mobile Store</option>
            <option value="Real Estate" ${data?.category === 'Real Estate' ? 'selected' : ''}>Real Estate</option>
            <option value="E-Commerce" ${data?.category === 'E-Commerce' ? 'selected' : ''}>E-Commerce</option>
            <option value="Web App" ${data?.category === 'Web App' ? 'selected' : ''}>Web App</option>
            <option value="Restaurant" ${data?.category === 'Restaurant' ? 'selected' : ''}>Restaurant</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Demo Type</label>
          <input type="text" name="demoType" value="${data?.demoType || 'hotel'}" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
        </div>
      </div>
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Image URL or Upload File</label>
        <input type="text" name="image" id="imageUrlInput" value="${data?.image || ''}" placeholder="https://images.unsplash.com/..." class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white mb-2">
        <input type="file" id="imageFileInput" accept="image/*" class="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950">
      </div>
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Description</label>
        <textarea name="description" rows="3" required class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">${data?.description || ''}</textarea>
      </div>
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Technologies (comma separated)</label>
        <input type="text" name="technologies" value="${(data?.technologies || []).join(', ')}" placeholder="PHP, MySQL, React, Tailwind CSS" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Live Demo URL</label>
          <input type="text" name="liveUrl" value="${data?.liveUrl || '#'}" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
        </div>
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase mb-1">GitHub Repo URL</label>
          <input type="text" name="githubUrl" value="${data?.githubUrl || '#'}" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
        </div>
      </div>
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Key Highlights (one per line)</label>
        <textarea name="highlights" rows="3" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">${(data?.highlights || []).join('\n')}</textarea>
      </div>
    `;
  } else if (tab === 'skills') {
    modalFormFields.innerHTML = `
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Skill Name</label>
        <input type="text" name="name" value="${data?.name || ''}" required class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Category</label>
          <select name="category" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
            <option value="frontend" ${data?.category === 'frontend' ? 'selected' : ''}>Front-End</option>
            <option value="backend" ${data?.category === 'backend' ? 'selected' : ''}>Back-End</option>
            <option value="database" ${data?.category === 'database' ? 'selected' : ''}>Database</option>
            <option value="tools" ${data?.category === 'tools' ? 'selected' : ''}>Tools</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Proficiency Level (0-100%)</label>
          <input type="number" name="level" value="${data?.level || 90}" min="1" max="100" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Icon Name</label>
          <input type="text" name="icon" value="${data?.icon || 'Code2'}" placeholder="Code2, Server, Database" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
        </div>
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Experience Years</label>
          <input type="text" name="experienceYears" value="${data?.experienceYears || '5+ Yrs'}" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
        </div>
      </div>
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Description</label>
        <textarea name="description" rows="2" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">${data?.description || ''}</textarea>
      </div>
    `;
  } else if (tab === 'experience') {
    modalFormFields.innerHTML = `
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Role Title</label>
        <input type="text" name="role" value="${data?.role || ''}" required class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Company</label>
          <input type="text" name="company" value="${data?.company || ''}" required class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
        </div>
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Year Span</label>
          <input type="text" name="year" value="${data?.year || '2024 - PRESENT'}" required class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Location</label>
          <input type="text" name="location" value="${data?.location || 'Remote'}" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
        </div>
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Type</label>
          <input type="text" name="type" value="${data?.type || 'Full-time'}" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
        </div>
      </div>
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Description</label>
        <textarea name="description" rows="2" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">${data?.description || ''}</textarea>
      </div>
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Highlights (one per line)</label>
        <textarea name="highlights" rows="3" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">${(data?.highlights || []).join('\n')}</textarea>
      </div>
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Technologies (comma separated)</label>
        <input type="text" name="technologies" value="${(data?.technologies || []).join(', ')}" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
      </div>
    `;
  } else if (tab === 'testimonials') {
    modalFormFields.innerHTML = `
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Client Name</label>
        <input type="text" name="name" value="${data?.name || ''}" required class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Role</label>
          <input type="text" name="role" value="${data?.role || ''}" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
        </div>
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Company</label>
          <input type="text" name="company" value="${data?.company || ''}" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
        </div>
      </div>
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Avatar Image URL</label>
        <input type="text" name="avatar" value="${data?.avatar || ''}" placeholder="https://images.unsplash.com/..." class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
      </div>
      <div>
        <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Testimonial Quote</label>
        <textarea name="content" rows="3" required class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">${data?.content || ''}</textarea>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Star Rating (1-5)</label>
          <input type="number" name="rating" value="${data?.rating || 5}" min="1" max="5" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
        </div>
        <div>
          <label class="block text-xs font-mono text-slate-400 uppercase mb-1">Project Ref</label>
          <input type="text" name="projectRef" value="${data?.projectRef || ''}" class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
        </div>
      </div>
    `;
  }
}

// 7. Save Item Form Submit Handler
itemModalForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(itemModalForm);
  const payload = {};

  formData.forEach((value, key) => {
    payload[key] = value.toString().trim();
  });

  // Handle image upload if file selected in project form
  const imageFileInput = document.getElementById('imageFileInput');
  if (imageFileInput && imageFileInput.files && imageFileInput.files[0]) {
    try {
      const file = imageFileInput.files[0];
      const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      payload['image'] = downloadURL;
    } catch (uploadErr) {
      console.warn('Storage upload warning:', uploadErr);
    }
  }

  // Format array fields
  if (payload.technologies) {
    payload.technologies = payload.technologies.split(',').map((t) => t.trim()).filter(Boolean);
  }
  if (payload.highlights) {
    payload.highlights = payload.highlights.split('\n').map((h) => h.trim()).filter(Boolean);
  }
  if (payload.level) {
    payload.level = Number(payload.level);
  }
  if (payload.rating) {
    payload.rating = Number(payload.rating);
  }

  try {
    if (currentEditingId) {
      await updateDoc(doc(db, activeTab, currentEditingId), payload);
    } else {
      const docId = `${activeTab.slice(0, 3)}_${Date.now()}`;
      await setDoc(doc(db, activeTab, docId), {
        ...payload,
        createdAt: new Date().toISOString()
      });
    }
    closeModal();
  } catch (err) {
    alert('Error saving to Firestore: ' + err.message);
  }
});
