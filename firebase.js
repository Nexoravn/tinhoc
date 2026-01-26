import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore, collection, addDoc,
  onSnapshot, deleteDoc, doc,
  updateDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC140KZpGPog1eu1sli-ZBsGnM22qtjg9c",
  authDomain: "diendan-tinhoc.firebaseapp.com",
  projectId: "diendan-tinhoc",
  storageBucket: "diendan-tinhoc.firebasestorage.app",
  messagingSenderId: "569311383784",
  appId: "1:569311383784:web:e4a39bff08ea498191395d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const postsRef = collection(db, "posts");

/* ĐĂNG BÀI */
postForm.onsubmit = async (e) => {
  e.preventDefault();
  await addDoc(postsRef, {
    name: name.value,
    title: title.value,
    content: content.value,
    likes: 0,
    createdAt: serverTimestamp()
  });
  postForm.reset();
};

/* HIỂN THỊ */
onSnapshot(postsRef, (snap) => {
  forumList.innerHTML = "";
  snap.forEach(docSnap => {
    const p = docSnap.data();
    forumList.innerHTML += `
      <div class="forum-item">
        <div class="post-title">${p.title}</div>
        <div class="post-meta">
          👤 ${p.name} · ⏰ ${p.createdAt?.toDate().toLocaleString() || ""}
        </div>
        <div>${p.content}</div>
        <div class="post-actions">
          <span class="like" onclick="likePost('${docSnap.id}', ${p.likes})">
            ❤️ ${p.likes}
          </span>
          <span class="delete" onclick="deletePost('${docSnap.id}')">
            🗑 Xóa
          </span>
        </div>
      </div>
    `;
  });
});

/* LIKE */
window.likePost = async (id, likes) => {
  await updateDoc(doc(db, "posts", id), { likes: likes + 1 });
};

/* XÓA */
window.deletePost = async (id) => {
  if(confirm("Xóa bài viết này?")){
    await deleteDoc(doc(db, "posts", id));
  }
};
