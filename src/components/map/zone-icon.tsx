export type ZoneIconName = "cards" | "relation" | "scroll" | "campus" | "mist" | "forge";

export function ZoneIcon({ name }: { name: ZoneIconName }) {
  const paths = {
    cards: <><rect x="8" y="11" width="24" height="30" rx="3" /><rect x="18" y="7" width="24" height="30" rx="3" /><path d="M24 17h12M24 23h8" /></>,
    relation: <><circle cx="14" cy="15" r="6" /><circle cx="36" cy="35" r="6" /><path d="m19 19 12 12M31 15h7v7M19 35h-7v-7" /></>,
    scroll: <><path d="M14 8h24v31H14zM14 8c-7 0-7 10 0 10M38 29c7 0 7 10 0 10" /><path d="M20 20h12M20 26h12" /></>,
    campus: <><path d="m25 8 18 10H7ZM11 21h28v20H11zM18 25v12M25 25v12M32 25v12" /></>,
    mist: <><path d="M7 17h20c8 0 8-10 1-10-4 0-6 3-6 6M43 26H19c-8 0-8-10-1-10M8 35h24c8 0 8 9 1 9-4 0-6-3-6-6" /></>,
    forge: <><path d="M10 10h30l-5 12H15ZM20 22h10v19H20zM14 41h22" /><path d="m36 8 7-5M39 13l8-1M33 5l2-4" /></>,
  };
  return <svg className="zone-icon" viewBox="0 0 50 50" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}
