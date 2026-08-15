import { useEffect, useState } from 'react';
import BottomNav, { type TabKey } from './components/BottomNav';
import DetailSheet from './components/DetailSheet';
import HomePage from './pages/HomePage';
import TonguePage from './pages/TonguePage';
import MedicinesPage from './pages/MedicinesPage';
import CasesPage from './pages/CasesPage';
import AcupointsPage from './pages/AcupointsPage';
import SearchPage from './pages/SearchPage';
import type { DetailRef } from './types';

export default function App() {
  const [tab, setTab] = useState<TabKey>('home');
  const [detailStack, setDetailStack] = useState<DetailRef[]>([]);
  const [search, setSearch] = useState<string | null>(null);

  const open = (ref: DetailRef) => setDetailStack(s => [...s, ref]);
  const back = () => setDetailStack(s => s.slice(0, -1));
  const closeAll = () => setDetailStack([]);

  // 切 Tab 时回到顶部
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab]);

  return (
    <div className="mx-auto min-h-screen max-w-lg">
      {tab === 'home' && (
        <HomePage onOpen={open} onTab={setTab} onSearch={q => setSearch(q)} />
      )}
      {tab === 'tongue' && <TonguePage onOpen={open} />}
      {tab === 'medicines' && <MedicinesPage onOpen={open} />}
      {tab === 'cases' && <CasesPage onOpen={open} />}
      {tab === 'acupoints' && <AcupointsPage onOpen={open} />}

      <BottomNav active={tab} onChange={setTab} />

      {search !== null && (
        <SearchPage initialQuery={search} onOpen={open} onClose={() => setSearch(null)} />
      )}

      {detailStack.length > 0 && (
        <DetailSheet stack={detailStack} onClose={closeAll} onBack={back} onNavigate={open} />
      )}
    </div>
  );
}
