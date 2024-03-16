import { defineRoute, FreshContext } from "$fresh/server.ts";
import { AppHeaderProps } from "../components/AppHeader.tsx";
import Recoder from "../islands/Recoder.tsx";

export const handler = {
  GET: async (req: any, ctx: FreshContext<AppHeaderProps>) => {
    ctx.state.showRecordingShortCut = false;
    return await ctx.render();
  },
};

export default defineRoute(() => {
  return (
    <>
      <div class="px-2 pt-4">
        <Recoder />
      </div>
    </>
  );
});
