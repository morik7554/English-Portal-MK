/* Browser-local learning journal. The same module is tested in Node without a DOM. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LearningJournal = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const LOCAL = 'english-portal-journal-v2';
  const SESSION = 'english-portal-journal-session-v2';
  const OLD_LOCAL = 'english-portal-learning-v1';
  const OLD_SESSION = 'english-portal-session-v1';
  const LAST_APP = 'english-portal-last-app-v2';
  const clone = value => JSON.parse(JSON.stringify(value));
  function validDate(value) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      !Number.isNaN(Date.parse(value)) && new Date(value + 'T00:00:00Z').toISOString().slice(0,10) === value;
  }
  function validRecord(r) {
    return r && typeof r.id === 'string' && validDate(r.date) && typeof r.materialId === 'string' &&
      typeof r.materialName === 'string' && typeof r.activity === 'string' && typeof r.comment === 'string' &&
      Number.isInteger(r.rating) && r.rating >= 1 && r.rating <= 5 &&
      (r.durationMinutes == null || (Number.isInteger(r.durationMinutes) && r.durationMinutes >= 0 && r.durationMinutes <= 1439)) &&
      typeof r.createdAt === 'string' && !Number.isNaN(Date.parse(r.createdAt)) &&
      typeof r.updatedAt === 'string' && !Number.isNaN(Date.parse(r.updatedAt));
  }
  function parse(raw) {
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (!v || v.version !== 2 || typeof v.persist !== 'boolean' || !Array.isArray(v.records) ||
      !v.records.every(validRecord) || new Set(v.records.map(r => r.id)).size !== v.records.length ||
      !Array.isArray(v.legacy) || !v.legacy.every(r => r && typeof r.id === 'string' && typeof r.materialName === 'string' && typeof r.goal === 'string' && typeof r.result === 'string' && typeof r.note === 'string' && typeof r.nextAction === 'string' && typeof r.date === 'string')) throw Error('記録の形式を読み取れません。上書きせずに保持しています。');
    return v;
  }
  class Journal {
    constructor(options) {
      this.local = options.local; this.session = options.session;
      this.materials = options.materials || [];
      this.clock = options.clock || (() => new Date().toISOString());
      this.id = options.id || (() => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2));
      this.error = ''; this.locked = false;
      this.state = { version: 2, persist: false, records: [], legacy: [] };
      this.load();
    }
    read(storage, key) { try { return storage.getItem(key); } catch (_) { return null; } }
    oldRecords() {
      const rows = [];
      for (const [storage,key] of [[this.local,OLD_LOCAL],[this.session,OLD_SESSION]]) {
        const raw = this.read(storage,key); if (!raw) continue;
        try {
          const old = JSON.parse(raw);
          if (old.version !== 1) continue;
          for (const r of [old.last, old.active]) {
            if (!r || typeof r.materialId !== 'string') continue;
            const m = this.materials.find(m => m.id === r.materialId);
            const string = v => typeof v === 'string' ? v : '';
            const stamp = string(r.updatedAt) || string(r.openedAt);
            rows.push({ id: r.materialId + ':' + stamp + ':' + string(r.stage), materialName: m ? m.name : r.materialId,
              date: stamp ? stamp.slice(0,10) : '', goal: string(r.goal), result: string(r.result) || string(r.stage),
              note: string(r.note), nextAction: [string(r.nextAction),string(r.reason)].filter(Boolean).join('：') });
          }
        } catch (_) { /* Leave the original data intact, even if it cannot be displayed. */ }
      }
      return [...new Map(rows.map(r => [r.id,r])).values()];
    }
    load() {
      this.error = ''; this.locked = false;
      try {
        let savedRaw = null;
        try { savedRaw = this.local.getItem(LOCAL); } catch (_) { if (this.state.persist) throw Error('端末の記録を読み込めません。保存設定を確認してください。'); }
        const saved = parse(savedRaw);
        let session = null;
        if (!(saved && saved.persist)) {
          let sessionRaw;
          try { sessionRaw = this.session.getItem(SESSION); } catch (_) { throw Error('保存できません。記録の読み取りが拒否されています。入力は残っています。'); }
          session = parse(sessionRaw);
        }
        this.state = saved && saved.persist ? saved : session && !session.persist ? session : {version:2,persist:false,records:[],legacy:[]};
        this.state.legacy = [...new Map([...this.state.legacy,...this.oldRecords()].map(r=>[r.id,r])).values()];
      } catch (e) { this.error = e.message; this.locked = true; }
      return this.snapshot();
    }
    snapshot() { return clone(this.state); }
    commit(next) {
      if (this.locked) throw Error(this.error);
      const storage = next.persist ? this.local : this.session;
      try { storage.setItem(next.persist ? LOCAL : SESSION, JSON.stringify(next)); }
      catch (_) { throw Error('保存できませんでした。入力は残っています。ブラウザーの保存設定や空き容量を確認してください。'); }
      this.state = next;
      // A session mirror is optional when the durable write has succeeded.
      if (next.persist) try { this.session.setItem(SESSION, JSON.stringify(next)); } catch (_) { /* local is authoritative */ }
      return this.snapshot();
    }
    upsert(values, editId) {
      this.load();
      if (this.locked) throw Error(this.error);
      const before = editId ? this.state.records.find(r=>r.id===editId) : null;
      if (editId && !before) throw Error('修正する記録が見つかりません。ログを開き直してください。');
      const material = this.materials.find(m=>m.id===values.materialId);
      const materialName = values.materialId === 'other' ? String(values.materialName || '').trim() : before && before.materialId === values.materialId ? before.materialName : material ? material.name : '';
      const r = { id: before ? before.id : this.id(), date: values.date, materialId: values.materialId,
        materialName, activity: String(values.activity || '').trim(), rating: Number(values.rating),
        comment: String(values.comment || '').trim(),
        durationMinutes: values.durationMinutes === undefined ? (before && before.durationMinutes != null ? before.durationMinutes : null) : values.durationMinutes, createdAt: before ? before.createdAt : this.clock(), updatedAt: this.clock() };
      if (!validRecord(r) || !materialName || r.materialName.length>80 || r.activity.length>200 || r.comment.length>2000) throw Error('日付・アプリ・勉強時間・1〜5の評価を確認してください。');
      const next = this.snapshot(); next.records = next.records.filter(item=>item.id!==r.id); next.records.push(r);
      this.commit(next); return clone(r);
    }
    remove(id) {
      this.load();
      if (!this.state.records.some(r=>r.id===id)) throw Error('対象の記録が見つかりません。');
      const next = this.snapshot(); next.records = next.records.filter(r=>r.id!==id); return this.commit(next);
    }
    list(filters = {}) {
      return clone(this.state.records.filter(r=>(!filters.from || r.date>=filters.from) && (!filters.to || r.date<=filters.to) &&
        (!filters.app || r.materialId===filters.app)).sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt.localeCompare(a.createdAt)||b.id.localeCompare(a.id)));
    }
    setPersistence(enabled) {
      this.load(); if (this.locked) throw Error(this.error);
      const next = this.snapshot(); next.persist = enabled;
      if (enabled) return this.commit(next);
      // Preserve a session copy before removing durable records, including the old format.
      try {
        this.session.setItem(SESSION,JSON.stringify(next));
        this.local.removeItem(LOCAL); this.local.removeItem(OLD_LOCAL);
      } catch (_) { throw Error('保存設定を変更できませんでした。端末内の記録を削除できたか確認できません。'); }
      this.state=next; return this.snapshot();
    }
    clearAll() {
      try {
        for (const key of [LOCAL,OLD_LOCAL]) this.local.removeItem(key);
        for (const key of [SESSION,OLD_SESSION,LAST_APP]) this.session.removeItem(key);
      } catch (_) { throw Error('記録をすべて消去できたか確認できません。ブラウザーの設定を確認してください。'); }
      this.state={version:2,persist:false,records:[],legacy:[]}; this.locked=false; this.error='';
    }
    remember(id) { try { this.session.setItem(LAST_APP,id); } catch (_) { /* Never block studying. */ } }
    lastApp() { return this.read(this.session,LAST_APP) || ''; }
  }
  return { Journal, validDate, parse, keys: {LOCAL,SESSION,OLD_LOCAL,OLD_SESSION,LAST_APP} };
});
