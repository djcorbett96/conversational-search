import { useState } from 'react';
import { BookOpenIcon, DocumentIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Layout({ children }) {
  const [selectedExperience, setSelectedExperience] = useState('Harry Potter');

  return (
    <>
      <div>
        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-900 p-6">
            <h1 className="text-white font-semibold text-lg">
              Conversational Search Demo
            </h1>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    <li>
                      <Link href="/harrypotter">
                        <div
                          className={classNames(
                            selectedExperience === 'Harry Potter'
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer'
                          )}
                          onClick={() => setSelectedExperience('Harry Potter')}
                        >
                          <BookOpenIcon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          Harry Potter
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/hitchhikers">
                        <div
                          className={classNames(
                            selectedExperience === 'Hitchhikers'
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer'
                          )}
                          onClick={() => setSelectedExperience('Hitchhikers')}
                        >
                          <BookOpenIcon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          Hitchhikers
                        </div>
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <main className="lg:pl-72">
          <div className="lg:pl-8">{children}</div>
        </main>
      </div>
    </>
  );
}
