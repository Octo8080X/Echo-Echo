import { defineRoute } from "$fresh/server.ts";
import Search from "../islands/Search.tsx";

export default defineRoute(() => {
  return (
    <>
      <div class="px-2 pt-4">
        <Search />
      </div>
    </>
  );
});
