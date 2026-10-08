'use client';
export default function Error({reset}:{reset:()=>void}){return <div className="card"><h1 className="text-xl font-bold">Une erreur est survenue</h1><button className="btn-or mt-4" onClick={reset}>Réessayer</button></div>}
