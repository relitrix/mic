import { useState } from "react";
import { Button, Modal, Table, Alert, Tooltip } from "flowbite-react";
import { FaCopy, FaCheckCircle } from "react-icons/fa";

const Results = ({ data, onClose }) => {
  return (
    <Modal size={"6xl"} show={data.show} onClose={onClose}>
      <Modal.Header>Results</Modal.Header>
      <Modal.Body>
        {data.hashes.length != 0 ? (
          <div className="space-y-6 text-white">
            <Alert className="bg-red-700" color={""}>
              These files not found in Modrinth. Try to find by name manually
              and download.
            </Alert>
            <Table>
              <Table.Head>
                <Table.HeadCell>File name</Table.HeadCell>
                <Table.HeadCell>Checksum</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y break-all">
                {data.hashes.map((i, index) => {
                  return (
                    <Table.Row
                      key={index}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {i[1]}
                      </Table.Cell>
                      <Table.Cell className="flex flex-row justify-content-center my-3">
                        ...{i[0].slice(-8)}{" "}
                        <Tooltip
                          content="Copied!"
                          animation={false}
                          trigger="click"
                        >
                          <FaCopy
                            onClick={() => {
                              navigator.clipboard.writeText(i[0]);
                            }}
                            className="ml-1 cursor-pointer"
                          />
                        </Tooltip>
                      </Table.Cell>
                      <Table.Cell className="columns-lg">
                        <Button
                          href={
                            "https://modrinth.com/mods?q=" +
                            encodeURIComponent(i[1])
                          }
                          target="_blank"
                        >
                          Search
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <>
            <FaCheckCircle className="size-1/4 mx-auto fill-green-500" />
            <div className="text-white my-4 text-center text-3xl font-bold">
              All clear!
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Results;
