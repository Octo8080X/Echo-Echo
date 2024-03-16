import { deleteByDate } from "../utils/kvstorage.ts";
import { getBeforeDate } from "../utils/time.ts";

export async function deleteData() {
  console.log("Start Task: deleteData");

  const date = new Date();
  const dateString = getBeforeDate(date, 1);
  console.log("delete date: ~", dateString);

  await deleteByDate(dateString);

  console.log("End Task: deleteData");
}
