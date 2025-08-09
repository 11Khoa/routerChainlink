import fs from "fs";
import fetch from "node-fetch";

function flattenDeep(arr, result = []) {
  for (const item of arr) {
    if (Array.isArray(item)) {
      flattenDeep(item, result);
    } else {
      result.push(item);
    }
  }
  return result;
}

const fetchCcipChains = async () => {
  try {
    const response = await fetch(
      "https://docs.chain.link/api/ccip/v1/chains?environment=mainnet"
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const { data } = await response.json();
    const chains = { ...data.evm, ...(data.svm || {}), ...(data.mvm || {}) };
    const routers = [];

    for (const [_, chain] of Object.entries(chains)) {
      if (chain.displayName) {
        const rpc =
          chain.displayName.replaceAll(" ", "_").toUpperCase() + "_RPC";
        routers.push({
          name: chain.displayName,
          rpc,
          router: chain.router,
          chainSelector: chain.selector,
          chainFamily: chain.chainFamily,
        });
      }
    }

    const formatted = routers.map(({ name, rpc, router, chainSelector, chainFamily }) => ({
      name: name || "",
      rpc: rpc || "",
      router: router || "",
      chainSelector: chainSelector || "",
      chainFamily: chainFamily || ""
    }));

    fs.writeFileSync("ccip-chains.json", JSON.stringify(formatted, null, 2));
    console.log(`✅ Đã ghi ${formatted.length} chain vào ccip-chains.json`);

    return { data, routers };
  } catch (err) {
    console.error("❌ Lỗi khi fetch CCIP chains:", err.message);
    throw err;
  }
};

const xyz = await fetchCcipChains();
