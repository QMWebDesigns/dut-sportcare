import { useState, useEffect, type ReactNode } from 'react';

interface RouteProps {
  path: string;
  element: ReactNode;
}

interface RouterProps {
  children: ReactNode;
}

export function Router({ children }: RouterProps) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const routes = children as React.ReactElement<RouteProps>[];
  const routeArray = Array.isArray(routes) ? routes : [routes];

  const matchedRoute = routeArray.find((route) => {
    if (route.props.path === currentPath) return true;
    if (route.props.path === '*' && !routeArray.some(r => r.props.path === currentPath)) return true;
    return false;
  });

  return <>{matchedRoute?.props.element || null}</>;
}

// FIX: Add path prop to Route component
export function Route({ path, element }: RouteProps) {
  return <>{element}</>;
}

export function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}