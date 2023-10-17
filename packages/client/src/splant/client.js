// @ts-ignore
import { Web3Storage } from "web3.storage";

export function makeStorageClient(accessToken) {
  return new Web3Storage({ token: accessToken });
}
class Web3StorageClient {
  constructor(accessToken) {
    this.client = makeStorageClient(accessToken);
  }

  async store(files) {
    console.log("storing:", files);

    const cid = await this.client.put(files);
    console.log("stored files with cid:", cid);
    return cid;
  }

  async retrieve(cid) {
    const res = await this.client.get(cid);
    console.log(`Got a response! [${res.status}] ${res.statusText}`);

    if (!res.ok) {
      throw new Error(`failed to get `);
    }
    const files = await res.files();
    for (const file of files) {
      console.log(`${file.cid} -- ${file.path} -- ${file.size}`);
    }
    return files;
  }
}

export default Web3StorageClient;
