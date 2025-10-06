import { useState } from "react";
import { Plus, MoreVertical, UserCheck, UserX, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type StaffMember = {
  id: string;
  superuserId: string;
  name: string;
  email: string;
  role: string;
  canEdit: boolean;
  canDelete: boolean;
  isAdmin: boolean;
  createdAt?: string;
};

export function StaffManagement({ userId }: { userId: string }) {
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    role: "Viewer",
  });
  const { toast } = useToast();

  const { data: staff = [], isLoading } = useQuery<StaffMember[]>({
    queryKey: ["/api/staff", userId],
    queryFn: () => fetch(`/api/staff/${userId}`).then((res) => res.json()),
  });

  const createStaffMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", "/api/staff", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff", userId] });
      setAddStaffOpen(false);
      setNewStaff({ name: "", email: "", role: "Viewer" });
      toast({
        title: "Staff member added",
        description: "The new staff member has been added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add staff member",
        variant: "destructive",
      });
    },
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PATCH", `/api/staff/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff", userId] });
      toast({
        title: "Permissions updated",
        description: "Staff permissions have been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update permissions",
        variant: "destructive",
      });
    },
  });

  const deleteStaffMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/staff/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff", userId] });
      toast({
        title: "Staff member removed",
        description: "The staff member has been removed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove staff member",
        variant: "destructive",
      });
    },
  });

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email) return;

    createStaffMutation.mutate({
      superuserId: userId,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      canEdit: false,
      canDelete: false,
      isAdmin: false,
    });
  };

  const handleRemoveStaff = (id: string) => {
    deleteStaffMutation.mutate(id);
  };

  const handleUpdatePermission = (
    id: string,
    field: "canEdit" | "canDelete" | "isAdmin",
    value: boolean
  ) => {
    updateStaffMutation.mutate({
      id,
      data: { [field]: value },
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading staff...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Staff Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage team members and their permissions
          </p>
        </div>
        <Button onClick={() => setAddStaffOpen(true)} data-testid="button-add-staff">
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>

      {staff.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No staff members yet. Add your first team member to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => (
            <div
              key={member.id}
              className="p-6 rounded-lg border bg-card"
              data-testid={`card-staff-${member.id}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold" data-testid={`text-staff-name-${member.id}`}>
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      data-testid={`button-staff-menu-${member.id}`}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setEditingStaff(member)}
                      data-testid={`button-edit-staff-${member.id}`}
                    >
                      Edit Permissions
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRemoveStaff(member.id)}
                      className="text-destructive"
                      data-testid={`button-remove-staff-${member.id}`}
                    >
                      Remove Staff
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Badge variant="secondary" className="mb-4">
                {member.role}
              </Badge>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span>Can Edit</span>
                  </div>
                  <Switch
                    checked={member.canEdit}
                    onCheckedChange={(checked) =>
                      handleUpdatePermission(member.id, "canEdit", checked)
                    }
                    data-testid={`switch-edit-${member.id}`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <UserX className="h-4 w-4 text-muted-foreground" />
                    <span>Can Delete</span>
                  </div>
                  <Switch
                    checked={member.canDelete}
                    onCheckedChange={(checked) =>
                      handleUpdatePermission(member.id, "canDelete", checked)
                    }
                    data-testid={`switch-delete-${member.id}`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>Admin Rights</span>
                  </div>
                  <Switch
                    checked={member.isAdmin}
                    onCheckedChange={(checked) =>
                      handleUpdatePermission(member.id, "isAdmin", checked)
                    }
                    data-testid={`switch-admin-${member.id}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={addStaffOpen} onOpenChange={setAddStaffOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="staff-name">Full Name</Label>
              <Input
                id="staff-name"
                value={newStaff.name}
                onChange={(e) =>
                  setNewStaff((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="John Doe"
                data-testid="input-staff-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-email">Email</Label>
              <Input
                id="staff-email"
                type="email"
                value={newStaff.email}
                onChange={(e) =>
                  setNewStaff((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="john@techoffice.com"
                data-testid="input-staff-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-role">Role</Label>
              <Input
                id="staff-role"
                value={newStaff.role}
                onChange={(e) =>
                  setNewStaff((prev) => ({ ...prev, role: e.target.value }))
                }
                placeholder="Manager"
                data-testid="input-staff-role"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setAddStaffOpen(false)}
              data-testid="button-cancel-staff"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddStaff}
              disabled={!newStaff.name || !newStaff.email || createStaffMutation.isPending}
              data-testid="button-save-staff"
            >
              {createStaffMutation.isPending ? "Adding..." : "Add Staff"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editingStaff && (
        <Dialog
          open={!!editingStaff}
          onOpenChange={() => setEditingStaff(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Permissions - {editingStaff.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <Label>Can Edit</Label>
                <Switch
                  checked={editingStaff.canEdit}
                  onCheckedChange={(checked) => {
                    handleUpdatePermission(editingStaff.id, "canEdit", checked);
                    setEditingStaff({
                      ...editingStaff,
                      canEdit: checked,
                    });
                  }}
                  data-testid="switch-edit-permission"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Can Delete</Label>
                <Switch
                  checked={editingStaff.canDelete}
                  onCheckedChange={(checked) => {
                    handleUpdatePermission(editingStaff.id, "canDelete", checked);
                    setEditingStaff({
                      ...editingStaff,
                      canDelete: checked,
                    });
                  }}
                  data-testid="switch-delete-permission"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Admin Rights</Label>
                <Switch
                  checked={editingStaff.isAdmin}
                  onCheckedChange={(checked) => {
                    handleUpdatePermission(editingStaff.id, "isAdmin", checked);
                    setEditingStaff({
                      ...editingStaff,
                      isAdmin: checked,
                    });
                  }}
                  data-testid="switch-admin-permission"
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                onClick={() => setEditingStaff(null)}
                data-testid="button-close-edit"
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
