import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
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
  orderBy,
  limit,
  startAfter,
  increment
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===== FIREBASE CONFIG ===== */
const firebaseConfig = {
  apiKey: "AIzaSyC140KZpGPog1eu1sli-ZBsGnM22qtjg9c",
  authDomain: "diendan-tinhoc.firebaseapp.com",
  projectId: "diendan-tinhoc",
  storageBucket: "diendan-tinhoc.firebasestorage.app",
  messagingSenderId: "569311383784",
  appId: "1:569311383784:web:e4a39bff08ea498191395d"
};

/* ===== INIT ===== */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const postsRef = collection(db, "posts");

/* ===== DOM ===== */
const postForm = document.getElementById("postForm");
const nameInput = document.getElementById("name");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const forumList = document.getElementById("forumList");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

/* ===== PAGINATION ===== */
let lastVisible = null;
const PAGE_SIZE = 5;

/* ===== ĐĂNG BÀI ===== */
postForm.onsubmit = async (e) => {
  e.preventDefault();

  await addDoc(postsRef, {
    name: nameInput.value,
    title: titleInput.value,
    content: contentInput.value,
    likes: 0,
    createdAt: serverTimestamp()
  });

  postForm.reset();
};

/* ===== LOAD BÀI ===== */
function loadPosts(direction = "first") {
  let q;

  if (direction === "next" && lastVisible) {
    q = query(
      postsRef,
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(PAGE_SIZE)
    );
  } else {
    q = query(
      postsRef,
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE)
    );
  }

  onSnapshot(q, (snap) => {
    forumList.innerHTML = "";
    snap.forEach(docSnap => {
      const p = docSnap.data();
      lastVisible = docSnap;

      forumList.innerHTML += `
        <div class="forum-item">
          <div class="post-title">${p.title}</div>
          <div class="post-meta">
            👤 ${p.name} · ⏰ ${p.createdAt?.toDate().toLocaleString() || ""}
          </div>
          <div class="post-content">${p.content}</div>
          <div class="post-actions">
            <span class="like" onclick="likePost('${docSnap.id}')">
              ❤️ ${p.likes || 0}
            </span>
            <span class="delete" onclick="deletePost('${docSnap.id}')">
              🗑 Xóa
            </span>
          </div>
        </div>
      `;
    });
  });
}

/* LOAD LẦN ĐẦU */
loadPosts();

/* NEXT PAGE */
nextBtn?.addEventListener("click", () => loadPosts("next"));

/* ===== LIKE ===== */
window.likePost = async (id) => {
  await updateDoc(doc(db, "posts", id), {
    likes: increment(1)
  });
};

/* ===== XÓA ===== */
window.deletePost = async (id) => {
  if (confirm("Bạn có chắc muốn xóa bài viết này?")) {
    await deleteDoc(doc(db, "posts", id));
  }
};
