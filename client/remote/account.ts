import axios from "./axios";

export async function getName(): Promise<string> {
  return (await axios.get("/name")).data.name;
}
