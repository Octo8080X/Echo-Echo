import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

interface AppHeaderProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  showRecordingShortCut?: boolean;
  showHomeLinkShortCut?: boolean;
}

export function AppHeader(props: AppHeaderProps) {
  const showRecordingShortCut = props.showRecordingShortCut ?? true;

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a href="/search">Search</a>
            </li>
            <li>
              <a href="/play/random">Random Play</a>
            </li>
            <li>
              <a href="/conditions">conditions</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl" href="/home">daisyUI</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="/search">Search</a>
          </li>
          <li>
            <a href="/play/random">Random Play</a>
          </li>
          <li>
            <a href="/conditions">conditions</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {showRecordingShortCut &&
          <a className="btn btn-primary" href="/recording">Recording</a>}
      </div>
    </div>
  );
}
