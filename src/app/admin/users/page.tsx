import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { UserRoleButton } from "@/components/admin/UserRoleButton";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteUser } from "@/lib/actions/admin";
import { auth } from "@/auth";

async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

export default async function AdminUsersPage() {
  const [users, session] = await Promise.all([getUsers(), auth()]);
  const currentUserId = (session?.user as any)?.id;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">Users</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>{users.length} registered accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isCurrentUser = user.id === currentUserId;
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                          user.role === "ADMIN"
                            ? "bg-primary/10 text-primary ring-primary/20"
                            : "bg-muted text-muted-foreground ring-border"
                        }`}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end">
                        {!isCurrentUser && (
                          <>
                            <UserRoleButton 
                              userId={user.id}
                              currentRole={user.role as "ADMIN" | "CUSTOMER"}
                              userName={user.name || user.email || "Usuario"}
                            />
                            <DeleteButton 
                              action={async () => {
                                "use server";
                                await deleteUser(user.id);
                              }}
                              itemName={user.name || user.email || "Usuario"}
                            />
                          </>
                        )}
                        {isCurrentUser && (
                          <span className="text-xs text-muted-foreground italic">You</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
