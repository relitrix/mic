import { Modal, Button } from "flowbite-react";
import { IoIosWarning } from "react-icons/io";

const Error = ({ data, onClose }) => {
  return (
    <Modal dismissible show={data.show} onClose={onClose}>
      <Modal.Header>An error occurred!</Modal.Header>
      <Modal.Body className="bg-red-800 overflow-hidden relative">
        <IoIosWarning
          className="absolute opacity-30 -my-5 -ml-12 text-white"
          size={68}
        />
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-white">
            {typeof data.error !== "undefined" ? data.error : ""} Testing
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Error;
