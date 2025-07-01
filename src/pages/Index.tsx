
import { ConsciousnessField } from '@/components/ConsciousnessField';
import { SubliminalCarrierLayer } from '@/components/operational/SubliminalCarrierLayer';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { DesktopLayout } from '@/components/layout/DesktopLayout';
import { useConsciousnessState } from '@/hooks/useConsciousnessState';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  const {
    consciousnessState,
    operationalMode,
    visualizerMode,
    carrierDepth,
    textInput,
    isActive,
    updateConsciousnessState,
    updateOperationalMode,
    setVisualizerMode,
    setCarrierDepth,
    setTextInput,
    setIsActive,
    handleBiometricUpdate
  } = useConsciousnessState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-gray-950 overflow-hidden relative">
      
      {/* Subliminal Carrier Layer */}
      <SubliminalCarrierLayer depth={carrierDepth} isActive={isActive} />
      
      {/* Background Consciousness Field */}
      <ConsciousnessField 
        state={consciousnessState}
        isActive={isActive}
        opacity={0.3}
      />

      {/* Responsive Layout */}
      {isMobile ? (
        <MobileLayout
          consciousnessState={consciousnessState}
          operationalMode={operationalMode}
          visualizerMode={visualizerMode}
          carrierDepth={carrierDepth}
          textInput={textInput}
          isActive={isActive}
          updateConsciousnessState={updateConsciousnessState}
          updateOperationalMode={updateOperationalMode}
          setVisualizerMode={setVisualizerMode}
          setCarrierDepth={setCarrierDepth}
          setTextInput={setTextInput}
          setIsActive={setIsActive}
          handleBiometricUpdate={handleBiometricUpdate}
        />
      ) : (
        <DesktopLayout
          consciousnessState={consciousnessState}
          operationalMode={operationalMode}
          visualizerMode={visualizerMode}
          carrierDepth={carrierDepth}
          textInput={textInput}
          isActive={isActive}
          updateConsciousnessState={updateConsciousnessState}
          updateOperationalMode={updateOperationalMode}
          setVisualizerMode={setVisualizerMode}
          setCarrierDepth={setCarrierDepth}
          setTextInput={setTextInput}
          setIsActive={setIsActive}
          handleBiometricUpdate={handleBiometricUpdate}
        />
      )}
    </div>
  );
};

export default Index;
