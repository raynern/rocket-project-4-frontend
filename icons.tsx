import { BsBook } from "react-icons/bs";
import { LuSchool } from "react-icons/lu";
import { SiCodementor } from "react-icons/si";
import { BiWorld } from "react-icons/bi";
import { FaPeopleGroup } from "react-icons/fa6";

export default function generateIcon(category: number) {
  switch (category) {
    case 1:
      return <BsBook />;
    case 2:
      return <LuSchool />;
    case 3:
      return <SiCodementor />;
    case 4:
      return <BiWorld />;
    case 5:
      return <FaPeopleGroup />;
    default:
      return null;
  }
}
