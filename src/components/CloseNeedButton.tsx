'use client';
import { closeNeed } from '@/server/actions';
export function CloseNeedButton({needId}:{needId:string}){return <form action={closeNeed.bind(null,needId)} onSubmit={e=>{if(!window.confirm('Clôturer ce besoin ?'))e.preventDefault()}}><button type="submit" className="rounded-xl p-2 text-red-700 hover:bg-red-50" aria-label="Clôturer le besoin" title="Clôturer le besoin"><svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg></button></form>}
