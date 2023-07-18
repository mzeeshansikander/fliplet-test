import axios from "axios";

const load = async () => {
  try {
    const { data } = await axios.get(
      "https://api.fliplet.com/v1/widgets/assets"
    );
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const main = async () => {
  const data = await load();
  const assets = data.assets;
  const list = Object.keys(assets);
  console.log(list);
  return list;
};

main();
