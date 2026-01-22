'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function ImportantSitesRedirectPage() {
  useEffect(() => {
    redirect('/important-sites/sovereign');
  }, []);

  return null;
}
