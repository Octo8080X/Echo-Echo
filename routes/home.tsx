import { defineRoute } from "$fresh/server.ts";
import HeroHome from "../components/HeroHome.tsx";
import RecentRecordings from "../islands/RecentRecordings.tsx";

export default defineRoute((_req, _ctx) => {
  return (
    <>
      <div class="px-2 pt-4">
        <HeroHome />
      </div>
      <div className="divider"></div>
      <div class="px-4">
        <RecentRecordings />
      </div>
    </>
  );
});
