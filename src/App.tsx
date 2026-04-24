import { useState } from 'react';
import LoginPage from './LoginPage';
import DoctorPortal from './DoctorPortal';
import PatientPortal from './PatientPortal';
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
  | { screen: 'login' }
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
        <LoginPage onEnter={handleEnter} onShowEvidenceGuide={() => setView({ screen: 'evidenceGuide' })} />
      )}
      {view.screen === 'doctor' && (
        <DoctorPortal onLogout={handleLogout} onOpenUserCenter={() => setView({ screen: 'landingE' })} />
      )}
      {view.screen === 'patient' && (
        <PatientPortal onLogout={handleLogout} onOpenUserCenter={() => setView({ screen: 'landingE' })} />
      )}
      {view.screen === 'evidenceGuide' && (
        <EvidenceGuide onBack={() => setView({ screen: 'landingE' })} />
      )}
    </>
  );
}
