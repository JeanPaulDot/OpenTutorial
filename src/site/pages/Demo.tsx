import { TourProvider } from '@opentutorial/core/adapters/react';
import { welcomeSpec } from '../demo/specs/welcome';
import { exportReportSpec } from '../demo/specs/export-report';
import { customizeSpec } from '../demo/specs/customize';
import { hotspotSpec } from '../demo/specs/hotspot';
import { i18nSpec } from '../demo/specs/i18n-demo';
import '../../core/styles.css';
import Shell from '../sections/Shell';

export default function Demo() {
  return (
    <TourProvider
      specs={[welcomeSpec, exportReportSpec, customizeSpec, hotspotSpec, i18nSpec]}
      context={{ plan: 'free' }}
      zIndex={9999}
      resume={true}
      progressTtl={86400000}
    >
      <Shell />
    </TourProvider>
  );
}
