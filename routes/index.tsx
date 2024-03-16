import { RouteConfig } from "$fresh/server.ts";
import HeroIndex from "../components/HeroIndex.tsx";

export const config: RouteConfig = {
  skipInheritedLayouts: true,
};

export default function Index() {
  return (
    <>
      <div class="container mx-auto">
        <HeroIndex />
      </div>
    </>
  );
}
