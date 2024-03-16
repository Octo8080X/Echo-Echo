import { defineLayout, FreshContext, RouteContext } from "$fresh/server.ts";
import { AppFooter } from "../components/AppFooter.tsx";
import { AppHeader, AppHeaderProps } from "../components/AppHeader.tsx";

export default defineLayout(
  (_req: Request, ctx: RouteContext<void, AppHeaderProps>) => {
    return (
      <>
        <div class="container mx-0">
          <AppHeader showRecordingShortCut={ctx.state.showRecordingShortCut} />
        </div>
        <div class="container mb-auto">
          <ctx.Component />
        </div>
        <div class="container">
          <AppFooter />
        </div>
      </>
    );
  },
);
