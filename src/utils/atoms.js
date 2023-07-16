import { atom } from "jotai";

export const sendMessageAtom = atom(undefined);
const distanceAtomRaw = atom({ 0: 0, 1: 0, 2: 0, 3: 0 });

export const distanceAtom = atom(
  (get) => get(distanceAtomRaw),
  (get, set, update) => {
    const prevState = get(distanceAtomRaw);
    prevState[update.stage] = update.value;
    set(distanceAtomRaw, prevState);
  }
);

export const lastMessageAtom = atom(undefined);
