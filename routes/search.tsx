import { AppHeader } from "../components/AppHeader.tsx";
import { getRecordingList } from "../utils/kvstorage.ts";

export default async function Home() {

  const list = await getRecordingList()
  console.log(list);


  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <AppHeader />
      </div>
      search
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th></th>
              <th>id</th>
              <th>uid</th>
              <th>Favorite Color</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => 
              <tr class="hover">
                <th>{index}</th>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td><a href={`/play/${item.id}`}>GO</a></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
