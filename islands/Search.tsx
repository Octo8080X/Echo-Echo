import { useEffect, useState } from "preact/hooks";
import { hc } from "hono/client";
import { AppRoutesType } from "../routes/api/[...path].ts";
const client = hc<AppRoutesType>("/");

export default function Search() {
  const [list, setList] = useState<
    { title: string; url: string; colorCode: string }[]
  >([]);
  const [q, setQ] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      search();
    }, 100);
  }, []);

  const search = async () => {
    setIsLoading(true);
    const result = await client.api.records.search.$get({ query: { q } });
    const json = await result.json();
    const recordings = json.recordings;
    setList(recordings);
    setIsLoading(false);
  };

  return (
    <>
      <div class="container w-full">
        <form
          class=""
          noValidate
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
        >
          <div class="flex">
            <div class="w-full">
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Search"
                  onChange={(e: any) => setQ(e?.target?.value)}
                />
              </label>
            </div>
            <button class="btn btn-primary btn-outline mx-2" onClick={search}>
              Search
            </button>
          </div>
        </form>
      </div>
      <div class="container mx-auto mt-2 px-2">
        <p class="text-xl">Total: {isLoading ? "?" : list.length}</p>
      </div>
      <div class="container mx-auto mt-2">
        <table class="table table-zebra">
          <tbody>
            {isLoading &&
              Array.from({ length: 30 }, (_, i) => (
                <tr class="hover">
                  <td>
                    <div class="skeleton h-4 w-full"></div>
                  </td>
                </tr>
              ))}

            {!isLoading && list.map((item, index) => (
              <tr class="hover">
                <th>
                  <a href={item.url}>
                    <div class="min-w-[30px] max-w-[50px]">
                      <div
                        class="relative aspect-square items-center justify-center overflow-hidden bg-base-300"
                        style={{ backgroundColor: item.colorCode }}
                        key={"art" + index}
                      >
                        <div class="aspect-square mt-[20%] mb-[-20%] ml-[20%] mr-[-20%]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            class="fill-neutral-content"
                          >
                            <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-96-32a96 96 0 1 0 192 0 96 96 0 1 0 -192 0zM96 240c0-35 17.5-71.1 45.2-98.8S205 96 240 96c8.8 0 16-7.2 16-16s-7.2-16-16-16c-45.4 0-89.2 22.3-121.5 54.5S64 194.6 64 240c0 8.8 7.2 16 16 16s16-7.2 16-16z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                </th>

                <td>
                  <a href={item.url} class="text-xl">{item.title}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
