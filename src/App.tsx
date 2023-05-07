import { useState } from "react";
import axios from "axios"

function App() {
  const [domain, setDomain] = useState("")
  const [port, setPort] = useState(26659)
  const [namespaceId, setNamespaceId] = useState("")
  const [data, setData] = useState("")
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)
  const [height, setHeight] = useState(0)
  const [txHash, setTxHash] = useState("")
  const [network, setNetwork] = useState<"mocha"|"blockspacerace"|"arabica">("mocha")

  const PFBName = () => {
    return network === "blockspacerace" ? "PFB" : "PFD"
  }

  const isValid = () => {
    return domain.length > 0 && port && namespaceId.length > 0 && data.length > 0
  }

  const onSubmit = async (event: any) => {
    event.preventDefault()

    setError("")

    if (!isValid()) {
      return
    }

    setSending(true)

    const uri = network === "blockspacerace" ? "submit_pfb" : "submit_pfd"

    let res
    try {
      res = await axios.post(`http://${domain}:${port}/${uri}`, {
        namespace_id: namespaceId,
        data: data,
        gas_limit: 80000,
        fee: 2000
      })
    } catch (err: any) {
      setError(err.message)
      setHeight(0)
      setTxHash("")
      setSending(false)
      return
    }

    setError("")
    setHeight(res.data.height)
    setTxHash(res.data.txhash)
    setSending(false)
  }

  return (
    <div className="flex flex-wrap">
      <div className="w-full lg:w-1/3 bg-white p-6 border-r">
        <h1 className="text-2xl font-bold">Submit your {PFBName()} transaction</h1>
        <div className="bg-yellow-50 px-4 py-3 shadow-sm rounded text-yellow-800 border-l-4 border-yellow-600 mt-6">
          <p>When running a Celestia node, you will need to use the following flags when starting your node to submit a {PFBName()}:</p>
          <ul className="mt-4 ml-6 list-disc">
            <li className="mb-3">the <code className="bg-yellow-100 px-1 border rounded text-sm whitespace-nowrap">--core.ip string</code> flag, to allow you to submit transactions to your node</li>
            <li>the <code className="bg-yellow-100 px-1 border rounded text-sm whitespace-nowrap">--gateway</code>, <code className="bg-yellow-100 px-1 border rounded text-sm whitespace-nowrap">--gateway.addr string</code>, and <code className="bg-yellow-100 px-1 border rounded text-sm whitespace-nowrap">--gateway.port string</code>, to open the gateway and allow
              anyone to use your IP as an endpoint to submit {PFBName()}s</li>
          </ul>
        </div>
        <a href="https://go.dev/play/p/7ltvaj8lhRl" target="_blank" rel="noreferrer noopener" className="block bg-purple-100 text-purple-900 font-bold text-xl mt-4 rounded py-2 text-center hover:bg-purple-200">
          Generate your namespace ID and Data
        </a>
        <a href="https://docs.celestia.org/developers/node-tutorial/#submit-a-pfb-transaction" target="_blank" rel="noreferrer noopener" className="block bg-gray-200 text-gray-900 font-bold text-xl mt-4 rounded py-2 text-center hover:bg-gray-300">
          Read the docs
        </a>
      </div>
      <div className="w-full lg:w-2/3 flex items-center justify-center lg:min-h-screen bg-gray-100 p-6">
        <div className="bg-gray-100 shadow rounded bg-white w-full lg:w-1/2 p-6 my-12 lg:my-0">
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label className="block text-lg">Network</label>
              <select disabled={sending} onChange={({ target }: any) => { setNetwork(target.value) }} className="border rounded px-3 py-2">
                <option selected value="mocha">Mocha</option>
                <option value="blockspacerace">Blockspace Race</option>
                <option value="arabica">Arabica</option>
              </select>
            </div>
            <div className="flex mb-4">
              <div className="w-2/3 pr-4">
                <label className="block text-lg">Node IP Address</label>
                <input type="text" disabled={sending} className="border rounded px-3 py-2 w-full" defaultValue={domain} onInput={({ target }: any) => { setDomain(target.value.trim()) }}/>
                <small className="italic block mt-1 text-xs text-gray-500">Your node's public IP address.</small>
              </div>
              <div className="w-1/3">
                <label className="block text-lg">Port</label>
                <input type="text" disabled={sending} className="border rounded px-3 py-2 w-full" defaultValue={port} onInput={({ target }: any) => { setPort(target.value.trim()) }}/>
                <small className="italic block mt-1 text-xs text-gray-500">Must be open to public.</small>
              </div>
            </div>
            <div className="flex">
              <div className="block pr-2 w-1/2">
                <label className="block mb-1 text-lg">Namespace ID</label>
                <input type="text" disabled={sending} className="border rounded px-3 py-2 w-full" defaultValue={namespaceId} onInput={({ target }: any) => { setNamespaceId(target.value.trim()) }}/>
              </div>
              <div className="block pl-2 w-1/2">
                <label className="block mb-1 text-lg">Data</label>
                <input type="text" disabled={sending} className="border rounded px-3 py-2 w-full" defaultValue={data} onInput={({ target }: any) => { setData(target.value.trim()) }}/>
              </div>
            </div>
            <a href="https://go.dev/play/p/7ltvaj8lhRl" target="_blank" rel="noreferrer noopener" className="italic text-xs block mt-1 text-blue-400 hover:underline">Generate your namespace ID and data</a>
            {error && (
              <div className="bg-red-100 my-6 rounded border border-red-200 text-red-900 flex items-center">
                <div className="w-16 flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div className="w-full py-4 pr-4">
                  <div className="font-bold">{error}</div>
                  <div className="text-sm">Make sure your node is properly configured and check your node logs.</div>
                </div>
              </div>
            )}
            {height !== 0 && txHash && (
              <div className="border rounded p-4 mt-4 bg-green-100 border-green-300 text-green-900">
                <div className="font-bold mb-3">Success!</div>
                <div className="font-mono text-xs">Height: {height}</div>
                <div className="font-mono text-xs">Hash&nbsp;&nbsp;: {txHash}</div>
              </div>
            )}
            <div className="mt-4 text-right">
              <button type="submit" className="px-3 py-2 rounded bg-purple-500 text-white font-bold disabled:opacity-50" disabled={!isValid() || sending}>
                {sending ? "Submiting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
