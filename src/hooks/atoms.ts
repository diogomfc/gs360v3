import { atom } from 'jotai';

export const sidebarOpen = atom(true);
export const selectedFilterAtom = atom({ filterId: '', filterName: '' });
