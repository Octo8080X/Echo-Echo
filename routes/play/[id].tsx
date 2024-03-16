import Player from "../../islands/Player.tsx";

export default function Play({ params }: { params: { id: string } }) {
  return (
    <>
      <div class="px-2 pt-4">
        <Player recodingId={params.id} />
      </div>
    </>
  );
}
