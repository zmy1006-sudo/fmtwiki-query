import { useState } from 'react';
import LoginPage from './LoginPage';
import DoctorPortal from './DoctorPortal';
import PatientPortal from './PatientPortal';
import { AISearchPanel } from './AISearchPanel';
import { EvidenceGuide } from './EvidenceGuide';
import { LandingPage } from './LandingPage';
import { LandingPageB } from './LandingPageB';
import { LandingPageC } from './LandingPageC';
import LandingPageD from './LandingPageD';
import LandingPageE from './LandingPageE';
import type { SearchRecord } from './data/searchIndex';

type DoctorTab = 'disease' | 'teams' | 'ai' | 'science';
type PatientEduCategory = '全部' | '前世今生' | '适应证' | '治疗流程' | '政策规范' | '医保报销' | '知情同意';

type AppView =
  | { screen: 'landingE' }
  | { screen: 'landingB' }
  | { screen: 'landingC' }
  | { screen: 'landingD' }
  | { screen: 'landingE' }
  | { screen: 'login' }
  | { screen: 'aiSearch'; portal: 'doctor' | 'patient' }
  | { screen: 'doctor'; tab: DoctorTab }
  | { screen: 'patient'; tab: PatientEduCategory }
  | { screen: 'evidenceGuide' };

export default function App() {
  const [view, setView] = useState<AppView>({ screen: 'landingE' });

  function handleEnter(type: 'doctor' | 'patient') {
    if (type === 'doctor') {
      setView({ screen: 'doctor', tab: 'disease' });
    } else {
      setView({ screen: 'patient', tab: '全部' });
    }
  }

  function handleAISearch(portal: 'doctor' | 'patient') {
    setView({ screen: 'aiSearch', portal });
  }

  function handleLogout() {
    setView({ screen: 'landingE' });
  }

  function handleResultClick(record: SearchRecord) {
    const isDoctor = record.type === 'disease' || record.type === 'team' || record.type === 'aiApp' || record.type === 'science';
    if (isDoctor) {
      setView({ screen: 'doctor', tab: 'disease' });
    } else {
      setView({ screen: 'patient', tab: '全部' });
    }
  }

  return (
    <>
      {view.screen === 'landingB' && (
        <LandingPageB
          onEnterDoctor={() => setView({ screen: 'doctor', tab: 'disease' })}
          onEnterPatient={() => setView({ screen: 'patient', tab: '全部' })}
          onEnterLandingC={() => setView({ screen: 'landingC' })}
        />
      )}
      {view.screen === 'landingC' && (
        <LandingPageC
          onEnterDoctor={() => setView({ screen: 'doctor', tab: 'disease' })}
          onEnterPatient={() => setView({ screen: 'patient', tab: '全部' })}
        />
      )}
      {view.screen === 'landingD' && (
        <LandingPageD
          onEnterDoctor={() => setView({ screen: 'doctor', tab: 'disease' })}
          onEnterPatient={() => setView({ screen: 'patient', tab: '全部' })}
        />
      )}
      {view.screen === 'landingE' && (
        <LandingPageE
          onEnterDoctor={() => setView({ screen: 'doctor', tab: 'disease' })}
          onEnterPatient={() => setView({ screen: 'patient', tab: '全部' })}
        />
      )}
      {view.screen === 'login' && (
        <LoginPage onEnter={handleEnter} onAISearch={handleAISearch} onShowEvidenceGuide={() => setView({ screen: 'evidenceGuide' })} />
      )}
      {view.screen === 'aiSearch' && (
        <AISearchPanel
          portal={view.portal}
          onBack={handleLogout}
          onResultClick={handleResultClick}
        />
      )}
      {view.screen === 'doctor' && (
        <DoctorPortal onLogout={handleLogout} onOpenAISearch={() => handleAISearch('doctor')} />
      )}
      {view.screen === 'patient' && (
        <PatientPortal onLogout={handleLogout} onOpenAISearch={() => handleAISearch('patient')} />
      )}
      {view.screen === 'evidenceGuide' && (
        <EvidenceGuide onBack={() => setView({ screen: 'landingE' })} />
      )}
    </>
  );
}
