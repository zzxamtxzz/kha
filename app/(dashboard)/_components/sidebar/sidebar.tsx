import Link from "next/link";
import List from "./list";

function Sidebar() {
  return (
    <aside className="w-[200px] cart-bg pt-2 border-r">
      <div className="my-8 center">
        <Link href={"/"} className="font-semibold text-lg">
          StarLink
        </Link>
      </div>
      <List />
    </aside>
  );
}

export default Sidebar;
