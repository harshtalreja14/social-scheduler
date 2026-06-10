import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { Outlet, useLocation } from 'react-router-dom';
import { MenuIcon } from 'lucide-react';

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/accounts": "Social Accounts",
    "/schedule": "Post Scheduler",
    "/ai-composer": "AI Composer",
}

const Layout = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "SocialAI"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div>
        <div className="flex h-screen bg-slate-50">
            {isMobileMenuOpen && <div className='fixed inset-0 bg-slate-900/5 z-40 md:hidden' 
             onClick={() => setIsMobileMenuOpen(false)} />}
            <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
            
            <div className='flex-1 flex flex-col overflow-hidden'>
                <header className='bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4'>
                    <button className='md:hidden p-1 text-slate-500' onClick={() => setIsMobileMenuOpen(true)}>
                        <MenuIcon className='size-6' />
                    </button>
                    <div>
                        <h1 className='text-lg font-semibold text-slate-900'>{title}</h1>
                        <p className='text-sm text-slate-400'>Manage and automate your social presence</p>
                    </div>
                </header>
                <main className='flex-1 overflow-auto p-4 sm:p-6 md:p-8 xl:p-12'>
                    <Outlet />
                </main>
            </div>
        </div>
    </div>
  )
}

export default Layout