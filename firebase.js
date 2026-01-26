// ===== IMPORT FIREBASE SDK =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyC140KZpGPog1eu1sli-ZBsGnM22qtjg9c",
  authDomain: "diendan-tinhoc.firebaseapp.com",
  projectId: "diendan-tinhoc",
  storageBucket: "diendan-tinhoc.firebasestorage.app",
  messagingSenderId: "569311383784",
  appId: "1:569311383784:web:e4a39bff08ea498191395d"
};

// ===== INIT =====
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== DOM =====
const form = document.getElementById("postForm");
const forumList = document.getElementById("forumList");

// ===== ĐĂNG BÀI =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();

  if (!name || !title || !content) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  await addDoc(collection(db, "posts"), {
    name,
    title,
    content,
    likes: 0,
    createdAt: serverTimestamp()
  });

  form.reset();
});

// ===== HIỂN THỊ REALTIME =====
const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
  forumList.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const post = docSnap.data();
    const time = post.createdAt
      ? post.createdAt.toDate().toLocaleString("vi-VN")
      : "Đang cập nhật...";

    forumList.innerHTML += `
      <div class="forum-item">
        <div class="post-title">🗨 ${post.title}</div>
        <div class="post-meta">
          👤 ${post.name} • ⏰ ${time}
        </div>
        <p>${post.content}</p>

        <div class="post-actions">
          <span class="action like" onclick="likePost('${docSnap.id}', ${post.likes})">
            ❤️ ${post.likes}
          </span>
          <span class="action delete" onclick="deletePost('${docSnap.id}')">
            🗑️ Xóa
          </span>
        </div>
      </div>
    `;
  });
});

// ===== LIKE =====
window.likePost = async (id, likes) => {
  await updateDoc(doc(db, "posts", id), {
    likes: likes + 1
  });
};

// ===== XÓA =====
window.deletePost = async (id) => {
  if (confirm("Bạn có chắc muốn xóa bài viết này?")) {
    await deleteDoc(doc(db, "posts", id));
  }
};
