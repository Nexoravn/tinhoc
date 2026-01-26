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

// ===== FIREBASE CONFIG (CỦA BẠN) =====
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
const postsDiv = document.getElementById("posts");

// ===== ĐĂNG BÀI =====
window.addPost = async function () {
  const name = document.getElementById("name").value.trim();
  const content = document.getElementById("content").value.trim();

  if (!name || !content) {
    alert("Nhập đầy đủ thông tin!");
    return;
  }

  await addDoc(collection(db, "posts"), {
    name: name,
    content: content,
    likes: 0,
    createdAt: serverTimestamp()
  });

  document.getElementById("content").value = "";
};

// ===== HIỂN THỊ BÀI (REALTIME – AI CŨNG THẤY) =====
const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
  postsDiv.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const post = docSnap.data();
    const time = post.createdAt
      ? post.createdAt.toDate().toLocaleString("vi-VN")
      : "Đang cập nhật...";

    postsDiv.innerHTML += `
      <div class="forum-item">
        <strong>👤 ${post.name}</strong>
        <p>⏰ ${time}</p>
        <p>${post.content}</p>

        ❤️ ${post.likes}
        <button onclick="likePost('${docSnap.id}', ${post.likes})">Like</button>
        <button onclick="deletePost('${docSnap.id}')">Xóa</button>
      </div>
    `;
  });
});

// ===== LIKE =====
window.likePost = async function (id, likes) {
  await updateDoc(doc(db, "posts", id), {
    likes: likes + 1
  });
};

// ===== XÓA =====
window.deletePost = async function (id) {
  if (confirm("Bạn chắc chắn muốn xóa bài này?")) {
    await deleteDoc(doc(db, "posts", id));
  }
};
