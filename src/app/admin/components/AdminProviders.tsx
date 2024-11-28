'use client';

import CsrfTokenContext from '~/lib/contexts/csrf';
import Toaster from '~/components/Toaster';

function AdminProviders(
  props: React.PropsWithChildren<{
    csrfToken: string | null;
  }>,
) {
  return (
    <CsrfTokenContext.Provider value={props.csrfToken}>
      <Toaster richColors={false} />
      {props.children}
    </CsrfTokenContext.Provider>
  );
}

export default AdminProviders;
