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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { updateUserRole, deleteUser } from "@/lib/actions/admin";
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
                            <form
                              action={async () => {
                                "use server";
                                const newRole = user.role === "ADMIN" ? "CUSTOMER" : "ADMIN";
                                await updateUserRole(user.id, newRole);
                              }}
                            >
                              <Button type="submit" variant="outline" size="sm">
                                {user.role === "ADMIN" ? "Make Customer" : "Make Admin"}
                              </Button>
                            </form>
                            <form
                              action={async () => {
                                "use server";
                                await deleteUser(user.id);
                              }}
                            >
                              <Button
                                type="submit"
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </form>
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
