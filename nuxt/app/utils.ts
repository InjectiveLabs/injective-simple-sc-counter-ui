import { sleep } from "@injectivelabs/utils";

export const backupPromiseCall = async <T>(promise: () => Promise<T>) => {
  await promise();
  await sleep(5000);

  sleep(5000).then(async () => {
    await promise();
  });
};
