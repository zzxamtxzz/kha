import { Suspense } from "react";
import UsersClient from "./client";

function Users() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsersClient />
    </Suspense>
  );
}

export default Users;
