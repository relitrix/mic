import { useState, useCallback } from "react";
import micLogo from "./assets/full_logo.svg";
import { LiaDownloadSolid } from "react-icons/lia";
import { FaGithub, FaShieldAlt, FaBolt } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { useDropzone } from "react-dropzone";
import sha1 from "js-sha1";
import sha512 from "js-sha512";
import { Button } from "flowbite-react";
import axios from "axios";
import Results from "./Results";
import Error from "./Error";
import { version } from "../package.json";

function App() {
  // 0 - SHA1, 1 - SHA512
  const [hashFunc, setHashFunc] = useState(1);
  const onDrop = useCallback(
    (acceptedFiles) => {
      setLoading(1);
      let promises = [];
      function calculateHash(file) {
        return file.arrayBuffer().then((result) => {
          let hash = hashFunc == 1 ? sha512(result) : sha1(result);
          return [hash, file.name];
        }, []);
      }
      for (let file of acceptedFiles) {
        promises.push(calculateHash(file));
      }
      Promise.all(promises).then((values) => {
        let hashes = values.map((i) => i[0]);
        axios
          .post(
            "https://api.modrinth.com/v2/version_files",
            {
              hashes: hashes,
              algorithm: hashFunc == 1 ? "sha512" : "sha1",
            },
            {
              headers: {
                "Content-Type": "application/json",
                "User-Agent": `relitrix/mic/${version}`,
              },
            }
          )
          .then((result) => {
            let remoteHashes = [];
            for (const [key] of Object.entries(result.data)) {
              remoteHashes.push(key);
            }
            let lostHashes = [];
            values.forEach((hash) => {
              if (!remoteHashes.includes(hash[0])) {
                lostHashes.push(hash);
              }
            });
            setLoading(0);
            setDataModal({ show: 1, hashes: lostHashes });
          })
          .catch((err) => {
            setLoading(0);
            setErrorModal({ show: 1, error: err.message });
          });
      });
    },
    [hashFunc]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const [loading, setLoading] = useState(0);
  const [dataModal, setDataModal] = useState({ show: 0, hashes: [] });
  const [errorModal, setErrorModal] = useState({ show: 0, error: "" });
  return (
    <>
      <Results
        data={dataModal}
        onClose={() => {
          setDataModal({ show: 0, hashes: [] });
        }}
      />
      <Error
        data={errorModal}
        onClose={() => {
          setErrorModal({ show: 0, error: "" });
        }}
      />
      <div className="md:container md:mx-auto">
        <div>
          <img
            className="my-10 size-2/3 lg:size-2/5 mx-auto"
            src={micLogo}
          ></img>
        </div>
        <div className="text-white text-center">
          <Button.Group className="mx-auto self-center">
            <Button
              onClick={() => setHashFunc(1)}
              className="bg-green-700"
              color=""
            >
              <FaShieldAlt className="mx-0.5" />
              Secure (SHA512)
            </Button>
            <Button
              onClick={() => setHashFunc(0)}
              className="bg-yellow-500"
              color=""
            >
              <FaBolt className="mx-0.5" />
              Fast (SHA1)
            </Button>
          </Button.Group>
        </div>
        <div
          className={`my-6 p-20 text-lg h-full rounded-3xl cursor-pointer hover:ring-8 hover:ring-white transition ease-in-out + ${
            hashFunc == 1 ? "bg-green-700" : "bg-yellow-500"
          }`}
          {...getRootProps()}
        >
          {loading == 0 ? (
            <LiaDownloadSolid className="size-60 fill-white mx-auto" />
          ) : (
            <AiOutlineLoading className="size-52 mb-8 fill-white mx-auto animate-spin" />
          )}
          <div className="text-center text-white">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop .jar files here, or click to select files</p>
            )}
          </div>
        </div>
        <div className="flex align-center justify-center mx-auto text-zinc-400">
          <a
            href="https://github.com/relitrix/mic"
            className="flex flex-row mx-1"
          >
            <FaGithub className="mx-1 my-1" />
            GitHub
          </a>{" "}
          | ver. {version}
        </div>
      </div>
    </>
  );
}

export default App;
