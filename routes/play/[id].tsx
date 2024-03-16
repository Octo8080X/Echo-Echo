import { AppHeader } from "../../components/AppHeader.tsx";
import Player from "../../islands/Player.tsx";

export default function Play({params}: {params: {id: string}}) {

  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <AppHeader />
      </div>
      <Player recodingId={params.id} />
    </div>
  );
}
