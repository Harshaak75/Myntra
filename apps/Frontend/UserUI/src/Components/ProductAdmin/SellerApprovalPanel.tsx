import React, { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/Components/ui/drawer";
import { getSupabaseClient } from "@/SupabaseClient";
import { AdminValidToken } from "@/Utiles/ValidateToken";

interface Seller {
  id: string;
  firstname: string;
  email: string;
  brand: string;
  isVerified: boolean | null;
  products: number;
  phone?: string;
  gstNumber?: string;
  documents?: string[];
}

export default function SellerApprovalPanel() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filtered, setFiltered] = useState<Seller[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [statusFilter, setStatusFilter] = useState("Approved");
  const [search, setSearch] = useState("");

  const [loading, setloading] = useState(false)

  useEffect(() => {
    async function fetchSellers() {
        setloading(true)
      const token = await AdminValidToken();
      if (!token){
        setloading(false);
        return;
      }

      const supabase = getSupabaseClient(token);
      const { data, error } = await supabase.from("Seller").select("*");

      if (data) {
        const sellersWithCounts = await Promise.all(
          data.map(async (seller: any) => {
            const { count } = await supabase
              .from("Product")
              .select("*", { count: "exact", head: true })
              .eq("sellerId", seller.id);

            return {
              ...seller,
              products: count || 0,
            };
          })
        );

        setSellers(sellersWithCounts);
      }
    }

    fetchSellers();

    setloading(false)
  }, []);

  useEffect(() => {
    setloading(true)
    const lower = search.toLowerCase();
    const filtered = sellers.filter((s) => {
      const status =
        s.isVerified === true
          ? "Approved"
          : s.isVerified === false
            ? "Rejected"
            : "Pending";

    setloading(false)

      return (
        status === statusFilter &&
        (s.firstname?.toLowerCase().includes(lower) ||
          s.email?.toLowerCase().includes(lower))
      );
    });

    setFiltered(filtered);
  }, [sellers, statusFilter, search]);

  async function updateStatus(id: string, newStatus: "Approved" | "Rejected") {
    setloading(true)
    const token = await AdminValidToken();
    if (!token) return;

    const supabase = getSupabaseClient(token);
    const isVerified = newStatus === "Approved";

    const { error } = await supabase
      .from("Seller")
      .update({ isVerified })
      .eq("id", id);

    if (!error) {
      setSellers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isVerified } : s))
      );
      setSelectedSeller(null);
    }

    setloading(false)
  }

  function getStatusLabel(isVerified: boolean | null): string {
    if (isVerified === true) return "Approved";
    if (isVerified === false) return "Pending";
    return "Pending";
  }

  return (
    <div className="p-6 ml-[15rem] space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Seller Approval Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:max-w-sm"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="Approved">Approved</option>
              <option value="Rejected">Pending</option>

              {/* <option value="Rejected">Rejected</option> */}
            </select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>GST Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell>{seller.firstname || "–"}</TableCell>
                  <TableCell>{seller.email || "–"}</TableCell>
                  <TableCell>{seller.brand || "–"}</TableCell>
                  <TableCell>{seller.products}</TableCell>
                  <TableCell>{seller.gstNumber || "–"}</TableCell>
                  <TableCell>{getStatusLabel(seller.isVerified)}</TableCell>
                  <TableCell>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setSelectedSeller(seller)}
                      className="cursor-pointer"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Drawer open={!!selectedSeller} onClose={() => setSelectedSeller(null)}>
        <DrawerContent className="p-6">
          <DrawerHeader>
            <DrawerTitle>Seller Details</DrawerTitle>
          </DrawerHeader>
          {selectedSeller && (
            <div className="space-y-4">
              <div>
                <strong>Name:</strong> {selectedSeller.firstname || "–"}
              </div>
              <div>
                <strong>Email:</strong> {selectedSeller.email || "–"}
              </div>
              <div>
                <strong>Brand:</strong> {selectedSeller.brand || "–"}
              </div>
              <div>
                <strong>Phone:</strong> {selectedSeller.phone || "–"}
              </div>
              <div>
                <strong>GST Number:</strong> {selectedSeller.gstNumber || "–"}
              </div>
              <div>
                <strong>Products:</strong> {selectedSeller.products}
              </div>
              <div>
                <strong>Documents:</strong>
                <ul className="list-disc ml-6">
                  {selectedSeller.documents?.length ? (
                    selectedSeller.documents.map((doc, i) => (
                      <li key={i}>
                        <a
                          href={doc}
                          className="text-blue-500 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {doc}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li>No documents</li>
                  )}
                </ul>
              </div>
              <div className="flex gap-4 mt-6">
                <Button
                  variant="default"
                  onClick={() => updateStatus(selectedSeller.id, "Approved")}
                  className="cursor-pointer"
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => updateStatus(selectedSeller.id, "Rejected")}
                  className="cursor-pointer"
                >
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
      {loading && (
        <div className="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-70">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}
