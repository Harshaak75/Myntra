import { useSelector } from 'react-redux';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function PersistedAppWrapper({ children }: Props) {
  const rehydrated = useSelector((state: any) => state._persist?.rehydrated);

  if (!rehydrated) {
    // Optional: render a loading spinner or skeleton
    return null;
  }

  return <>{children}</>;
}
