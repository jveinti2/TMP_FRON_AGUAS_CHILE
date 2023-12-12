import { Button } from "flowbite-react";
import { FaArrowRotateLeft } from "react-icons/fa6";

export default function ButtonReload({ functionName }) {
  return (
    <>
      <Button size={"xs"} onClick={() => functionName()}>
        <FaArrowRotateLeft />
      </Button>
    </>
  );
}
