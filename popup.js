/*
Quick Page Notes
Developed by Imtiaz Ahmed (https://websolapp.net)
Copyright (c) 2026 Web Solution Application
*/
const PREFIX = "note_";
const $ = (id) => document.getElementById(id);

let notes = [];
let currentTab = { title: "", url: "" };
let editingId = null;

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function safeUrl(u) {
  try {
    const x = new URL(u);
    return ["http:", "https:"].includes(x.protocol) ? x.href : null;
  } catch {
    return null;
  }
}

function showStatus(msg, isError = false) {
  const s = $("status");
  s.textContent = msg;
  s.className = "status" + (isError ? " error" : "");
  if (msg)
    setTimeout(() => {
      if (s.textContent === msg) s.textContent = "";
    }, 2500);
}

/* ---------- Storage layer ----------
   Each note is its own key (note_<id>) so we stay under the 8 KB per item
   limit of chrome.storage.sync. If sync is full or fails, the note falls
   back to chrome.storage.local so nothing is ever lost. */

async function getAllNotes() {
  const [syncData, localData] = await Promise.all([
    chrome.storage.sync.get(null),
    chrome.storage.local.get(null),
  ]);
  const map = new Map();
  for (const src of [localData, syncData]) {
    for (const [key, val] of Object.entries(src)) {
      if (!key.startsWith(PREFIX) || !val || !val.id) continue;
      const existing = map.get(val.id);
      if (!existing || val.updatedAt > existing.updatedAt) map.set(val.id, val);
    }
  }
  return [...map.values()].sort((a, b) => b.updatedAt - a.updatedAt);
}

async function saveNote(note) {
  const key = PREFIX + note.id;
  try {
    await chrome.storage.sync.set({ [key]: note });
    await chrome.storage.local.remove(key);
  } catch (err) {
    await chrome.storage.local.set({ [key]: note });
    try {
      await chrome.storage.sync.remove(key);
    } catch (_) {}
  }
}

async function deleteNote(id) {
  const key = PREFIX + id;
  await Promise.all([
    chrome.storage.sync.remove(key),
    chrome.storage.local.remove(key),
  ]);
}

/* ---------- UI ---------- */

function buildItem(n) {
  const li = el("li");

  if (editingId === n.id) {
    const ta = el("textarea");
    ta.value = n.text;
    ta.maxLength = 4000;
    const actions = el("div", "actions");
    const save = el("button", "primary", "Save");
    const cancel = el("button", "", "Cancel");
    save.addEventListener("click", async () => {
      const text = ta.value.trim();
      if (!text) {
        showStatus("Note cannot be empty.", true);
        return;
      }
      await saveNote({ ...n, text, updatedAt: Date.now() });
      editingId = null;
      await refresh();
      showStatus("Note updated.");
    });
    cancel.addEventListener("click", () => {
      editingId = null;
      render();
    });
    actions.append(save, cancel);
    li.append(ta, actions);
    setTimeout(() => ta.focus(), 0);
    return li;
  }

  li.append(el("p", "note-text", n.text));

  const href = safeUrl(n.url);
  const label = n.title || n.url || "Untitled page";
  if (href) {
    const a = el("a", "note-link", label);
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.title = href;
    li.append(a);
  } else {
    li.append(el("span", "note-link", label));
  }

  const edited = n.updatedAt !== n.createdAt ? " (edited)" : "";
  li.append(
    el("div", "note-date", new Date(n.createdAt).toLocaleString() + edited),
  );

  const actions = el("div", "actions");
  const edit = el("button", "", "Edit");
  const del = el("button", "danger", "Delete");
  edit.addEventListener("click", () => {
    editingId = n.id;
    render();
  });
  del.addEventListener("click", async () => {
    if (!confirm("Delete this note?")) return;
    await deleteNote(n.id);
    await refresh();
    showStatus("Note deleted.");
  });
  actions.append(edit, del);
  li.append(actions);
  return li;
}

function render() {
  const q = $("search").value.trim().toLowerCase();
  const list = notes.filter(
    (n) =>
      !q ||
      [n.text, n.title, n.url].some((s) => (s || "").toLowerCase().includes(q)),
  );
  const ul = $("notes");
  ul.replaceChildren(...list.map(buildItem));
  $("count").textContent = notes.length
    ? `${list.length} of ${notes.length} notes`
    : "";
  const empty = $("empty");
  empty.hidden = list.length > 0;
  empty.textContent = notes.length
    ? "No notes match your search."
    : "No notes yet. Write your first one above.";
}

async function refresh() {
  notes = await getAllNotes();
  render();
}

async function addNote() {
  const text = $("noteInput").value.trim();
  if (!text) {
    showStatus("Write something first.", true);
    return;
  }
  const now = Date.now();
  await saveNote({
    id: crypto.randomUUID(),
    text,
    title: currentTab.title,
    url: currentTab.url,
    createdAt: now,
    updatedAt: now,
  });
  $("noteInput").value = "";
  $("counter").textContent = "0 / 4000";
  await refresh();
  showStatus("Note saved.");
}

async function init() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    currentTab = { title: tab?.title || "", url: tab?.url || "" };
  } catch (_) {}
  $("pageTitle").textContent = currentTab.title || "(no page title)";
  $("pageUrl").textContent = currentTab.url || "(no URL available)";

  $("saveBtn").addEventListener("click", addNote);
  $("noteInput").addEventListener("input", (e) => {
    $("counter").textContent = `${e.target.value.length} / 4000`;
  });
  $("noteInput").addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") addNote();
  });
  $("search").addEventListener("input", render);

  await refresh();
  $("noteInput").focus();
}

init();
